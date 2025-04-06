import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth"; 
import { ThemeProvider } from "@/lib/theme-provider";
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
import SecurityPage from "@/pages/Security";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsOfServicePage from "@/pages/TermsOfService";
import OnlineBankingPage from "@/pages/dashboard/online-banking";
import SavingsAccountsPage from "@/pages/dashboard/savings-accounts";
import InvestmentsPage from "@/pages/dashboard/investments";
import AdminDashboard from "@/pages/admin/index";
import AdminUsers from "@/pages/admin/users/index";
import AdminCreateUser from "@/pages/admin/users/create";
import AdminTransactions from "@/pages/admin/transactions/index";
import AdminCreateTransaction from "@/pages/admin/transactions/create";
import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/aboutus" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/contact" component={Contact} />
      <Route path="/cookiepolicy" component={CookiePolicyPage} />
      <Route path="/press" component={PressPage} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/privacypolicy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />
      
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/transfer" component={TransferPage} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/online-banking" component={OnlineBankingPage} />
      <ProtectedRoute path="/savings-accounts" component={SavingsAccountsPage} />
      <ProtectedRoute path="/investments" component={InvestmentsPage} />
      
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
      <ThemeProvider defaultTheme="system" storageKey="nivalus-theme">
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <Router />
            <Toaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
