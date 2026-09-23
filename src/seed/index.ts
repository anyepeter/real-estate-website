import { getPayload } from "payload";
import config from "@payload-config";

import { dubai, type SeedArea } from "./areas";

/**
 * Seeds the location tree.
 *
 * Idempotent by design — matched on slugEn, so re-running updates rather
 * than duplicates. That matters more than it sounds: this will be re-run
 * every time the tree gains a community, and a duplicated area silently
 * splits a landing page's listing count in two, which then trips the
 * thin-content gate and deletes a page that should exist.
 *
 * Run with:  npm run seed
 */

/** Depth maps to level. The tree is emirate → community → tower today; if a
 *  sub-community layer is ever added this needs a matching branch. */
const LEVELS = ["emirate", "community", "tower"] as const;

/** Postgres ids are numeric — keeping this narrow stops the relationship
 *  field silently accepting a string and failing at insert time. */
async function upsertArea(
  payload: Awaited<ReturnType<typeof getPayload>>,
  node: SeedArea,
  depth: number,
  parentId: number | null
): Promise<number> {
  const level = LEVELS[Math.min(depth, LEVELS.length - 1)];

  const existing = await payload.find({
    collection: "areas",
    where: { slugEn: { equals: node.slugEn } },
    limit: 1,
    depth: 0,
  });

  const data = {
    nameEn: node.nameEn,
    nameAr: node.nameAr ?? null,
    slugEn: node.slugEn,
    slugAr: node.slugAr ?? null,
    level,
    parent: parentId,
    lat: node.lat ?? null,
    lng: node.lng ?? null,
  };

  let id: number;

  if (existing.docs.length > 0) {
    const doc = await payload.update({
      collection: "areas",
      id: existing.docs[0].id,
      data,
    });
    id = doc.id;
    console.log(`  updated  ${level.padEnd(9)} ${node.nameEn}`);
  } else {
    const doc = await payload.create({ collection: "areas", data });
    id = doc.id;
    console.log(`  created  ${level.padEnd(9)} ${node.nameEn}`);
  }

  for (const child of node.children ?? []) {
    await upsertArea(payload, child, depth + 1, id);
  }

  return id;
}

async function seed() {
  const payload = await getPayload({ config });

  console.log("\nSeeding areas…\n");
  await upsertArea(payload, dubai, 0, null);

  const total = await payload.count({ collection: "areas" });
  console.log(`\nDone. ${total.totalDocs} areas in the tree.\n`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("\nSeed failed:\n", err);
  process.exit(1);
});
