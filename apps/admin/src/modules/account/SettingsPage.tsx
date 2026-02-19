import { Page, PageHeader, PageContent } from "@/core/ui";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader
        title="Settings"
        description="Manage your application preferences"
      />
      <PageContent className="space-y-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f3b] p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-1">Account</h3>
          <p className="text-sm text-muted-foreground mb-4">Update your account and password</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Profile</Label>
                <p className="text-sm text-muted-foreground">Edit your profile and avatar</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                Open profile
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Password</Label>
                <p className="text-sm text-muted-foreground">Change your password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/update-password")}>
                Change password
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f3b] p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-1">Preferences</h3>
          <p className="text-sm text-muted-foreground mb-2">Language and display options</p>
          <p className="text-sm text-muted-foreground">
            Use the language selector in the header to switch between English and French.
          </p>
        </div>
      </PageContent>
    </Page>
  );
}
