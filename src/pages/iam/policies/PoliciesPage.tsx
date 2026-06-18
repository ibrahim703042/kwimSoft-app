import { useState } from "react";
import { Plus } from "lucide-react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPolicies } from "../mock-data";
import type { IamPolicy } from "../types";
import { notifySuccess } from "@/lib/notify";
import { PolicyFormFields, PolicyTable } from "./PolicyTable";

const emptyForm = { name: "", type: "Authentication", status: "active" as IamPolicy["status"] };

export default function PoliciesPage() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [editing, setEditing] = useState<IamPolicy | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openEdit = (policy: IamPolicy) => {
    setEditing(policy);
    setForm({ name: policy.name, type: policy.type, status: policy.status });
  };

  const openCreate = () => {
    setCreating(true);
    setForm(emptyForm);
  };

  const savePolicy = () => {
    if (editing) {
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, ...form, lastModified: new Date().toISOString().slice(0, 10) }
            : p
        )
      );
      notifySuccess("Policy updated");
      setEditing(null);
    }
  };

  const createPolicy = () => {
    if (!form.name.trim()) return;
    setPolicies((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        ...form,
        lastModified: new Date().toISOString().slice(0, 10),
      },
    ]);
    notifySuccess("Policy created");
    setCreating(false);
  };

  const filterByType = (type: string) =>
    policies.filter((p) => p.type.toLowerCase().includes(type));

  return (
    <div>
      <IamPageHeader
        title="Policies"
        description="Manage authentication, authorization, and session policies"
        actions={
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add policy
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All policies</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <PolicyTable rows={policies} onEdit={openEdit} />
        </TabsContent>
        <TabsContent value="auth" className="mt-4">
          <PolicyTable rows={filterByType("auth")} onEdit={openEdit} />
        </TabsContent>
        <TabsContent value="session" className="mt-4">
          <PolicyTable rows={filterByType("session")} onEdit={openEdit} />
        </TabsContent>
      </Tabs>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit policy</DialogTitle>
          </DialogHeader>
          <PolicyFormFields form={form} onChange={setForm} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={savePolicy}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create policy</DialogTitle>
          </DialogHeader>
          <PolicyFormFields form={form} onChange={setForm} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={createPolicy}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
