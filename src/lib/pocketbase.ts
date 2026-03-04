import { env } from "next-runtime-env";
import Pocketbase from "pocketbase";

export const pb = new Pocketbase(env("NEXT_PUBLIC_POCKETBASE_URL"));

// Disable auto-cancellation to prevent "The request was autocancelled" errors
// This allows multiple concurrent requests without them being cancelled
pb.autoCancellation(false);
