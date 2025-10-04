import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface TagWithCount {
  tag: string;
  count: number;
}

const TagCloud = () => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('published', true);

      if (error) throw error;

      // Count tag occurrences
      const tagCount: Record<string, number> = {};
      data?.forEach((post) => {
        post.tags?.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      // Convert to array and sort by count
      const sortedTags = Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Show top 20 tags

      setTags(sortedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || tags.length === 0) return null;

  // Calculate font sizes based on tag frequency
  const maxCount = Math.max(...tags.map(t => t.count));
  const minCount = Math.min(...tags.map(t => t.count));
  
  const getFontSize = (count: number) => {
    const scale = (count - minCount) / (maxCount - minCount);
    return `${0.875 + scale * 0.5}rem`; // 0.875rem to 1.375rem
  };

  return (
    <section className="mt-12 p-6 rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Popular Topics</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
            style={{ fontSize: getFontSize(count) }}
          >
            <Badge
              variant="outline"
              className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-pointer"
            >
              {tag} ({count})
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TagCloud;
