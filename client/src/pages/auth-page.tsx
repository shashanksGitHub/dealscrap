import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Star, Lock, Mail, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Michael Weber",
    position: "Vertriebsleiter",
    company: "TechSolutions GmbH",
    text: "LeadScraper hat unseren Vertriebsprozess revolutioniert. Wir konnten unsere Conversion-Rate um 300% steigern."
  },
  {
    name: "Sarah Schmidt",
    position: "Marketing Director",
    company: "Digital Marketing Pro",
    text: "Die Qualität der Leads ist hervorragend. Endlich ein Tool, das hält was es verspricht."
  },
  {
    name: "Andreas Müller",
    position: "CEO",
    company: "Sales Innovation AG",
    text: "Einfach zu bedienen und extrem effektiv. Bestes Lead-Tool auf dem deutschen Markt."
  }
];

export default function AuthPage() {
  const { user } = useAuth();

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow grid md:grid-cols-2">
        <div className="flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Willkommen zurück</h1>
              <p className="text-muted-foreground">Starten Sie Ihre Lead-Generierung</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Anmelden</TabsTrigger>
                <TabsTrigger value="register">Registrieren</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center bg-muted/5 p-12 border-l">
          <div className="max-w-lg mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Über 1.000 zufriedene Kunden</h2>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm mb-3">{testimonial.text}</p>
                  <div className="text-sm">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-muted-foreground">{testimonial.position}, {testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>30 Tage Geld-zurück-Garantie</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Kostenlose Testversion verfügbar</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Persönlicher Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                placeholder="ihre@email.de"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-10"
                placeholder="••••••••"
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Anmeldung..." : "Anmelden"}
          </Button>
          <button
            type="button"
            onClick={() => window.location.href = "/reset-password"}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Passwort vergessen?
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                placeholder="ihre@email.de"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-10"
                placeholder="••••••••"
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Passwort bestätigen</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="passwordConfirm"
                type="password"
                className="pl-10"
                placeholder="••••••••"
                {...form.register("passwordConfirm")}
              />
            </div>
            {form.formState.errors.passwordConfirm && (
              <p className="text-sm text-destructive">{form.formState.errors.passwordConfirm.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Konto wird erstellt..." : "Konto erstellen"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}