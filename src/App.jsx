import React, { useState } from 'react';
import { Gamepad2, ExternalLink, GitBranch, Terminal, Sparkles } from 'lucide-react';

const games = [
  {
    id: 'x3plorer',
    title: 'X3PLORER',
    description: 'A 3D browser space exploration game built with X3D components and JavaScript, featuring a custom radar and HUD.',
    tags: ['JavaScript', 'X3D', 'Canvas', 'WebGL'],
    status: 'In Development',
    playUrl: '/games/x3plorer/',
    repoUrl: 'https://github.com/kyleleber/experimental/tree/main/x3plorer',
    featured: true,
  },
];

export default function App() {
  const [filter, setFilter] = useState('all');

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        {/* Header */}
        <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              KL Development Sandbox
            </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                  href="https://github.com/kyleleber/experimental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
              >
                <GitBranch className="w-4 h-4" />
                <span>Source Repo</span>
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6 border-b border-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experimental Browser Games & WebGL Toys</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
              Interactive Experiments & Side Quests
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A dedicated sandbox for browser-based games, rendering engines, and interactive technical explorations.
            </p>
          </div>
        </section>

        {/* Main Content / Game Grid */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>Active Projects</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">{games.length} LOADED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
                <div
                    key={game.id}
                    className="group bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block mb-1">
                      {game.status}
                    </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {game.title}
                        </h3>
                      </div>
                      {game.featured && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                      Featured
                    </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {game.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {game.tags.map((tag) => (
                          <span
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-mono"
                          >
                      {tag}
                    </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <a
                        href={game.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                    <a
                        href={game.playUrl}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
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
        <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
          <p>Built with React & Tailwind CSS. Hosted independently.</p>
        </footer>
      </div>
  );
}