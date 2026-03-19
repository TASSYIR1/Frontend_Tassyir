import Link from "next/link";

export default function SchoolPage() {
	return (
		<main className="min-h-screen bg-[#f4f4f8] flex items-center justify-center px-4" dir="rtl">
			<div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
				<h1 className="text-2xl md:text-3xl font-black text-[#2d2d5e] mb-3">بوابة المؤسسة</h1>
				<p className="text-gray-500 font-bold mb-8">اختر المسار المناسب للمتابعة</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Link
						href="/signup/register"
						className="rounded-xl bg-[#e01c8a] text-white font-black py-3 px-4 hover:bg-rose-600 transition-colors"
					>
						تسجيل مؤسسة جديدة
					</Link>
					<Link
						href="/Tamkin/login"
						className="rounded-xl border border-[#e01c8a] text-[#e01c8a] font-black py-3 px-4 hover:bg-rose-50 transition-colors"
					>
						تسجيل الدخول
					</Link>
				</div>
			</div>
		</main>
	);
}
