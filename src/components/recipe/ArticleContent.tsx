'use client';

interface ArticleContentProps {
  content: string;
}

/**
 * Renders article content with markdown-like formatting
 * Supports: ## headings, ### headings, bullet lists, **bold**, paragraphs
 */
export function ArticleContent({ content }: ArticleContentProps) {
  // Split content into blocks by double newlines
  const blocks = content.split(/\n\n+/).filter(block => block.trim());

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Check for ## heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={index}
              className="font-display text-xl md:text-2xl font-normal text-ink mt-10 mb-4 first:mt-0"
            >
              {trimmed.replace('## ', '')}
            </h3>
          );
        }

        // Check for ### heading
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={index}
              className="font-display text-lg md:text-xl font-normal text-ink mt-6 mb-3"
            >
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // Check if it's a list (lines starting with - or * or emoji bullets)
        const lines = trimmed.split('\n');
        const isList = lines.every(line =>
          /^[-*•✅❌🔥💡👉🌿]/.test(line.trim()) || line.trim() === ''
        );

        if (isList) {
          return (
            <ul key={index} className="space-y-2">
              {lines.filter(line => line.trim()).map((line, lineIndex) => {
                // Remove bullet character
                const text = line.replace(/^[-*•]\s*/, '').trim();
                return (
                  <li
                    key={lineIndex}
                    className="flex gap-3 text-lg text-ink-light leading-relaxed font-body"
                  >
                    <span className="flex-shrink-0">
                      {line.trim().match(/^[✅❌🔥💡👉🌿]/)?.[0] || '•'}
                    </span>
                    <span>{renderInlineFormatting(text.replace(/^[✅❌🔥💡👉🌿]\s*/, ''))}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // First paragraph gets drop cap styling
        if (index === 0) {
          return (
            <p
              key={index}
              className="text-xl md:text-2xl text-ink-light leading-relaxed font-body first-letter:text-7xl first-letter:font-display first-letter:font-normal first-letter:text-terracotta-500 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1"
            >
              {renderInlineFormatting(trimmed)}
            </p>
          );
        }

        // Regular paragraph with inline formatting
        return (
          <p key={index} className="text-lg md:text-xl text-ink-light leading-relaxed font-body">
            {renderInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Render inline formatting like **bold** text
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Split by **bold** pattern
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold text
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
