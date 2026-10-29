import { httpRouter } from "convex/server";

import { auth, createAuth } from "./auth";

const http = httpRouter();

auth.registerRoutes(http, createAuth, { cors: true });

export default http;
