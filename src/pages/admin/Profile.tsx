import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { DocumentsSection } from "@/components/profile/DocumentsSection";
import { PaymentHistorySection } from "@/components/profile/PaymentHistorySection";
import { SupportSection } from "@/components/profile/SupportSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface Payment {
  date: string;
  amount: string;
  status: string;
  type: string;
}

export default function Profile() {
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const { toast } = useToast();

  // Fetch member profile data
  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['member-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  // Fetch payment history
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['member-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching payments",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Transform the data to match the Payment interface
      return (data || []).map(payment => ({
        date: payment.payment_date,
        amount: payment.amount.toString(),
        status: payment.status,
        type: payment.payment_type
      }));
    },
  });

  // Mock document types (this could be moved to a constants file)
  const documentTypes = [
    { type: 'Identification', description: 'Valid ID document (Passport, Driving License)' },
    { type: 'Address Proof', description: 'Recent utility bill or bank statement' },
    { type: 'Medical Certificate', description: 'Recent medical certificate if applicable' },
    { type: 'Marriage Certificate', description: 'Marriage certificate if applicable' },
  ];

  // Mock documents (you might want to add a documents table to Supabase later)
  const documents = [
    { name: 'ID Document.pdf', uploadDate: '2024-03-01', type: 'Identification' },
    { name: 'Proof of Address.pdf', uploadDate: '2024-02-15', type: 'Address Proof' },
  ];

  if (memberLoading || paymentsLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const filteredPayments = paymentsData?.filter(payment => {
    const matchesDate = searchDate ? payment.date.includes(searchDate) : true;
    const matchesAmount = searchAmount ? payment.amount.includes(searchAmount) : true;
    return matchesDate && matchesAmount;
  }) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        Member Profile
      </h1>

      <div className="space-y-6">
        <AccountSettingsSection memberData={memberData} />
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