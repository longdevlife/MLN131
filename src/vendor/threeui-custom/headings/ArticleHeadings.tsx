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
        className="article-title font-sans"
        style={{
          fontSize: 'clamp(1.45rem, 2.2vw, 2.25rem)',
          lineHeight: 1.2,
          color: '#F5F0E8',
          margin: 0,
          fontWeight: 650,
          letterSpacing: '-0.02em',
          textWrap: 'balance',
        }}
      >
        {title}
      </Component>
      {subtitle && (
        <p
          data-article-heading
          className="article-subtitle font-sans"
          style={{
            fontSize: 'clamp(0.88rem, 1.05vw, 1.05rem)',
            color: 'rgba(237, 228, 214, 0.78)',
            marginTop: '0.45rem',
            marginBottom: 0,
            lineHeight: 1.4,
            textWrap: 'balance',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
