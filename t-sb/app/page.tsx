"use client";

import { useMemo, useState } from "react";

type Song = {
  id: number;
  title: string;
  artist: string;
  year: number;
  tags: string[];
};

// 데모 데이터 (나중에 Supabase 연동 시 제거)
const DEMO_SONGS: Song[] = [
  { id: 1, title: "Blueming", artist: "아이유", year: 2019, tags: ["발라드", "여성보컬"] },
  { id: 2, title: "노래제목 A", artist: "가수 B", year: 2021, tags: ["댄스", "여름"] },
  { id: 3, title: "노래제목 C", artist: "가수 D", year: 2008, tags: ["록"] },
  { id: 4, title: "노래제목 D", artist: "가수 E", year: 2015, tags: ["재즈", "저녁"] },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  const filtered = useMemo(() => {
    return DEMO_SONGS.filter((s) => {
      const hitQ =
        !q ||
        s.title.toLowerCase().includes(q.toLowerCase()) ||
        s.artist.toLowerCase().includes(q.toLowerCase());
      const hitYear = !year || String(s.year) === year;
      const hitTag = !tag || s.tags.some((t) => t.includes(tag));
      return hitQ && hitYear && hitTag;
    });
  }, [q, year, tag]);

  const uniqueYears = useMemo(
    () => Array.from(new Set(DEMO_SONGS.map((s) => s.year))).sort((a, b) => b - a),
    []
  );
  const uniqueTags = useMemo(
    () => Array.from(new Set(DEMO_SONGS.flatMap((s) => s.tags))),
    []
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">누구의 노래책</h1>
          <nav className="text-sm text-gray-500">
            <span className="mr-2">공개용 노래 리스트</span>
          </nav>
        </div>
      </header>

      {/* 3열 레이아웃 */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr_220px]">
        {/* 왼쪽: 검색창 */}
        <aside className="space-y-4 md:sticky md:top-16 md:h-[calc(100vh-6rem)] md:overflow-auto">
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">검색</h2>
            <label className="mb-2 block text-sm text-gray-600" htmlFor="q">
              제목 / 가수
            </label>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예: 아이유, Blueming"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            />

            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-600" htmlFor="year">
                발매년도
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-lg border bg-white px-3 py-2"
              >
                <option value="">전체</option>
                {uniqueYears.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-600" htmlFor="tag">
                태그
              </label>
              <input
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="예: 발라드, 여름"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {uniqueTags.slice(0, 6).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setQ("");
                  setYear("");
                  setTag("");
                }}
                className="flex-1 rounded-lg border px-3 py-2 hover:bg-gray-50"
              >
                초기화
              </button>
            </div>
          </section>
        </aside>

        {/* 중앙: 노래 리스트 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              노래 리스트 <span className="text-sm text-gray-500">({filtered.length}곡)</span>
            </h2>
          </div>

          <ul className="grid grid-cols-1 gap-3">
            {filtered.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{s.title}</div>
                    <div className="text-sm text-gray-600">{s.artist} · {s.year}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-2 py-0.5 text-xs text-gray-700"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
                      상세
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
              조건에 맞는 노래가 없습니다.
            </div>
          )}
        </section>

        {/* 오른쪽: 배너 영역 */}
        <aside className="space-y-4 md:sticky md:top-16 md:h-[calc(100vh-6rem)] md:overflow-auto">
          <a
            href="https://example.com/fancafe"
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border bg-white p-5 text-center shadow-sm transition hover:shadow"
            aria-label="팬카페로 이동"
          >
            <div className="text-lg font-semibold">팬카페</div>
            <div className="mt-1 text-sm text-gray-500">바로가기</div>
          </a>

          <a
            href="https://example.com/broadcast"
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border bg-white p-5 text-center shadow-sm transition hover:shadow"
            aria-label="개인방송국으로 이동"
          >
            <div className="text-lg font-semibold">개인방송국</div>
            <div className="mt-1 text-sm text-gray-500">바로가기</div>
          </a>
        </aside>
      </div>

      {/* 하단 푸터 */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} 누구의 노래책
        </div>
      </footer>
    </main>
  );
}
