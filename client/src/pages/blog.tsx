import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { BlogPost } from "@shared/schema";
import { formatDistance } from "date-fns";
import { de } from "date-fns/locale";
import { Link } from "wouter";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

export default function BlogPage() {
  const { user } = useAuth();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <ArrowLeftIcon className="h-5 w-5" />
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Lesen Sie die neuesten Beiträge über Lead-Generierung und Vertriebsstrategien
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
            <p className="text-muted-foreground">Noch keine Blog-Beiträge vorhanden.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}