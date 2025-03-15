import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <AlertCircle className="h-12 w-12 text-primary" />
            <h1 className="text-2xl font-bold">404 - Seite nicht gefunden</h1>
            <p className="text-muted-foreground">
              Die von Ihnen gesuchte Seite konnte leider nicht gefunden werden.
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                Zurück zur Startseite
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}