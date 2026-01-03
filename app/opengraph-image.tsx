import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const runtime = "edge";
export const alt = `${BRAND.name} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          padding: 64,
          justifyContent: "space-between",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: "#0b0b0c",
            }}
          />
          <div style={{ display: "flex", fontSize: 32, fontWeight: 800, color: "#0b0b0c" }}>
            {BRAND.name}
          </div>
        </div>

        {/* Center */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 60, fontWeight: 900, color: "#0b0b0c", lineHeight: 1.05 }}>
              Systems-first websites
            </div>
            <div style={{ display: "flex", fontSize: 60, fontWeight: 900, color: "#0b0b0c", lineHeight: 1.05 }}>
              that convert.
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 26, color: "#52525b" }}>
            {BRAND.tagline}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", fontSize: 18, color: "#71717a" }}>{BRAND.domain}</div>
      </div>
    ),
    size
  );
}
