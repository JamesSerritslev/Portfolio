import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { ImageResponse } from "next/og";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "opengraph.png");

const image = new ImageResponse(
  (
    <div
      style={{
        background: "#F6F3EC",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 320,
          fontFamily: "Georgia, serif",
          color: "#6E6240",
          lineHeight: 1,
        }}
      >
        J
      </div>
    </div>
  ),
  { width: 1200, height: 630 }
);

async function main() {
  const buffer = Buffer.from(await image.arrayBuffer());
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, buffer);
  console.log(`Wrote ${outPath} (${buffer.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
