import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const App = () => (<ErrorBoundary>
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>);

export default App;
