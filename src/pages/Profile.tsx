import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { PaymentHistorySection } from "@/components/profile/PaymentHistorySection";
import { DocumentsSection } from "@/components/profile/DocumentsSection";
import { SupportSection } from "@/components/profile/SupportSection";

export default function Profile() {
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");

  // Mock data for demonstration
  const payments = [
    { date: "2024-03-01", amount: "£50.00", status: "Completed", type: "Monthly" },
    { date: "2024-02-01", amount: "£50.00", status: "Completed", type: "Monthly" },
  ];

  const documents = [
    { name: "ID Document.pdf", uploadDate: "2024-03-01", type: "Identification" },
    { name: "Proof of Address.pdf", uploadDate: "2024-02-15", type: "Address Proof" },
  ];

  const documentTypes = [
    { type: "Identification", description: "Valid ID document (Passport, Driving License)" },
    { type: "Address Proof", description: "Recent utility bill or bank statement" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <AccountSettingsSection />
          <PaymentHistorySection 
            payments={payments}
            searchDate={searchDate}
            searchAmount={searchAmount}
            onSearchDateChange={setSearchDate}
            onSearchAmountChange={setSearchAmount}
          />
          <DocumentsSection 
            documents={documents}
            documentTypes={documentTypes}
          />
          <SupportSection />
        </CardContent>
      </Card>
    </div>
  );
}