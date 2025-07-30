// import your .env file
import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: 'ts-node -r tsconfig-paths/register --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
});
