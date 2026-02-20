import { getPlatformFeatures } from "../platformData";
import { StatusBadge } from "../components/StatusBadge";

export default function ProviderInfoPage() {
  const features = getPlatformFeatures();
  const enabledFeatures = features.filter((f) => f.enabled);
  const disabledFeatures = features.filter((f) => !f.enabled);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
        <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
          Enabled features
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">
                  Description
                </th>
                <th className="py-2.5 px-4 text-left font-medium text-muted-foreground w-32">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {enabledFeatures.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 px-4 text-center text-muted-foreground">
                    No enabled features
                  </td>
                </tr>
              ) : (
                enabledFeatures.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-4 font-medium">{f.name}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{f.description}</td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={f.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
        <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
          Disabled features
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">
                  Description
                </th>
                <th className="py-2.5 px-4 text-left font-medium text-muted-foreground w-32">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {disabledFeatures.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 px-4 text-center text-muted-foreground">
                    No disabled features
                  </td>
                </tr>
              ) : (
                disabledFeatures.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-4 font-medium">{f.name}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{f.description}</td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={f.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
