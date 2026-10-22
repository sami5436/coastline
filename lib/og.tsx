import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Result } from "./coast";

export const OG_SIZE = { width: 1200, height: 630 };

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/Geist-Regular.ttf")),
  readFile(join(process.cwd(), "assets/Geist-SemiBold.ttf")),
]);

// The link preview card: wordmark, headline, one line of detail, and the
// start year bars from the result so the preview looks like the app.
export async function ogCard({
  title,
  subtitle,
  result,
}: {
  title: string;
  subtitle: string;
  result: Result;
}) {
  const [regular, semibold] = await fonts;
  const { periods, target } = result;
  // A fixed scale keeps the target line mid card; taller bars are clipped.
  const top = 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          color: "#111111",
          padding: "64px 72px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>Coastline</div>
        <div
          style={{
            marginTop: 40,
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: -1.5,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 18, fontSize: 34, color: "#6b6b6b" }}>{subtitle}</div>
        <div
          style={{
            marginTop: "auto",
            height: 190,
            display: "flex",
            alignItems: "flex-end",
            position: "relative",
          }}
        >
          {periods.map((p) => (
            <div
              key={p.start}
              style={{
                flex: 1,
                margin: "0 2px",
                height: `${Math.min(100, Math.max(1, (p.final / target / top) * 100))}%`,
                background: p.ok ? "#111111" : "#c9c9c9",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: `${(1 / top) * 100}%`,
              height: 8,
              marginBottom: -4,
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
            }}
          >
            <div style={{ width: "100%", height: 2, background: "#111111" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
