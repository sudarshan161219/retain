import type { Application } from "express";
import { container } from "../config/container.js";
import { ClientRouter } from "../routes/client.routes.js";
import { AuthRouter } from "../routes/auth.router.js";
import { UserRouter } from "../routes/user.router.js";
import { TYPES } from "../types/types.js";

export function addRoutes(app: Application): Application {
  const ClientRouter = container.get<ClientRouter>(TYPES.ClientRouter);
  const AuthRouter = container.get<AuthRouter>(TYPES.AuthRouter);
  const UserRouter = container.get<UserRouter>(TYPES.UserRouter);

  app.get("/", (req, res) => {
    const sunArt = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⢹⣿⣄⠀⠀⣄⠀⠀⠀⣠⣾⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢳⣄⠀⠀⢻⣿⡇⠰⠿⠀⠀⢀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠤⣀⣀⣀⠀⠀⠀⠀⠀⠙⠆⠀⣼⣿⡷⠠⡦⠀⣤⣾⣿⠇⠀⣠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠛⢿⣶⣤⣤⣤⣀⣀⠴⠇⠈⢀⣀⣠⣤⣤⡉⠛⠋⣤⡘⠋⠀⠀⢀⣠⣤⣄⣠⣤⡴⠂
⠀⠀⠀⠀⠀⠀⠉⠛⠛⢿⣿⡿⠀⣰⣾⡿⠟⠛⠛⠛⢿⣷⣄⠈⣵⣤⣤⣶⣿⠟⠛⠻⠛⠙⠀⠀
⠀⠀⠀⠀⠠⢤⣤⣤⠀⢀⣉⠁⣼⣿⠋⣠⣶⣿⣿⣷⣄⠙⣿⣆⠘⠿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣈⣍⠀⣿⡏⠈⣿⣿⣁⡈⠹⣿⡇⢻⣿⠀⠺⠆⠀⣶⠶⠦⠂⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⡇⠻⣿⣦⡈⠛⠋⣁⣴⣿⢃⣽⣿⠀⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⣤⣾⣿⠿⣿⡿⠟⠁⠀⠠⣶⢀⡈⠻⠿⣿⣿⠿⠏⣡⣾⡿⠃⣸⣿⣿⣿⣿⣿⣷⣦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⠀⠀⣿⣿⣿⣷⣶⣶⣾⡿⠟⠋⢀⣤⠈⠉⠉⠉⠁⠀⠛⠿⣶⣤⣄⡀
⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⢸⣿⡟⠁⠀⣥⡁⢠⣤⣴⣶⠀⠁⢶⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⡇⠀⢀⣌⠀⠈⣿⣿⡇⠀⠀⠀⠉⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠰⠗⠀⠀⠘⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡿⠁⠀⠀⠀⠈⠀⠀⠀⠀⠈⠻⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    Hail!, Surya Deva
    `;

    res.send(`<pre style="line-height: 1.0;">${sunArt}</pre>`);
  });
  app.use("/api/clients", ClientRouter.router);
  app.use("/api/auth", AuthRouter.router);
  app.use("/api/user", UserRouter.router);

  return app;
}
