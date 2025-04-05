import { Link } from "wouter";
import { 
  PlusCircle, 
  ClipboardList, 
  User,
  CreditCard,
  BarChart4,
  UserPlus,
  Users,
  FileText
} from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "accent" | "blue";
  linkTo: string;
}

export default function ActionCard({ title, description, icon, color, linkTo }: ActionCardProps) {
  // Determine background and text colors based on the color prop
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-primary-100 dark:bg-primary-900 text-primary-500";
      case "secondary":
        return "bg-secondary-100 dark:bg-secondary-900 text-secondary-500";
      case "accent":
        return "bg-amber-100 dark:bg-amber-900 text-amber-500";
      case "blue":
        return "bg-blue-100 dark:bg-blue-900 text-blue-500";
      default:
        return "bg-primary-100 dark:bg-primary-900 text-primary-500";
    }
  };

  // Render appropriate icon
  const renderIcon = () => {
    switch (icon) {
      case "transfer":
        return <PlusCircle className="h-6 w-6" />;
      case "history":
        return <ClipboardList className="h-6 w-6" />;
      case "profile":
        return <User className="h-6 w-6" />;
      case "card":
        return <CreditCard className="h-6 w-6" />;
      case "stats":
        return <BarChart4 className="h-6 w-6" />;
      case "createUser":
        return <UserPlus className="h-6 w-6" />;
      case "manageUsers":
        return <Users className="h-6 w-6" />;
      case "transactions":
        return <FileText className="h-6 w-6" />;
      default:
        return <PlusCircle className="h-6 w-6" />;
    }
  };

  return (
    <Link href={linkTo}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-12 w-12 ${getColorClasses()} rounded-full flex items-center justify-center`}>
            {renderIcon()}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
