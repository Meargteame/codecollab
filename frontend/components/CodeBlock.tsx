interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBlock({ 
  code, 
  language = "typescript", 
  showLineNumbers = true,
  className = ""
}: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div className={`bg-white/5 border border-white/10 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-2 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
          {language}
        </span>
        <button className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
          COPY
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 font-mono text-sm">
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td className="text-gray-600 select-none pr-4 text-right" style={{ width: '1%' }}>
                      {index + 1}
                    </td>
                    <td className="text-gray-300">
                      <code>{line || ' '}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code className="text-gray-300">{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
