'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCustomizeTexts } from './_shared/useCustomizeTexts';

type Palette = {
  id: string;
  name: string;
  colors: [string, string, string];
};

const palettes: Palette[] = [
  { id: 'modern', name: 'أكاديمي حديث', colors: ['#6DD8EA', '#39B3E6', '#243F97'] },
  { id: 'bright', name: 'تعليم منعش', colors: ['#61D9B1', '#14B884', '#19783F'] },
  { id: 'vivid', name: 'تعلم حيوي', colors: ['#F2B56A', '#F7A30E', '#F3650A'] },
  { id: 'elegant', name: 'تعليم فاخر', colors: ['#C2B5F3', '#9D89EC', '#6D35D8'] },
  { id: 'calm', name: 'اختياري هادئ', colors: ['#67DED1', '#20B9AF', '#147F79'] },
];

const tools = [
  { id: 'colors', label: 'ألوان', iconSrc: '/side%20bar%20stickers/mdi_color.png', href: '/signup/customize' },
  { id: 'images', label: 'الصور', iconSrc: '/side%20bar%20stickers/icon-park-outline_picture.png', href: '/signup/customize/pictures' },
  { id: 'sections', label: 'التقسيمات', iconSrc: '/side%20bar%20stickers/tabler_section.png', href: '/signup/customize/sections' },
  { id: 'text', label: 'النصوص', iconSrc: '/side%20bar%20stickers/majesticons_text.png', href: '/signup/customize/texts' },
  { id: 'social', label: 'مواقع التواصل', iconSrc: '/side%20bar%20stickers/material-symbols_share-outline.png', href: '/signup/customize/social' },
];

export default function CustomizeSchoolPage() {
  const [activePalette, setActivePalette] = useState<Palette>(palettes[0]);
  const { texts } = useCustomizeTexts();

  // Helper for palette colors
  const [main, secondary, accent] = activePalette.colors;

  return (
    <main className="min-h-screen bg-[#E7E8ED]" dir="rtl">
      <div
        className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-3 py-4 md:px-6 lg:grid-cols-[minmax(0,57%)_minmax(0,1fr)_150px] lg:items-start lg:py-6"
        dir="ltr"
      >

        <section
          className="rounded-[22px] border-[5px] p-3 shadow-[0_12px_30px_rgba(40,40,80,0.15)] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-hidden lg:hover:overflow-y-auto"
          style={{ borderColor: accent, background: '#F5F6FB' }}
          dir="rtl"
        >
          <div className="overflow-hidden rounded-[18px] border" style={{ borderColor: secondary, background: 'white' }}>
            <header
              className="relative h-[250px] overflow-hidden rounded-b-[28px] p-4 md:h-[300px]"
              style={{
                backgroundImage:
                  `linear-gradient(145deg, rgba(255,255,255,0.2) 0%, ${main}99 45%, ${accent}b3 100%), url(/assets/Rectangle%209.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="flex items-center justify-between text-white/90">
                <button className="rounded-md px-4 py-1 text-xs font-bold md:text-sm" style={{ background: accent }}>
                  تسجيل الدخول
                </button>
                <nav className="hidden gap-5 text-xs font-semibold md:flex md:text-sm">
                  <span>الرئيسية</span>
                  <span>من نحن</span>
                  <span>المعرض</span>
                  <span>التواصل</span>
                </nav>
              </div>

              <div className="mt-10 flex items-center gap-4 md:mt-14">
                <div className="relative h-32 w-28 overflow-hidden rounded-b-[60px] rounded-t-[20px] border-4 border-white/80 bg-white/50 md:h-40 md:w-32">
                  <Image src="/Mask group@2x.png" alt="student" fill className="object-cover" />
                </div>
                <div className="text-right text-white">
                  <p className="text-[11px] text-white/75 md:text-xs">{texts.homeTagline}</p>
                  <h2 className="text-xl font-extrabold leading-tight md:text-3xl">{texts.homeTitle}</h2>
                  <p className="mt-1 text-sm font-semibold md:text-2xl">{texts.homeDescription}</p>
                  <button className="mt-4 rounded px-5 py-1.5 text-xs font-bold md:text-sm" style={{ background: accent }}>
                    تسجيل الدخول
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-4 right-0 h-8 w-full" style={{ background: secondary, opacity: 0.4 }} />
            </header>

            <div className="px-4 py-5 md:px-8 md:py-8">
              <h3 className="text-right text-xl font-extrabold text-[#241646] md:text-[27px]">{texts.aboutTitle}</h3>
              <p className="mt-2 text-right text-[11px] font-semibold text-[#241646]/80 md:text-xs">{texts.aboutDescription}</p>

              <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <article key={item} className="overflow-hidden rounded-2xl border-2 border-[#B795F1] bg-white shadow-sm">
                    <div className="relative h-24 w-full">
                      <Image src="/assets/Group%20333.png" alt="students" fill className="object-cover" />
                    </div>
                    <div className="p-3 text-right">
                      <p className="text-sm font-black text-[#241646]">أكثر من 500 طالب</p>
                      <p className="mt-1 text-xs font-semibold text-[#241646]/70">تشمل مدرسة التميّز من كل المستويات</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 text-right">
                <h4 className="text-xl font-extrabold text-[#241646] md:text-[27px]">{texts.galleryTitle}</h4>
                <p className="text-[11px] font-semibold text-[#241646]/70 md:text-xs">{texts.galleryDescription}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1" dir="rtl">
          <h1 className="mb-4 text-center text-xl font-extrabold text-[#241646] md:text-2xl">قم بتعديل الرئيسية لمدرستك</h1>

          <div className="space-y-4">
            {palettes.map((palette) => {
              const isActive = activePalette.id === palette.id;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setActivePalette(palette)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-right transition-all md:px-8 md:py-5 ${
                    isActive
                      ? 'border-[#241646] bg-white shadow-[0_8px_20px_rgba(20,20,40,0.18)]'
                      : 'border-[#3A3450] bg-white/85 hover:bg-white'
                  }`}
                  style={isActive ? { borderColor: accent } : {}}
                >
                  <span className="text-base font-extrabold text-[#241646] md:text-lg">{palette.name}</span>
                  <span className="flex gap-3">
                    {palette.colors.map((color) => (
                      <span
                        key={color}
                        className="h-11 w-11 rounded-full ring-2 ring-white md:h-14 md:w-14"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-[18px] bg-gradient-to-b from-[#F20A9D] to-[#C60086] p-3 text-white shadow-xl lg:sticky lg:top-4" dir="rtl">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-[11px] font-bold">
            <Image src="/assets/logo.png" alt="logo" width={72} height={28} />
          </div>

          <div className="flex-1 space-y-3">
            {tools.map((tool) => {
              const className = `flex w-full flex-col items-center justify-center rounded-xl px-2 py-2.5 text-center transition-all duration-200 ${
                tool.id === 'colors'
                  ? 'bg-[#9E79F7] shadow-[0_10px_22px_rgba(34,16,80,0.35)]'
                  : 'hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-[0_8px_18px_rgba(22,8,45,0.28)]'
              }`;

              if (tool.href) {
                return (
                  <Link key={tool.id} href={tool.href} className={className}>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <Image src={tool.iconSrc} alt={tool.label} width={22} height={22} className="h-5 w-5 object-contain" />
                    </span>
                    <span className="mt-1 text-sm font-extrabold">{tool.label}</span>
                  </Link>
                );
              }

              return (
                <button key={tool.id} type="button" className={className}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <Image src={tool.iconSrc} alt={tool.label} width={22} height={22} className="h-5 w-5 object-contain" />
                  </span>
                  <span className="mt-1 text-sm font-extrabold">{tool.label}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs font-semibold text-white/80">النمط الحالي: {activePalette.name}</p>
        </aside>
      </div>
    </main>
  );
}
