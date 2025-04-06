import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import TransferPage from "@/pages/transfer-page";
import HistoryPage from "@/pages/history-page";
import ProfilePage from "@/pages/profile-page";
import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import CookiePolicyPage from "@/pages/Cookiepolicy";
import PressPage from "@/pages/Press";
import AdminDashboard from "@/pages/admin/index";
import AdminUsers from "@/pages/admin/users/index";
import AdminCreateUser from "@/pages/admin/users/create";
import AdminTransactions from "@/pages/admin/transactions/index";
import AdminCreateTransaction from "@/pages/admin/transactions/create";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/about" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/contact" component={Contact} />
      <Route path="/cookie-policy" component={CookiePolicyPage} />
      <Route path="/press" component={PressPage} />
      
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/transfer" component={TransferPage} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/users" component={AdminUsers} adminOnly />
      <ProtectedRoute path="/admin/users/create" component={AdminCreateUser} adminOnly />
      <ProtectedRoute path="/admin/transactions" component={AdminTransactions} adminOnly />
      <ProtectedRoute path="/admin/transactions/create" component={AdminCreateTransaction} adminOnly />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
