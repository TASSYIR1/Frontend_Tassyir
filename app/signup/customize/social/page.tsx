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
  { id: 'colors', label: 'ألوان', icon: '🎨', href: '/signup/customize' },
  { id: 'images', label: 'الصور', icon: '🖼️', href: '/signup/customize/pictures' },
  { id: 'sections', label: 'التقسيمات', icon: '▦', href: '/signup/customize/sections' },
  { id: 'text', label: 'النصوص', icon: '≡', href: '/signup/customize/texts' },
  { id: 'social', label: 'مواقع التواصل', icon: '⤴', href: '/signup/customize/social' },
];

function InputRow({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-end gap-2">
        <span className="text-sm font-extrabold text-[#241646]">{label}</span>
        <span className="inline-flex h-6 w-6 items-center justify-center">{icon}</span>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#D7D7E3] bg-white px-3 py-2 text-right text-xs font-semibold text-[#241646] outline-none"
        dir="ltr"
      />
    </div>
  );
}

function AddRow({ label, icon, onAdd }: { label: string; icon: React.ReactNode; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#D2008A] text-[#D2008A]"
        aria-label={`إضافة ${label}`}
      >
        <span className="text-lg leading-none">+</span>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-extrabold text-[#241646]">{label}</span>
        <span className="inline-flex h-6 w-6 items-center justify-center">{icon}</span>
      </div>
    </div>
  );
}

export default function SocialCustomizePage() {
  const { sections } = useCustomizeSections();
  const { texts } = useCustomizeTexts();

  const [social, setSocial] = useState<SocialState>(() => loadSocialFromStorage());

  const [showOptional, setShowOptional] = useState<{ x: boolean; linkedin: boolean; youtube: boolean }>(() => {
    const loaded = loadSocialFromStorage();
    return {
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

        <section className="space-y-5" dir="rtl">
          <div className="rounded-2xl border-2 border-[#1E163C] bg-white p-6">
            <h1 className="text-center text-2xl font-extrabold text-[#241646]">العنوان</h1>
            <p className="mt-2 text-center text-xs font-semibold text-[#241646]/80">قم بإدخال عنوان مدرستك لعرضها على الخريطة</p>

            <div className="mt-4">
              <InputRow
                label="الموقع"
                icon={
                  <svg className="h-5 w-5 text-[#241646]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10c0 6-7 12-7 12S5 16 5 10a7 7 0 1114 0z" />
                  </svg>
                }
                value={social.location}
                onChange={(v) => setValue('location', v)}
              />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#1E163C] bg-white p-6">
            <h2 className="text-center text-2xl font-extrabold text-[#241646]">مواقع التواصل</h2>
            <p className="mt-2 text-center text-xs font-semibold text-[#241646]/80">قم بإدخال مواقع التواصل الخاصة بمدرستك</p>

            <div className="mt-5 space-y-4">
              <InputRow
                label="فيسبوك"
                icon={<Image src="/assets/facebook.png" alt="facebook" width={20} height={20} />}
                value={social.facebook}
                onChange={(v) => setValue('facebook', v)}
              />

              <InputRow
                label="انستغرام"
                icon={<Image src="/assets/instagram.png" alt="instagram" width={20} height={20} />}
                value={social.instagram}
                onChange={(v) => setValue('instagram', v)}
              />

              {showOptional.x ? (
                <InputRow
                  label="اكس"
                  icon={<span className="text-lg font-black text-[#241646]">X</span>}
                  value={social.x}
                  onChange={(v) => setValue('x', v)}
                />
              ) : (
                <AddRow label="اكس" icon={<span className="text-lg font-black text-[#241646]">X</span>} onAdd={() => setShowOptional((p) => ({ ...p, x: true }))} />
              )}

              {showOptional.linkedin ? (
                <InputRow
                  label="لينكدين"
                  icon={<Image src="/assets/linkedin.png" alt="linkedin" width={20} height={20} />}
                  value={social.linkedin}
                  onChange={(v) => setValue('linkedin', v)}
                />
              ) : (
                <AddRow
                  label="لينكدين"
                  icon={<Image src="/assets/linkedin.png" alt="linkedin" width={20} height={20} />}
                  onAdd={() => setShowOptional((p) => ({ ...p, linkedin: true }))}
                />
              )}

              {showOptional.youtube ? (
                <InputRow
                  label="يوتيوب"
                  icon={<span className="text-lg font-black text-[#241646]">▶</span>}
                  value={social.youtube}
                  onChange={(v) => setValue('youtube', v)}
                />
              ) : (
                <AddRow label="يوتيوب" icon={<span className="text-lg font-black text-[#241646]">▶</span>} onAdd={() => setShowOptional((p) => ({ ...p, youtube: true }))} />
              )}
            </div>
          </div>
        </section>

        <aside className="rounded-[18px] bg-gradient-to-b from-[#F20A9D] to-[#C60086] p-3 text-white shadow-xl" dir="rtl">
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-xs font-bold">
            <Image src="/assets/logo.png" alt="logo" width={72} height={28} />
          </div>

          <div className="space-y-3">
            {tools.map((tool) => {
              const className = `flex w-full flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition ${
                tool.id === 'social' ? 'bg-[#9E79F7]' : 'hover:bg-white/15'
              }`;

              return (
                <Link key={tool.id} href={tool.href} className={className}>
                  <span className="text-xl leading-none">{tool.icon}</span>
                  <span className="mt-1 text-xs font-bold">{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}
