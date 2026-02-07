import axios from "axios";
import { injectable } from "inversify";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import type {
  IRegisterDTO,
  ILoginDTO,
  UpdateUserDTO,
  JwtUserPayload,
} from "../types/auth.types.js";
import { prisma } from "../utils/prismaClient.js";
import { AppError } from "../errors/AppError.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { hashToken } from "../utils/hash.js";
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

@injectable()
export class AuthService {
  async register(data: IRegisterDTO) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new AppError({
          message: "Email already in use.",
          statusCode: StatusCodes.CONFLICT,
          code: "EMAIL_CONFLICT",
          debugMessage: `Attempted to register with existing email: ${data.email}`,
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: { name: data.name, email: data.email, password: hashedPassword },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        message: "Registration failed. Please try again.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "REGISTRATION_FAILED",
        debugMessage: "Unexpected error in AuthService.register",
        cause: error as Error,
      });
    }
  }

  async login(data: ILoginDTO) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new AppError({
          message: "Incorrect email or password.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "INVALID_CREDENTIALS",
          debugMessage: `No user found with email: ${data.email}`,
        });
      }

      if (!user.password) {
        throw new AppError({
          message: "Invalid credentials.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "INVALID_CREDENTIALS",
          debugMessage: `User exists but has no password set (likely OAuth user).`,
        });
      }

      const isMatch = await bcrypt.compare(data.password, user.password);

      if (!isMatch) {
        throw new AppError({
          message: "Incorrect email or password.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "INVALID_CREDENTIALS",
          debugMessage: `Password mismatch for email: ${data.email}`,
        });
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: "Login failed. Please try again.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "LOGIN_FAILED",
        debugMessage: "Unexpected error in AuthService.login",
        cause: error as Error,
      });
    }
  }

  async logout(token: string) {
    // NOTE: Without Redis, we cannot blacklist JWTs server-side.
    // Logout relies entirely on the client/controller clearing the cookie.
    return { message: "User logged out successfully" };
  }

  async me(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          avatar: true,
        },
      });

      if (!user) {
        throw new AppError({
          message: "Session expired. Please log in again.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "USER_NOT_FOUND",
          debugMessage: `No user found with ID: ${userId}`,
        });
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: "Failed to fetch user info.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "ME_FAILED",
        debugMessage: "Unexpected error in AuthService.me",
        cause: error as Error,
      });
    }
  }

  async update(userId: string, data: UpdateUserDTO) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      // No cache invalidation needed
      return updatedUser;
    } catch (error) {
      throw new AppError({
        message: "Failed to update user.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "USER_UPDATE_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async forgot_password(email: string) {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = hashToken(token);
      const expiry = new Date(Date.now() + 15 * 60 * 1000);

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new AppError({
          message: "User not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "USER_NOT_FOUND",
        });
      }

      await prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: new Date(expiry),
        },
      });

      const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
      const subject = "Reset your password?";
      const html = `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password. This link will expire in 15 minutes:</p>
        <a href="${resetURL}">Reset your password</a>
      `;

      await sendEmail(email, subject, html);
    } catch (error) {
      throw new AppError({
        message: "Failed to process forgot password.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "FORGOT_PASSWORD_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async reset_password(token: string, password: string) {
    try {
      const hashedToken = hashToken(token);

      const user = await prisma.user.findFirst({
        where: {
          passwordResetExpires: { gte: new Date() },
          passwordResetToken: hashedToken,
        },
      });

      if (!user) {
        throw new AppError({
          message: "Token is invalid or expired.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "TOKEN_INVALID",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      const subject = "Your password was successfully changed";
      const html = `<p>Your password was successfully changed.</p>`;

      await sendEmail(user.email, subject, html);
    } catch (error) {
      throw new AppError({
        message: "Failed to process reset password.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "RESET_PASSWORD_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async generateOAuthToken(user: { id: string; email: string }) {
    try {
      const jti = uuidv4();

      const payload: JwtUserPayload = {
        id: user.id,
        email: user.email,
        jti,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      return token;
    } catch (error) {
      throw new AppError({
        message: "Failed to generate OAuth token.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "OAUTH_TOKEN_FAILED",
        debugMessage: (error as Error).message,
        cause: error as Error,
      });
    }
  }

  async verifyGoogleToken(idToken: string) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || "Google User";
    const profileImage = payload?.picture || "";
    const sub = payload?.sub;

    if (!email) {
      throw new AppError({
        message: "No email in Google profile",
        statusCode: 400,
      });
    }

    return { email, name, profileImage, sub };
  }

  async exchangeCodeForIdToken(code: string): Promise<string> {
    try {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage",
        grant_type: "authorization_code",
      });

      const idToken = response.data.id_token;

      if (!idToken) {
        throw new AppError({
          message: "Failed to retrieve ID token from Google",
          statusCode: 400,
        });
      }

      return idToken;
    } catch (error: any) {
      throw new AppError({
        message: "Error exchanging code for token",
        statusCode: 400,
        debugMessage: error?.response?.data?.error_description || error.message,
      });
    }
  }

  async handleGoogleAuth({ code }: { code: string }) {
    const idToken = await this.exchangeCodeForIdToken(code);
    const { email, name, profileImage, sub } =
      await this.verifyGoogleToken(idToken);

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      user = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          name,
          email,
          avatar: profileImage,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          avatar: profileImage,
          provider: "google",
          googleId: sub || "unknown",
        },
      });
    }

    return this.generateOAuthToken(user);
  }

  async handleGitHubAuth({ code }: { code: string }) {
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const accessToken = data.access_token;
    if (!accessToken) {
      throw new AppError({
        message: "GitHub token exchange failed",
        statusCode: 400,
      });
    }

    const [userRes, emailRes] = await Promise.all([
      axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    const emailData = emailRes.data.find((e: any) => e.primary && e.verified);
    const email = emailData?.email;
    const name = userRes.data.name || userRes.data.login;
    const profileImage = userRes.data.avatar_url;
    const githubId = String(userRes.data.id);

    if (!email) {
      throw new AppError({ message: "No email found", statusCode: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      if (!user.githubId) {
        user = await prisma.user.update({
          where: { email },
          data: { githubId },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          avatar: profileImage,
          provider: "github",
          githubId: githubId,
        },
      });
    }

    return this.generateOAuthToken(user);
  }
}
