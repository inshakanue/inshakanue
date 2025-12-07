/**
 * ABOUT SECTION COMPONENT
 * 
 * BUSINESS CONTEXT:
 * This is the first major content section after the hero, establishing credibility
 * and expertise. It answers the critical question: "Why should I work with this
 * AI Product Manager?" through quantified achievements and comprehensive expertise.
 * 
 * KEY BUSINESS OBJECTIVES:
 * 1. Build trust through concrete metrics (€15M+ revenue, 70% fraud reduction)
 * 2. Demonstrate breadth of experience across industries (travel, logistics, agriculture)
 * 3. Show both technical depth (ML/AI) and business acumen (revenue optimization)
 * 4. Establish thought leadership in AI Product Management
 * 
 * CONVERSION GOALS:
 * - Encourage visitors to explore Experience section for project details
 * - Build confidence for eventual contact form submission
 * - Support SEO with "AI Product Manager" keyword integration
 * 
 * CONTENT STRUCTURE:
 * 1. Header: Clear positioning as AI Product Manager
 * 2. Introduction: 3 paragraphs covering journey, achievements, and expertise
 * 3. Highlights Grid: 4 visual cards showing key metrics
 * 4. Expertise Badges: 11 core competencies for quick scanning
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Responsive grid layout (2 columns on large screens)
 * - Icon-based visual hierarchy for quick comprehension
 * - Semantic HTML with proper heading structure for SEO
 * - ARIA labels for accessibility
 * 
 * SEO OPTIMIZATION:
 * - H2/H3 tags with "AI Product Manager" keywords
 * - Natural keyword density ~2% for target phrases
 * - Structured content for potential featured snippets
 */

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Lightbulb, Target } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const About = () => {
  /**
   * HIGHLIGHTS DATA
   * Visual cards showing quantified achievements and impact.
   * Each highlight uses an icon, title, description, and color coding.
   * 
   * BUSINESS PURPOSE: Build credibility through concrete metrics
   * that resonate with hiring managers and business stakeholders.
   */
  const highlights = [{
    icon: TrendingUp,                                                        // Revenue growth visualization
    title: "Revenue Impact",
    description: "Generated €15M+ in revenue through data-driven product strategies",
    color: "text-success"                                                   // Green = positive financial impact
  }, {
    icon: Users,                                                             // Leadership visualization
    title: "Team Leadership",
    description: "Led cross-functional teams across multiple time zones and cultures",
    color: "text-primary"                                                   // Brand color for key strength
  }, {
    icon: Lightbulb,                                                        // Innovation visualization
    title: "Product launches",
    description: "Shipped 10+ AI and ML products from concept to market",
    color: "text-accent"                                                    // Accent for creative work
  }, {
    icon: Target,                                                           // Precision/optimization visualization
    title: "Optimization",
    description: "Achieved 96.7% optimization in lead generation and 70% fraud reduction",
    color: "text-primary-light"                                             // Lighter variant for variety
  }];

  /**
   * EXPERTISE PILLS DATA
   * Core competencies displayed as animated floating pills for visual engagement.
   * 
   * ANIMATION STRATEGY:
   * - Each pill has a rotation value (-12 to +12 degrees) for diagonal stacking
   * - Alternating colors (primary purple and dark charcoal) create visual rhythm
   * - Staggered animation delays create wave effect
   * - Pills positioned strategically for left-to-right, top-to-bottom flow
   * 
   * ACCESSIBILITY:
   * - prefers-reduced-motion media query disables animations for users who need it
   * - Semantic HTML with proper list structure maintained
   * - High contrast text on both background colors (WCAG AA compliant)
   * 
   * PERFORMANCE:
   * - CSS animations (GPU-accelerated) instead of JavaScript
   * - Transform and opacity only (no layout reflows)
   * - will-change hints for smooth rendering
   */
  const initialPills = [
    { text: "AI Product Strategy & Roadmapping", rotation: -8, top: "0%", left: "2%" },
    { text: "Data Strategy & Governance", rotation: 6, top: "0%", left: "52%" },
    { text: "LLM Integration & Prompt Engineering", rotation: -4, top: "18%", left: "8%" },
    { text: "ML Lifecycle & MLOps", rotation: 10, top: "18%", left: "60%" },
    { text: "Experimentation & A/B Testing", rotation: -6, top: "36%", left: "0%" },
    { text: "Product Analytics & Measurement", rotation: 7, top: "36%", left: "28%" },
    { text: "Responsible AI & Ethics", rotation: -10, top: "36%", left: "55%" },
    { text: "Market Research and Validation", rotation: 5, top: "54%", left: "10%" },
    { text: "Cross-functional Team Leadership", rotation: -7, top: "54%", left: "58%" },
    { text: "Revenue Optimization", rotation: 9, top: "72%", left: "5%" },
    { text: "Stakeholder Management", rotation: -5, top: "72%", left: "62%" },
  ];

  const [pills, setPills] = useState(initialPills.map((pill, index) => {
    return {
      ...pill,
      id: index,
      x: Math.random() * 400, // Random initial x position (wider spread)
      y: -50 - (index * 15), // Start just above visible area, staggered
      vx: (Math.random() - 0.5) * 3,
      vy: 0,
    };
  }));

  const [draggingPill, setDraggingPill] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [animationPhase, setAnimationPhase] = useState<'falling' | 'floating'>('falling');
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const animationFrame = useRef<number>();
  const startTime = useRef<number>(0);
  const containerDimensions = useRef({ width: 0, height: 0 });

  // Update container dimensions cache
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        containerDimensions.current = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        };
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            startTime.current = Date.now();
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of section is visible (earlier trigger)
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasStarted]);

  // Check for collision between two pills
  const checkCollision = (pill1: any, pill2: any) => {
    const dx = pill1.x - pill2.x;
    const dy = pill1.y - pill2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = 180; // Minimum distance between pill centers
    return distance < minDistance;
  };

  // Physics animation loop with falling and floating phases
  useEffect(() => {
    if (!hasStarted) return; // Don't animate until section is visible

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      
      // Switch to floating phase after 2 seconds (longer falling phase)
      if (elapsed > 2000 && animationPhase === 'falling') {
        setAnimationPhase('floating');
      }

      setPills(prevPills => {
        return prevPills.map((pill, index) => {
          if (pill.id === draggingPill) return pill;
          
          // Use cached dimensions instead of reading from DOM
          const maxX = containerDimensions.current.width - 320;
          const maxY = containerDimensions.current.height - 50;
          
          let newVx = pill.vx;
          let newVy = pill.vy;
          let newX = pill.x;
          let newY = pill.y;
          
          if (animationPhase === 'falling') {
            // Falling phase: gravity and landing with collision detection
            const gravity = 0.8;
            newVy += gravity;
            
            // Air resistance
            newVx *= 0.98;
            newVy *= 0.98;
            
            // Apply velocity
            newX = pill.x + newVx;
            newY = pill.y + newVy;
            
            // Collision detection with other pills during falling
            const separationForce = 1.5;
            prevPills.forEach((otherPill) => {
              if (otherPill.id !== pill.id && otherPill.id !== draggingPill) {
                if (checkCollision(pill, otherPill)) {
                  const dx = pill.x - otherPill.x;
                  const dy = pill.y - otherPill.y;
                  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                  
                  // Push away from each other
                  newVx += (dx / distance) * separationForce;
                  newVy += (dy / distance) * separationForce * 0.5; // Less vertical separation
                }
              }
            });
            
            // Floor collision with bounce
            if (newY >= maxY) {
              newY = maxY;
              newVy = -newVy * 0.4; // Small bounce
              newVx *= 0.8; // Friction
            }
            
            // Top boundary - prevent going above container
            if (newY < 0) {
              newY = 0;
              newVy = Math.abs(newVy) * 0.3;
            }
            
            // Wall collisions - clamp position
            newX = Math.max(0, Math.min(newX, maxX));
            if (newX <= 0 || newX >= maxX) {
              newVx = -newVx * 0.5;
            }
          } else {
            // Floating phase: gentle floating motion with collision avoidance
            const floatStrength = 0.15;
            const separationForce = 0.8;
            
            // Add gentle upward force to lift pills from bottom
            if (pill.y > maxY * 0.7) {
              newVy -= 0.3;
            }
            
            // Floating force - gentle sine wave motion
            const time = Date.now() / 1000;
            const floatX = Math.sin(time * 0.5 + index * 0.5) * floatStrength;
            const floatY = Math.cos(time * 0.3 + index * 0.3) * floatStrength;
            
            newVx += floatX;
            newVy += floatY;
            
            // Collision detection and separation
            prevPills.forEach((otherPill) => {
              if (otherPill.id !== pill.id && otherPill.id !== draggingPill) {
                if (checkCollision(pill, otherPill)) {
                  const dx = pill.x - otherPill.x;
                  const dy = pill.y - otherPill.y;
                  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                  
                  // Push away from each other
                  newVx += (dx / distance) * separationForce;
                  newVy += (dy / distance) * separationForce;
                }
              }
            });
            
            // Gentle damping
            newVx *= 0.95;
            newVy *= 0.95;
            
            // Apply velocity
            newX = pill.x + newVx;
            newY = pill.y + newVy;
            
            // Boundary constraints - clamp position strictly
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            // Gentle bounce at boundaries
            if (newX <= 0 || newX >= maxX) {
              newVx = -newVx * 0.5;
            }
            if (newY <= 0 || newY >= maxY) {
              newVy = -newVy * 0.5;
            }
          }
          
          return { ...pill, x: newX, y: newY, vx: newVx, vy: newVy };
        });
      });
      
      animationFrame.current = requestAnimationFrame(animate);
    };
    
    animationFrame.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [draggingPill, animationPhase, hasStarted]);

  const handleMouseDown = (e: React.MouseEvent, pillId: number) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;
    
    const pill = pills.find(p => p.id === pillId);
    if (!pill) return;
    
    setDragOffset({
      x: e.clientX - (pill.x || 0) - container.left,
      y: e.clientY - (pill.y || 0) - container.top,
    });
    setDraggingPill(pillId);
    lastMousePos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingPill === null) return;

    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    let newX = e.clientX - container.left - dragOffset.x;
    let newY = e.clientY - container.top - dragOffset.y;

    // Constrain to container boundaries using cached dimensions
    const maxX = containerDimensions.current.width - 320;
    const maxY = containerDimensions.current.height - 50;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    // Track velocity for momentum
    const now = Date.now();
    const dt = (now - lastMousePos.current.time) || 1;
    const vx = (e.clientX - lastMousePos.current.x) / dt * 16;
    const vy = (e.clientY - lastMousePos.current.y) / dt * 16;
    
    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

    setPills(pills.map(p =>
      p.id === draggingPill
        ? { ...p, x: newX, y: newY, vx, vy }
        : p
    ));
  };

  const handleMouseUp = () => {
    setDraggingPill(null);
  };

  const handleTouchStart = (e: React.TouchEvent, pillId: number) => {
    const touch = e.touches[0];
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;
    
    const pill = pills.find(p => p.id === pillId);
    if (!pill) return;
    
    setDragOffset({
      x: touch.clientX - (pill.x || 0) - container.left,
      y: touch.clientY - (pill.y || 0) - container.top,
    });
    setDraggingPill(pillId);
    lastMousePos.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingPill === null) return;
    e.preventDefault();

    const touch = e.touches[0];
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    let newX = touch.clientX - container.left - dragOffset.x;
    let newY = touch.clientY - container.top - dragOffset.y;

    // Constrain to container boundaries using cached dimensions
    const maxX = containerDimensions.current.width - 320;
    const maxY = containerDimensions.current.height - 50;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    const now = Date.now();
    const dt = (now - lastMousePos.current.time) || 1;
    const vx = (touch.clientX - lastMousePos.current.x) / dt * 16;
    const vy = (touch.clientY - lastMousePos.current.y) / dt * 16;
    
    lastMousePos.current = { x: touch.clientX, y: touch.clientY, time: now };

    setPills(pills.map(p =>
      p.id === draggingPill
        ? { ...p, x: newX, y: newY, vx, vy }
        : p
    ));
  };
  return <section id="about" ref={sectionRef} className="section-padding" aria-labelledby="about-heading">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <header className="text-center mb-16">
            <h2 id="about-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">AI Product Manager with 8+ years building machine learning products. I have shipped data platforms, fraud detection systems, and recommendation engines that generated €15M+ in revenue. As an AI Product Manager, I bridge data science and business, turning ML models into products that scale across FinTech, travel tech, logistics, agriculture, and knowledge management.</p>
          </header>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <article className="slide-in-left">
              <h3 className="text-2xl font-bold mb-6 text-foreground">AI Product Manager Building Machine Learning Products That Scale</h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  As an AI Product Manager with 7 years of experience, I have built and launched machine learning 
                  products from concept to production. My work includes AI-powered data platforms, fraud detection 
                  systems using ML algorithms, sentiment analysis tools, and recommendation engines. At HRS Group, 
                  I launched Datahub, an AI data ingestion platform that reduced onboarding time by 40% and enabled 
                  AI features generating 15% revenue growth.
                </p>
                <p className="text-lg leading-relaxed">My journey as an AI Product Manager began as a developer, then founding an IoT startup using predictive analytics and machine learning. Now I lead AI/ML product strategy at HRS Group where my AI products have generated €15M+ in revenue with measurable impact: 70% fraud reduction, 96.7% optimization in lead generation, and 95% operational improvements through AI automation.</p>
                <p className="text-lg leading-relaxed">As an AI Product Manager, I collaborate with data scientists, ML engineers, and business stakeholders to transform machine learning models into scalable products. My AI product management experience spans travel technology, logistics, agriculture, and knowledge management. The key to successful AI Product Management is converting technical ML capabilities into products that deliver business value and revenue growth.</p>
              </div>
            </article>

            {/* Highlights Grid */}
            <div className="slide-in-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {highlights.map((highlight, index) => <Card key={index} className="card-elevated">
                    <CardContent className="p-6 text-center">
                      <highlight.icon className={`w-8 h-8 mx-auto mb-4 ${highlight.color}`} />
                      <h4 className="font-semibold mb-2 text-foreground">{highlight.title}</h4>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </div>

          {/* Animated Expertise Pills Section */}
          <aside ref={sectionRef} className="fade-in-up mt-20" aria-labelledby="expertise-heading" aria-label="Animated core expertise showcase">
            <h3 id="expertise-heading" className="text-2xl font-bold text-center mb-16">Core Expertise</h3>
            
            {/* Desktop: Stacked floating pills layout */}
            <div 
              ref={containerRef}
              className="hidden md:block relative mx-auto overflow-hidden border-2 border-transparent" 
              style={{ height: 'min(450px, 65vh)', maxWidth: '1400px', width: '100%' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {pills.map((pill, index) => (
                <div
                  key={pill.id}
                  className={`
                    absolute expertise-pill cursor-grab active:cursor-grabbing
                    ${index % 2 === 0 
                      ? 'bg-primary text-[hsl(var(--primary-foreground))]'
                      : 'bg-[hsl(var(--pill-dark))] text-[hsl(var(--pill-dark-foreground))]'}
                    font-bold text-[0.8rem] md:text-sm lg:text-base
                    px-5 py-3.5 rounded-full
                    shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25),0_0_30px_rgba(0,0,0,0.15)]
                    hover:scale-105 transition-all duration-200
                    will-change-transform select-none touch-none
                    ${draggingPill === pill.id ? 'shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4),0_0_50px_rgba(0,0,0,0.25)]' : ''}
                  `}
                  style={{
                    top: `${pill.y}px`,
                    left: `${pill.x}px`,
                    transform: `rotate(${pill.rotation}deg) ${draggingPill === pill.id ? 'scale(1.08)' : ''}`,
                    zIndex: draggingPill === pill.id ? 1000 : index + 1,
                    maxWidth: '320px',
                    '--rotation': `${pill.rotation}deg`,
                    position: 'absolute',
                    transition: draggingPill === pill.id ? 'none' : 'none',
                  } as React.CSSProperties & { '--rotation': string }}
                  onMouseDown={(e) => handleMouseDown(e, pill.id)}
                  onTouchStart={(e) => handleTouchStart(e, pill.id)}
                >
                  {pill.text}
                </div>
              ))}
            </div>

            {/* Mobile: Simple vertical list with minimal rotation */}
            <ul className="md:hidden flex flex-col items-center gap-4 list-none px-4">
              {pills.map((pill, index) => (
                <li
                  key={index}
                  className={`
                    ${index % 2 === 0 
                      ? 'bg-primary text-[hsl(var(--primary-foreground))]'
                      : 'bg-[hsl(var(--pill-dark))] text-[hsl(var(--pill-dark-foreground))]'}
                    font-bold text-sm
                    px-6 py-3 rounded-full
                    shadow-lg
                    animate-float-gentle
                    w-full max-w-sm text-center
                  `}
                  style={{
                    transform: `rotate(${pill.rotation * 0.3}deg)`,
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  {pill.text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>;
};
export default About;