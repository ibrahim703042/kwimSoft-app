import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PermissionsMatrix from "@/components/iam/PermissionsMatrix";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import {
  useSubgroupMembers,
  useStaffDrivers,
  useAssignUserToGroup,
} from "@/domains/identity/hooks";
import { mockAuditLogs, permissionModules } from "../mock-data";
import { Badge } from "@/components/ui/badge";
import { notifySuccess } from "@/lib/notify";

const addMemberSchema = z.object({
  userId: z.string().min(1, "Select a user"),
});

type AddMemberForm = z.infer<typeof addMemberSchema>;

type FunctionMember = { id?: string; username?: string; email?: string };

function FunctionMembersTable({
  isLoading,
  members,
}: Readonly<{ isLoading: boolean; members: FunctionMember[] }>) {
  if (isLoading) return <LoadingState />;
  if (members.length === 0) return <EmptyState title="No members in this function" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id ?? member.username}>
            <TableCell>{member.username ?? "—"}</TableCell>
            <TableCell>{member.email ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function FunctionDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useSubgroupMembers(id);
  const { data: driversData } = useStaffDrivers();
  const assignMutation = useAssignUserToGroup();

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(permissionModules[0].id);
  const [checked, setChecked] = useState<Record<string, boolean>>({
    GRADE_VIEW: true,
    ATT_VIEW: true,
  });

  const members = data?.data ?? [];
  const drivers = driversData?.data?.content ?? [];

  const permissionCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const form = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { userId: "" },
  });

  const onAddMember = (values: AddMemberForm) => {
    assignMutation.mutate(
      { userId: values.userId, groupId: id },
      {
        onSuccess: () => {
          setMemberDialogOpen(false);
          form.reset();
          refetch();
        },
      }
    );
  };

  const auditForFunction = mockAuditLogs.filter((log) =>
    log.target.toUpperCase().includes(id.slice(0, 4).toUpperCase())
  );

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/user-management/functions")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to functions
      </Button>

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Function detail</h1>
          <p className="text-sm text-muted-foreground">Manage members and permissions for this group</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Members</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{members.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Permissions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{permissionCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last modified</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">Today</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="access-reviews">Access reviews</TabsTrigger>
          <TabsTrigger value="audit">Audit trail</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Members</CardTitle>
              <Button type="button" size="sm" onClick={() => setMemberDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add member
              </Button>
            </CardHeader>
            <CardContent>
              <FunctionMembersTable isLoading={isLoading} members={members} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <PermissionsMatrix
            modules={permissionModules}
            selectedModuleId={selectedModule}
            onModuleChange={setSelectedModule}
            checked={checked}
            onCheckedChange={(permId, value) =>
              setChecked((prev) => ({ ...prev, [permId]: value }))
            }
            onSave={() => notifySuccess("Function permissions saved")}
            onTerminateSessions={() => notifySuccess("All sessions terminated for this function")}
          />
        </TabsContent>

        <TabsContent value="access-reviews" className="mt-4">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>
                Access review for this function is tracked in{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => navigate("/user-management/access-reviews")}
                >
                  Access Reviews
                </button>
                .
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Audit trail</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {auditForFunction.length === 0 ? (
                <EmptyState title="No audit events for this function yet" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditForFunction.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          <Badge variant={log.result === "success" ? "default" : "destructive"}>
                            {log.result}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add member to function</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddMember)} className="space-y-4">
              <FormField
                control={form.control}
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setMemberDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? "Adding..." : "Add member"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
