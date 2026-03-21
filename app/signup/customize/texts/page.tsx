'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useCustomizeSections } from '../_shared/useCustomizeSections';
import { useCustomizeTexts } from '../_shared/useCustomizeTexts';

type PanelKey = 'home' | 'about' | 'gallery';

const tools = [
  { id: 'colors', label: 'ألوان', iconSrc: '/side%20bar%20stickers/mdi_color.png', href: '/signup/customize' },
  { id: 'images', label: 'الصور', iconSrc: '/side%20bar%20stickers/icon-park-outline_picture.png', href: '/signup/customize/pictures' },
  { id: 'sections', label: 'التقسيمات', iconSrc: '/side%20bar%20stickers/tabler_section.png', href: '/signup/customize/sections' },
  { id: 'text', label: 'النصوص', iconSrc: '/side%20bar%20stickers/majesticons_text.png', href: '/signup/customize/texts' },
  { id: 'social', label: 'مواقع التواصل', iconSrc: '/side%20bar%20stickers/material-symbols_share-outline.png', href: '/signup/customize/social' },
];

function AccordionCard({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-[#1E163C] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-extrabold text-[#241646]">{label}</span>
        <span className="text-[#1E163C]" aria-hidden="true">
          <svg className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.25 7.5 10 12.25 14.75 7.5 13.25 6 10 9.25 6.75 6z" />
          </svg>
        </span>
      </button>

      {open && <div className="border-t-2 border-[#1E163C] p-4">{children}</div>}
    </div>
  );
}

export default function TextsCustomizePage() {
  const { sections } = useCustomizeSections();
  const { texts, setText } = useCustomizeTexts();

  const availablePanels = useMemo(() => {
    const items: PanelKey[] = ['home'];
    if (sections.about) items.push('about');
    if (sections.gallery) items.push('gallery');
    return items;
  }, [sections.about, sections.gallery]);

  const [openPanel, setOpenPanel] = useState<PanelKey | null>(availablePanels.includes('about') ? 'about' : 'home');

  const togglePanel = (panel: PanelKey) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  return (
    <main className="min-h-screen bg-[#E7E8ED]" dir="rtl">
      <div
        className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-3 py-4 md:px-6 lg:grid-cols-[minmax(0,57%)_minmax(0,1fr)_150px] lg:items-start lg:py-6"
        dir="ltr"
      >
        <section
          className="rounded-[22px] border-[4px] border-[#D2008A] bg-[#F5F6FB] p-3 shadow-[0_12px_30px_rgba(40,40,80,0.15)] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-hidden lg:hover:overflow-y-auto"
          dir="rtl"
        >
          <div className="overflow-hidden rounded-[18px] border border-[#B89BEA] bg-white">
            <header
              className="relative h-[220px] overflow-hidden rounded-b-[28px] p-4 md:h-[275px]"
              style={{
                backgroundImage:
                  'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(40,37,122,0.65) 45%, rgba(32,30,93,0.7) 100%), url(/assets/Rectangle%209.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="flex items-center justify-between text-white/90">
                <button className="rounded-md bg-[#D2008A] px-4 py-1 text-[11px] font-bold md:text-xs">تسجيل الدخول</button>
                <nav className="hidden gap-4 text-[11px] font-semibold md:flex md:text-xs">
                  <span>الرئيسية</span>
                  <span>من نحن</span>
                  <span>المعرض</span>
                  <span>التواصل</span>
                </nav>
              </div>

              <div className="mt-8 flex items-center gap-4 md:mt-10">
                <div className="relative h-28 w-24 overflow-hidden rounded-b-[56px] rounded-t-[18px] border-4 border-white/80 bg-white/50 md:h-36 md:w-28">
                  <Image src="/Mask group@2x.png" alt="student" fill className="object-cover" />
                </div>
                <div className="text-right text-white">
                  <p className="text-[10px] text-white/75 md:text-[11px]">{texts.homeTagline}</p>
                  <h2 className="text-lg font-extrabold leading-tight md:text-2xl">{texts.homeTitle}</h2>
                  <p className="mt-1 text-xs font-semibold md:text-lg">{texts.homeDescription}</p>
                  <button className="mt-3 rounded bg-[#D2008A] px-4 py-1 text-[10px] font-bold md:text-xs">تسجيل الدخول</button>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-3 right-0 h-6 w-full bg-[#BBA2ED]/65" />
            </header>

            <div className="px-4 py-5 md:px-6 md:py-6">
              {sections.about && (
                <>
                  <h3 className="text-right text-lg font-extrabold text-[#241646] md:text-xl">{texts.aboutTitle}</h3>
                  <p className="mt-2 text-right text-[11px] font-semibold text-[#241646]/80 md:text-xs">{texts.aboutDescription}</p>
                </>
              )}

              {sections.stats && (
                <div className={`${sections.about ? 'mt-7' : 'mt-0'} grid grid-cols-1 gap-3 md:grid-cols-3`}>
                  {[1, 2, 3].map((item) => (
                    <article key={item} className="overflow-hidden rounded-2xl border-2 border-[#B795F1] bg-white shadow-sm">
                      <div className="relative h-20 w-full">
                        <Image src="/assets/Group 333.png" alt="students" fill className="object-cover" />
                      </div>
                      <div className="p-2 text-right">
                        <p className="text-sm font-black text-[#241646]">أكثر من 500 طالب</p>
                        <p className="mt-1 text-[10px] font-semibold text-[#241646]/70">تشمل مدرسة التميّز من كل المستويات</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {sections.gallery && (
                <div className="mt-7 text-right">
                  <h4 className="text-lg font-extrabold text-[#241646] md:text-xl">{texts.galleryTitle}</h4>
                  <p className="text-[11px] font-semibold text-[#241646]/70 md:text-xs">{texts.galleryDescription}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4" dir="rtl">
          <div className="rounded-2xl border-2 border-[#1E163C] bg-white p-5">
            <h1 className="text-center text-xl font-extrabold text-[#241646]">نصوص صفحة المدرسة</h1>
            <p className="mt-2 text-center text-xs font-semibold text-[#241646]/80">قم باختيار الاجزاء وادخال نصوصها</p>

            <div className="mt-4 space-y-3">
              <AccordionCard label="الرئيسية" open={openPanel === 'home'} onToggle={() => togglePanel('home')}>
                  <label className="block text-right text-xs font-extrabold text-[#241646]">النص العلوي</label>
                  <input
                    value={texts.homeTagline}
                    onChange={(e) => setText('homeTagline', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#D7D7E3] bg-[#F1F2F6] px-3 py-2 text-right text-xs font-semibold text-[#241646] outline-none"
                  />

                  <label className="mt-4 block text-right text-xs font-extrabold text-[#241646]">عنوان الرئيسية</label>
                  <input
                    value={texts.homeTitle}
                    onChange={(e) => setText('homeTitle', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#D7D7E3] bg-[#F1F2F6] px-3 py-2 text-right text-xs font-semibold text-[#241646] outline-none"
                  />

                  <label className="mt-4 block text-right text-xs font-extrabold text-[#241646]">وصف الرئيسية</label>
                  <textarea
                    value={texts.homeDescription}
                    onChange={(e) => setText('homeDescription', e.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-[#D7D7E3] bg-[#F1F2F6] p-3 text-right text-xs font-semibold text-[#241646] outline-none"
                    rows={2}
                  />
              </AccordionCard>

              <AccordionCard label="من نحن" open={openPanel === 'about'} onToggle={() => togglePanel('about')}>
                  <label className="block text-right text-xs font-extrabold text-[#241646]">العنوان</label>
                  <textarea
                    value={texts.aboutTitle}
                    onChange={(e) => setText('aboutTitle', e.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-[#D7D7E3] bg-[#F1F2F6] p-3 text-right text-xs font-semibold text-[#241646] outline-none"
                    rows={2}
                  />

                  <label className="mt-4 block text-right text-xs font-extrabold text-[#241646]">الوصف</label>
                  <textarea
                    value={texts.aboutDescription}
                    onChange={(e) => setText('aboutDescription', e.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-[#D7D7E3] bg-[#F1F2F6] p-3 text-right text-xs font-semibold text-[#241646] outline-none"
                    rows={3}
                  />
              </AccordionCard>

              <AccordionCard label="المعرض" open={openPanel === 'gallery'} onToggle={() => togglePanel('gallery')}>
                  <label className="block text-right text-xs font-extrabold text-[#241646]">العنوان</label>
                  <input
                    value={texts.galleryTitle}
                    onChange={(e) => setText('galleryTitle', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#D7D7E3] bg-[#F1F2F6] px-3 py-2 text-right text-xs font-semibold text-[#241646] outline-none"
                  />

                  <label className="mt-4 block text-right text-xs font-extrabold text-[#241646]">الوصف</label>
                  <textarea
                    value={texts.galleryDescription}
                    onChange={(e) => setText('galleryDescription', e.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-[#D7D7E3] bg-[#F1F2F6] p-3 text-right text-xs font-semibold text-[#241646] outline-none"
                    rows={2}
                  />
              </AccordionCard>
            </div>
          </div>
        </section>

        <aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-[18px] bg-gradient-to-b from-[#F20A9D] to-[#C60086] p-3 text-white shadow-xl lg:sticky lg:top-4" dir="rtl">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-[11px] font-bold">
            <Image src="/assets/logo.png" alt="logo" width={72} height={28} />
          </div>

          <div className="flex-1 space-y-3">
            {tools.map((tool) => {
              const className = `flex w-full flex-col items-center justify-center rounded-xl px-2 py-2.5 text-center transition-all duration-200 ${
                tool.id === 'text'
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
        </aside>
      </div>
    </main>
  );
}
