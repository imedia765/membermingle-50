import { useState } from "react";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { DocumentsSection } from "@/components/profile/DocumentsSection";
import { PaymentHistorySection } from "@/components/profile/PaymentHistorySection";
import { SupportSection } from "@/components/profile/SupportSection";

export default function Profile() {
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");

  const paymentHistory = [
    { date: '2024-03-15', amount: '£50.00', status: 'Paid', type: 'Membership Fee' },
    { date: '2024-02-15', amount: '£50.00', status: 'Paid', type: 'Membership Fee' },
  ];

  const documents = [
    { name: 'ID Document.pdf', uploadDate: '2024-03-01', type: 'Identification' },
    { name: 'Proof of Address.pdf', uploadDate: '2024-02-15', type: 'Address Proof' },
  ];

  const documentTypes = [
    { type: 'Identification', description: 'Valid ID document (Passport, Driving License)' },
    { type: 'Address Proof', description: 'Recent utility bill or bank statement' },
    { type: 'Medical Certificate', description: 'Recent medical certificate if applicable' },
    { type: 'Marriage Certificate', description: 'Marriage certificate if applicable' },
  ];

  const filteredPayments = paymentHistory.filter(payment => {
    const matchesDate = searchDate ? payment.date.includes(searchDate) : true;
    const matchesAmount = searchAmount ? payment.amount.includes(searchAmount) : true;
    return matchesDate && matchesAmount;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Members Profile
      </h1>

      <div className="space-y-6">
        <AccountSettingsSection />
        <DocumentsSection 
          documents={documents}
          documentTypes={documentTypes}
        />
        <PaymentHistorySection 
          payments={filteredPayments}
          searchDate={searchDate}
          searchAmount={searchAmount}
          onSearchDateChange={setSearchDate}
          onSearchAmountChange={setSearchAmount}
        />
        <SupportSection />
      </div>
    </div>
  );
}