export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      
      {/* Header */}
      <div style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: 24, marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", margin: 0 }}>
          WhatItReallyCost
        </h1>
        <p style={{ color: "#6b7280", marginTop: 8, fontSize: 16 }}>
          Real build costs from real New Zealanders. No spin, no sales pitch.
        </p>
      </div>

      {/* Search bar placeholder */}
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 40 }}>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 15 }}>
          🔍 Search by region, builder, or cost range — coming soon
        </p>
      </div>

      {/* Example listing card */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recent builds</h2>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 16, background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>3-bedroom home · Waikato</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Completed 2023 · Sign in to see builder and full costs</p>
          </div>
          <span style={{ background: "#f3f4f6", borderRadius: 8, padding: "4px 12px", fontSize: 14, color: "#374151" }}>
            $400k–$500k
          </span>
        </div>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 16, background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>4-bedroom home · Canterbury</h3>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>Completed 2024 · Sign in to see builder and full costs</p>
          </div>
          <span style={{ background: "#f3f4f6", borderRadius: 8, padding: "4px 12px", fontSize: 14, color: "#374151" }}>
            $600k–$700k
          </span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 48, background: "#111", borderRadius: 12, padding: 32, textAlign: "center" }}>
        <h2 style={{ color: "#fff", margin: "0 0 8px", fontSize: 22 }}>Built a house in NZ?</h2>
        <p style={{ color: "#9ca3af", margin: "0 0 20px", fontSize: 15 }}>
          Share your costs and help the next person avoid the surprises you had.
        </p>
        <button style={{ background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          Share my build →
        </button>
      </div>

    </main>
  )
}
