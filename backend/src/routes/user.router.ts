import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { injectable, inject } from "inversify";
import { UserController } from "../controllers/user.controller.js";
import { TYPES } from "../types/types.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import { validate } from "../middlewares/user/user.middleware.js";
import {
  updateWorkspaceSchema,
  updatePreferenceSchema,
} from "../validators/user.validator.js";

@injectable()
export class UserRouter {
  public router: Router;

  constructor(
    @inject(TYPES.UserController) private userController: UserController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/settings",
      authenticate,
      (req: Request, res: Response, next: NextFunction) =>
        this.userController.getSettings(req, res, next),
    );

    this.router.put(
      "/settings/workspace",
      authenticate,
      validate(updateWorkspaceSchema),
      (req: Request, res: Response, next: NextFunction) =>
        this.userController.updateWorkspace(req, res, next),
    );

    this.router.put(
      "/settings/preference",
      authenticate,
      validate(updatePreferenceSchema),
      (req: Request, res: Response, next: NextFunction) =>
        this.userController.updatePreference(req, res, next),
    );
  }
}
