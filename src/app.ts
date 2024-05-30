import fastify from "fastify";
import { registerRoutes } from "./http/controllers/users/routes";

export const app = fastify();

app.register(registerRoutes)