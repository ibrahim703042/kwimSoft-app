import { useAuthStore } from "@/core/auth";
import { Page, PageHeader, PageContent } from "@/core/ui";
import profileImg from "@/assets/img/users/avatar.png";

export default function ProfilePage() {
  const { user } = useAuthStore();

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "—";
  const email = user?.email || "—";
  const username = user?.username || "—";
  const avatar = user?.avatar ? (
    <img
      src={user.avatar}
      alt=""
      className="rounded-full w-24 h-24 object-cover border-2 border-gray-200 dark:border-gray-600"
    />
  ) : (
    <img
      src={profileImg}
      alt=""
      className="rounded-full w-24 h-24 object-cover border-2 border-gray-200 dark:border-gray-600"
    />
  );

  return (
    <Page>
      <PageHeader
        title="Profile"
        description="View and manage your account information"
      />
      <PageContent>
        <div className="max-w-2xl rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f3b] p-6 shadow-sm">
          <div className="flex items-center gap-6 mb-6">
            {avatar}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="text-sm mt-1">{username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm mt-1">{email}</p>
            </div>
            {user?.tenantCode && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tenant</label>
                <p className="text-sm mt-1">{user.tenantCode}</p>
              </div>
            )}
            {user?.roles?.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Roles</label>
                <p className="text-sm mt-1">{user.roles.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
