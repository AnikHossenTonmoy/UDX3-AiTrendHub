
import React from 'react';

const CommunitySection = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-[#080B14]">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Container */}
        <div className="relative w-full rounded-[40px] bg-[#05050A] border border-white/5 overflow-hidden pb-16 pt-12 md:pt-20 px-6 md:px-12 shadow-2xl">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-[#1d1b4b] opacity-40 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 opacity-30 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
          
          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)] pointer-events-none"></div>

          {/* TOP CENTER VISUAL (Connected Nodes) */}
          <div className="relative z-10 flex flex-col items-center mb-12">
            {/* Avatars Row */}
            <div className="flex gap-16 mb-4 relative">
               {/* Connecting Lines */}
               <div className="absolute top-full left-1/2 -translate-x-1/2 w-[180px] h-12 border-x border-t border-white/10 rounded-t-3xl -mb-2"></div>
               <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-white/10 to-blue-500/50"></div>

               <img src="https://i.pravatar.cc/100?img=5" alt="User" className="size-10 rounded-full border-2 border-[#05050A] relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
               <img src="https://i.pravatar.cc/100?img=9" alt="User" className="size-10 rounded-full border-2 border-[#05050A] relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)] -mt-6" />
               <img src="https://i.pravatar.cc/100?img=3" alt="User" className="size-10 rounded-full border-2 border-[#05050A] relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            </div>
            
            {/* More Avatars (Lower) */}
            <div className="flex gap-24 mb-2 relative">
               <img src="https://i.pravatar.cc/100?img=1" alt="User" className="size-8 rounded-full border-2 border-[#05050A] opacity-60 grayscale" />
               <img src="https://i.pravatar.cc/100?img=8" alt="User" className="size-8 rounded-full border-2 border-[#05050A] opacity-60 grayscale" />
            </div>

            {/* Central Glowing Logo */}
            <div className="relative mt-4">
                <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-40 rounded-full"></div>
                <div className="relative size-20 rounded-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] box-content p-1">
                    <div className="size-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-4xl">auto_awesome</span>
                    </div>
                </div>
            </div>
          </div>

          {/* HEADINGS */}
          <div className="relative z-10 text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              What’s in our Community
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              Comprehensive online courses designed to enhance skills and knowledge for all learners.
            </p>
          </div>

          {/* FEATURE CARDS GRID */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* CARD 1: Video Access (Large) */}
            <div className="col-span-1 md:col-span-6 group relative bg-[#0F121D]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Visual Illustration */}
                <div className="h-48 mb-8 relative flex items-center justify-center">
                    {/* Background Cards */}
                    <div className="absolute left-4 top-4 w-48 h-32 bg-slate-800/30 rounded-xl border border-white/5 transform -rotate-6 blur-[1px]"></div>
                    <div className="absolute right-4 top-4 w-48 h-32 bg-slate-800/30 rounded-xl border border-white/5 transform rotate-6 blur-[1px]"></div>
                    
                    {/* Main Video Player */}
                    <div className="relative w-64 h-40 bg-[#161b2c] rounded-xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden z-10">
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 relative group-hover:scale-105 transition-transform duration-500">
                            <div className="size-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="material-symbols-outlined text-blue-600 text-2xl ml-1">play_arrow</span>
                            </div>
                        </div>
                        <div className="h-8 bg-[#0f121d] flex items-center px-3 gap-2 border-t border-white/5">
                            <div className="text-[8px] text-white/50">02:30</div>
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">Anytime Access to Courses</h3>
                    <p className="text-slate-400 text-sm leading-relaxed px-4">Access our courses anytime, anywhere, on any device, allowing you to learn at your own pace and convenience.</p>
                </div>
            </div>

            {/* CARD 2: Certificates (Large) */}
            <div className="col-span-1 md:col-span-6 group relative bg-[#0F121D]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Visual Illustration */}
                <div className="h-48 mb-8 relative flex items-center justify-center">
                    <div className="relative w-56 h-40 bg-[#161b2c] rounded-xl border border-slate-700/50 shadow-2xl flex flex-col p-4 z-10 transform group-hover:-translate-y-2 transition-transform duration-300">
                        {/* Cert Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="size-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-0.5 shadow-lg shadow-green-500/20">
                                <div className="w-full h-full bg-[#161b2c] rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-400 text-lg">verified</span>
                                </div>
                            </div>
                            <div className="size-6 rounded-full bg-blue-600/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-500 text-xs">auto_awesome</span>
                            </div>
                        </div>
                        {/* Cert Lines */}
                        <div className="space-y-2">
                            <div className="h-1.5 w-24 bg-white/20 rounded-full mx-auto"></div>
                            <div className="h-1 w-32 bg-white/10 rounded-full mx-auto"></div>
                            <div className="h-1 w-20 bg-white/10 rounded-full mx-auto"></div>
                        </div>
                        {/* Pen */}
                        <div className="absolute -bottom-2 -right-4 bg-gradient-to-tr from-blue-500 to-cyan-400 w-24 h-6 rounded-full transform -rotate-45 border-2 border-[#0F121D] shadow-xl"></div>
                    </div>
                </div>

                <div className="text-center relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">Certificates for All Courses</h3>
                    <p className="text-slate-400 text-sm leading-relaxed px-4">Earn certificates upon completion to validate your skills and boost your professional profile.</p>
                </div>
            </div>

            {/* CARD 3: Job Finding (Small) */}
            <div className="col-span-1 md:col-span-4 group relative bg-[#0F121D]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Visual */}
                <div className="h-32 mb-6 relative flex items-center justify-center">
                    <div className="relative flex flex-col items-center">
                        <div className="size-10 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center relative z-10 mb-4">
                            <span className="material-symbols-outlined text-white">work</span>
                        </div>
                        {/* Nodes */}
                        <div className="flex gap-6 relative">
                            {/* Lines */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-px bg-white/10"></div>
                            <div className="absolute -top-4 left-2 w-px h-4 bg-white/10"></div>
                            <div className="absolute -top-4 right-2 w-px h-4 bg-white/10"></div>

                            {[1,2,3,4].map((i) => (
                                <div key={i} className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white/40 text-sm">business_center</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center relative z-10">
                    <h3 className="text-lg font-bold text-white mb-2">Job-Finding Community</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Connect with our community to discover job opportunities.</p>
                </div>
            </div>

            {/* CARD 4: Expert Teachers (Small) */}
            <div className="col-span-1 md:col-span-4 group relative bg-[#0F121D]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Visual */}
                <div className="h-32 mb-6 relative flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-3">
                            <img src="https://i.pravatar.cc/100?img=32" className="size-10 rounded-full border border-white/20 shadow-lg" alt="" />
                            <img src="https://i.pravatar.cc/100?img=47" className="size-10 rounded-full border border-white/20 shadow-lg" alt="" />
                            <img src="https://i.pravatar.cc/100?img=12" className="size-10 rounded-full border border-white/20 shadow-lg" alt="" />
                            <img src="https://i.pravatar.cc/100?img=59" className="size-10 rounded-full border border-white/20 shadow-lg" alt="" />
                        </div>
                        <div className="flex gap-3">
                            <img src="https://i.pravatar.cc/100?img=11" className="size-12 rounded-full border-2 border-white/30 shadow-xl z-10" alt="" />
                            <img src="https://i.pravatar.cc/100?img=60" className="size-12 rounded-full border-2 border-white/30 shadow-xl z-10" alt="" />
                            <img src="https://i.pravatar.cc/100?img=3" className="size-12 rounded-full border-2 border-white/30 shadow-xl z-10" alt="" />
                        </div>
                    </div>
                </div>

                <div className="text-center relative z-10">
                    <h3 className="text-lg font-bold text-white mb-2">Expert Teacher Network</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Access a supportive community of experienced teachers for guidance.</p>
                </div>
            </div>

            {/* CARD 5: Skill Events (Small) */}
            <div className="col-span-1 md:col-span-4 group relative bg-[#0F121D]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Visual */}
                <div className="h-32 mb-6 relative flex items-center justify-center">
                    <div className="flex items-end gap-3 h-24">
                        {/* Bar 1 */}
                        <div className="w-8 h-[40%] bg-gradient-to-t from-blue-900 to-blue-600 rounded-t-lg relative group-hover:h-[50%] transition-all duration-500">
                            <img src="https://i.pravatar.cc/100?img=1" className="absolute -top-3 left-1/2 -translate-x-1/2 size-5 rounded-full border border-slate-900" alt="" />
                        </div>
                        {/* Bar 2 */}
                        <div className="w-8 h-[60%] bg-gradient-to-t from-blue-900 to-blue-500 rounded-t-lg relative group-hover:h-[70%] transition-all duration-500 delay-75">
                            <img src="https://i.pravatar.cc/100?img=2" className="absolute -top-3 left-1/2 -translate-x-1/2 size-5 rounded-full border border-slate-900" alt="" />
                        </div>
                        {/* Bar 3 (Main) */}
                        <div className="w-8 h-[100%] bg-gradient-to-t from-blue-800 to-cyan-400 rounded-t-lg relative shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                            <img src="https://i.pravatar.cc/100?img=3" className="absolute -top-4 left-1/2 -translate-x-1/2 size-6 rounded-full border-2 border-slate-900" alt="" />
                        </div>
                        {/* Bar 4 */}
                        <div className="w-8 h-[75%] bg-gradient-to-t from-blue-900 to-blue-500 rounded-t-lg relative group-hover:h-[85%] transition-all duration-500 delay-100">
                            <img src="https://i.pravatar.cc/100?img=4" className="absolute -top-3 left-1/2 -translate-x-1/2 size-5 rounded-full border border-slate-900" alt="" />
                        </div>
                        {/* Bar 5 */}
                        <div className="w-8 h-[50%] bg-gradient-to-t from-blue-900 to-blue-600 rounded-t-lg relative group-hover:h-[60%] transition-all duration-500 delay-150">
                            <img src="https://i.pravatar.cc/100?img=5" className="absolute -top-3 left-1/2 -translate-x-1/2 size-5 rounded-full border border-slate-900" alt="" />
                        </div>
                    </div>
                </div>

                <div className="text-center relative z-10">
                    <h3 className="text-lg font-bold text-white mb-2">Skill-Enhancing Online Events</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Participate in online events designed to refine and advance your skills.</p>
                </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
