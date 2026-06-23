import { useAuthStore } from "@kwim/auth";
import { Page, PageHeader, PageContent } from "@kwim/core";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "—";

  return (
    <Page>
      <PageHeader title="Profile" description="View and manage your account information" />
      <PageContent>
        <div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-6 mb-6">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="rounded-full w-24 h-24 object-cover border-2 border-border" />
            ) : (
              <div className="rounded-full w-24 h-24 bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground border-2 border-border">
                {(user?.firstName?.[0] || user?.username?.[0] || "?").toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div><span className="text-muted-foreground">Username</span><p className="mt-1">{user?.username || "—"}</p></div>
            <div><span className="text-muted-foreground">Email</span><p className="mt-1">{user?.email || "—"}</p></div>
            {user?.tenantCode ? <div><span className="text-muted-foreground">Tenant</span><p className="mt-1">{user.tenantCode}</p></div> : null}
            {user?.roles?.length ? <div><span className="text-muted-foreground">Roles</span><p className="mt-1">{user.roles.join(", ")}</p></div> : null}
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
