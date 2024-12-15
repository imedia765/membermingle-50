import { useState } from "react";
import { FinanceHeader } from "@/components/finance/FinanceHeader";
import { FinanceStats } from "@/components/finance/FinanceStats";
import { FinanceTabs } from "@/components/finance/FinanceTabs";

export default function Finance() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <FinanceHeader />
      <FinanceStats />
      <FinanceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}