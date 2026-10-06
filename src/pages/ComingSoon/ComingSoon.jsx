export default function ComingSoon({ title }) {
  return (
    <div style={{ padding: "3rem 0", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>{title}</h1>
      <p style={{ color: "var(--muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
        This page is coming soon.
      </p>
    </div>
  );
}
