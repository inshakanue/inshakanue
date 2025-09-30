import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
  honeypot?: string;
}

// Rate limit configuration
const RATE_LIMITS = {
  PER_EMAIL: { count: 3, window: 60 * 60 * 1000 }, // 3 per hour
  PER_IP: { count: 5, window: 60 * 60 * 1000 }, // 5 per hour
  GLOBAL: { count: 100, window: 60 * 60 * 1000 }, // 100 per hour
};

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, inquiryType, subject, message, honeypot }: ContactEmailRequest = await req.json();

    // Bot detection - honeypot field should be empty
    if (honeypot && honeypot.length > 0) {
      console.log("Bot detected via honeypot:", email);
      return new Response(
        JSON.stringify({ error: "Invalid submission" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get IP address and user agent for rate limiting
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseClient = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = supabaseClient.createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limits
    const now = new Date();
    const hourAgo = new Date(now.getTime() - RATE_LIMITS.PER_EMAIL.window);

    // Check per-email rate limit
    const { data: emailSubmissions, error: emailError } = await supabase
      .from("contact_form_submissions")
      .select("id")
      .eq("email", email)
      .gte("created_at", hourAgo.toISOString());

    if (emailError) {
      console.error("Error checking email rate limit:", emailError);
    } else if (emailSubmissions && emailSubmissions.length >= RATE_LIMITS.PER_EMAIL.count) {
      console.log("Rate limit exceeded for email:", email);
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. You can submit up to 3 messages per hour. Please try again later or contact me directly at inshakanue@protonmail.com" 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check per-IP rate limit
    if (ipAddress !== "unknown") {
      const { data: ipSubmissions, error: ipError } = await supabase
        .from("contact_form_submissions")
        .select("id")
        .eq("ip_address", ipAddress)
        .gte("created_at", hourAgo.toISOString());

      if (ipError) {
        console.error("Error checking IP rate limit:", ipError);
      } else if (ipSubmissions && ipSubmissions.length >= RATE_LIMITS.PER_IP.count) {
        console.log("Rate limit exceeded for IP:", ipAddress);
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded from your location. Please try again later or contact me directly at inshakanue@protonmail.com" 
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    // Check global rate limit
    const { data: globalSubmissions, error: globalError } = await supabase
      .from("contact_form_submissions")
      .select("id")
      .gte("created_at", hourAgo.toISOString());

    if (globalError) {
      console.error("Error checking global rate limit:", globalError);
    } else if (globalSubmissions && globalSubmissions.length >= RATE_LIMITS.GLOBAL.count) {
      console.log("Global rate limit exceeded");
      return new Response(
        JSON.stringify({ 
          error: "Service temporarily unavailable due to high volume. Please try again later or contact me directly at inshakanue@protonmail.com" 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const safeInquiryType = escapeHtml(inquiryType);

    console.log("Sending contact email from:", safeEmail, "Name:", safeName, "Inquiry Type:", safeInquiryType);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    // Send email using Resend API directly
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["inshakanue@protonmail.com"],
        reply_to: safeEmail,
        subject: `Portfolio Contact: ${safeSubject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Inquiry Type:</strong> <span style="background-color: #f3f4f6; padding: 4px 12px; border-radius: 4px; font-weight: 600;">${safeInquiryType}</span></p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <h3>Message:</h3>
          <p>${safeMessage.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(`Resend API error: ${JSON.stringify(data)}`);
    }

    console.log("Email sent successfully:", data);

    // Log successful submission to database
    const { error: insertError } = await supabase
      .from("contact_form_submissions")
      .insert({
        email: safeEmail,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: "success",
      });

    if (insertError) {
      console.error("Error logging submission:", insertError);
      // Don't fail the request if logging fails
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
