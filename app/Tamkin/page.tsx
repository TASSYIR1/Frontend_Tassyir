import TamkinNavbar from "@/components/tamkin/TamkinNavbar";
import TamkinHero from "@/components/tamkin/TamkinHero";
import TamkinAbout from "@/components/tamkin/TamkinAbout";
import TamkinGallery from "@/components/tamkin/TamkinGallery";
import TamkinContact from "@/components/tamkin/TamkinContact";
import TamkinFooter from "@/components/tamkin/TamkinFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدرسة تمكين — دروس خصوصية للطور الابتدائي",
  description: "مدرسة تمكين للدروس الخصوصية، نقدم أفضل تعليم للطور الابتدائي",
};

export default function TamkinPage() {
  return (
    <main style={{ background: "#f9f5ff" }}>
      <TamkinNavbar />
      <TamkinHero />
      <TamkinAbout />
      <TamkinGallery />
      <TamkinContact />
      <TamkinFooter />
    </main>
  );
}
