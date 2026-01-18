import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Translation from "./pages/Translation";
import Safety from "./pages/Safety";
import Feedback from "./pages/Feedback";
import Translate from "./pages/Translate";
import TextBase from "./pages/TextBase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Translation />} />
          <Route path="/text-base" element={<TextBase />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/translate" element={<Translate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;