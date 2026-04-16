export default function Stats() {
  const stats = [
    { value: "10M+", label: "Lines of Code" },
    { value: "50K+", label: "Active Developers" },
    { value: "<50ms", label: "Avg Latency" },
    { value: "99.99%", label: "Uptime SLA" }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-black text-blue-500 mb-2 font-mono">
                {stat.value}
              </div>
              <div className="text-gray-600 text-xs uppercase tracking-[0.15em] font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
