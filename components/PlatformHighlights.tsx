
import React from 'react';

const SERVICES = [
  { name: 'Machine Learning', icon: 'memory' },
  { name: 'Graphic Design', icon: 'palette' },
  { name: 'Web Design', icon: 'language' },
  { name: 'Data Science', icon: 'database' },
  { name: 'Business Analytics', icon: 'analytics' },
  { name: 'AI Tools', icon: 'smart_toy' },
  { name: 'Project Management', icon: 'task_alt' },
  { name: 'Cybersecurity', icon: 'security' },
  { name: 'Financial Modeling', icon: 'attach_money' },
  { name: 'Mobile Development', icon: 'smartphone' },
  { name: 'Content Creation', icon: 'auto_fix_high' },
  { name: 'E-commerce', icon: 'shopping_bag' },
];

const PlatformHighlights = () => {
  // Split services into 3 rows for the marquee effect
  const row1 = SERVICES.slice(0, 4);
  const row2 = SERVICES.slice(4, 8);
  const row3 = SERVICES.slice(8, 12);

  // Helper to render a card (reused for both mobile and desktop to ensure identical design)
  // Adjusted: Smaller padding, smaller icon size (size-10 vs size-12), smaller text (text-sm vs text-lg), tighter gap (gap-3 vs gap-4)
  const ServiceCard = ({ service }: { service: typeof SERVICES[0] }) => (
    <div className="group flex items-center gap-3 bg-white pl-1.5 pr-6 py-1.5 rounded-full border border-blue-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.15)] hover:border-blue-200 transition-all duration-300 cursor-default flex-shrink-0">
        <div className="size-10 rounded-full bg-[#eff6ff] group-hover:bg-[#dbeafe] flex items-center justify-center text-blue-600 transition-colors duration-300">
            <span className="material-symbols-outlined text-[20px]">{service.icon}</span>
        </div>
        <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 whitespace-nowrap tracking-tight">
            {service.name}
        </span>
    </div>
  );

  return (
    <section className="py-20 px-4 md:px-8 bg-[#080B14]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Main Card Container */}
        <div className="relative w-full rounded-[40px] overflow-hidden bg-gradient-to-b from-[#E0F2FE] via-[#F0F9FF] to-white border border-white/20 shadow-2xl p-8 md:p-12">
          
          {/* Background Decor - Subtle Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-30" 
               style={{ 
                   backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', 
                   backgroundSize: '50px 50px',
                   maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
               }}>
          </div>

          {/* Background Decor - Top Waves/Glows */}
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-400/10 to-transparent pointer-events-none"></div>
          <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
          
          {/* Curved Header Shape (SVG) */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none opacity-40">
             <svg className="relative block w-full h-[150px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                 <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#bae6fd"></path>
             </svg>
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col items-center w-full">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
                <span className="material-symbols-outlined text-blue-500 text-[18px]">radar</span>
                <span className="text-xs font-bold text-slate-600 tracking-wide">What’s Inside</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#0F172A] text-center mb-10 tracking-tight drop-shadow-sm">
                Platform Highlights
            </h2>

            {/* MOBILE LAYOUT: Static Grid (Hidden on md+) */}
            <div className="flex flex-wrap justify-center gap-3 md:hidden max-w-6xl w-full">
                {SERVICES.map((service, index) => (
                    <ServiceCard key={index} service={service} />
                ))}
            </div>

            {/* DESKTOP LAYOUT: Auto-Sliding Rows (Hidden on sm) */}
            {/* Adjusted gap-8 to gap-5 for tighter vertical spacing */}
            <div className="hidden md:flex flex-col gap-5 w-full overflow-hidden mask-fade-edges py-2">
                
                {/* Row 1: Left -> Right (Very Slow) */}
                {/* Adjusted gap-6 to gap-4 for tighter horizontal spacing */}
                <div className="flex gap-4 w-max animate-marquee-right">
                    {/* Duplicating content 4 times to ensure seamless loop on wide screens */}
                    {[...row1, ...row1, ...row1, ...row1].map((service, i) => (
                        <ServiceCard key={`r1-${i}`} service={service} />
                    ))}
                </div>

                {/* Row 2: Right -> Left (Medium Slow) */}
                <div className="flex gap-4 w-max animate-marquee-left">
                    {[...row2, ...row2, ...row2, ...row2].map((service, i) => (
                        <ServiceCard key={`r2-${i}`} service={service} />
                    ))}
                </div>

                {/* Row 3: Left -> Right (Slowest) */}
                <div className="flex gap-4 w-max animate-marquee-slow-right">
                    {[...row3, ...row3, ...row3, ...row3].map((service, i) => (
                        <ServiceCard key={`r3-${i}`} service={service} />
                    ))}
                </div>

            </div>

          </div>
        </div>
      </div>

      <style>{`
        /* Soft fade mask for floating conveyor effect */
        .mask-fade-edges {
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        /* Seamless Loop Logic: Move by exactly 25% because we duplicated the list 4 times. */
        @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
        }

        @keyframes marquee-right {
            0% { transform: translateX(-25%); }
            100% { transform: translateX(0); }
        }

        .animate-marquee-left {
            animation: marquee-left 25s linear infinite;
        }

        .animate-marquee-right {
            animation: marquee-right 30s linear infinite;
        }

        .animate-marquee-slow-right {
            animation: marquee-right 40s linear infinite;
        }
        
        /* Optional: Smooth hover pause for better readability if user wants to click */
        .group:hover .animate-marquee-left,
        .group:hover .animate-marquee-right,
        .group:hover .animate-marquee-slow-right {
            animation-play-state: paused;
        }
        
        /* Keywords: smooth marquee, infinite loop, edge fade mask, horizontal conveyor animation, premium SaaS motion */
      `}</style>
    </section>
  );
};

export default PlatformHighlights;
