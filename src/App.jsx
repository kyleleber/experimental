import React, { useState, useEffect } from 'react';
import { Gamepad2, ExternalLink, GitBranch, Terminal, Sparkles, Sun, Moon, ShieldCheck, Cookie, Lock, Eye } from 'lucide-react';

const games = [
  {
    id: 'x3plorer',
    title: 'X3PLORER',
    description: 'A 3D browser shooting/survival game built with X3D components and JavaScript, featuring a custom radar and HUD.',
    tags: ['JavaScript', 'X3D', 'Canvas', 'WebGL'],
    status: 'In Development',
    playUrl: '/games/x3plorer/',
    repoUrl: 'https://github.com/kyleleber/experimental/tree/main/games/x3plorer',
    featured: true,
  },
  {
    id: 'skeet',
    title: 'Skeet / Trap Shooting',
    description: 'An interactive 3D skeet/trap shooting simulator featuring customizable chokes, pellet spread physics, and dynamic target tracking.',
    tags: ['JavaScript', 'X3D', 'Physics', 'WebGL'],
    status: 'In Development',
    playUrl: '/games/skeet/',
    repoUrl: 'https://github.com/kyleleber/experimental/tree/main/games/skeet',
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

  return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white' : 'bg-slate-100 text-slate-900 selection:bg-indigo-600 selection:text-white'}`}>
        {/* Header */}
        <header className={`border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-300 bg-white/90 shadow-sm'}`}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 border rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-800'}`}>
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                KL Development Sandbox
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                  href="https://github.com/kyleleber/experimental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm transition-colors border px-3 py-1.5 rounded-lg font-medium ${isDarkMode ? 'text-slate-200 hover:text-white bg-slate-900 border-slate-700 hover:border-slate-600' : 'text-slate-800 hover:text-black bg-white border-slate-400 hover:border-slate-500 shadow-sm'}`}
              >
                <GitBranch className="w-4 h-4" />
                <span>Source Repo</span>
              </a>
              <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  aria-label="Toggle theme"
                  className={`p-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-400 text-amber-600 hover:bg-slate-100 shadow-sm'}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`relative overflow-hidden py-20 px-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-gradient-to-b from-indigo-100/70 via-slate-100 to-slate-100'}`}>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-6 ${isDarkMode ? 'bg-indigo-950 border-indigo-700 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-900'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experimental Browser Games & WebGL Toys</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Interactive Experiments & Side Quests
            </h1>
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              A dedicated sandbox for browser-based games, rendering engines, and interactive technical explorations.
            </p>
          </div>
        </section>

        {/* Main Content / Game Grid */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Terminal className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`} />
              <span>Active Projects</span>
            </h2>
            <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full border ${isDarkMode ? 'text-slate-300 bg-slate-900 border-slate-700' : 'text-slate-800 bg-white border-slate-300 shadow-sm'}`}>
              {games.length} LOADED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
                <div
                    key={game.id}
                    className={`group border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10' : 'bg-white border-slate-300 hover:border-slate-400 hover:shadow-md'}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className={`text-xs font-mono uppercase tracking-wider block mb-1 font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
                          {game.status}
                        </span>
                        <h3 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                          {game.title}
                        </h3>
                      </div>
                      {game.featured && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs border font-bold ${isDarkMode ? 'bg-amber-950/65 border-amber-600 text-amber-300' : 'bg-amber-100 border-amber-400 text-amber-900'}`}>
                            Featured
                          </span>
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {game.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {game.tags.map((tag) => (
                          <span
                              key={tag}
                              className={`px-2.5 py-1 rounded-md border text-xs font-mono font-medium ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
                          >
                            {tag}
                          </span>
                      ))}
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <a
                        href={game.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs flex items-center gap-1.5 transition-colors font-semibold ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-black'}`}
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                    <a
                        href={game.playUrl}
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30' : 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-sm'}`}
                    >
                      <span>Launch Game</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className={`border-t py-8 px-6 text-center text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'border-slate-800 text-slate-400 bg-slate-950' : 'border-slate-300 text-slate-700 bg-white'}`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>Built with React & Tailwind CSS. Hosted independently.</p>
            <button
                onClick={() => setShowPreferences(true)}
                className={`inline-flex items-center gap-1.5 transition-colors underline underline-offset-4 ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>Privacy & Cookie Preferences</span>
            </button>
          </div>
        </footer>

        {/* Larger Floating Privacy & Cookie Popup (Right Side) */}
        {isBannerVisible && (
            <div className={`fixed bottom-6 right-6 z-50 max-w-md w-full p-7 border rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-black/50' : 'bg-white border-slate-300 text-slate-800 shadow-slate-300/50'}`}>
              <div className="flex items-start gap-3.5 mb-4">
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${isDarkMode ? 'bg-indigo-950 border-indigo-700 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-800'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1.5">Privacy & Analytics Preferences</h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    We respect your privacy. Local storage is used strictly to remember your preferred theme settings.
                  </p>
                </div>
              </div>

              <div className={`space-y-2.5 mb-5 p-3.5 rounded-xl border text-xs leading-relaxed ${isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                  <span><strong>No Data Sales:</strong> Your personal information and browsing data are never sold, traded, or shared with third-party data brokers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Eye className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                  <span><strong>Optional Analytics:</strong> If accepted, Google Analytics cookies help us anonymously understand site traffic, device types, and usage patterns to improve performance. Essential functionality works regardless of your choice.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                    onClick={() => handleConsent('declined')}
                    className={`w-full py-2.5 text-sm font-semibold rounded-xl border transition-colors ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                >
                  Decline Optional
                </button>
                <button
                    onClick={() => handleConsent('accepted')}
                    className={`w-full py-2.5 text-sm font-semibold rounded-xl transition-colors shadow-sm ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-indigo-700 hover:bg-indigo-800 text-white'}`}
                >
                  Accept All
                </button>
              </div>
            </div>
        )}
      </div>
  );
}