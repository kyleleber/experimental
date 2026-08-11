import React, { useState, useEffect } from 'react';
import { Gamepad2, ExternalLink, GitBranch, Terminal, Sparkles, Sun, Moon, ShieldCheck, Cookie, Lock, Eye, Search, Lightbulb, Cpu, Globe, Zap, Smartphone, CheckCircle2, Copy, Check } from 'lucide-react';

const games = [
  {
    id: 'x3plorer',
    title: 'X3PLORER',
    description: 'A 3D browser shooting/survival game built with X3D components and JavaScript, featuring a custom radar and HUD.',
    tags: ['JavaScript', 'X3D', 'Canvas', 'WebGL'],
    status: 'In Development',
    category: 'Action',
    playUrl: '/games/x3plorer/',
    repoUrl: 'https://github.com/kyleleber/experimental/tree/main/public/games/x3plorer',
    featured: true,
  },
  {
    id: 'skeet',
    title: 'Skeet / Trap Shooting',
    description: 'An interactive 3D skeet/trap shooting simulator featuring customizable chokes, pellet spread physics, and dynamic target tracking.',
    tags: ['JavaScript', 'X3D', 'Physics', 'WebGL'],
    status: 'In Development',
    category: 'Simulation',
    playUrl: '/games/skeet/',
    repoUrl: 'https://github.com/kyleleber/experimental/tree/main/public/games/skeet',
    featured: true,
  },
  {
    id: 'maze-explorer',
    title: '3D Maze Explorer',
    description: 'A procedural 3D maze generator and first-person explorer built with X3D components and modular vanilla JavaScript architecture.',
    tags: ['JavaScript', 'X3D', 'Procedural', 'WebGL'],
    status: 'Stable',
    category: 'Simulation',
    playUrl: '/games/maze_explorer/',
    repoUrl: 'https://github.com/kyleleber/experimental/tree/main/public/games/maze_explorer',
    featured: true,
  },
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem('cookie_consent');
  });

  const [showPreferences, setShowPreferences] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  // Quick launch command snippet for developers/terminal enthusiasts
  const quickCommand = 'git clone https://github.com/kyleleber/experimental.git && cd experimental';

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(quickCommand);
    setCopiedId('cmd');
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (cookieConsent === 'accepted') {
      if (!window.dataLayer) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-77RJH85DB0';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-77RJH85DB0');
      }
    }
  }, [cookieConsent]);

  const handleConsent = (choice) => {
    localStorage.setItem('cookie_consent', choice);
    setCookieConsent(choice);
    setShowPreferences(false);
  };

  const isBannerVisible = !cookieConsent || showPreferences;

  const categories = ['All', 'Action', 'Simulation'];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0b0f19] text-slate-100 selection:bg-cyan-500 selection:text-white' : 'bg-[#f4f6f9] text-slate-900 selection:bg-blue-600 selection:text-white'}`}>
        {/* Header */}
        <header className={`border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-[#0b0f19]/90' : 'border-slate-300 bg-white/95 shadow-sm'}`}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 border rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-blue-50 border-blue-300 text-blue-700'}`}>
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                3D Development Sandbox
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                  href="https://github.com/kyleleber/experimental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm transition-colors border px-3.5 py-2 rounded-lg font-semibold ${isDarkMode ? 'text-slate-200 hover:text-white bg-slate-900 border-slate-700 hover:border-slate-600' : 'text-slate-900 hover:text-black bg-white border-slate-300 hover:border-slate-400 shadow-sm'}`}
              >
                <GitBranch className="w-4 h-4" />
                <span>Source Repo</span>
              </a>
              <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  aria-label="Toggle theme"
                  className={`p-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100 shadow-sm'}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`relative overflow-hidden py-20 px-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-[#0b0f19]' : 'border-slate-300 bg-gradient-to-b from-blue-50/80 via-[#f4f6f9] to-[#f4f6f9]'}`}>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 ${isDarkMode ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-300' : 'bg-blue-100 border-blue-300 text-blue-900'}`}>
              <Sparkles className="w-4 h-4" />
              <span>Experimental Browser Games & WebGL Experiments</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              Interactive Prototypes & Technical Demos
            </h1>
            <p className={`text-xl max-w-2xl mx-auto leading-relaxed mb-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              A dedicated sandbox for browser-based games, rendering engines, and interactive technical explorations.
            </p>

            {/* Quick CLI Clone Widget */}
            <div className={`max-w-xl mx-auto p-2.5 rounded-xl border flex items-center justify-between gap-3 font-mono text-xs shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`}>
              <div className="flex items-center gap-2.5 overflow-x-auto px-2 py-1">
                <Terminal className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-cyan-400' : 'text-blue-700'}`} />
                <span className="whitespace-nowrap select-all">{quickCommand}</span>
              </div>
              <button
                  onClick={handleCopyCommand}
                  className={`p-2 rounded-lg border transition-colors shrink-0 flex items-center gap-1.5 font-sans font-semibold ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-900'}`}
                  title="Copy clone command"
              >
                {copiedId === 'cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Main Content / Controls & Projects */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
          {/* Always-Visible System & Browser Requirements Grid */}
          <div className={`mb-12 p-7 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-400' : 'bg-blue-50 border-blue-300 text-blue-700'}`}>
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  Browser & System Requirements
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ensure your environment is configured for optimal rendering and physics performance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
                <div className="flex items-center gap-2 mb-2.5 font-semibold text-base">
                  <Globe className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-blue-700'}`} />
                  <span className={isDarkMode ? 'text-white' : 'text-slate-950'}>WebGL Support</span>
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  The browser must natively support WebGL (standard on all modern desktop and mobile browsers like Chrome, Firefox, Safari, and Edge).
                </p>
              </div>

              <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
                <div className="flex items-center gap-2 mb-2.5 font-semibold text-base">
                  <Zap className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-blue-700'}`} />
                  <span className={isDarkMode ? 'text-white' : 'text-slate-950'}>Hardware Acceleration</span>
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  GPU hardware acceleration must be turned on in your browser settings for smooth rendering performance.
                </p>
              </div>

              <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-300'}`}>
                <div className="flex items-center gap-2 mb-2.5 font-semibold text-base">
                  <Terminal className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-blue-700'}`} />
                  <span className={isDarkMode ? 'text-white' : 'text-slate-950'}>JavaScript Enabled</span>
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Modern JavaScript (ES5/ES6+) must be active to parse and run the framework logic.
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-3 pt-4 border-t text-sm ${isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700'}`}>
              <Smartphone className="w-4 h-4 shrink-0 text-cyan-400 mt-1" />
              <span>
                <strong className={isDarkMode ? 'text-white' : 'text-slate-950'}>Mobile Support Notice:</strong> While mobile devices technically support WebGL execution, touch screen interactions within X3DOM currently present bugs and limitations with standard click/tap handlers. A cross-platform mobile interaction layout is actively being brainstormed and engineered.
              </span>
            </div>
          </div>

          {/* Controls Bar: Search and Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className={`relative flex items-center flex-1 max-w-sm border rounded-xl overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-950 shadow-sm'}`}>
              <Search className={`w-4 h-4 absolute left-3.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                  type="text"
                  placeholder="Search experiments or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-transparent focus:outline-none placeholder:text-slate-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                  <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                          selectedCategory === cat
                              ? (isDarkMode ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/25' : 'bg-blue-700 border-blue-700 text-white shadow-sm')
                              : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm')
                      }`}
                  >
                    {cat}
                  </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold flex items-center gap-2.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              <Terminal className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-blue-700'}`} />
              <span>Active Projects</span>
            </h2>
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border ${isDarkMode ? 'text-slate-200 bg-slate-900 border-slate-800' : 'text-slate-900 bg-white border-slate-300 shadow-sm'}`}>
              {filteredGames.length} LOADED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                    <div
                        key={game.id}
                        className={`group border rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-500/5' : 'bg-white border-slate-300 hover:border-slate-400 hover:shadow-md'}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <span className={`text-xs font-mono uppercase tracking-wider block mb-1 font-bold ${
                                game.status.toLowerCase() === 'stable'
                                    ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700')
                                    : (isDarkMode ? 'text-cyan-400' : 'text-blue-700')
                            }`}>
                              {game.status} • {game.category}
                            </span>
                            <h3 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white group-hover:text-cyan-300' : 'text-slate-950 group-hover:text-blue-700'}`}>
                              {game.title}
                            </h3>
                          </div>
                          {game.featured && (
                              <span className={`px-3 py-1 rounded-full text-xs border font-bold ${isDarkMode ? 'bg-amber-950/40 border-amber-600/50 text-amber-300' : 'bg-amber-100 border-amber-400 text-amber-900'}`}>
                                Featured
                              </span>
                          )}
                        </div>

                        <p className={`text-base leading-relaxed mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {game.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {game.tags.map((tag) => (
                              <span
                                  key={tag}
                                  className={`px-3 py-1 rounded-md border text-xs font-mono font-medium ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
                              >
                                {tag}
                              </span>
                          ))}
                        </div>
                      </div>

                      <div className={`flex items-center justify-between pt-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <a
                            href={game.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm flex items-center gap-2 transition-colors font-semibold ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-black'}`}
                        >
                          <GitBranch className="w-4 h-4" />
                          <span>Code</span>
                        </a>
                        <a
                            href={game.playUrl}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm ${isDarkMode ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-500/25' : 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm'}`}
                        >
                          <span>Launch Game</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                ))
            ) : (
                <div className={`col-span-full py-16 text-center border rounded-xl ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'}`}>
                  <p className="text-base font-medium">No experiments matched your search criteria.</p>
                </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className={`border-t py-8 px-6 text-center text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'border-slate-800 text-slate-300 bg-[#0b0f19]' : 'border-slate-300 text-slate-900 bg-white'}`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-900 font-medium'}>Built with React & Tailwind CSS. Hosted independently.</p>
            <button
                onClick={() => setShowPreferences(true)}
                className={`inline-flex items-center gap-1.5 transition-colors underline underline-offset-4 font-semibold ${isDarkMode ? 'text-slate-200 hover:text-white' : 'text-blue-800 hover:text-blue-950'}`}
            >
              <Cookie className="w-4 h-4" />
              <span>Privacy & Cookie Preferences</span>
            </button>
          </div>
        </footer>

        {/* Larger Floating Privacy & Cookie Popup (Right Side) */}
        {isBannerVisible && (
            <div className={`fixed bottom-6 right-6 z-50 max-w-md w-full p-7 border rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-black/80' : 'bg-white border-slate-300 text-slate-900 shadow-xl'}`}>
              <div className="flex items-start gap-3.5 mb-4">
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${isDarkMode ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-400' : 'bg-blue-50 border-blue-300 text-blue-700'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`font-bold text-lg mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Privacy & Analytics Preferences</h2>
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    We respect your privacy. Local storage is used strictly to remember your preferred theme settings.
                  </p>
                </div>
              </div>

              <div className={`space-y-3 mb-6 p-4 rounded-xl border text-sm leading-relaxed ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-800'}`}>
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 shrink-0 text-cyan-400 mt-1" />
                  <span><strong className={isDarkMode ? 'text-white' : 'text-slate-950'}>No Data Sales:</strong> Your personal information and browsing data are never sold, traded, or shared with third-party data brokers.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Eye className="w-4 h-4 shrink-0 text-cyan-400 mt-1" />
                  <span><strong className={isDarkMode ? 'text-white' : 'text-slate-950'}>Optional Analytics:</strong> If accepted, Google Analytics cookies help us anonymously understand site traffic, device types, and usage patterns to improve performance. Essential functionality works regardless of your choice.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                    onClick={() => handleConsent('declined')}
                    className={`w-full py-3 text-sm font-semibold rounded-xl border transition-colors ${isDarkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'}`}
                >
                  Decline Optional
                </button>
                <button
                    onClick={() => handleConsent('accepted')}
                    className={`w-full py-3 text-sm font-semibold rounded-xl transition-colors shadow-sm ${isDarkMode ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold' : 'bg-blue-700 hover:bg-blue-800 text-white font-bold'}`}
                >
                  Accept All
                </button>
              </div>
            </div>
        )}
      </div>
  );
}