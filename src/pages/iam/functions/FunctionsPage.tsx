import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import LoadingState from "@/components/shared/LoadingState";
import EmptyState from "@/components/shared/EmptyState";
import { useGroups, useCreateGroup } from "@/domains/identity/hooks";
import { useUserData } from "@/hooks/useUserData";

const groupSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

type GroupForm = z.infer<typeof groupSchema>;

type FunctionGroup = { id: string; name: string; path?: string };

function FunctionsTableContent({
  isLoading,
  groups,
  onNavigate,
}: Readonly<{
  isLoading: boolean;
  groups: FunctionGroup[];
  onNavigate: (id: string) => void;
}>) {
  if (isLoading) return <LoadingState />;
  if (groups.length === 0) return <EmptyState title="No functions found" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Path</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <TableRow
            key={group.id}
            className="cursor-pointer"
            onClick={() => onNavigate(group.id)}
          >
            <TableCell className="font-medium">{group.name}</TableCell>
            <TableCell className="text-muted-foreground">{group.path ?? "/"}</TableCell>
            <TableCell className="text-right">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(group.id);
                }}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function FunctionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: profile } = useUserData();
  const companyGroupId = profile?.companyId?.keycloakGroupId as string | undefined;

  const { data, isLoading } = useGroups(companyGroupId);
  const createGroup = useCreateGroup(companyGroupId);

  const groups = (data?.data ?? []).filter((g: { name?: string }) =>
    !search || g.name?.toLowerCase().includes(search.toLowerCase())
  );

  const form = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: GroupForm) => {
    createGroup.mutate(values, {
      onSuccess: () => {
        setDialogOpen(false);
        form.reset();
      },
    });
  };

  return (
    <div>
      <IamPageHeader
        title="Functions"
        description="Organize users into functions and manage group permissions"
        searchPlaceholder="Search functions..."
        onSearchChange={setSearch}
        actions={
          <Button type="button" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Function
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        <FunctionsTableContent
          isLoading={isLoading}
          groups={groups}
          onNavigate={(id) => navigate(`/user-management/functions/${id}`)}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create function</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. TEACHERS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createGroup.isPending}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
