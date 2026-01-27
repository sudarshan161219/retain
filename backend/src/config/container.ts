import { Container } from "inversify";
import { AuthService } from "../services/auth.service.js";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthRouter } from "../routes/auth.router.js";
import { ClientService } from "../services/client.service.js";
import { ClientController } from "../controllers/client.controller.js";
import { ClientRouter } from "../routes/client.routes.js";
import { TYPES } from "../types/types.js";

export const container: Container = new Container();

container
  .bind<AuthService>(TYPES.AuthService)
  .to(AuthService)
  .inTransientScope();

container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);

container
  .bind<ClientService>(TYPES.ClientService)
  .to(ClientService)
  .inTransientScope();

container.bind<ClientController>(TYPES.ClientController).to(ClientController);

container.bind<ClientRouter>(TYPES.ClientRouter).to(ClientRouter);
