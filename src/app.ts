import fastify from "fastify";
import { registerRoutes } from "./http/controllers/users/routes";
import { walletRoutes } from "./http/controllers/wallets/routes";
import { transationRoutes } from "./http/controllers/transations/router";

export const app = fastify();

app.register(registerRoutes)
app.register(walletRoutes)
app.register(transationRoutes)

