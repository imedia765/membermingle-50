import { FinanceHeader } from "@/components/finance/FinanceHeader";
import { FinanceStats } from "@/components/finance/FinanceStats";
import { FinanceTabs } from "@/components/finance/FinanceTabs";

export default function Finance() {
  return (
    <div className="space-y-6">
      <FinanceHeader />
      <FinanceStats />
      <FinanceTabs />
    </div>
  );
}