import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/date-utils";

interface DashboardHeaderProps {
  username: string;
  balance: string;
  lastLogin?: Date | string | null;
}

export default function DashboardHeader({ username, balance, lastLogin }: DashboardHeaderProps) {
  // Format balance as currency
  const formattedBalance = formatCurrency(parseFloat(balance));
  
  // Format last login date
  const formattedLastLogin = lastLogin ? formatDate(new Date(lastLogin)) : "N/A";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {username}</h1>
          <p className="text-gray-500 dark:text-gray-400">Last login: {formattedLastLogin}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">Available Balance</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{formattedBalance}</div>
        </div>
      </div>
    </div>
  );
}
