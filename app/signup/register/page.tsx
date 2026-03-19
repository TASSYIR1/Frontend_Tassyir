'use client';

import { useState, useEffect, useRef } from 'react';
import SignupLayout from '../components/SignupLayout';

type FieldName = 'schoolName' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'address';
type FormErrors = Partial<Record<FieldName, string>>;

const fieldLabels: Record<FieldName, string> = {
  schoolName: 'اسم المدرسة',
  email: 'البريد الإلكتروني',
  phone: 'رقم الهاتف',
  password: 'كلمة المرور',
  confirmPassword: 'تأكيد كلمة المرور',
  address: 'العنوان',
};

/* ─── slide animation styles injected once ─── */
const SLIDE_STYLES = `
  @keyframes slideInFromLeft {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInFromRight {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .slide-forward { animation: slideInFromLeft  0.35s cubic-bezier(.25,.8,.25,1) both; }
  .slide-backward { animation: slideInFromRight 0.35s cubic-bezier(.25,.8,.25,1) both; }
`;

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [animDir, setAnimDir]         = useState<'forward' | 'backward'>('forward');
  const [animKey, setAnimKey]         = useState(0);   // bump to retrigger animation
  const styleInjected                 = useRef(false);

  // Inject keyframe CSS once
  useEffect(() => {
    if (styleInjected.current) return;
    const tag = document.createElement('style');
    tag.textContent = SLIDE_STYLES;
    document.head.appendChild(tag);
    styleInjected.current = true;
  }, []);

  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    schoolType: 'privateCourses',
    educationStages: ['middle', 'secondary'],
  });
  const [errors, setErrors]                       = useState<FormErrors>({});
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popupErrors, setPopupErrors]             = useState<string[]>([]);
  const [submissionState, setSubmissionState]     = useState<'form' | 'first' | 'final'>('form');

  const requiredMessages: Record<FieldName, string> = {
    schoolName: 'هذا الحقل مطلوب',
    email: 'هذا الحقل مطلوب',
    phone: 'هذا الحقل مطلوب',
    password: 'هذا الحقل مطلوب',
    confirmPassword: 'هذا الحقل مطلوب',
    address: 'هذا الحقل مطلوب',
  };

  const validateStepOne = () => {
    const nextErrors: FormErrors = {};
    const fields: FieldName[] = ['schoolName', 'email', 'phone', 'password', 'confirmPassword'];
    fields.forEach((field) => {
      if (!formData[field].trim()) nextErrors[field] = requiredMessages[field];
    });
    setErrors(nextErrors);
    const errorMessages = fields
      .filter((f) => nextErrors[f])
      .map((f) => `الرجاء تعبئة حقل ${fieldLabels[f]}`);
    setPopupErrors(errorMessages);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const field = name as FieldName;
    if (value.trim()) {
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
      setPopupErrors((prev) => prev.filter((m) => !m.includes(fieldLabels[field])));
    }
  };

  const handleSchoolTypeChange = (value: 'regularSchool' | 'privateCourses') =>
    setFormData((prev) => ({ ...prev, schoolType: value }));

  const handleStageToggle = (stage: 'primary' | 'middle' | 'secondary') =>
    setFormData((prev) => {
      const exists = prev.educationStages.includes(stage);
      return {
        ...prev,
        educationStages: exists
          ? prev.educationStages.filter((item) => item !== stage)
          : [...prev.educationStages, stage],
      };
    });

  /* ── navigation with animation direction tracking ── */
  const navigate = (direction: 'forward' | 'backward') => {
    setAnimDir(direction);
    setAnimKey((k) => k + 1);
    setCurrentStep((s) => (direction === 'forward' ? s + 1 : s - 1));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStepOne()) return;
    }
    if (currentStep < 3) navigate('forward');
  };

  const handlePrevious = () => {
    if (currentStep > 1) navigate('backward');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmissionState('first');
  };

  const steps = [
    { number: 1, label: 'معلومات الاتصال الأساسية' },
    { number: 2, label: 'تفاصيل المدرسة' },
    { number: 3, label: 'معلومات إضافية' },
  ];

  const iconClass = 'w-4 h-4 text-gray-400 shrink-0';
  const stepAnimClass = animDir === 'forward' ? 'slide-forward' : 'slide-backward';

  if (submissionState === 'first') {
    return (
      <SignupLayout>
        <div className="flex flex-col items-center justify-center text-center max-w-3xl px-4 z-10" dir="rtl">
          <h2 className="text-[#1F1B3D] text-[18px] sm:text-[22px] md:text-[26px] font-bold mb-8 leading-[1.8]">
            "بعد إتمام التسجيل، سيقوم فريقنا بالاتصال بك على الرقم {formData.phone || '05XXXXXXXX'}
            <br />
            لتأكيد اشتراككم وتفعيل حساب المدرسة خلال 24 ساعة"
          </h2>
          
          <div className="flex items-center justify-center gap-4">
            <button 
              type="button"
              className="bg-[#D2008A] text-white font-semibold py-2 px-12 md:px-16 rounded shadow-sm hover:opacity-90 transition-opacity text-sm"
              onClick={() => setSubmissionState('final')}
            >
              تسجيل
            </button>
            <button 
              type="button"
              className="border border-[#D2008A] text-[#D2008A] bg-white font-semibold py-2 px-12 md:px-16 rounded shadow-sm hover:bg-pink-50 transition-colors text-sm"
              onClick={() => setSubmissionState('form')}
            >
              العودة
            </button>
          </div>
        </div>
      </SignupLayout>
    );
  }

  if (submissionState === 'final') {
    return (
      <SignupLayout>
        <div className="flex flex-col items-center justify-center text-center max-w-3xl px-4 z-10" dir="rtl">
          <div className="space-y-4 mb-8">
            <h2 className="text-[#1F1B3D] text-[20px] sm:text-[24px] md:text-[28px] font-bold mb-2">
              تم استلام طلبكم بنجاح
            </h2>
            <h3 className="text-[#1F1B3D] text-[18px] sm:text-[22px] md:text-[24px] font-bold mb-6">
              رقم الطلب: REQ-2026-001
            </h3>
            <p className="text-[#1F1B3D] text-[16px] sm:text-[20px] md:text-[22px] font-bold leading-relaxed">
              سنتواصل معكم قريباً على الرقم المسجل لتأكيد الحساب وتفعيله.
              <br />
              يمكنكم متابعة حالة الطلب عبر البريد الإلكتروني.
            </p>
          </div>
          
          <button 
            type="button"
            className="border border-[#D2008A] text-[#D2008A] bg-transparent font-semibold py-2 px-12 md:px-16 rounded shadow-sm hover:bg-pink-50 transition-colors text-sm"
            onClick={() => window.location.href = '/'}
          >
            العودة
          </button>
        </div>
      </SignupLayout>
    );
  }

  return (
    <SignupLayout>
      <div className="w-full max-w-lg" dir="rtl">

        {/* ── Step Indicator ── */}
        <div className="-mt-8 px-4 h-23 flex flex-col justify-start">
          {/* Top labels */}
          <div className="grid grid-cols-3 mb-2">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              return (
                <div key={`top-${step.number}`} className="flex justify-center">
                  <p
                    className={`h-9 text-[11.5px] font-semibold text-center max-w-23.75 leading-tight flex items-end justify-center
                      ${isActive ? 'text-[#D2008A]' : 'text-gray-400'}`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Circles + line */}
          <div className="relative grid grid-cols-3 items-center">
            <div className="absolute left-[16.66%] right-[16.66%] top-1/2 -translate-y-1/2 h-px bg-gray-300" />

            {steps.map((step) => {
              const isActive    = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isActivatedOrDone = isActive || isCompleted;
              return (
                <div key={`circle-${step.number}`} className="relative z-10 flex justify-center">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center
                      ${isActivatedOrDone
                        ? 'bg-[#D2008A] border-[#D2008A] text-white'
                        : 'bg-white border-gray-300 text-gray-400'}`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-semibold">{step.number}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom labels */}
          <div className="grid grid-cols-3 mt-1.5">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              return (
                <div key={`bottom-${step.number}`} className="flex justify-center">
                  <p className={`text-[10px] text-center ${isActive ? 'text-[#D2008A]' : 'text-gray-400'}`}>
                    {`خطوة ${step.number}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Form ── */}
        <form noValidate onSubmit={handleSubmit} className="space-y-0">
          <div className="relative mt-3 min-h-97.5 overflow-hidden">

          {/* Each step wrapped in keyed div for re-triggering the animation */}
          {currentStep === 1 && (
            <div key={`step1-${animKey}`} className={`space-y-3 ${stepAnimClass}`}>

              {/* School Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">اسم المدرسة</label>
                <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white ${errors.schoolName ? 'border-[#D2008A]' : 'border-gray-200'}`}>
                  <input type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange}
                    placeholder="ادخل اسم مدرستك هنا" dir="rtl" required
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent" />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 22V12h6v10" />
                  </svg>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">البريد الإلكتروني</label>
                <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white ${errors.email ? 'border-[#D2008A]' : 'border-gray-200'}`}>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    placeholder="ادخل البريد الإلكتروني هنا" dir="rtl" required
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent" />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">رقم الهاتف</label>
                <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white ${errors.phone ? 'border-[#D2008A]' : 'border-gray-200'}`}>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    placeholder="ادخل رقم هاتفك هنا" dir="rtl" required
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent" />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">كلمة المرور</label>
                <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white ${errors.password ? 'border-[#D2008A]' : 'border-gray-200'}`}>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange}
                    placeholder="ادخل كلمة المرور" dir="rtl" required
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent" />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">تأكيد كلمة المرور</label>
                <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 bg-white ${errors.confirmPassword ? 'border-[#D2008A]' : 'border-gray-200'}`}>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                    placeholder="ادخل كلمة المرور" dir="rtl" required
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent" />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div key={`step2-${animKey}`} className={`flex justify-center ${stepAnimClass}`}>
              <div className="w-full max-w-105 bg-white border border-gray-200 rounded-md px-8 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]" dir="rtl">

                {/* School Type */}
                <div className="mb-8">
                  <h3 className="text-[18px] font-bold text-[#1F1B3D] text-right mb-4">نوع المدرسة</h3>

                  <label className="flex items-center gap-3 mb-3 cursor-pointer w-full" dir="rtl">
                    <input
                      type="radio"
                      name="schoolType"
                      checked={formData.schoolType === 'regularSchool'}
                      onChange={() => handleSchoolTypeChange('regularSchool')}
                      className="h-4 w-4 accent-[#D2008A] shrink-0"
                    />
                    <span className="text-[16px] text-[#1F1B3D] text-right w-full">مدرسة عادية</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer w-full" dir="rtl">
                    <input
                      type="radio"
                      name="schoolType"
                      checked={formData.schoolType === 'privateCourses'}
                      onChange={() => handleSchoolTypeChange('privateCourses')}
                      className="h-4 w-4 accent-[#D2008A] shrink-0"
                    />
                    <span className="text-[16px] text-[#1F1B3D] text-right w-full">دروس خصوصية</span>
                  </label>
                </div>

                {/* Education Stages */}
                <div>
                  <h3 className="text-[18px] font-bold text-[#1F1B3D] text-right mb-4">المراحل التعليمية المتوفرة</h3>

                  {(['primary', 'middle', 'secondary'] as const).map((stage, i) => {
                    const labels = { primary: 'ابتدائي', middle: 'متوسط', secondary: 'ثانوي' };
                    return (
                      <label
                        key={stage}
                        className={`flex items-center gap-3 cursor-pointer w-full ${i < 2 ? 'mb-3' : ''}`}
                        dir="rtl"
                      >
                        <input
                          type="checkbox"
                          checked={formData.educationStages.includes(stage)}
                          onChange={() => handleStageToggle(stage)}
                          className="h-4 w-4 accent-[#D2008A] shrink-0"
                        />
                        <span className="text-[16px] text-[#1F1B3D] text-right w-full">{labels[stage]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div key={`step3-${animKey}`} className={`space-y-3 ${stepAnimClass}`}>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">العنوان</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="ادخل الولاية، المدينة والعنوان هنا"
                    dir="rtl"
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent"
                  />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">رقم الهاتف</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="ادخل رقم هاتفك هنا"
                    dir="rtl"
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent"
                  />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">كلمة المرور</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="ادخل كلمة المرور"
                    dir="rtl"
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent"
                  />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-[13px] text-right">تأكيد كلمة المرور</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                      }
                    </svg>
                  </button>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="ادخل كلمة المرور"
                    dir="rtl"
                    className="w-full outline-none text-gray-700 placeholder-gray-400 text-[13px] text-right bg-transparent"
                  />
                  <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            {currentStep !== 3 ? (
              <button type="button" onClick={handleNext}
                className="flex-1 bg-[#D2008A] text-white font-semibold py-2.5 rounded-lg hover:bg-[#b8006d] transition-colors duration-200 text-[13px]">
                متابعة
              </button>
            ) : (
              <button type="button" onClick={handleSubmit}
                className="flex-1 bg-[#D2008A] text-white font-semibold py-2.5 rounded-lg hover:bg-[#b8006d] transition-colors duration-200 text-[13px]">
                إرسال
              </button>
            )}
            <button type="button" onClick={currentStep > 1 ? handlePrevious : undefined}
              className="flex-1 border-2 border-[#D2008A] text-[#D2008A] font-semibold py-2.5 rounded-lg hover:bg-pink-50 transition-colors duration-200 text-[13px]">
              {currentStep > 1 ? 'السابق' : 'إلغاء'}
            </button>
          </div>
        </form>
      </div>

      {popupErrors.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" dir="rtl">
          <div className="w-full max-w-sm rounded-xl border border-[#D2008A] bg-white p-4 shadow-lg">
            <h3 className="text-[#D2008A] font-bold text-[15px] mb-2 text-right">الرجاء تعبئة الحقول المطلوبة</h3>
            <div className="space-y-1.5 mb-4 max-h-40 overflow-y-auto">
              {popupErrors.map((message) => (
                <p key={message} className="text-[12px] text-[#D2008A] text-right font-semibold">• {message}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPopupErrors([])}
              className="w-full bg-[#D2008A] text-white font-semibold py-2 rounded-lg hover:bg-[#b8006d] transition-colors duration-200 text-[13px]"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </SignupLayout>
  );
}