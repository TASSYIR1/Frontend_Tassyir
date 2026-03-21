'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
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
  { id: 'bg1', src: '/assets/bg1.jpg', alt: 'خلفية رأس الصفحة الأولى' },
  { id: 'bg2', src: '/assets/bg2.jpg', alt: 'خلفية رأس الصفحة الثانية' },
  { id: 'bg3', src: '/assets/bg3.jpg', alt: 'خلفية رأس الصفحة الثالثة' },
];

const stageChoices: StageChoice[] = [
  { id: 'primary', label: 'طور ابتدائي', src: '/assets/primaire.png', alt: 'صورة طور ابتدائي' },
  { id: 'middle', label: 'طور متوسط', src: '/assets/cem.png', alt: 'صورة طور متوسط' },
  { id: 'secondary', label: 'طور ثانوي', src: '/assets/lycee.png', alt: 'صورة طور ثانوي' },
];

const tools = [
  { id: 'colors', label: 'ألوان', iconSrc: '/side%20bar%20stickers/mdi_color.png', href: '/signup/customize' },
  { id: 'images', label: 'الصور', iconSrc: '/side%20bar%20stickers/icon-park-outline_picture.png', href: '/signup/customize/pictures' },
  { id: 'sections', label: 'التقسيمات', iconSrc: '/side%20bar%20stickers/tabler_section.png', href: '/signup/customize/sections' },
  { id: 'text', label: 'النصوص', iconSrc: '/side%20bar%20stickers/majesticons_text.png', href: '/signup/customize/texts' },
  { id: 'social', label: 'مواقع التواصل', iconSrc: '/side%20bar%20stickers/material-symbols_share-outline.png', href: '/signup/customize/social' },
];

function UploadSlot({ className, label }: { className: string; label: string }) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextUrl;
    });
  };

  return (
    <label
      htmlFor={inputId}
      className={`group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-[#2A214A] bg-white/50 text-[#2A214A] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D2008A] hover:bg-white active:translate-y-0 active:scale-[0.99] ${className}`}
    >
      <input id={inputId} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {previewUrl ? (
        <div className="relative h-full w-full overflow-hidden rounded-md">
          <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#241646]/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-[#241646]">تغيير الصورة</span>
          </div>
        </div>
      ) : (
        <>
          <svg className="h-9 w-9 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 9l5-5 5 5" />
          </svg>
          <span className="mt-1 text-[10px] font-semibold transition-colors duration-200 group-hover:text-[#D2008A]">قم برفع صورتك هنا</span>
          <span className="mt-0.5 text-[10px] font-semibold transition-colors duration-200 group-hover:text-[#D2008A]">{label}</span>
        </>
      )}
    </label>
  );
}

function UploadSpaces({ sectionLabel }: { sectionLabel: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <UploadSlot className="col-span-2 h-[120px]" label={`${sectionLabel} - صورة رئيسية`} />
      <UploadSlot className="h-[95px]" label={`${sectionLabel} - صورة 2`} />
      <UploadSlot className="h-[95px]" label={`${sectionLabel} - صورة 3`} />
    </div>
  );
}

export default function PicturesCustomizePage() {
  const [selectedHero, setSelectedHero] = useState(heroChoices[0].id);
  const [selectedStage, setSelectedStage] = useState(stageChoices[0].id);
  const { sections } = useCustomizeSections();
  const { texts } = useCustomizeTexts();

  const selectedHeroImage = heroChoices.find((hero) => hero.id === selectedHero) ?? heroChoices[0];
  const selectedStageImage = stageChoices.find((stage) => stage.id === selectedStage) ?? stageChoices[0];

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
                  `linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(40,37,122,0.65) 45%, rgba(32,30,93,0.7) 100%), url(${selectedHeroImage.src})`,
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
                  <Image src={selectedStageImage.src} alt={selectedStageImage.alt} fill className="object-cover" />
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

        <section className="space-y-3" dir="rtl">
          <h1 className="mb-2 text-center text-base font-extrabold text-[#241646] md:text-xl">قم بتعديل الرئيسية لمدرستك</h1>

          <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
            <h2 className="mb-3 text-right text-lg font-black text-[#241646]">صورة راس الصفحة</h2>
            <div className="space-y-3">
              {heroChoices.map((hero) => {
                const selected = hero.id === selectedHero;
                return (
                  <button
                    key={hero.id}
                    type="button"
                    onClick={() => setSelectedHero(hero.id)}
                    className={`group relative h-[95px] w-full overflow-hidden rounded-md border-2 transition-all duration-200 ${
                      selected
                        ? 'border-[#D2008A] shadow-[0_10px_24px_rgba(210,0,138,0.3)]'
                        : 'border-transparent hover:-translate-y-0.5 hover:border-[#D2008A]/50 hover:shadow-[0_8px_18px_rgba(36,22,70,0.18)]'
                    }`}
                  >
                    <Image src={hero.src} alt={hero.alt} fill className="object-cover" />
                    <div className={`absolute inset-0 transition-colors duration-200 ${selected ? 'bg-[#1B1535]/20' : 'bg-black/0 group-hover:bg-black/20'}`} />
                    <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-[#241646]">
                      {hero.id.toUpperCase()}
                    </div>
                    {selected && (
                      <div className="absolute bottom-2 right-2 rounded-full bg-[#D2008A] px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                        تم الاختيار
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
            <h2 className="mb-3 text-right text-lg font-black text-[#241646]">صورة الطفل</h2>
            <div className="grid grid-cols-3 gap-2">
              {stageChoices.map((stage) => {
                const selected = stage.id === selectedStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setSelectedStage(stage.id)}
                    className={`relative overflow-hidden rounded-md border-2 transition-all duration-200 ${
                      selected
                        ? 'border-[#D2008A] shadow-[0_10px_20px_rgba(210,0,138,0.28)]'
                        : 'border-transparent hover:-translate-y-0.5 hover:border-[#D2008A]/40 hover:shadow-[0_8px_18px_rgba(36,22,70,0.15)]'
                    }`}
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

          {sections.about && (
            <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
              <h2 className="mb-2 text-right text-lg font-black text-[#241646]">من نحن</h2>
              <UploadSpaces sectionLabel="من نحن" />
            </div>
          )}

          {sections.gallery && (
            <div className="rounded-xl border-2 border-[#332B50] bg-[#F2F3F8] p-3">
              <h2 className="mb-2 text-right text-lg font-black text-[#241646]">صور المعرض</h2>
              <UploadSpaces sectionLabel="المعرض" />
            </div>
          )}
        </section>

        <aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-[18px] bg-gradient-to-b from-[#F20A9D] to-[#C60086] p-3 text-white shadow-xl lg:sticky lg:top-4" dir="rtl">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-[11px] font-bold">
            <Image src="/assets/logo.png" alt="logo" width={72} height={28} />
          </div>

          <div className="flex-1 space-y-3">
            {tools.map((tool) => {
              const className = `flex w-full flex-col items-center justify-center rounded-xl px-2 py-2.5 text-center transition-all duration-200 ${
                tool.id === 'images'
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
