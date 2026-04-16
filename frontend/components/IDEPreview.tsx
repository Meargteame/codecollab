export default function IDEPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tight">
            YOUR <span className="text-blue-500">WORKSPACE</span>
          </h2>
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            Professional IDE experience in your browser
          </p>
        </div>

        {/* IDE Mock */}
        <div className="bg-[#0a0a0a] border-2 border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
          {/* IDE Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-gray-500 font-mono ml-4">
                CODE<span className="text-blue-500">COLLAB</span>_OS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded border border-green-500/30 uppercase tracking-wider">
                ▶ EXECUTE_SEQ
              </button>
            </div>
          </div>

          {/* IDE Content */}
          <div className="grid grid-cols-12 h-[500px]">
            {/* Sidebar */}
            <div className="col-span-2 bg-black/30 border-r border-white/5 p-3">
              <div className="text-[10px] text-blue-500 font-mono mb-3 uppercase tracking-wider">
                PROJECT_FILES
              </div>
              <div className="space-y-1">
                {['src', 'App.tsx', 'index.tsx', 'components', 'Button.tsx', 'Editor.tsx', 'package.json', 'tsconfig.json'].map((file, i) => (
                  <div
                    key={i}
                    className={`text-[11px] font-mono px-2 py-1 rounded ${
                      file === 'App.tsx' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-600 hover:text-gray-400'
                    } cursor-pointer transition-colors`}
                  >
                    {file.includes('.') ? '📄' : '📁'} {file}
                  </div>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="col-span-7 bg-black/20 p-4 font-mono text-xs overflow-auto">
              <div className="space-y-1">
                <div className="text-gray-600">
                  <span className="text-purple-400">import</span>{' '}
                  <span className="text-blue-400">React</span>{' '}
                  <span className="text-purple-400">from</span>{' '}
                  <span className="text-green-400">'react'</span>
                </div>
                <div className="text-gray-600">
                  <span className="text-purple-400">import</span>{' '}
                  <span className="text-blue-400">{'{ Editor }'}</span>{' '}
                  <span className="text-purple-400">from</span>{' '}
                  <span className="text-green-400">'./components'</span>
                </div>
                <div className="h-4" />
                <div className="text-gray-600">
                  <span className="text-purple-400">function</span>{' '}
                  <span className="text-yellow-400">App</span>
                  <span className="text-gray-500">()</span>{' '}
                  <span className="text-gray-500">{'{'}</span>
                </div>
                <div className="text-gray-600 pl-4">
                  <span className="text-purple-400">return</span>{' '}
                  <span className="text-gray-500">(</span>
                </div>
                <div className="text-gray-600 pl-8">
                  <span className="text-gray-500">{'<'}</span>
                  <span className="text-green-400">div</span>
                  <span className="text-gray-500">{'>'}</span>
                </div>
                <div className="text-gray-600 pl-12">
                  <span className="text-gray-500">{'<'}</span>
                  <span className="text-green-400">Editor</span>{' '}
                  <span className="text-blue-400">theme</span>
                  <span className="text-gray-500">=</span>
                  <span className="text-green-400">"dark"</span>{' '}
                  <span className="text-gray-500">{'/>'}</span>
                </div>
                <div className="text-gray-600 pl-8">
                  <span className="text-gray-500">{'</'}</span>
                  <span className="text-green-400">div</span>
                  <span className="text-gray-500">{'>'}</span>
                </div>
                <div className="text-gray-600 pl-4">
                  <span className="text-gray-500">)</span>
                </div>
                <div className="text-gray-600">
                  <span className="text-gray-500">{'}'}</span>
                </div>
                <div className="h-4" />
                <div className="text-gray-600">
                  <span className="text-purple-400">export default</span>{' '}
                  <span className="text-yellow-400">App</span>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-3 bg-black/40 border-l border-white/5 p-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-black text-2xl">A</span>
                </div>
                <div className="text-xs text-green-400 font-mono mb-1">SIGNAL_GOOD ●</div>
                <div className="text-[10px] text-gray-600 font-mono">ALEX_DEV</div>
              </div>

              <div className="space-y-2 mb-6">
                <button className="w-full p-2 bg-white/5 hover:bg-white/10 rounded text-[10px] text-gray-400 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="w-full p-2 bg-white/5 hover:bg-white/10 rounded text-[10px] text-gray-400 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>

              <div className="text-[10px] text-blue-500 font-mono mb-2 uppercase">CHAT</div>
              <div className="space-y-2 text-[10px]">
                <div className="text-gray-600">
                  <span className="text-blue-400">Alex Dev:</span> Hey, check line 42?
                </div>
                <div className="text-gray-600">
                  <span className="text-green-400">You:</span> Sure, looking now.
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="bg-black/60 border-t border-white/5 p-4 font-mono text-xs">
            <div className="flex items-center gap-4 mb-3 text-[10px]">
              <span className="text-blue-500 uppercase tracking-wider">▸ TERMINAL_01</span>
              <span className="text-gray-700">OUTPUT_LOG</span>
              <span className="text-gray-700">SYS_PROBLEMS</span>
            </div>
            <div className="space-y-1">
              <div className="text-gray-600">$ npm run dev</div>
              <div className="text-gray-700">Transforming...</div>
              <div className="text-gray-700">Optimizing chunks...</div>
              <div className="text-gray-700">Running...</div>
              <div className="text-green-500">▸ Process exited with code 0</div>
              <div className="text-gray-600">$ <span className="animate-pulse">▊</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
