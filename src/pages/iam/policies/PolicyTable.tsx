import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IamPolicy } from "../types";

type PolicyForm = {
  name: string;
  type: string;
  status: IamPolicy["status"];
};

export function PolicyTable({
  rows,
  onEdit,
}: Readonly<{ rows: IamPolicy[]; onEdit: (policy: IamPolicy) => void }>) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last modified</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.name}</TableCell>
              <TableCell>{policy.type}</TableCell>
              <TableCell>
                <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                  {policy.status}
                </Badge>
              </TableCell>
              <TableCell>{policy.lastModified}</TableCell>
              <TableCell>
                <Button type="button" variant="outline" size="sm" onClick={() => onEdit(policy)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function PolicyFormFields({
  form,
  onChange,
}: Readonly<{
  form: PolicyForm;
  onChange: (updater: (current: PolicyForm) => PolicyForm) => void;
}>) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="policy-name">Name</Label>
        <Input
          id="policy-name"
          value={form.name}
          onChange={(e) => onChange((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="policy-type">Type</Label>
        <Select value={form.type} onValueChange={(v) => onChange((f) => ({ ...f, type: v }))}>
          <SelectTrigger id="policy-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Authentication">Authentication</SelectItem>
            <SelectItem value="Authorization">Authorization</SelectItem>
            <SelectItem value="Password">Password</SelectItem>
            <SelectItem value="Session">Session</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(v) => onChange((f) => ({ ...f, status: v as IamPolicy["status"] }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
