import * as React from 'react';
//import { escape } from '@microsoft/sp-lodash-subset';
import * as DOMPurifyModule from 'dompurify';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DOMPurify = (DOMPurifyModule as any).default ?? DOMPurifyModule;

export interface IHtmlReaderProps {
  content: string;        // Raw HTML string
  sanitize?: boolean;     // Sanitize HTML before rendering (default: true)
  className?: string;
}

const HtmlReader: React.FC<IHtmlReaderProps> = ({
  content,
  sanitize = true,
  className = '',
}) => {
  const parseMarkdownLinks = (input: string): string =>
    input.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

  const sanitized = React.useMemo(() => {
    if (!content) return '';
    const withLinks = parseMarkdownLinks(content);
    return sanitize
      ? DOMPurify.sanitize(withLinks, {
          ALLOWED_TAGS: [
            'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a',
            'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'img', 'span', 'div', 'blockquote', 'pre', 'code',
          ],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
          ADD_ATTR: ['target'],
        })
      : content;
  }, [content, sanitize]);

  return (
    <div
      className={`html-reader ${className}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitized }} onClick={(e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        e.preventDefault();
        e.stopPropagation();
        window.open(anchor.href, '_blank', 'noopener,noreferrer');
      }
    }}
    />
  );
};

export default HtmlReader;