# Insha Kanue - Product Manager Portfolio

A modern, responsive portfolio website showcasing professional experience, skills, and blog content. Built with React and powered by Lovable Cloud for seamless backend functionality.

## 🌟 Features

- **Interactive Portfolio**: Comprehensive showcase of experience, skills, and projects
- **Blog Platform**: Full-featured blog with admin panel, rich text editing, and tag-based filtering
- **Contact System**: Integrated contact form with email notifications via Resend API
- **Authentication**: Secure admin authentication for blog management
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **SEO Optimized**: Structured data, meta tags, and semantic HTML for better search visibility
- **Performance Monitoring**: Built-in analytics and performance tracking

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautifully designed component library
- **React Router** - Client-side routing
- **React Hook Form** - Performant form validation
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching

### Backend (Lovable Cloud)
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Database-level security policies
- **Edge Functions** - Serverless functions for contact form and blog sanitization
- **Storage** - Private file storage for blog cover images

### Development & Testing
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The `.env` file contains public Supabase credentials (automatically configured):
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
   VITE_SUPABASE_PROJECT_ID=<your-project-id>
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open [http://localhost:8080](http://localhost:8080) in your browser

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run unit tests with Vitest
- `npm run test:ui` - Open Vitest UI
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
├── public/                      # Static assets
│   ├── Insha_Kanue_Resume.pdf  # Downloadable resume
│   ├── robots.txt              # SEO crawler instructions
│   └── sitemap.xml             # SEO sitemap
├── src/
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── About.tsx          # About section
│   │   ├── Contact.tsx        # Contact form
│   │   ├── Experience.tsx     # Work experience
│   │   ├── Hero.tsx           # Hero section
│   │   ├── Skills.tsx         # Skills showcase
│   │   └── ...                # Other components
│   ├── pages/                  # Page components
│   │   ├── Index.tsx          # Home page
│   │   ├── Blog.tsx           # Blog listing
│   │   ├── BlogPost.tsx       # Individual blog post
│   │   ├── BlogAdmin.tsx      # Blog admin panel
│   │   └── Auth.tsx           # Authentication page
│   ├── hooks/                  # Custom React hooks
│   ├── integrations/           # Third-party integrations
│   │   └── supabase/          # Supabase client & types
│   ├── utils/                  # Utility functions
│   └── App.tsx                # Main app component
├── supabase/
│   ├── functions/             # Edge functions
│   │   ├── send-contact-email/    # Contact form handler
│   │   └── sanitize-blog-post/    # Blog content sanitizer
│   └── config.toml            # Supabase configuration
├── tests/
│   └── e2e/                   # Playwright tests
└── ...config files
```

## 🔐 Security

- **Row Level Security (RLS)**: All database tables protected with RLS policies
- **Authentication**: Secure admin authentication for blog management
- **Input Validation**: Client and server-side validation for all forms
- **Sanitization**: HTML content sanitized to prevent XSS attacks
- **Rate Limiting**: Contact form protected against spam
- **Encrypted Secrets**: API keys stored as encrypted environment variables

## 🎨 Design System

The project uses a semantic token-based design system defined in:
- `src/index.css` - CSS custom properties and global styles
- `tailwind.config.ts` - Tailwind theme configuration

All components use semantic color tokens (e.g., `--primary`, `--background`, `--foreground`) instead of hardcoded colors for consistent theming and easy customization.

## 📝 Blog Features

- **Rich Text Editor**: React Quill with custom toolbar
- **Image Upload**: Cover images stored in private Supabase storage
- **Tag System**: Organize posts with multiple tags
- **Draft Mode**: Save posts as drafts before publishing
- **Admin Panel**: Secure interface for creating and editing posts
- **Reading Time**: Automatically calculated based on content
- **Social Sharing**: Built-in social media sharing buttons

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

Test coverage includes:
- Component rendering
- User interactions
- Authentication flows
- Blog operations
- Form submissions
- Protected routes

## 📄 License

This project is private and proprietary.

## 👤 Author

**Insha Kanue**
- Product Manager

---

Built with ❤️ using [Lovable](https://lovable.dev)
