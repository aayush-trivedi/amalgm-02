import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Copy, RefreshCw, Download, SquareArrowOutUpRight } from 'lucide-react';

const ChatMessage = ({ message, onCopy, onRefresh, onDownload, onOpenInDocs }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh(message);
    } finally {
      setRefreshing(false);
    }
  };

  const renderMessage = () => {
    return (
      <div className={`relative group ${message.isUser ? 'text-right' : 'text-left'} mt-6`}>
        <div className={`inline-block rounded-2xl ${message.isUser ? 'bg-stone-900 px-4 py-2' : 'bg-transparent'} max-w-full text-white`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-8xl font-bold mt-6 mb-4 text-white" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-5xl font-semibold mt-5 mb-3 text-white" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-medium mt-4 mb-2 text-white" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 last:mb-0 text-gray-200 text-base" style={{ lineHeight: '1.6' }} {...props} />,
              table: ({node, ...props}) => <div className="overflow-hidden rounded-lg my-4"><table className="border-collapse w-full text-white text-sm" {...props} /></div>,
              thead: ({node, ...props}) => <thead className="bg-stone-800" {...props} />,
              tbody: ({node, ...props}) => <tbody className="bg-stone-900" {...props} />,
              tr: ({node, ...props}) => <tr {...props} />,
              th: ({node, ...props}) => <th className="border border-stone-700 px-3 py-2 font-semibold text-left" {...props} />,
              td: ({node, ...props}) => <td className="border border-stone-700 px-3 py-2" {...props} />,
              code: ({node, inline, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '')
                const language = match ? match[1] : 'text'
                const content = String(children).replace(/\n$/, '')
                
                if (!inline && content.split(/\s+/).length > 3) {
                  return (
                    <div className="bg-[#1e1e1e] rounded-md overflow-hidden my-2">
                      <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2 text-gray-200 text-sm">
                        <span>{`${language}.${getFileExtension(language)}`}</span>
                        <div className="flex space-x-2">
                          <button onClick={() => onDownload(content)} className="hover:bg-[#3a3a3a] p-1 rounded">
                            <Download size={14} />
                          </button>
                          <button onClick={() => onCopy(content)} className="hover:bg-[#3a3a3a] p-1 rounded">
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                      <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{margin: 0, padding: '1rem'}}
                      >
                        {content}
                      </SyntaxHighlighter>
                    </div>
                  )
                } else {
                  return (
                    <code className={`bg-black bg-opacity-20 py-0.5 rounded ${className}`} {...props}>
                      {children}
                    </code>
                  )
                }
              },
              a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-sm" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-sm" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 text-sm" {...props} />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        {!message.isUser && (
          <div className="absolute left-0 right-0 mt-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex space-x-2">
              <button
                onClick={() => onCopy(message.text)}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                title="Copy message"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handleRefresh}
                className={`p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white ${refreshing ? 'animate-spin' : ''}`}
                title="Refresh response"
                disabled={refreshing}
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => onDownload(message.text)}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                title="Download response"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => onOpenInDocs(message.text)}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                title="Open in application"
              >
                <SquareArrowOutUpRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return renderMessage();
};

const getFileExtension = (lang) => {
  const extensionMap = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    csharp: 'cs',
    ruby: 'rb',
    php: 'php',
    swift: 'swift',
    go: 'go',
    rust: 'rs',
    typescript: 'ts',
    kotlin: 'kt',
    scala: 'scala',
    html: 'html',
    css: 'css',
    sql: 'sql',
  };
  return extensionMap[lang.toLowerCase()] || 'txt';
};

export default ChatMessage;