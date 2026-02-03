import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { injectable, inject } from "inversify";
import { AuthController } from "../controllers/auth.controller.js";
import { TYPES } from "../types/types.js";
import { configuredPassport as passport } from "../config/passport.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import { validate } from "../middlewares/validate/validate.middleware.js";

// Import your validator arrays
import {
  registerValidator,
  loginValidator,
  forgot_password_Validator,
  reset_password_Validator,
} from "../validators/auth.validator.js";

@injectable()
export class AuthRouter {
  public router: Router;

  constructor(
    @inject(TYPES.AuthController) private authController: AuthController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ==========================================
    // AUTHENTICATION ROUTES
    // ==========================================

    /**
     * REGISTER
     * POST /api/auth/register
     */
    this.router.post(
      "/register",
      registerValidator, // 1. Validation Rules
      validate, // 2. Check for Errors
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.handleRegister(req, res, next),
    );

    /**
     * LOGIN
     * POST /api/auth/login
     */
    this.router.post(
      "/login",
      loginValidator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.handleLogin(req, res, next),
    );

    /**
     * LOGOUT
     * POST /api/auth/logout
     */
    this.router.post(
      "/logout",
      authenticate,
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.handleLogout(req, res, next),
    );

    // ==========================================
    // USER PROFILE ROUTES (Protected)
    // ==========================================

    /**
     * GET CURRENT USER
     * GET /api/auth/me
     */
    this.router.get(
      "/me",
      authenticate,
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.handleMe(req, res, next),
    );

    /**
     * UPDATE PROFILE
     * PATCH /api/auth/update (Changed from GET to PATCH for semantics)
     */
    this.router.patch(
      "/update",
      authenticate,
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.handleUpdate(req, res, next),
    );

    // ==========================================
    // PASSWORD RECOVERY
    // ==========================================

    this.router.post(
      "/forgot-password",
      forgot_password_Validator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.handleForgotPassword(req, res, next),
    );

    this.router.post(
      "/reset-password",
      reset_password_Validator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.handleResetPassword(req, res, next),
    );

    // ==========================================
    // OAUTH ROUTES
    // ==========================================

    // --- GOOGLE  (API / Mobile Mode) ---
    // this.router.post(
    //   "/google",
    //   (req: Request, res: Response, next: NextFunction) =>
    //     this.authController.googleAuthAPI(req, res, next),
    // );

    // --- GOOGLE ---
    this.router.get(
      "/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
      }),
    );

    // Callback: Google
    this.router.get(
      "/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/login?error=oauth_failed",
        session: false,
      }),
      (req: Request, res: Response, next: NextFunction) =>
        this.authController.oauthCallback(req, res, next),
    );

    // --- GitHub (API / Mobile Mode) ---
    // this.router.post(
    //   "/github",
    //   (req: Request, res: Response, next: NextFunction) =>
    //     this.authController.githubAuthAPI(req, res, next),
    // );

    // --- GITHUB ---
    // this.router.get(
    //   "/github",
    //   passport.authenticate("github", {
    //     scope: ["user:email"],
    //     session: false,
    //   }),
    // );

    // 4. GitHub (Passport / Redirect Mode)
    this.router.get(
      "/github/callback",
      (req, res, next) => {
        // 1. Authenticate using the code sent from frontend
        passport.authenticate(
          "github",
          { session: false },
          (err, user, info) => {
            if (err) {
              // This logs the "redirect_uri_mismatch" if urls don't match
              console.error("GitHub Strategy Error:", err);
              return res
                .status(500)
                .json({ message: "Auth failed", error: err.message });
            }

            if (!user) {
              return res.status(401).json({ message: "No user found" });
            }

            req.user = user;
            next(); // Proceed to controller
          },
        )(req, res, next);
      },
      (req: Request, res: Response, next: NextFunction) => this.authController.oauthCallback(req, res, next),
    );
  }
}
