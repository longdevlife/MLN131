import React, { useEffect, useRef } from 'react';
import { startArticleHeadingDecode } from './articleHeadingDecode';

export interface ArticleHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'p';
  title: string;
  subtitle?: string;
  kicker?: string;
  className?: string;
  duration?: number;
  stagger?: number;
}

export const ArticleHeadings: React.FC<ArticleHeadingProps> = ({
  as: Component = 'div',
  title,
  subtitle,
  kicker,
  className = '',
  duration = 900,
  stagger = 120,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cancel = startArticleHeadingDecode(containerRef.current, {
      duration,
      stagger,
      scrambleLength: 3,
      preserveChance: 0.25,
    });
    return cancel;
  }, [title, subtitle, kicker, duration, stagger]);

  return (
    <div key={title} ref={containerRef} className={`article-heading-group ${className}`}>
      {kicker && (
        <div
          data-article-heading
          className="article-kicker font-mono text-muted"
          style={{
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C8A86A',
            marginBottom: '0.5rem',
          }}
        >
          {kicker}
        </div>
      )}
      <Component
        data-article-heading
        className="article-title font-serif"
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.75rem)',
          lineHeight: 1.15,
          color: '#F5F0E8',
          margin: 0,
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </Component>
      {subtitle && (
        <p
          data-article-heading
          className="article-subtitle font-sans"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            color: '#EDE4D6',
            opacity: 0.85,
            marginTop: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
