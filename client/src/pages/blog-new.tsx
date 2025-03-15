import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { NavHeader } from "@/components/layout/nav-header";
import { Footer } from "@/components/layout/footer";

export default function NewBlogPost() {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: user?.id
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create blog post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Erfolg!",
        description: "Ihr Ratgeber-Beitrag wurde erfolgreich erstellt.",
      });
      window.location.href = '/blog';
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Beitrag konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: any) {
    mutation.mutate(data);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container mx-auto py-8">
          <div className="text-center">Bitte melden Sie sich an, um einen Ratgeber-Beitrag zu erstellen.</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Neuen Ratgeber-Beitrag erstellen</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inhalt</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[200px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Wird erstellt..." : "Beitrag erstellen"}
            </Button>
          </form>
        </Form>
      </div>
      <Footer />
    </div>
  );
}