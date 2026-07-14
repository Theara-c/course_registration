import { useState, useEffect } from "react";

export default function PolicyLayout({
  title,
  updated,
  summaryTitle = "Quick Summary",
  summaryIcon = "fa-bolt",
  summary = [],
  sections,
  footer,
}) {
  const [activeSection, setActiveSection] = useState("");
  const [jumpTo, setJumpTo] = useState("");

  function handleMobileJump(e) {
    const id = e.target.value;
    setJumpTo(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          setJumpTo(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 antialiased bg-white text-slate-800">
      {/* Hero Header */}
      <header className="max-w-3xl mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142175] tracking-tight">
          {title}
        </h1>
        {updated && (
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Last updated: {updated}
          </p>
        )}
      </header>

      {/* Summary Highlights */}
      {summary.length > 0 && (
        <div className="mb-16 bg-gradient-to-br from-indigo-50/40 to-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
          <h2 className="font-bold text-[#142175] flex items-center gap-2 text-base uppercase tracking-wider">
            <i className={`fa-solid ${summaryIcon} text-amber-500`}></i>
            {summaryTitle}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {summary.map((point, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-slate-600 leading-relaxed"
              >
                <i className="fa-solid fa-check text-emerald-500 mt-1 shrink-0"></i>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile Sticky Selector */}
      <div className="lg:hidden sticky top-0 z-20 my-6 bg-white/90 backdrop-blur-md py-3 border-b border-slate-100">
        <select
          value={jumpTo}
          onChange={handleMobileJump}
          className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-[#142175] cursor-pointer"
        >
          <option value="" disabled>
            Jump to a section...
          </option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.navLabel || s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Core Split Content Layout */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-16 items-start">
        {/* Sticky Sidebar Navigation */}
        <nav className="hidden lg:block sticky top-24 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-3">
            On this page
          </p>
          <div className="border-l border-slate-100 space-y-1">
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`group flex items-center gap-3 text-sm font-medium py-2.5 pl-4 -ml-px border-l transition-all duration-200 ${
                    isActive
                      ? "border-[#142175] text-[#142175] font-semibold"
                      : "border-transparent text-slate-400 hover:text-[#142175] hover:border-slate-200"
                  }`}
                >
                  <i
                    className={`fa-solid ${s.icon} w-4 text-center text-xs transition-colors ${
                      isActive
                        ? "text-[#142175]"
                        : "text-slate-300 group-hover:text-slate-400"
                    }`}
                  ></i>
                  <span className="truncate">
                    {s.navLabel || s.title.replace(/^\d+\.\s*/, "")}
                  </span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Content Flow */}
        <div className="space-y-16 max-w-3xl">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0 text-xs font-medium group-hover:bg-[#142175]/5 group-hover:text-[#142175] group-hover:border-transparent transition-all">
                  <i className={`fa-solid ${s.icon}`}></i>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {s.title}
                </h2>
              </div>
              <div className="text-slate-600 text-[15px] leading-relaxed pl-11 space-y-4">
                {s.content}
              </div>
            </section>
          ))}

          {footer && (
            <div className="pt-8 border-t border-slate-100">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
