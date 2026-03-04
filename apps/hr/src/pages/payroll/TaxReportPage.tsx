/**
 * TaxReportPage - Tax reports and declarations
 */
import { FileBarChart, Download } from "lucide-react";
import { Button, Label, Input } from "@kwim/shared-ui";

export default function TaxReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Rapport fiscal
          </h2>
          <p className="text-sm text-muted-foreground">
            Déclarations et rapports d'impôts sur les salaires
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Exporter
        </Button>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800 p-6 max-w-md">
        <h3 className="font-medium mb-4">Période</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Du</Label>
            <Input type="month" />
          </div>
          <div>
            <Label>Au</Label>
            <Input type="month" />
          </div>
        </div>
        <Button className="mt-4">Générer le rapport</Button>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800 p-6">
        <p className="text-sm text-muted-foreground text-center py-8">
          Sélectionnez une période et générez le rapport pour voir les totaux d'impôts retenus.
        </p>
      </div>
    </div>
  );
}
