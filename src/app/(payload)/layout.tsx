/**
 * Payload's own root layout. It renders its own <html> and <body>, which is
 * why the public site had to move into (frontend) — two route groups, two
 * root layouts, no shared wrapper. Nothing here inherits the site's fonts,
 * smooth scroll or header, and that is deliberate: the admin panel should
 * look like an admin panel.
 */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import React from "react";

import { importMap } from "./admin/importMap.js";

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
