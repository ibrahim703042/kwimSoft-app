import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, MoreHorizontal, X, Check, Filter } from "lucide-react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import IamTablePagination from "@/components/iam/IamTablePagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { useStaffDrivers, useGroups, useAssignUserToGroup } from "@/domains/identity/hooks";
import { useUserData } from "@/hooks/useUserData";
import { notifySuccess } from "@/lib/notify";
import type { IamUserStatus } from "../types";

const PAGE_SIZE = 10;

const assignSchema = z.object({
  userId: z.string().min(1, "Select a user"),
  groupId: z.string().min(1, "Select a function"),
});

const editUserSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phoneNumber: z.string().optional(),
});

type AssignForm = z.infer<typeof assignSchema>;
type EditUserForm = z.infer<typeof editUserSchema>;

type UserRow = {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  company?: { name?: string };
};

function UsersListContent({
  isLoading,
  filtered,
  paginated,
  page,
  getStatus,
  onAssign,
  onEdit,
  onLock,
  onPageChange,
}: Readonly<{
  isLoading: boolean;
  filtered: UserRow[];
  paginated: UserRow[];
  page: number;
  getStatus: (userId: string) => IamUserStatus;
  onAssign: (userId: string) => void;
  onEdit: (user: UserRow) => void;
  onLock: (userId: string) => void;
  onPageChange: (page: number) => void;
}>) {
  if (isLoading) return <LoadingState />;
  if (filtered.length === 0) return <EmptyState title="No users found" />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Function</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>MFA</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((user) => {
            const status = getStatus(user._id);
            return (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {(user.fullName ?? "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.fullName ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.company?.name ?? "Staff"}</TableCell>
                <TableCell>
                  <Badge variant={status === "locked" ? "destructive" : "default"}>
                    {status === "locked" ? "Locked" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <X className="h-4 w-4 text-muted-foreground" aria-label="MFA disabled" />
                </TableCell>
                <TableCell>{user.phoneNumber ?? "—"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onAssign(user._id)}>
                        Assign to function
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        Edit user
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onLock(user._id)}
                      >
                        Lock account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <IamTablePagination
        page={page}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IamUserStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [lockUserId, setLockUserId] = useState<string | null>(null);
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());

  const { data: profile } = useUserData();
  const companyGroupId = profile?.companyId?.keycloakGroupId as string | undefined;

  const { data: driversData, isLoading } = useStaffDrivers();
  const { data: groupsData } = useGroups(companyGroupId);
  const assignMutation = useAssignUserToGroup();

  const drivers = driversData?.data?.content ?? [];
  const groups = groupsData?.data ?? [];

  const filtered = useMemo(() => {
    let list = drivers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d: { fullName?: string; email?: string }) =>
          d.fullName?.toLowerCase().includes(q) ||
          d.email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((d: { _id: string }) => {
        const isLocked = lockedIds.has(d._id);
        return statusFilter === "locked" ? isLocked : !isLocked;
      });
    }
    return list;
  }, [drivers, search, statusFilter, lockedIds]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const assignForm = useForm<AssignForm>({
    resolver: zodResolver(assignSchema),
    defaultValues: { userId: "", groupId: "" },
  });

  const editForm = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { fullName: "", email: "", phoneNumber: "" },
  });

  const onAssignSubmit = (values: AssignForm) => {
    assignMutation.mutate(values, {
      onSuccess: () => {
        setDialogOpen(false);
        assignForm.reset();
      },
    });
  };

  const openEdit = (user: { fullName?: string; email?: string; phoneNumber?: string }) => {
    editForm.reset({
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
    });
    setEditDialogOpen(true);
  };

  const onEditSubmit = () => {
    notifySuccess("User updated successfully");
    setEditDialogOpen(false);
  };

  const handleLock = () => {
    if (lockUserId) {
      setLockedIds((prev) => new Set(prev).add(lockUserId));
      notifySuccess("User account locked");
      setLockUserId(null);
    }
  };

  const getStatus = (userId: string): IamUserStatus =>
    lockedIds.has(userId) ? "locked" : "active";

  return (
    <div>
      <IamPageHeader
        title="Users"
        description="Manage user accounts, functions, and access"
        searchPlaceholder="Search users..."
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        actions={
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      setStatusFilter(v as IamUserStatus | "all");
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
            <Button type="button" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </>
        }
      />

      <div className="rounded-lg border bg-card">
        <UsersListContent
          isLoading={isLoading}
          filtered={filtered}
          paginated={paginated}
          page={page}
          getStatus={getStatus}
          onAssign={(userId) => {
            assignForm.setValue("userId", userId);
            setDialogOpen(true);
          }}
          onEdit={openEdit}
          onLock={setLockUserId}
          onPageChange={setPage}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign user to function</DialogTitle>
          </DialogHeader>
          <Form {...assignForm}>
            <form onSubmit={assignForm.handleSubmit(onAssignSubmit)} className="space-y-4">
              <FormField
                control={assignForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivers.map((d: { _id: string; fullName?: string }) => (
                          <SelectItem key={d._id} value={d._id}>
                            {d.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={assignForm.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select function" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((g: { id: string; name: string }) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(lockUserId)}
        onOpenChange={(open) => !open && setLockUserId(null)}
        title="Lock user account"
        description="This will prevent the user from signing in until the account is unlocked."
        confirmLabel="Lock account"
        onConfirm={handleLock}
        destructive
      />
    </div>
  );
}
