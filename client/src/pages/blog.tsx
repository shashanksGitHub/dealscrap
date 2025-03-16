import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { BlogPost } from "@shared/schema";
import { formatDistance } from "date-fns";
import { de } from "date-fns/locale";
import { Link } from "wouter";
import { ArrowLeftIcon, PlusIcon, BookOpenIcon } from "lucide-react";
import { Footer } from "@/components/layout/footer";

export default function BlogPage() {
  const { user } = useAuth();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 pt-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto text-center">
          <BookOpenIcon className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Ratgeber für Leadgenerierung</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Erfahren Sie mehr über Lead-Generierung, Vertriebsstrategien und wie Sie Ihr Business erfolgreich ausbauen können
          </p>
          <Link href="/auth">
            <Button size="lg" className="rounded-full px-6 py-5 h-auto text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 animate-[pulse_3s_ease-in-out_infinite] hover:animate-none">
              Kostenloses Konto erstellen
            </Button>
          </Link>
        </div>
      </section>

      <main className="container mx-auto py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Aktuelle Beiträge</h2>
            <p className="text-lg text-muted-foreground">
              Die neuesten Insights und Strategien für Ihren Geschäftserfolg
            </p>
          </div>
          {user && (
            <Link href="/blog/new">
              <Button className="rounded-lg">
                <PlusIcon className="h-5 w-5 mr-2" />
                Neuen Beitrag erstellen
              </Button>
            </Link>
          )}
        </div>

        {posts?.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Noch keine Blog-Beiträge vorhanden.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        Lead-Generierung
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDistance(new Date(post.createdAt!), new Date(), {
                        addSuffix: true,
                        locale: de,
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-muted-foreground">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                      Weiterlesen
                      <ArrowLeftIcon className="h-4 w-4 rotate-180" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}