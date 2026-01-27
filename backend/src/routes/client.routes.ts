import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { injectable, inject } from "inversify";
import { param } from "express-validator";
import { TYPES } from "../types/types.js";
import { ClientController } from "../controllers/client.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import { validate } from "../middlewares/validate/validate.middleware.js";

import {
  createClientValidators,
  updateDetailsValidators,
  addLogValidators,
  idParamValidator,
  updateStatusValidators,
  refillValidators,
  logIdParamValidator,
  slugParamValidator,
} from "../validators/client.validator.js";

@injectable()
export class ClientRouter {
  public router: Router;

  constructor(
    @inject(TYPES.ClientController)
    private clientController: ClientController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ==========================================
    // PUBLIC ROUTES (No Auth Required)
    // ==========================================

    /**
     * 1. PUBLIC VIEW (Client Read-Only)
     * GET /api/clients/public/:slug
     * (Moved to /public/ namespace to avoid collision with ID routes)
     */
    this.router.get(
      "/public/:slug",
      slugParamValidator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.getPublicOne(req, res, next),
    );

    // ==========================================
    // PROTECTED ROUTES (Require Login)
    // ==========================================

    /**
     * 2. CREATE CLIENT
     * POST /api/clients
     */
    this.router.post(
      "/", // Mounted at /api/clients
      authenticate, // 🔒
      createClientValidators,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.create(req, res, next),
    );

    /**
     * 3. GET ONE CLIENT (Admin Dashboard)
     * GET /api/clients/:id
     */
    this.router.get(
      "/:id",
      authenticate, // 🔒
      idParamValidator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.getClientDetails(req, res, next),
    );

    /**
     * 4. UPDATE DETAILS (Settings)
     * PATCH /api/clients/:id
     */
    this.router.patch(
      "/:id",
      authenticate, // 🔒
      updateDetailsValidators,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.updateDetails(req, res, next),
    );

    /**
     * 5. UPDATE STATUS (Pause/Resume)
     * PATCH /api/clients/:id/status
     */
    this.router.patch(
      "/:id/status",
      authenticate, // 🔒
      updateStatusValidators,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.updateStatus(req, res, next),
    );

    /**
     * 6. DELETE CLIENT
     * DELETE /api/clients/:id
     */
    this.router.delete(
      "/:id",
      authenticate, // 🔒
      idParamValidator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.deleteClient(req, res, next),
    );

    // ==========================================
    // LOG & ACTION ROUTES
    // ==========================================

    /**
     * 7. ADD WORK LOG
     * POST /api/clients/:id/logs
     */
    this.router.post(
      "/:id/logs",
      authenticate, // 🔒
      addLogValidators,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.addLog(req, res, next),
    );

    /**
     * 8. REFILL BALANCE
     * POST /api/clients/:id/refill
     */
    this.router.post(
      "/:id/refill",
      authenticate, // 🔒
      refillValidators,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.addRefillLog(req, res, next),
    );

    /**
     * 9. DELETE LOG
     * DELETE /api/clients/logs/:logId
     * (Note: We mount this under clients but verify owner via logId)
     */
    this.router.delete(
      "/logs/:logId",
      authenticate, // 🔒
      logIdParamValidator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.deleteLog(req, res, next),
    );

    /**
     * 10. EXPORT EXCEL
     * GET /api/clients/:id/export
     */
    this.router.get(
      "/:id/export",
      authenticate, // 🔒
      idParamValidator,
      validate,
      (req: Request, res: Response, next: NextFunction) =>
        this.clientController.exportClientLogs(req, res, next),
    );
  }
}
