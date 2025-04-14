import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SecuritySettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your password and active sessions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium">Change Password</h4>
          <p className="text-sm text-gray-600 mb-2">You can change your account password here.</p>
          <Button variant="outline">Change Password</Button>
        </div>

        <div>
          <h4 className="font-medium">Active Sessions</h4>
          <p className="text-sm text-gray-600 mb-2">Log out of all other browser sessions.</p>
          <Button variant="destructive">Log Out of Other Sessions</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings
