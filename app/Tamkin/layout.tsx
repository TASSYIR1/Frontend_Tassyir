import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدرسة تمكين — دروس خصوصية للطور الابتدائي",
  description: "مدرسة تمكين للدروس الخصوصية، نقدم أفضل تعليم للطور الابتدائي مع أفضل المعلمين",
};

export default function TamkinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
