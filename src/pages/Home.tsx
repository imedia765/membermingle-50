import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Welcome to PWA Burton</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your trusted platform for managing member services and support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}