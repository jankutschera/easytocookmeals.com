'use client';

interface StoryContentProps {
  content: string;
}

/**
 * Renders story content with basic markdown support
 * Handles: ## headings, paragraphs (double newlines)
 */
export function StoryContent({ content }: StoryContentProps) {
  // Split content into blocks by double newlines
  const blocks = content.split(/\n\n+/).filter(block => block.trim());

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const trimmed = block.trim();

        // Check for ## heading
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^## /, '');
          return (
            <h3
              key={index}
              className="font-display text-xl text-gray-900 mt-8 mb-4 first:mt-0"
            >
              {headingText}
            </h3>
          );
        }

        // Check for ### heading
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace(/^### /, '');
          return (
            <h4
              key={index}
              className="font-display text-lg text-gray-800 mt-6 mb-3"
            >
              {headingText}
            </h4>
          );
        }

        // Regular paragraph - handle single newlines as line breaks
        const lines = trimmed.split('\n');
        return (
          <p key={index} className="text-gray-700 leading-relaxed">
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
