/**
 * Pixel-perfect mark for `next/og` ImageResponse (favicon + apple-icon).
 * Three ascending bars = Lighthouse-style scores / performance signal.
 */
export function BrandIconInner() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "12%",
        padding: "18%",
        background:
          "linear-gradient(145deg, #8B5CF6 0%, #5B21B6 100%)",
        borderRadius: "22%",
      }}
    >
      <div
        style={{
          width: "14%",
          height: "34%",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 3,
        }}
      />
      <div
        style={{
          width: "14%",
          height: "54%",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 3,
        }}
      />
      <div
        style={{
          width: "14%",
          height: "74%",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 3,
        }}
      />
    </div>
  );
}
