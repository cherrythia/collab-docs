import index from "./index.html";
import { migrate } from "./db";
import { documentsRoutes } from "./routes/documents";

await migrate();

Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    ...documentsRoutes,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Running at http://localhost:3000");
