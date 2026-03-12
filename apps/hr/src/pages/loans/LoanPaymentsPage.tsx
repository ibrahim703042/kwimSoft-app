/**
 * LoanPaymentsPage - Payment tracking and recording for a loan
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Banknote,
  Calendar,
  Receipt,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Input,
  Textarea,
  Badge,
} from "@kwim/shared-ui";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { loanApi } from "../../api/hr.api";

interface LoanRepayment {
  amount: number;
  dueDate: string;
  paidDate?: string;
  isPaid: boolean;
  transactionReference?: string;
  notes?: string;
}

interface PaymentFormValues {
  amount: number;
  paidDate: string;
  transactionReference: string;
  notes: string;
}

const schema = Yup.object({
  amount: Yup.number().min(0.01, "Le montant doit être positif").required("Le montant est requis"),
  paidDate: Yup.string().required("La date est requise"),
  transactionReference: Yup.string(),
  notes: Yup.string(),
});

export default function LoanPaymentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState<number | null>(null);

  const { data: loanData, isLoading } = useQuery({
    queryKey: ["loan", id],
    queryFn: async () => (await loanApi.getById(id!)).data,
    enabled: !!id,
  });
  const loan = loanData?.data || loanData;

  const recordPaymentMutation = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      if (selectedPaymentIndex !== null) {
        return await loanApi.markPaymentAsPaid(id!, selectedPaymentIndex, values);
      }
      return await loanApi.recordPayment(id!, values);
    },
    onSuccess: () => {
      Swal.fire("Succès!", "Le paiement a été enregistré.", "success");
      qc.invalidateQueries({ queryKey: ["loan", id] });
      closeDialog();
    },
    onError: (e: any) =>
      Swal.fire("Erreur!", e.response?.data?.message || "Erreur lors de l'enregistrement.", "error"),
  });

  const formik = useFormik<PaymentFormValues>({
    initialValues: {
      amount: 0,
      paidDate: new Date().toISOString().split("T")[0],
      transactionReference: "",
      notes: "",
    },
    validationSchema: schema,
    onSubmit: (v) => recordPaymentMutation.mutateAsync(v),
  });

  const closeDialog = () => {
    setPaymentOpen(false);
    setSelectedPaymentIndex(null);
    formik.resetForm();
  };

  const openNewPayment = () => {
    formik.resetForm();
    formik.setFieldValue("amount", loan?.monthlyInstallment || 0);
    formik.setFieldValue("paidDate", new Date().toISOString().split("T")[0]);
    setSelectedPaymentIndex(null);
    setPaymentOpen(true);
  };

  const openScheduledPayment = (index: number, payment: LoanRepayment) => {
    formik.setValues({
      amount: payment.amount,
      paidDate: new Date().toISOString().split("T")[0],
      transactionReference: "",
      notes: payment.notes || "",
    });
    setSelectedPaymentIndex(index);
    setPaymentOpen(true);
  };

  const getPaymentStatus = (payment: LoanRepayment) => {
    if (payment.isPaid) return "paid";
    const dueDate = new Date(payment.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) return "overdue";
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    if (dueDate <= weekFromNow) return "upcoming";
    return "scheduled";
  };

  const statusConfig = {
    paid: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Payé" },
    overdue: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "En retard" },
    upcoming: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "À venir" },
    scheduled: { color: "bg-gray-100 text-gray-800", icon: Calendar, label: "Planifié" },
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
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Prêt non trouvé</h3>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/hr/loans/list")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const repayments: LoanRepayment[] = loan.repayments || [];
  const paidPayments = repayments.filter((r) => r.isPaid);
  const unpaidPayments = repayments.filter((r) => !r.isPaid);
  const overdueCount = unpaidPayments.filter((r) => new Date(r.dueDate) < new Date()).length;
  const progressPercent = loan.totalAmount > 0 ? ((loan.paidAmount || 0) / loan.totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/loans/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Paiements - {loan.loanNumber}</h1>
            <p className="text-muted-foreground">
              {loan.employee ? `${loan.employee.firstName} ${loan.employee.lastName}` : "—"}
            </p>
          </div>
        </div>
        {loan.status === "active" && (
          <Button onClick={openNewPayment} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" /> Enregistrer un paiement
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Banknote className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Montant total</p>
              <p className="text-xl font-bold">{loan.totalAmount?.toLocaleString()} Frw</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Montant payé</p>
              <p className="text-xl font-bold text-green-600">{loan.paidAmount?.toLocaleString()} Frw</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reste à payer</p>
              <p className="text-xl font-bold text-orange-600">{loan.remainingAmount?.toLocaleString()} Frw</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${overdueCount > 0 ? "bg-red-100" : "bg-gray-100"}`}>
              <AlertTriangle className={`h-5 w-5 ${overdueCount > 0 ? "text-red-600" : "text-gray-600"}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paiements en retard</p>
              <p className={`text-xl font-bold ${overdueCount > 0 ? "text-red-600" : ""}`}>{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Progression du remboursement</span>
          <span className="font-bold">{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{paidPayments.length} paiements effectués</span>
          <span>{unpaidPayments.length} paiements restants</span>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Receipt className="h-5 w-5" /> Échéancier des paiements
        </h3>
        <div>
          {repayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Aucun échéancier généré pour ce prêt.</p>
              {loan.status === "approved" && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => loanApi.generateSchedule(id!).then(() => qc.invalidateQueries({ queryKey: ["loan", id] }))}
                >
                  Générer l'échéancier
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {repayments.map((payment, idx) => {
                const status = getPaymentStatus(payment);
                const config = statusConfig[status];
                const Icon = config.icon;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      payment.isPaid ? "bg-green-50/50 border-green-200" : status === "overdue" ? "bg-red-50/50 border-red-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{payment.amount?.toLocaleString()} Frw</p>
                          <Badge variant="outline" className={config.color}>
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Échéance: {new Date(payment.dueDate).toLocaleDateString("fr-FR")}
                          {payment.notes && <span className="ml-2">• {payment.notes}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {payment.isPaid ? (
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            Payé le {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString("fr-FR") : "—"}
                          </p>
                          {payment.transactionReference && (
                            <p className="text-xs text-muted-foreground">Réf: {payment.transactionReference}</p>
                          )}
                        </div>
                      ) : (
                        loan.status === "active" && (
                          <Button size="sm" onClick={() => openScheduledPayment(idx, payment)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Marquer payé
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={formik.handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {selectedPaymentIndex !== null ? "Marquer comme payé" : "Enregistrer un paiement"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Montant</Label>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.amount && formik.errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.amount}</p>
                )}
                {loan?.remainingAmount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Solde restant: {loan.remainingAmount.toLocaleString()} Frw
                  </p>
                )}
              </div>
              <div>
                <Label>Date de paiement</Label>
                <Input
                  name="paidDate"
                  type="date"
                  value={formik.values.paidDate}
                  onChange={formik.handleChange}
                />
                {formik.touched.paidDate && formik.errors.paidDate && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.paidDate}</p>
                )}
              </div>
              <div>
                <Label>Référence de transaction</Label>
                <Input
                  name="transactionReference"
                  value={formik.values.transactionReference}
                  onChange={formik.handleChange}
                  placeholder="Ex: TXN-123456"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  rows={2}
                  placeholder="Notes optionnelles..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Annuler
              </Button>
              <Button type="submit" disabled={recordPaymentMutation.isPending}>
                {recordPaymentMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
