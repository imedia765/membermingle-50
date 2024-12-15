import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { PaymentHistorySection } from "@/components/profile/PaymentHistorySection";
import { DocumentsSection } from "@/components/profile/DocumentsSection";
import { SupportSection } from "@/components/profile/SupportSection";

export default function Profile() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <AccountSettingsSection />
          <PaymentHistorySection />
          <DocumentsSection />
          <SupportSection />
        </CardContent>
      </Card>
    </div>
  );
}