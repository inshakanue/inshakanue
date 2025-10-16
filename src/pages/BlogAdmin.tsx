import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateReadingTime, suggestTags } from "@/utils/internalLinking";

const BlogAdmin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    author_name: "Insha Kanue",
    published: false,
    tags: [] as string[],
    reading_time_minutes: 5,
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the blog admin.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        if (import.meta.env.DEV) {
          console.error("Error checking admin role:", roleError);
        }
      }

      if (!roleData) {
        toast({
          title: "Access denied",
          description: "You don't have admin privileges to access this page.",
          variant: "destructive",
        });
        navigate("/blog");
        return;
      }

      setIsAdmin(true);
      setAuthLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    if (editId && isAdmin) {
      fetchPost();
    }
  }, [editId, isAdmin]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", editId)
        .single();

      if (error) throw error;
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content,
        cover_image: data.cover_image || "",
        author_name: data.author_name,
        published: data.published,
        tags: data.tags || [],
        reading_time_minutes: data.reading_time_minutes || 5,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching post:", error);
      }
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      const reading_time = formData.content ? calculateReadingTime(formData.content) : formData.reading_time_minutes;
      
      const postData = { 
        ...formData, 
        slug,
        reading_time_minutes: reading_time 
      };
      
      if (editId) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editId);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([postData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      navigate("/blog");
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("Error saving post:", error);
      }
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const handleSuggestTags = () => {
    const suggested = suggestTags(formData.content, formData.title);
    const newTags = suggested.filter(tag => !formData.tags.includes(tag));
    setFormData({ ...formData, tags: [...formData.tags, ...newTags] });
  };

  const handleDelete = async () => {
    if (!editId) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", editId);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      navigate("/blog");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error deleting post:", error);
      }
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-custom">
            <div className="flex justify-center items-center min-h-[50vh]">
              <p>Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-3xl">
                  {editId ? "Edit" : "Create New"} Blog Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      placeholder="Enter post title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug (auto-generated if left empty)
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="post-url-slug"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="Brief description of the post"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                      placeholder="Write your post content here..."
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_image">Cover Image URL</Label>
                    <Input
                      id="cover_image"
                      type="url"
                      value={formData.cover_image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cover_image: e.target.value,
                        })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tags">Tags</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={handleSuggestTags}
                      >
                        Suggest Tags
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add a tag and press Enter"
                      />
                      <Button 
                        type="button" 
                        onClick={addTag}
                        size="icon"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button 
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                    <Input
                      id="reading_time"
                      type="number"
                      min="1"
                      value={formData.reading_time_minutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reading_time_minutes: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Auto-calculated on save: {calculateReadingTime(formData.content)} min
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, published: checked })
                      }
                    />
                    <Label htmlFor="published">Publish post</Label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : editId ? "Update Post" : "Create Post"}
                    </Button>
                    {editId && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogAdmin;
