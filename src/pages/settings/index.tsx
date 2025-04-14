import React from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./appearanceSettings";
import NotificationsSettings from "./notificationsSettings";
import SecuritySettings from "./securitySettings";

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4 grid grid-cols-4 gap-4 rounded-none bg-transparent p-0">
          <TabsTrigger value="account" className="tab-trigger">Account</TabsTrigger>
          <TabsTrigger value="notifications" className="tab-trigger">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="tab-trigger">Security</TabsTrigger>
          <TabsTrigger value="appearance" className="tab-trigger">Appearance</TabsTrigger>
        </TabsList>

        <Separator className="mb-6" />

        <TabsContent value="account"><AccountSettings /></TabsContent>
        <TabsContent value="notifications"><NotificationsSettings /></TabsContent>
        <TabsContent value="security"><SecuritySettings /></TabsContent>
        <TabsContent value="appearance"><AppearanceSettings /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
