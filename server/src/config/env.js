import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(4000),

    MONGODB_URI: z.string().min(1).optional(),

    CLIENT_URL: z.string().url().optional(),

    JWT_SECRET: z.string().min(32).optional(),

    JWT_EXPIRES_IN: z.string().default("7d"),

    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    COORDINATOR_SEED_EMAIL: z.string().email().optional(),
    COORDINATOR_SEED_PASSWORD: z.string().min(8).optional(),
    COORDINATOR_SEED_NAME: z.string().min(2).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "production") {
      for (const key of ["MONGODB_URI", "CLIENT_URL", "JWT_SECRET"]) {
        if (!data[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key],
            message: `${key} is required in production.`,
          });
        }
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  throw new Error("Environment validation failed");
}

export const env = {
  ...parsed.data,
  MONGODB_URI:
    parsed.data.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/offline_field_tracker",
  CLIENT_URL: parsed.data.CLIENT_URL || "http://localhost:3000",
  JWT_SECRET:
    parsed.data.JWT_SECRET ||
    "offline_tracker_super_secure_jwt_secret_dev_32char_key!",
};
