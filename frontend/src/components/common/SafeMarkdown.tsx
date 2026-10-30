import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ content, className = "" }) => {
  return (
    <div className={`prose dark:prose-invert max-w-none text-ink/90 dark:text-ink-dark/90 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-heading text-2xl sm:text-3xl font-bold mt-6 mb-3 text-ink dark:text-ink-dark border-b border-line-light dark:border-line-dark pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading text-xl sm:text-2xl font-bold mt-5 mb-2.5 text-ink dark:text-ink-dark">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-lg sm:text-xl font-bold mt-4 mb-2 text-majorelle dark:text-majorelle-dark">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 marker:text-saffron dark:marker:text-saffron-dark">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5 marker:text-saffron dark:marker:text-saffron-dark font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-ink dark:text-ink-dark">{children}</strong>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="bg-canvas-dark text-ink-dark p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono border border-line-dark">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-majorelle-light dark:bg-majorelle-darkSurface text-majorelle dark:text-majorelle-dark px-1.5 py-0.5 rounded text-sm font-mono font-medium">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-saffron dark:border-saffron-dark pl-4 py-1 my-4 italic bg-surface-light/60 dark:bg-surface-dark/60 rounded-r-lg">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-majorelle dark:text-majorelle-dark hover:underline font-medium inline-flex items-center gap-1"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-line-light dark:border-line-dark">
              <table className="min-w-full divide-y divide-line-light dark:divide-line-dark text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 bg-surface-light dark:bg-surface-dark font-heading font-bold text-left text-ink dark:text-ink-dark">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-t border-line-light dark:border-line-dark text-muted-light dark:text-muted-dark">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
