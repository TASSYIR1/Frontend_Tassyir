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
  { id: 'colors', label: 'ألوان', icon: '🎨', href: '/signup/customize' },
  { id: 'images', label: 'الصور', icon: '🖼️', href: '/signup/customize/pictures' },
  { id: 'sections', label: 'التقسيمات', icon: '▦', href: '/signup/customize/sections' },
  { id: 'text', label: 'النصوص', icon: '≡', href: '/signup/customize/texts' },
  { id: 'social', label: 'مواقع التواصل', icon: '⤴', href: '/signup/customize/social' },
];

export default function CustomizeSchoolPage() {
  const [activePalette, setActivePalette] = useState<Palette>(palettes[0]);
  const { texts } = useCustomizeTexts();

  return (
    <main className="min-h-screen bg-[#E7E8ED]" dir="rtl">
      <div
        className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-3 py-4 md:px-6 lg:grid-cols-[minmax(0,57%)_minmax(0,1fr)_150px] lg:items-start lg:py-6"
        dir="ltr"
      >

        <section className="rounded-[22px] border-[5px] border-[#D2008A] bg-[#F5F6FB] p-3 shadow-[0_12px_30px_rgba(40,40,80,0.15)]" dir="rtl">
          <div className="overflow-hidden rounded-[18px] border border-[#B89BEA] bg-white">
            <header
              className="relative h-[250px] overflow-hidden rounded-b-[28px] p-4 md:h-[300px]"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(40,37,122,0.65) 45%, rgba(32,30,93,0.7) 100%), url(/assets/Rectangle%209.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex items-center justify-between text-white/90">
                <button className="rounded-md bg-[#D2008A] px-4 py-1 text-xs font-bold hover:bg-[#B30075] md:text-sm">
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
                  <p className="text-[11px] text-white/75 md:text-xs">من أول مستقبل آمن</p>
                  <h2 className="text-xl font-extrabold leading-tight md:text-3xl">مدرسة تمكين</h2>
                  <p className="mt-1 text-sm font-semibold md:text-2xl">مدرسة دروس خصوصية للطور الابتدائي</p>
                  <button className="mt-4 rounded bg-[#D2008A] px-5 py-1.5 text-xs font-bold hover:bg-[#B30075] md:text-sm">تسجيل الدخول</button>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-4 right-0 h-8 w-full bg-[#BBA2ED]/65" />
            </header>

            <div className="px-4 py-5 md:px-8 md:py-8">
              <h3 className="text-right text-2xl font-extrabold text-[#241646] md:text-[30px]">{texts.aboutTitle}</h3>
              <p className="mt-2 text-right text-xs font-semibold text-[#241646]/80 md:text-sm">{texts.aboutDescription}</p>

              <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <article key={item} className="overflow-hidden rounded-2xl border-2 border-[#B795F1] bg-white shadow-sm">
                    <div className="relative h-24 w-full">
                      <Image src="/assets/Group%20333.png" alt="students" fill className="object-cover" />
                    </div>
                    <div className="p-3 text-right">
                      <p className="text-base font-black text-[#241646]">أكثر من 500 طالب</p>
                      <p className="mt-1 text-xs font-semibold text-[#241646]/70">تشمل مدرسة التميّز من كل المستويات</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 text-right">
                <h4 className="text-2xl font-extrabold text-[#241646] md:text-[30px]">{texts.galleryTitle}</h4>
                <p className="text-xs font-semibold text-[#241646]/70 md:text-sm">أبرز اللقطات داخل المؤسسة</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1" dir="rtl">
          <h1 className="mb-4 text-center text-xl font-extrabold text-[#241646] md:text-3xl">قم بتعديل الرئيسية لمدرستك</h1>

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
                >
                  <span className="text-xl font-black text-[#241646] md:text-3xl">{palette.name}</span>
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

        <aside className="rounded-[18px] bg-gradient-to-b from-[#F20A9D] to-[#C60086] p-3 text-white shadow-xl" dir="rtl">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-xs font-bold">
            <Image src="/assets/logo.png" alt="logo" width={72} height={28} />
          </div>

          <div className="space-y-3">
            {tools.map((tool) => {
              const className = `flex w-full flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition ${
                tool.id === 'colors' ? 'bg-[#9E79F7]' : 'hover:bg-white/15'
              }`;

              if (tool.href) {
                return (
                  <Link key={tool.id} href={tool.href} className={className}>
                    <span className="text-xl leading-none">{tool.icon}</span>
                    <span className="mt-1 text-xs font-bold">{tool.label}</span>
                  </Link>
                );
              }

              return (
                <button key={tool.id} type="button" className={className}>
                  <span className="text-xl leading-none">{tool.icon}</span>
                  <span className="mt-1 text-xs font-bold">{tool.label}</span>
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
