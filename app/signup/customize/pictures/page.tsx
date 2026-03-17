'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCustomizeSections } from '../_shared/useCustomizeSections';
import { useCustomizeTexts } from '../_shared/useCustomizeTexts';

type HeroChoice = {
  id: string;
  src: string;
  alt: string;
};

type StageChoice = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

const heroChoices: HeroChoice[] = [
  { id: 'hero-yellow', src: '/assets/Rectangle 3.png', alt: 'خلفية رأس الصفحة الأولى' },
  { id: 'hero-family', src: '/assets/Rectangle 4.png', alt: 'خلفية رأس الصفحة الثانية' },
];

const stageChoices: StageChoice[] = [
  { id: 'secondary', label: 'طور ثانوي', src: '/assets/Rectangle 5.png', alt: 'صورة طور ثانوي' },
  { id: 'middle', label: 'طور متوسط', src: '/assets/Rectangle 6.png', alt: 'صورة طور متوسط' },
  { id: 'primary', label: 'طور ابتدائي', src: '/Mask group@2x.png', alt: 'صورة طور ابتدائي' },
];

const tools = [
  { id: 'colors', label: 'ألوان', icon: '🎨', href: '/signup/customize' },
  { id: 'images', label: 'الصور', icon: '🖼️', href: '/signup/customize/pictures' },
  { id: 'sections', label: 'التقسيمات', icon: '▦', href: '/signup/customize/sections' },
  { id: 'text', label: 'النصوص', icon: '≡', href: '/signup/customize/texts' },
  { id: 'social', label: 'مواقع التواصل', icon: '⤴', href: '/signup/customize/social' },
];

function UploadDropzone({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="mx-auto flex h-[110px] w-[170px] flex-col items-center justify-center rounded-md border-2 border-dashed border-[#2A214A] bg-white/50 text-[#2A214A]"
    >
      <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 9l5-5 5 5" />
      </svg>
      <span className="mt-1 text-[10px] font-semibold">قم برفع صورتك هنا</span>
      <span className="mt-0.5 text-[10px] font-semibold">{label}</span>
    </button>
  );
}

export default function PicturesCustomizePage() {
  const [selectedHero, setSelectedHero] = useState(heroChoices[0].id);
  const [selectedStage, setSelectedStage] = useState(stageChoices[2].id);
  const { sections } = useCustomizeSections();
  const { texts } = useCustomizeTexts();

  return (
    <main className="min-h-screen bg-[#E7E8ED]" dir="rtl">
      <div
        className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-3 py-4 md:px-6 lg:grid-cols-[minmax(0,57%)_minmax(0,1fr)_150px] lg:items-start lg:py-6"
        dir="ltr"
      >
        <section className="rounded-[22px] border-[4px] border-[#D2008A] bg-[#F5F6FB] p-3 shadow-[0_12px_30px_rgba(40,40,80,0.15)]" dir="rtl">
          <div className="overflow-hidden rounded-[18px] border border-[#B89BEA] bg-white">
            <header
              className="relative h-[220px] overflow-hidden rounded-b-[28px] p-4 md:h-[275px]"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(40,37,122,0.65) 45%, rgba(32,30,93,0.7) 100%), url(/assets/Rectangle%209.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
                  <p className="text-[10px] text-white/75 md:text-[11px]">من أول مستقبل آمن</p>
                  <h2 className="text-lg font-extrabold leading-tight md:text-2xl">مدرسة تمكين</h2>
                  <p className="mt-1 text-xs font-semibold md:text-lg">مدرسة دروس خصوصية للطور الابتدائي</p>
                  <button className="mt-3 rounded bg-[#D2008A] px-4 py-1 text-[10px] font-bold md:text-xs">تسجيل الدخول</button>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-3 right-0 h-6 w-full bg-[#BBA2ED]/65" />
            </header>

            <div className="px-4 py-5 md:px-6 md:py-6">
              {sections.about && (
                <>
                  <h3 className="text-right text-xl font-extrabold text-[#241646] md:text-2xl">{texts.aboutTitle}</h3>
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
                  <h4 className="text-xl font-extrabold text-[#241646] md:text-2xl">{texts.galleryTitle}</h4>
                  <p className="text-[11px] font-semibold text-[#241646]/70 md:text-xs">أبرز اللقطات داخل المؤسسة</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-3" dir="rtl">
          <h1 className="mb-2 text-center text-lg font-extrabold text-[#241646] md:text-2xl">قم بتعديل الرئيسية لمدرستك</h1>

          <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
            <h2 className="mb-3 text-right text-xl font-black text-[#241646]">صورة راس الصفحة</h2>
            <div className="space-y-3">
              {heroChoices.map((hero) => {
                const selected = hero.id === selectedHero;
                return (
                  <button
                    key={hero.id}
                    type="button"
                    onClick={() => setSelectedHero(hero.id)}
                    className={`relative h-[95px] w-full overflow-hidden rounded-md border-2 ${
                      selected ? 'border-[#D2008A]' : 'border-transparent'
                    }`}
                  >
                    <Image src={hero.src} alt={hero.alt} fill className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          {sections.stats && (
            <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
              <h2 className="mb-3 text-right text-xl font-black text-[#241646]">صورة راس الصفحة</h2>
              <div className="grid grid-cols-3 gap-2">
                {stageChoices.map((stage) => {
                  const selected = stage.id === selectedStage;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setSelectedStage(stage.id)}
                      className={`relative overflow-hidden rounded-md border-2 ${selected ? 'border-[#D2008A]' : 'border-transparent'}`}
                    >
                      <div className="absolute right-0 top-0 z-10 rounded-bl-md bg-[#11B8F7] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                        {stage.label}
                      </div>
                      <div className="relative h-[120px] w-full bg-[#57DDF5]">
                        <Image src={stage.src} alt={stage.alt} fill className="object-cover" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {sections.about && (
            <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
              <h2 className="mb-2 text-right text-xl font-black text-[#241646]">من نحن</h2>
              <UploadDropzone label="" />
            </div>
          )}

          {sections.gallery && (
            <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
              <h2 className="mb-2 text-right text-xl font-black text-[#241646]">صور المعرض</h2>
              <UploadDropzone label="" />
            </div>
          )}
        </section>

        <aside className="rounded-[18px] bg-gradient-to-b from-[#F20A9D] to-[#C60086] p-3 text-white shadow-xl" dir="rtl">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-xs font-bold">
            <Image src="/assets/logo.png" alt="logo" width={72} height={28} />
          </div>

          <div className="space-y-3">
            {tools.map((tool) => {
              const className = `flex w-full flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition ${
                tool.id === 'images' ? 'bg-[#9E79F7]' : 'hover:bg-white/15'
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
        </aside>
      </div>
    </main>
  );
}
