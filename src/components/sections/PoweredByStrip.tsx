const platforms = [
  { name: "Netflix" },
  { name: "ChatGPT" },
  { name: "Claude" },
  { name: "Spotify" },
  { name: "YouTube" },
  { name: "Canva" },
  { name: "NordVPN" },
  { name: "Duolingo" },
  { name: "Disney+" },
  { name: "Amazon Prime" },
];

export function PoweredByStrip() {
  const doubled = [...platforms, ...platforms];

  return (
    <section className="py-12 relative overflow-hidden border-y border-border/40">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 text-center mb-8">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: "#94a3b8" }}
        >
          Platforms we offer
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #f8f9ff, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(270deg, #f8f9ff, transparent)" }}
        />

        {/* Scrolling track */}
        <div
          className="flex items-center gap-16"
          style={{
            animation: "marquee 28s linear infinite",
            width: "max-content",
          }}
        >
          {doubled.map((platform, i) => (
            <div
              key={`${platform.name}-${i}`}
              className="flex items-center gap-3 group cursor-default select-none shrink-0"
            >
              <span
                className="font-heading font-semibold text-base transition-colors duration-300 group-hover:text-[#64748b]"
                style={{ color: "#a8b4c4" }}
              >
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
