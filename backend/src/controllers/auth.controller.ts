import { injectable, inject } from "inversify";
import { StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { TYPES } from "../types/types.js";
import { AppError } from "../errors/AppError.js";
// Ensure this path matches your file structure
import type { AuthRequest } from "../types/express/index.js";

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  /**
   * REGISTER
   */
  async handleRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.register(req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * LOGIN
   */
  async handleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user, rememberMe } = await this.authService.login(
        req.body,
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Strict for login actions prevents CSRF
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        user,

        ...(process.env.NODE_ENV !== "production" && { token }),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * LOGOUT
   */
  async handleLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res.status(StatusCodes.NO_CONTENT).send();
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      await this.authService.logout(token);

      res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET CURRENT USER
   */
  async handleMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
        });
      }

      const user = await this.authService.me(userId);
      res.status(StatusCodes.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE PROFILE
   */
  async handleUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const data = req.body;

      if (!userId) {
        throw new AppError({
          message: "Access denied.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
        });
      }

      const user = await this.authService.update(userId, data);
      res.status(StatusCodes.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PASSWORD RECOVERY
   */
  async handleForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      if (!email) {
        throw new AppError({
          message: "Email is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "EMAIL_REQUIRED",
        });
      }
      await this.authService.forgot_password(email);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "If the email is registered, a reset link has been sent.",
      });
    } catch (error) {
      next(error);
    }
  }

  async handleResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, token } = req.body;

      if (!token || !password) {
        throw new AppError({
          message: "Token and new password are required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "INVALID_INPUT",
        });
      }
      await this.authService.reset_password(token, password);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Password reset successful.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PASSPORT OAUTH CALLBACK
   * Used when Passport middleware handles the redirect
   */
  async oauthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as { id: string; email: string };

      if (!user) {
        throw new AppError({
          message: "Authentication failed: User not found",
          statusCode: 401,
        });
      }

      const token = await this.authService.generateOAuthToken(user);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Login successful",
        id: user.id,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * API-BASED GOOGLE AUTH
   * Used when Frontend sends the 'code' directly
   */
  async googleAuthAPI(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Missing code" });
      }

      const token = await this.authService.handleGoogleAuth({ code });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        ...(process.env.NODE_ENV !== "production" && { token }),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * API-BASED GITHUB AUTH
   */
  async githubAuthAPI(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Missing code" });
      }

      const token = await this.authService.handleGitHubAuth({ code });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        ...(process.env.NODE_ENV !== "production" && { token }),
      });
    } catch (err) {
      next(err);
    }
  }
}
