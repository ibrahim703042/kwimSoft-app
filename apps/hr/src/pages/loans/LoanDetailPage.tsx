/**
 * LoanDetailPage - View loan details with approval workflow
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Banknote,
  Calendar,
  User,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
  Badge,
} from "@kwim/shared-ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { loanApi } from "../../api/hr.api";

interface LoanRepayment {
  amount: number;
  dueDate: string;
  paidDate?: string;
  isPaid: boolean;
  transactionReference?: string;
  notes?: string;
}

interface LoanDetail {
  _id: string;
  loanNumber: string;
  employee?: { _id: string; firstName?: string; lastName?: string; email?: string; employeeId?: string };
  loanType?: { _id: string; name: string; interestRate?: number };
  principalAmount: number;
  interestRate: number;
  totalInterest: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  monthlyInstallment: number;
  tenureMonths: number;
  status: string;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  startDate?: string;
  endDate?: string;
  purpose?: string;
  remarks?: string;
  rejectionReason?: string;
  repayments: LoanRepayment[];
  approvedBy?: { firstName?: string; lastName?: string };
}

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "En attente", icon: Clock },
  approved: { color: "bg-blue-100 text-blue-800 border-blue-300", label: "Approuvé", icon: CheckCircle },
  active: { color: "bg-green-100 text-green-800 border-green-300", label: "Actif", icon: Banknote },
  rejected: { color: "bg-red-100 text-red-800 border-red-300", label: "Rejeté", icon: XCircle },
  fully_paid: { color: "bg-purple-100 text-purple-800 border-purple-300", label: "Remboursé", icon: CheckCircle },
};

export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: loanData, isLoading } = useQuery({
    queryKey: ["loan", id],
    queryFn: async () => (await loanApi.getById(id!)).data,
    enabled: !!id,
  });
  const loan: LoanDetail | null = loanData?.data || loanData;

  const approveMutation = useMutation({
    mutationFn: async () => await loanApi.approve(id!, {}),
    onSuccess: () => {
      Swal.fire("Succès!", "Le prêt a été approuvé.", "success");
      qc.invalidateQueries({ queryKey: ["loan", id] });
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Erreur lors de l'approbation.", "error"),
  });

  const rejectMutation = useMutation({
    mutationFn: async () => await loanApi.reject(id!, { reason: rejectReason }),
    onSuccess: () => {
      Swal.fire("Rejeté", "Le prêt a été rejeté.", "info");
      qc.invalidateQueries({ queryKey: ["loan", id] });
      qc.invalidateQueries({ queryKey: ["loans"] });
      setRejectOpen(false);
      setRejectReason("");
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Erreur lors du rejet.", "error"),
  });

  const disburseMutation = useMutation({
    mutationFn: async () => await loanApi.disburse(id!),
    onSuccess: () => {
      Swal.fire("Succès!", "Le prêt a été décaissé et est maintenant actif.", "success");
      qc.invalidateQueries({ queryKey: ["loan", id] });
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Erreur lors du décaissement.", "error"),
  });

  const generateScheduleMutation = useMutation({
    mutationFn: async () => await loanApi.generateSchedule(id!),
    onSuccess: () => {
      Swal.fire("Succès!", "L'échéancier de remboursement a été généré.", "success");
      qc.invalidateQueries({ queryKey: ["loan", id] });
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Erreur lors de la génération.", "error"),
  });

  const handleApprove = () => {
    Swal.fire({
      title: "Approuver ce prêt?",
      text: "Cette action approuvera la demande de prêt.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, approuver",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate();
      }
    });
  };

  const handleDisburse = () => {
    Swal.fire({
      title: "Décaisser ce prêt?",
      text: "Le prêt sera marqué comme actif et le décaissement sera enregistré.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, décaisser",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        disburseMutation.mutate();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Prêt non trouvé</h3>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/hr/loans/list")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[loan.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  const progressPercent = loan.totalAmount > 0 ? ((loan.paidAmount || 0) / loan.totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/hr/loans/list")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{loan.loanNumber}</h1>
            <p className="text-muted-foreground">
              {loan.employee ? `${loan.employee.firstName} ${loan.employee.lastName}` : "—"}
            </p>
          </div>
        </div>
        <Badge className={`${statusInfo.color} px-3 py-1 text-sm border`}>
          <StatusIcon className="h-4 w-4 mr-1 inline" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Action Buttons */}
      {(loan.status === "pending" || loan.status === "approved") && (
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          <div>
            <div className="flex flex-wrap gap-3">
              {loan.status === "pending" && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={approveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {approveMutation.isPending ? "Approbation..." : "Approuver"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setRejectOpen(true)}
                    disabled={rejectMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Rejeter
                  </Button>
                </>
              )}
              {loan.status === "approved" && (
                <>
                  <Button
                    onClick={handleDisburse}
                    disabled={disburseMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    {disburseMutation.isPending ? "Décaissement..." : "Décaisser"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateScheduleMutation.mutate()}
                    disabled={generateScheduleMutation.isPending}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {generateScheduleMutation.isPending ? "Génération..." : "Générer échéancier"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Display */}
      {loan.status === "rejected" && loan.rejectionReason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Raison du rejet</p>
                <p className="text-red-700 mt-1">{loan.rejectionReason}</p>
              </div>
            </div>
        </div>
      )}

      {/* Loan Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Financial Details */}
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Banknote className="h-5 w-5" /> Détails financiers
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Montant principal</p>
                <p className="font-semibold text-lg">{loan.principalAmount?.toLocaleString()} Frw</p>
              </div>
              <div>
                <p className="text-muted-foreground">Taux d'intérêt</p>
                <p className="font-semibold text-lg">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Intérêt total</p>
                <p className="font-semibold">{loan.totalInterest?.toLocaleString()} Frw</p>
              </div>
              <div>
                <p className="text-muted-foreground">Montant total</p>
                <p className="font-semibold text-lg text-primary">{loan.totalAmount?.toLocaleString()} Frw</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mensualité</p>
                <p className="font-semibold">{loan.monthlyInstallment?.toLocaleString()} Frw</p>
              </div>
              <div>
                <p className="text-muted-foreground">Durée</p>
                <p className="font-semibold">{loan.tenureMonths} mois</p>
              </div>
            </div>

            {/* Progress Bar */}
            {loan.status === "active" && (
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression du remboursement</span>
                  <span className="font-medium">{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Payé: {loan.paidAmount?.toLocaleString()} Frw</span>
                  <span>Reste: {loan.remainingAmount?.toLocaleString()} Frw</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employee & Dates */}
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <User className="h-5 w-5" /> Informations
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Employé</p>
              <p className="font-semibold">
                {loan.employee ? `${loan.employee.firstName} ${loan.employee.lastName}` : "—"}
              </p>
              {loan.employee?.email && (
                <p className="text-sm text-muted-foreground">{loan.employee.email}</p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Type de prêt</p>
              <p className="font-semibold">{loan.loanType?.name || "Non spécifié"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
              <div>
                <p className="text-muted-foreground">Date de demande</p>
                <p className="font-medium">
                  {loan.applicationDate ? new Date(loan.applicationDate).toLocaleDateString("fr-FR") : "—"}
                </p>
              </div>
              {loan.approvalDate && (
                <div>
                  <p className="text-muted-foreground">Date d'approbation</p>
                  <p className="font-medium">{new Date(loan.approvalDate).toLocaleDateString("fr-FR")}</p>
                </div>
              )}
              {loan.disbursementDate && (
                <div>
                  <p className="text-muted-foreground">Date de décaissement</p>
                  <p className="font-medium">{new Date(loan.disbursementDate).toLocaleDateString("fr-FR")}</p>
                </div>
              )}
              {loan.endDate && (
                <div>
                  <p className="text-muted-foreground">Date de fin</p>
                  <p className="font-medium">{new Date(loan.endDate).toLocaleDateString("fr-FR")}</p>
                </div>
              )}
            </div>
            {loan.approvedBy && (
              <div className="pt-2 border-t">
                <p className="text-muted-foreground text-sm">Approuvé par</p>
                <p className="font-medium">{loan.approvedBy.firstName} {loan.approvedBy.lastName}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purpose & Remarks */}
      {(loan.purpose || loan.remarks) && (
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <FileText className="h-5 w-5" /> Détails supplémentaires
          </h3>
          <div className="space-y-4">
            {loan.purpose && (
              <div>
                <p className="text-muted-foreground text-sm">Objet du prêt</p>
                <p>{loan.purpose}</p>
              </div>
            )}
            {loan.remarks && (
              <div>
                <p className="text-muted-foreground text-sm">Remarques</p>
                <p>{loan.remarks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Schedule */}
      {loan.repayments && loan.repayments.length > 0 && (
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5" /> Échéancier de remboursement
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigate(`/loans/${id}/payments`)}>
              Voir tous les paiements
            </Button>
          </div>
          <div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {loan.repayments.slice(0, 5).map((payment, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    payment.isPaid ? "bg-green-50 border-green-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {payment.isPaid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">{payment.amount?.toLocaleString()} Frw</p>
                      <p className="text-xs text-muted-foreground">
                        Échéance: {new Date(payment.dueDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  {payment.isPaid && payment.paidDate && (
                    <p className="text-sm text-green-600">
                      Payé le {new Date(payment.paidDate).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              ))}
              {loan.repayments.length > 5 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  +{loan.repayments.length - 5} autres échéances
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande de prêt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Raison du rejet</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Veuillez indiquer la raison du rejet..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejectOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => rejectMutation.mutate()}
                disabled={!rejectReason.trim() || rejectMutation.isPending}
              >
                {rejectMutation.isPending ? "Rejet..." : "Confirmer le rejet"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
