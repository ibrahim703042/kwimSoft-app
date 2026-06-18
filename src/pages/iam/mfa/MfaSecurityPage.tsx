import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import IamPageHeader from "@/components/iam/IamPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { notifySuccess } from "@/lib/notify";

const mfaMethods = [
  { id: "authenticator", label: "Authenticator App", description: "TOTP via Google Authenticator, Authy, etc." },
  { id: "sms", label: "SMS", description: "One-time codes via SMS" },
  { id: "email", label: "Email", description: "Verification codes sent by email" },
  { id: "webauthn", label: "WebAuthn", description: "Hardware security keys and passkeys" },
  { id: "biometric", label: "Biometric", description: "Fingerprint or face recognition" },
];

const passwordPolicySchema = z.object({
  minLength: z.coerce.number().min(8, "Minimum 8 characters").max(128),
  requireUppercase: z.boolean(),
  requireNumbers: z.boolean(),
  requireSpecial: z.boolean(),
  expiryDays: z.coerce.number().min(0).max(365),
  historyCount: z.coerce.number().min(0).max(24),
});

type PasswordPolicyForm = z.infer<typeof passwordPolicySchema>;

const securityTips = [
  "Enforce MFA for all privileged accounts",
  "Review failed login attempts weekly",
  "Rotate API keys and service accounts quarterly",
  "Use WebAuthn for administrator accounts",
];

export default function MfaSecurityPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    authenticator: true,
    email: true,
  });

  const [trustedDevices, setTrustedDevices] = useState(true);
  const [ipAllowlist, setIpAllowlist] = useState(false);

  const passwordForm = useForm<PasswordPolicyForm>({
    resolver: zodResolver(passwordPolicySchema),
    defaultValues: {
      minLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecial: true,
      expiryDays: 90,
      historyCount: 5,
    },
  });

  const toggle = (id: string, value: boolean) => {
    setEnabled((prev) => ({ ...prev, [id]: value }));
    notifySuccess("Security settings updated");
  };

  const onPasswordPolicySave = () => {
    notifySuccess("Password policy saved");
  };

  return (
    <div>
      <IamPageHeader
        title="MFA & Security"
        description="Configure multi-factor authentication and security policies"
      />

      <Tabs defaultValue="mfa">
        <TabsList>
          <TabsTrigger value="mfa">MFA Methods</TabsTrigger>
          <TabsTrigger value="password">Password Policy</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="mfa" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">MFA methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mfaMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <Label htmlFor={method.id} className="font-medium">
                        {method.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <Switch
                      id={method.id}
                      checked={enabled[method.id] ?? false}
                      onCheckedChange={(v) => toggle(method.id, v)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">MFA overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">87%</p>
                  <p className="mt-1 text-sm text-muted-foreground">of users have MFA enabled</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {securityTips.map((tip) => (
                      <li key={tip} className="flex gap-2">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Password policy</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordPolicySave)}
                  className="grid gap-6 md:grid-cols-2"
                >
                  <FormField
                    control={passwordForm.control}
                    name="minLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum length</FormLabel>
                        <FormControl>
                          <Input type="number" min={8} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="expiryDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password expiry (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="historyCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password history</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4 md:col-span-2">
                    {(
                      [
                        ["requireUppercase", "Require uppercase letter"],
                        ["requireNumbers", "Require number"],
                        ["requireSpecial", "Require special character"],
                      ] as const
                    ).map(([name, label]) => (
                      <FormField
                        key={name}
                        control={passwordForm.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <FormLabel className="!mt-0">{label}</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit">Save password policy</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="trusted-devices" className="font-medium">
                    Trusted devices
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Remember verified devices for 30 days
                  </p>
                </div>
                <Switch
                  id="trusted-devices"
                  checked={trustedDevices}
                  onCheckedChange={(v) => {
                    setTrustedDevices(v);
                    notifySuccess("Settings updated");
                  }}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="ip-allowlist" className="font-medium">
                    IP allowlist
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Restrict admin access to approved IP ranges
                  </p>
                </div>
                <Switch
                  id="ip-allowlist"
                  checked={ipAllowlist}
                  onCheckedChange={(v) => {
                    setIpAllowlist(v);
                    notifySuccess("Settings updated");
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
