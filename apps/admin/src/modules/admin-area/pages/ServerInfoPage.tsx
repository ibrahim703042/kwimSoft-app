import { getServerInfo } from "../platformData";
import { APP_CONFIG } from "@/config";

export default function ServerInfoPage() {
  const serverInfo = getServerInfo();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
            Server info
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {serverInfo.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-4 font-medium text-muted-foreground w-[40%]">
                      {row.name}
                    </td>
                    <td className="py-2.5 px-4">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
            Profile
          </h2>
          <div className="p-4 text-sm text-muted-foreground">
            <p>
              This application runs the {APP_CONFIG.name} platform with the modules and features
              listed under the &quot;Provider info&quot; tab. Server info reflects current
              environment and app settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
