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
      
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/transfer" component={TransferPage} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      
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
