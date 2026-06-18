import { useState } from "react";
import { Plus } from "lucide-react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { mockAccessReviews } from "../mock-data";
import type { AccessReview } from "../types";
import { notifySuccess } from "@/lib/notify";

function reviewProgress(row: AccessReview) {
  const reviewed = row.approved + row.rejected;
  return row.totalUsers > 0 ? Math.round((reviewed / row.totalUsers) * 100) : 0;
}

export default function AccessReviewsPage() {
  const [reviews, setReviews] = useState(mockAccessReviews);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [quarter, setQuarter] = useState("Q3 2026");

  const overall =
    reviews.reduce((sum, r) => sum + reviewProgress(r), 0) / reviews.length;

  const startReview = () => {
    if (!department.trim()) return;
    setReviews((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        department,
        totalUsers: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    ]);
    notifySuccess(`Access review started for ${department}`);
    setDialogOpen(false);
    setDepartment("");
  };

  return (
    <div>
      <IamPageHeader
        title="Access reviews"
        description="Track quarterly access certification progress"
        actions={
          <Button type="button" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Start review
          </Button>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Q2 2026 review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold">{Math.round(overall)}%</p>
            <div className="flex-1">
              <Progress value={overall} className="h-2" />
              <p className="mt-1 text-sm text-muted-foreground">Overall completion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Total users</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Not approved</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.department}</TableCell>
                <TableCell>{row.totalUsers}</TableCell>
                <TableCell>{row.pending}</TableCell>
                <TableCell>{row.approved}</TableCell>
                <TableCell>{row.rejected}</TableCell>
                <TableCell className="min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <Progress value={reviewProgress(row)} className="h-2 flex-1" />
                    <span className="w-8 text-xs text-muted-foreground">
                      {reviewProgress(row)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start access review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="review-dept">Department</Label>
              <Input
                id="review-dept"
                placeholder="e.g. Finance"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Quarter</Label>
              <Select value={quarter} onValueChange={setQuarter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q3 2026">Q3 2026</SelectItem>
                  <SelectItem value="Q4 2026">Q4 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={startReview}>
              Start review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
