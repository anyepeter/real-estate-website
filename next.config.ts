import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
};

/**
 * withPayload wires the admin panel's bundling into the Next build — it is
 * not optional glue, the /admin routes won't resolve without it.
 */
export default withPayload(nextConfig);
