'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useCustomizeSections } from '../_shared/useCustomizeSections';
import { useCustomizeTexts } from '../_shared/useCustomizeTexts';

type SocialKey = 'location' | 'facebook' | 'instagram' | 'x' | 'linkedin' | 'youtube';
type SocialState = Record<SocialKey, string>;

const STORAGE_KEY = 'tassyir_customize_social_v1';

const defaultSocial: SocialState = {
  location: '',
  facebook: 'www.facebook.com/tasyir.dz',
  instagram: 'www.instagram.com/tasyir.dz',
  x: '',
  linkedin: '',
  youtube: '',
};

function loadSocialFromStorage(): SocialState {
  if (typeof window === 'undefined') return defaultSocial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSocial;
    const parsed = JSON.parse(raw) as Partial<SocialState>;
    return { ...defaultSocial, ...parsed };
  } catch {
    return defaultSocial;
  }
}

const tools = [
  { id: 'colors', label: 'ألوان', iconSrc: '/side%20bar%20stickers/mdi_color.png', href: '/signup/customize' },
  { id: 'images', label: 'الصور', iconSrc: '/side%20bar%20stickers/icon-park-outline_picture.png', href: '/signup/customize/pictures' },
  { id: 'sections', label: 'التقسيمات', iconSrc: '/side%20bar%20stickers/tabler_section.png', href: '/signup/customize/sections' },
  { id: 'text', label: 'النصوص', iconSrc: '/side%20bar%20stickers/majesticons_text.png', href: '/signup/customize/texts' },
  { id: 'social', label: 'مواقع التواصل', iconSrc: '/side%20bar%20stickers/material-symbols_share-outline.png', href: '/signup/customize/social' },
];

const socialStickerIcons: Record<SocialKey, string> = {
  location: '/social%20media%20stickers/ic_outline-place.png',
  facebook: '/social%20media%20stickers/ic_baseline-facebook.png',
  instagram: '/social%20media%20stickers/mdi_instagram.png',
  x: '/social%20media%20stickers/prime_twitter.png',
  linkedin: '/social%20media%20stickers/mdi_linkedin.png',
  youtube: '/social%20media%20stickers/mdi_youtube.png',
};

function InputRow({
  label,
  icon,
  value,
  onChange,
  onRemove,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div dir="rtl" className="rounded-xl border border-[#D7D7E3] bg-[#F8F8FC] p-3 transition-all duration-200 hover:border-[#B9A9E6] hover:shadow-[0_8px_18px_rgba(36,22,70,0.08)]">
      <div className="mb-2 grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="flex items-center gap-2 text-right">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm">{icon}</span>
          <span className="text-sm font-extrabold text-[#241646]">{label}</span>
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-self-end rounded-md border border-[#F2B8D9] bg-white px-2 py-1 text-[10px] font-bold text-[#B80A73] transition-all duration-200 hover:border-[#D2008A] hover:bg-[#FFF2FA]"
            aria-label={`حذف ${label}`}
          >
            حذف
          </button>
        ) : (
          <span className="justify-self-end" />
        )}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#D7D7E3] bg-white px-3 py-2 text-right text-xs font-semibold text-[#241646] outline-none transition-all duration-200 focus:border-[#D2008A] focus:shadow-[0_0_0_3px_rgba(210,0,138,0.12)]"
        dir="ltr"
      />
    </div>
  );
}

function AddRow({ label, icon, onAdd }: { label: string; icon: React.ReactNode; onAdd: () => void }) {
  return (
    <div dir="rtl" className="grid grid-cols-[auto_1fr] items-center gap-2 rounded-xl border border-dashed border-[#CDBFEF] bg-[#FAF9FF] px-3 py-2 transition-all duration-200 hover:border-[#D2008A]/50 hover:bg-white hover:shadow-[0_8px_18px_rgba(36,22,70,0.08)]">
      <div className="flex items-center gap-2 text-right">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm">{icon}</span>
        <span className="text-sm font-extrabold text-[#241646]">{label}</span>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-8 w-8 items-center justify-center justify-self-end rounded-full border-2 border-[#D2008A] bg-white transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_14px_rgba(210,0,138,0.25)] active:scale-95"
        aria-label={`إضافة ${label}`}
      >
        <Image src="/add.png" alt="add" width={16} height={16} className="h-4 w-4 object-contain" />
      </button>
    </div>
  );
}


export default function SocialCustomizePage() {
  const { sections } = useCustomizeSections();
  const { texts } = useCustomizeTexts();

  const [social, setSocial] = useState<SocialState>(() => loadSocialFromStorage());

  // Add show/hide state for location, facebook, instagram, plus the existing optionals
  const [showFields, setShowFields] = useState<{
    location: boolean;
    facebook: boolean;
    instagram: boolean;
    x: boolean;
    linkedin: boolean;
    youtube: boolean;
  }>(() => {
    const loaded = loadSocialFromStorage();
    return {
      location: Boolean(loaded.location),
      facebook: Boolean(loaded.facebook),
      instagram: Boolean(loaded.instagram),
      x: Boolean(loaded.x),
      linkedin: Boolean(loaded.linkedin),
      youtube: Boolean(loaded.youtube),
    };
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(social));
    } catch {
      // ignore
    }
  }, [social]);

  const setValue = useMemo(
    () =>
      (key: SocialKey, value: string) => {
        setSocial((prev) => ({ ...prev, [key]: value }));
      },
    [],
  );

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

        <section className="space-y-5" dir="rtl">
          <div className="rounded-2xl border-2 border-[#1E163C] bg-white p-6">
            <h1 className="text-right text-xl font-extrabold text-[#241646]">العنوان</h1>
            <p className="mt-2 text-right text-xs font-semibold text-[#241646]/80">قم بإدخال عنوان مدرستك لعرضها على الخريطة</p>

            <div className="mt-4">
              {showFields.location ? (
                <InputRow
                  label="الموقع"
                  icon={<Image src={socialStickerIcons.location} alt="location" width={20} height={20} />}
                  value={social.location}
                  onChange={(v) => setValue('location', v)}
                  onRemove={() => {
                    setShowFields((p) => ({ ...p, location: false }));
                    setValue('location', '');
                  }}
                />
              ) : (
                <AddRow
                  label="الموقع"
                  icon={<Image src={socialStickerIcons.location} alt="location" width={20} height={20} />}
                  onAdd={() => setShowFields((p) => ({ ...p, location: true }))}
                />
              )}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#1E163C] bg-white p-6">
            <h2 className="text-right text-xl font-extrabold text-[#241646]">مواقع التواصل</h2>
            <p className="mt-2 text-right text-xs font-semibold text-[#241646]/80">قم بإدخال مواقع التواصل الخاصة بمدرستك</p>

            <div className="mt-5 space-y-4">
              {showFields.facebook ? (
                <InputRow
                  label="فيسبوك"
                  icon={<Image src={socialStickerIcons.facebook} alt="facebook" width={20} height={20} />}
                  value={social.facebook}
                  onChange={(v) => setValue('facebook', v)}
                  onRemove={() => {
                    setShowFields((p) => ({ ...p, facebook: false }));
                    setValue('facebook', '');
                  }}
                />
              ) : (
                <AddRow
                  label="فيسبوك"
                  icon={<Image src={socialStickerIcons.facebook} alt="facebook" width={20} height={20} />}
                  onAdd={() => setShowFields((p) => ({ ...p, facebook: true }))}
                />
              )}

              {showFields.instagram ? (
                <InputRow
                  label="انستغرام"
                  icon={<Image src={socialStickerIcons.instagram} alt="instagram" width={20} height={20} />}
                  value={social.instagram}
                  onChange={(v) => setValue('instagram', v)}
                  onRemove={() => {
                    setShowFields((p) => ({ ...p, instagram: false }));
                    setValue('instagram', '');
                  }}
                />
              ) : (
                <AddRow
                  label="انستغرام"
                  icon={<Image src={socialStickerIcons.instagram} alt="instagram" width={20} height={20} />}
                  onAdd={() => setShowFields((p) => ({ ...p, instagram: true }))}
                />
              )}

              {showFields.x ? (
                <InputRow
                  label="اكس"
                  icon={<Image src={socialStickerIcons.x} alt="x" width={20} height={20} />}
                  value={social.x}
                  onChange={(v) => setValue('x', v)}
                  onRemove={() => {
                    setShowFields((p) => ({ ...p, x: false }));
                    setValue('x', '');
                  }}
                />
              ) : (
                <AddRow label="اكس" icon={<Image src={socialStickerIcons.x} alt="x" width={20} height={20} />} onAdd={() => setShowFields((p) => ({ ...p, x: true }))} />
              )}

              {showFields.linkedin ? (
                <InputRow
                  label="لينكدين"
                  icon={<Image src={socialStickerIcons.linkedin} alt="linkedin" width={20} height={20} />}
                  value={social.linkedin}
                  onChange={(v) => setValue('linkedin', v)}
                  onRemove={() => {
                    setShowFields((p) => ({ ...p, linkedin: false }));
                    setValue('linkedin', '');
                  }}
                />
              ) : (
                <AddRow
                  label="لينكدين"
                  icon={<Image src={socialStickerIcons.linkedin} alt="linkedin" width={20} height={20} />}
                  onAdd={() => setShowFields((p) => ({ ...p, linkedin: true }))}
                />
              )}

              {showFields.youtube ? (
                <InputRow
                  label="يوتيوب"
                  icon={<Image src={socialStickerIcons.youtube} alt="youtube" width={20} height={20} />}
                  value={social.youtube}
                  onChange={(v) => setValue('youtube', v)}
                  onRemove={() => {
                    setShowFields((p) => ({ ...p, youtube: false }));
                    setValue('youtube', '');
                  }}
                />
              ) : (
                <AddRow label="يوتيوب" icon={<Image src={socialStickerIcons.youtube} alt="youtube" width={20} height={20} />} onAdd={() => setShowFields((p) => ({ ...p, youtube: true }))} />
              )}
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
                tool.id === 'social'
                  ? 'bg-[#9E79F7] shadow-[0_10px_22px_rgba(34,16,80,0.35)]'
                  : 'hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-[0_8px_18px_rgba(22,8,45,0.28)]'
              }`;

              return (
                <Link key={tool.id} href={tool.href} className={className}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <Image src={tool.iconSrc} alt={tool.label} width={22} height={22} className="h-5 w-5 object-contain" />
                  </span>
                  <span className="mt-1 text-sm font-extrabold">{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}
