import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/store/AppContext";
import LoginPage from "./pages/LoginPage";
import PendingApproval from "./pages/PendingApproval";
import AdminDashboard from "./pages/AdminDashboard";
import ArtManagerDashboard from "./pages/ArtManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/pending" element={<PendingApproval />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/manager/*" element={<ArtManagerDashboard />} />
            <Route path="/employee/*" element={<EmployeeDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
