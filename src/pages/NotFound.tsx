import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/i18n";

const NotFound = () => {
    const location = useLocation();
    const { isHindi, isBengali, isFrench } = useTranslation();
    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);
    return (<div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{isFrench ? "Oups ! Page introuvable" : isBengali ? "উফ! পেজটি পাওয়া যায়নি" : isHindi ? "ओह! यह पेज नहीं मिला" : "Oops! Page not found"}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {isFrench ? "Retour à l'accueil" : isBengali ? "হোমে ফিরে যান" : isHindi ? "मुख्य पृष्ठ पर लौटें" : "Return to Home"}
        </Link>
      </div>
    </div>);
};
export default NotFound;
