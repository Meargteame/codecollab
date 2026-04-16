export default function TrustedBy() {
  const companies = [
    "Vercel",
    "GitHub",
    "Stripe",
    "Linear",
    "Supabase",
    "Cloudflare"
  ];

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-gray-600 text-xs uppercase tracking-[0.2em] mb-12 font-mono">
          TRUSTED BY TEAMS AT
        </p>
        <div className="flex items-center justify-center gap-16 flex-wrap opacity-40">
          {companies.map((company) => (
            <div key={company} className="text-white font-bold text-xl">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
