"use client";
import { useMemo, useRef, useState } from "react";
import { Source_Serif_4, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { parseInput } from "@/lib/parser";
import { CIN_PARTS, FILTERS } from "@/lib/constant";
import { detailsOf, csvCell } from "@/lib/helper.js";

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });
const sans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const EXAMPLE = `L17110MH1973PLC019786
U72900DL2019PTC123456
AAA-1234
ABC-12345
U12345XX2020PTC000001`;

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState(null); // null = nothing analysed yet
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const resultsRef = useRef(null);

  const lineCount = useMemo(
    () => input.split(/\r?\n/).filter((l) => l.trim()).length,
    [input],
  );

  const stats = useMemo(() => {
    const list = results || [];
    const valid = list.filter((r) => r.valid).length;
    return { total: list.length, valid, invalid: list.length - valid };
  }, [results]);

  const visible = useMemo(() => {
    if (!results) return [];
    if (filter === "valid") return results.filter((r) => r.valid);
    if (filter === "invalid") return results.filter((r) => !r.valid);
    return results;
  }, [results, filter]);

  function handleAnalyze() {
    if (!input.trim()) {
      setNotice("Paste at least one CIN or LLPIN, one per line.");
      setResults(null);
      return;
    }
    setNotice("");
    setFilter("all");
    setResults(parseInput(input));
    requestAnimationFrame(() =>
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    );
  }

  function handleClear() {
    setInput("");
    setResults(null);
    setNotice("");
  }

  function handleExport() {
    const rows = [
      ["Identifier", "Status", "Type", "Details"],
      ...results.map((r) => [
        r.input,
        r.valid ? "Valid" : "Invalid",
        r.type,
        r.valid
          ? detailsOf(r)
              .map((detail) => `${detail.label}: ${detail.value}`)
              .join(" | ")
          : r.error,
      ]),
    ];
    const blob = new Blob(
      [rows.map((r) => r.map(csvCell).join(",")).join("\n")],
      {
        type: "text/csv;charset=utf-8",
      },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cin-llpin-results.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const focus =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B6B5D]";

  return (
    <main
      className={`${serif.variable} ${sans.variable} ${mono.variable} min-h-screen bg-[#F4F6F8] font-[family-name:var(--font-sans)] text-[#0E1B2C] antialiased`}
    >
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <header className="max-w-2xl">
          <h1 className="font-[family-name:var(--font-serif)] text-[2rem] font-semibold leading-tight tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent sm:text-5xl">
            Check company and LLP identification numbers
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Paste any number of CINs and LLPINs. We check the format and read
            out what each number says about the entity.
          </p>
        </header>

        {/* Input */}
        <section className="mt-8 rounded-2xl border border-[#D5DBE3] bg-white p-4 shadow-sm sm:mt-10 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="ids" className="text-sm font-semibold">
              Identifiers
            </label>
            <span
              className="text-sm tabular-nums text-[#5B6B7F]"
              aria-live="polite"
            >
              {lineCount === 0
                ? "One per line"
                : `${lineCount.toLocaleString("en-IN")} ${lineCount === 1 ? "line" : "lines"}`}
            </span>
          </div>

          <textarea
            id="ids"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter")
                handleAnalyze();
            }}
            spellCheck={false}
            autoCapitalize="characters"
            autoCorrect="off"
            aria-describedby="ids-help"
            placeholder={`L17110MH1973PLC019786\nU72900DL2019PTC123456\nAAA-1234`}
            className={`mt-2 h-48 w-full resize-y rounded-xl border border-[#C3CBD6] bg-[#FBFCFD] p-4 font-[family-name:var(--font-mono)] text-[15px] leading-7 placeholder:text-[#9AA6B5] sm:h-56 ${focus}`}
          />

          <p id="ids-help" className="mt-2 text-sm text-[#5B6B7F]">
            Paste straight from a spreadsheet or a list. Blank lines are
            ignored.
          </p>

          {notice && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-[#FDECEA] px-3 py-2 text-sm font-medium text-[#8A1F14]"
            >
              {notice}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAnalyze}
              className={`min-h-11 flex-1 cursor-pointer rounded-lg bg-indigo-600 px-6 text-base font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors hover:bg-indigo-700 active:bg-indigo-800 sm:flex-none ${focus}`}
            >
              Check identifiers
            </button>
            <button
              onClick={() => setInput(EXAMPLE)}
              className={`min-h-11 cursor-pointer rounded-lg px-3 text-sm font-semibold text-[#0B6B5D] underline-offset-4 hover:underline ${focus}`}
            >
              Use sample data
            </button>
            {input && (
              <button
                onClick={handleClear}
                className={`min-h-11 cursor-pointer rounded-lg px-3 text-sm font-semibold text-[#5B6B7F] underline-offset-4 hover:underline sm:ml-auto ${focus}`}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Empty state: how to read a CIN */}
        {!results && (
          <section className="mt-10" aria-labelledby="anatomy">
            <h2
              id="anatomy"
              className="font-[family-name:var(--font-serif)] text-xl font-semibold"
            >
              How a CIN reads
            </h2>
            <p className="mt-1 text-sm text-[#4B5A6D]">
              A CIN is 21 characters. Each part carries one fact, for example
              L17110MH1973PLC019786.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CIN_PARTS.map((p) => (
                <div
                  key={p.label}
                  className="rounded-xl border border-[#D5DBE3] bg-white p-3"
                >
                  <dt className="font-[family-name:var(--font-mono)] text-lg font-medium text-[#0B6B5D]">
                    {p.code}
                  </dt>
                  <dd className="mt-1 text-sm leading-snug text-[#4B5A6D]">
                    {p.label}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-[#4B5A6D]">
              LLPINs use a shorter pattern, such as AAA-1234. Paste both kinds
              together if you like.
            </p>
          </section>
        )}

        {/* Results */}
        {results && (
          <section
            ref={resultsRef}
            className="mt-10 scroll-mt-6"
            aria-labelledby="results-title"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id="results-title"
                  className="font-[family-name:var(--font-serif)] text-2xl font-semibold"
                >
                  Results
                </h2>
                <p className="mt-1 text-sm text-[#4B5A6D]" aria-live="polite">
                  {stats.total.toLocaleString("en-IN")} checked:{" "}
                  <span className="font-semibold text-[#0B6B5D]">
                    {stats.valid.toLocaleString("en-IN")} valid
                  </span>
                  ,{" "}
                  <span className="font-semibold text-[#B42318]">
                    {stats.invalid.toLocaleString("en-IN")} invalid
                  </span>
                </p>
              </div>
              <button
                onClick={handleExport}
                className={`min-h-11 cursor-pointer rounded-lg border border-[#C3CBD6] bg-white px-4 text-sm font-semibold hover:bg-[#EEF1F5] ${focus}`}
              >
                Download CSV
              </button>
            </div>

            <div
              role="tablist"
              aria-label="Filter results"
              className="mt-4 inline-flex rounded-lg border border-[#D5DBE3] bg-white p-1"
            >
              {FILTERS.map((f) => {
                const count = f.id === "all" ? stats.total : stats[f.id];
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.id)}
                    className={`min-h-9 cursor-pointer rounded-md px-3 text-sm font-semibold tabular-nums ${focus} ${
                      active
                        ? "bg-[#0E1B2C] text-white"
                        : "text-[#4B5A6D] hover:bg-[#EEF1F5]"
                    }`}
                  >
                    {f.label} {count}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 max-h-[70vh] overflow-auto rounded-2xl border border-[#D5DBE3] bg-white">
              <div className="sticky top-0 z-10 hidden grid-cols-[minmax(0,2.2fr)_7rem_6rem_minmax(0,3fr)] gap-x-4 border-b border-[#D5DBE3] bg-[#EEF1F5] px-5 py-3 text-sm font-semibold text-[#4B5A6D] md:grid">
                <span>Identifier</span>
                <span>Status</span>
                <span>Type</span>
                <span>Details</span>
              </div>
              {visible.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-[#4B5A6D]">
                  No {filter} identifiers in this list.
                </p>
              ) : (
                <ul>
                  {visible.map((item, i) => {
                    const details = detailsOf(item);
                    return (
                      <li
                        key={`${item.input}-${i}`}
                        className="grid gap-x-4 gap-y-2 border-t border-[#E3E8EE] px-4 py-4 first:border-t-0 md:grid-cols-[minmax(0,2.2fr)_7rem_6rem_minmax(0,3fr)] md:px-5 md:py-3"
                      >
                        <span className="break-all font-[family-name:var(--font-mono)] text-[15px] font-medium">
                          {item.input}
                        </span>

                        <div className="flex items-center gap-3 md:contents">
                          <span
                            className={`inline-flex w-fit items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-sm font-semibold md:self-center ${
                              item.valid
                                ? "bg-[#E2F4EF] text-[#0B6B5D]"
                                : "bg-[#FDECEA] text-[#B42318]"
                            }`}
                          >
                            <span aria-hidden="true">
                              {item.valid ? "✓" : "✕"}
                            </span>
                            {item.valid ? "Valid" : "Invalid"}
                          </span>
                          <span className="text-sm text-[#4B5A6D] md:self-center">
                            {item.type || "Unknown"}
                          </span>
                        </div>

                        {item.valid ? (
                          <div className="flex flex-wrap gap-2 md:self-center">
                            {details.length > 0 &&
                              details.map((detail, index) => (
                                <div
                                  key={index}
                                  className="rounded-lg border border-[#B9DED4] bg-[#E8F5F0] px-3 py-2"
                                >
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#478273]">
                                    {detail.label}
                                  </p>
                                  <p className="mt-0.5 text-sm font-semibold text-[#075B4D]">
                                    {detail.value}
                                  </p>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#8A1F14] md:self-center">
                            {item.error}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
