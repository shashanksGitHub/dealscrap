import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { BlogPost } from "@shared/schema";
import { formatDistance } from "date-fns";
import { de } from "date-fns/locale";

export default function BlogPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  if (isLoading) {
    return <div>Lade Blog-Beiträge...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        {user && (
          <Button onClick={() => window.location.href = '/blog/new'}>
            Neuen Beitrag erstellen
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {posts?.map((post) => (
          <Card key={post.id} className="p-6">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-muted-foreground mb-4">
              {formatDistance(new Date(post.createdAt!), new Date(), {
                addSuffix: true,
                locale: de,
              })}
            </p>
            <p className="line-clamp-3">{post.content}</p>
            <Button
              variant="link"
              className="mt-4"
              onClick={() => window.location.href = `/blog/${post.id}`}
            >
              Weiterlesen
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}