// The Coastline mark: four start year bars, drawn for ImageResponse.
export function Mark({ size, radius }: { size: number; radius: number }) {
  const unit = size / 32;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 2.5 * unit,
        padding: `0 0 ${8 * unit}px`,
        background: "#111111",
        borderRadius: radius,
      }}
    >
      {[10, 16, 8, 18].map((h, i) => (
        <div key={i} style={{ width: 3.5 * unit, height: h * unit, background: "#ffffff" }} />
      ))}
    </div>
  );
}
