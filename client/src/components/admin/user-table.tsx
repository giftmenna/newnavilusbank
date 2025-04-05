import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Lock, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { formatCurrency } from "@/utils/format-currency";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserTableProps {
  users: User[];
  compact?: boolean;
}

export default function UserTable({ users, compact = false }: UserTableProps) {
  const { toast } = useToast();
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Update user status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${data.id}/status`, { status: data.status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User status updated",
        description: `User status has been updated to ${activeUser?.status === "active" ? "inactive" : "active"}.`,
      });
      setShowStatusDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation (soft delete)
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}/status`, { status: "deleted" });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle user status
  const toggleStatus = (user: User) => {
    setActiveUser(user);
    setShowStatusDialog(true);
  };

  // Delete user
  const deleteUser = (user: User) => {
    setActiveUser(user);
    setShowDeleteDialog(true);
  };

  // Confirm status change
  const confirmStatusChange = () => {
    if (!activeUser) return;
    
    const newStatus = activeUser.status === "active" ? "inactive" : "active";
    updateStatusMutation.mutate({ id: activeUser.id, status: newStatus });
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!activeUser) return;
    deleteUserMutation.mutate(activeUser.id);
  };

  // Get user status badge
  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-none">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-none">
            Inactive
          </Badge>
        );
      case "deleted":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-none">
            Deleted
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-none">
            {status}
          </Badge>
        );
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
              {!compact && (
                <>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PIN</th>
                </>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              {!compact && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
              )}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                {!compact && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{user.password ? "********" : "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{user.pin}</td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(parseFloat(user.balance.toString()))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getUserStatusBadge(user.status)}
                </td>
                {!compact && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.last_login ? formatDate(new Date(user.last_login)) : "Never"}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(user)}>
                        <Lock className="mr-2 h-4 w-4" />
                        <span>{user.status === "active" ? "Deactivate" : "Activate"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteUser(user)} className="text-red-600 dark:text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!compact && (
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of <span className="font-medium">{users.length}</span> users
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {activeUser?.status === "active" ? "deactivate" : "activate"} {activeUser?.username}?
              {activeUser?.status === "active" 
                ? " The user will not be able to log in while inactive." 
                : " This will allow the user to log in again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              className={activeUser?.status === "active" ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}
            >
              {activeUser?.status === "active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {activeUser?.username}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
