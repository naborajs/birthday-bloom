import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { Sparkles, Heart, Users, Home } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();
  const { isHindi, isBengali, isFrench } = useTranslation();

  useEffect(() => {
    document.title = "404: Page Not Found | Birthday Bloom";

    // Set noindex for search engines on 404
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const previousContent = robotsMeta ? robotsMeta.getAttribute("content") : null;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", "noindex, follow");

    console.warn("404 Error: Non-existent route accessed:", location.pathname);

    return () => {
      if (robotsMeta) {
        robotsMeta.setAttribute("content", previousContent || "index, follow");
      }
    };
  }, [location.pathname]);

  const titleText = isFrench
    ? "Oups ! Célébration Introuvable"
    : isBengali
      ? "উফ! পেজটি খুঁজে পাওয়া যায়নি"
      : isHindi
        ? "ओह! यह पेज नहीं मिला"
        : "Oops! Celebration Not Found";

  const descriptionText = isFrench
    ? "Cette page d'anniversaire semble s'être envolée dans les étoiles..."
    : isBengali
      ? "আপনার কাঙ্ক্ষিত জন্মদিনের পেজটি খুঁজে পাওয়া যায়নি বা মুছে ফেলা হয়েছে।"
      : isHindi
        ? "आपका चाहा गया जन्मदिन का पेज मौजूद नहीं है या हटा दिया गया है।"
        : "The birthday celebration page you are looking for might have been moved or doesn't exist.";

  return (
    <main
      className="flex min-h-screen items-center justify-center p-6 text-center text-white"
      style={{ background: "radial-gradient(ellipse at center, #2e0827 0%, #1a0515 70%, #0d000a 100%)" }}
    >
      <div className="relative max-w-lg w-full p-8 md:p-10 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,107,130,0.15)] animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary border border-primary/30 mb-6 shadow-[0_0_20px_rgba(255,107,130,0.3)]">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary via-rose-300 to-amber-200 bg-clip-text text-transparent mb-2">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {titleText}
        </h2>

        <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
          {descriptionText}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-black font-bold transition-all shadow-[0_0_20px_rgba(255,107,130,0.4)] hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            {isFrench ? "Retour à l'accueil" : isBengali ? "হোমে ফিরে যান" : isHindi ? "मुख्य पृष्ठ" : "Return Home"}
          </Link>

          <Link
            to="/?template=romantic&rel=partner"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium border border-white/15 transition-all hover:scale-105 active:scale-95"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            {isFrench ? "Surprise Romantique" : isBengali ? "রোমান্টিক উপহার" : isHindi ? "रोमांटिक सरप्राइज" : "Romantic Surprise"}
          </Link>

          <Link
            to="/?template=fun&rel=friend"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium border border-white/15 transition-all hover:scale-105 active:scale-95"
          >
            <Users className="w-4 h-4 text-amber-400" />
            {isFrench ? "Fête d'Amis" : isBengali ? "বন্ধুর সেলিব্রেশন" : isHindi ? "दोस्त का उत्सव" : "Friend Party"}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
