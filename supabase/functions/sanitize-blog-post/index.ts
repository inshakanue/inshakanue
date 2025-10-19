import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Allowlist of safe HTML tags and attributes
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "code", "a", "img", "span", "div"
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  "a": ["href", "title", "target", "rel"],
  "img": ["src", "alt", "title", "width", "height"],
  "span": ["style"],
  "div": ["style"],
  "p": ["style"],
  "code": ["class"],
  "pre": ["class"]
};

const ALLOWED_STYLES = [
  "color", "background-color", "font-size", "font-weight", "text-align",
  "text-decoration", "font-style"
];

function sanitizeHTML(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc || !doc.body) return "";

    sanitizeNode(doc.body);
    return doc.body.innerHTML;
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    return "";
  }
}

function sanitizeNode(node: Element | any) {
  const nodesToRemove: any[] = [];

  // Process all child nodes
  const children = Array.from(node.childNodes || []);
  for (const child of children) {
    const childNode = child as any;
    if (childNode.nodeType === 1) { // Element node
      const element = childNode as Element;
      const tagName = element.tagName.toLowerCase();

      // Remove disallowed tags
      if (!ALLOWED_TAGS.includes(tagName)) {
        nodesToRemove.push(element);
        continue;
      }

      // Sanitize attributes
      const attributes = Array.from(element.attributes || []);
      for (const attr of attributes) {
        const attrName = attr.name.toLowerCase();
        const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];

        if (!allowedAttrs.includes(attrName)) {
          element.removeAttribute(attr.name);
        } else if (attrName === "href") {
          // Validate URLs - only allow http, https, and mailto
          const href = attr.value;
          if (!href.match(/^(https?:\/\/|mailto:)/i)) {
            element.removeAttribute("href");
          }
        } else if (attrName === "src") {
          // Validate image sources - only allow http and https
          const src = attr.value;
          if (!src.match(/^https?:\/\//i)) {
            element.removeAttribute("src");
          }
        } else if (attrName === "style") {
          // Sanitize inline styles
          const sanitizedStyle = sanitizeStyle(attr.value);
          if (sanitizedStyle) {
            element.setAttribute("style", sanitizedStyle);
          } else {
            element.removeAttribute("style");
          }
        }
      }

      // Recursively sanitize children
      sanitizeNode(element);
    }
  }

  // Remove disallowed nodes
  for (const nodeToRemove of nodesToRemove) {
    nodeToRemove.parentNode?.removeChild(nodeToRemove);
  }
}

function sanitizeStyle(styleString: string): string {
  const styles = styleString.split(";").map(s => s.trim()).filter(Boolean);
  const sanitized: string[] = [];

  for (const style of styles) {
    const [property, value] = style.split(":").map(s => s.trim());
    if (property && value && ALLOWED_STYLES.includes(property.toLowerCase())) {
      // Basic validation - reject if contains javascript or suspicious patterns
      if (!value.match(/(javascript|expression|import|@import)/i)) {
        sanitized.push(`${property}: ${value}`);
      }
    }
  }

  return sanitized.join("; ");
}

interface BlogPostRequest {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author_name: string;
  published: boolean;
  tags?: string[];
  reading_time_minutes?: number;
  id?: string; // For updates
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const postData: BlogPostRequest = await req.json();

    // Sanitize HTML content
    const sanitizedContent = sanitizeHTML(postData.content);
    
    // Sanitize excerpt if present
    const sanitizedExcerpt = postData.excerpt 
      ? sanitizeHTML(postData.excerpt) 
      : postData.excerpt;

    // Validate required fields
    if (!postData.title || !sanitizedContent) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate slug if not provided
    const slug = postData.slug || postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Calculate reading time (average 200 words per minute)
    const wordCount = sanitizedContent.replace(/<[^>]*>/g, " ").split(/\s+/).length;
    const reading_time = Math.max(1, Math.ceil(wordCount / 200));

    const sanitizedPostData = {
      title: postData.title,
      slug,
      excerpt: sanitizedExcerpt,
      content: sanitizedContent,
      cover_image: postData.cover_image,
      author_name: postData.author_name,
      published: postData.published,
      tags: postData.tags || [],
      reading_time_minutes: reading_time,
    };

    let result;
    
    if (postData.id) {
      // Update existing post
      const { data, error } = await supabaseClient
        .from("blog_posts")
        .update(sanitizedPostData)
        .eq("id", postData.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new post
      const { data, error } = await supabaseClient
        .from("blog_posts")
        .insert([sanitizedPostData])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    console.log(`Blog post ${postData.id ? "updated" : "created"} successfully:`, result.id);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in sanitize-blog-post function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
