import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoticesSection } from "@/components/support/NoticesSection";
import { NoticeHistory } from "@/components/support/NoticeHistory";

export default function Support() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <NoticesSection />
          <NoticeHistory />
        </CardContent>
      </Card>
    </div>
  );
}