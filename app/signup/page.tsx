import Link from 'next/link';
import SignupLayout from './components/SignupLayout';

export default function SignupPage() {
  return (
    <SignupLayout>
      <div className="text-center max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-md flex flex-col items-center justify-center">
        {/* Title */}
        <h1
          className="font-bold text-gray-900 mb-6 lg:mb-12 text-xl sm:text-2xl md:text-3xl lg:whitespace-nowrap"
          style={{ fontSize: 'clamp(1.25rem, 2.5vw, 54px)' }}
        >
          هل أنت مسؤول مدرسة وترغب في الانضمام؟
        </h1>

        {/* Register button */}
        <Link
          href="/signup/register"
          className="bg-[#D2008A] hover:bg-[#b8006d] text-white font-semibold transition-colors duration-200 mb-4 flex items-center justify-center w-full lg:w-[380px] lg:h-[68px] py-3 lg:py-0 rounded-md lg:rounded-[5.8px] text-lg sm:text-xl lg:text-[27px]"
        >
          بدء تسجيل المدرسة
        </Link>

        {/* Help text */}
        <p
          className="text-gray-600 mb-8 text-sm sm:text-base lg:text-[20px] lg:whitespace-nowrap"
        >
          ملاحظة صغيرة، بعد التسجيل، ستتواصل معك هاتفياً لتأكيد الحساب
        </p>
      </div>
    </SignupLayout>
  );
}