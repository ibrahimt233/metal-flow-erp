
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PurchasePage from "./pages/purchase/PurchasePage";
import ProductionPage from "./pages/production/ProductionPage";
import ProductsPage from "./pages/products/ProductsPage";
import SalesPage from "./pages/sales/SalesPage";
import ClientsPage from "./pages/clients/ClientsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
