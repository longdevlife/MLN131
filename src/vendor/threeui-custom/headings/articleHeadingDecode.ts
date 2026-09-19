export const ARTICLE_HEADING_DECODE_POOL = '#%&@$/\\<>*+=~ABCDEFGHKMNPRSTUVWXYZ0123456789';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const easeOutQuad = (t: number) => 1 - Math.pow(1 - t, 2);

export interface DecodeOptions {
  duration?: number;
  stagger?: number;
  scrambleLength?: number;
  preserveChance?: number;
  tailChance?: number;
}

export function startArticleHeadingDecode(
  container: HTMLElement,
  options: DecodeOptions = {}
): () => void {
  const {
    duration = 1200,
    stagger = 150,
    scrambleLength = 4,
    preserveChance = 0.2,
    tailChance = 0.4,
  } = options;

  const animFrameIds = new Set<number>();
  const originalTexts = new Map<Text, string>();
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const decodeElement = (element: Element, delay: number) => {
    if (prefersReducedMotion) return;

    const textNodes: Array<{ node: Text; original: string }> = [];
    const extractTextNodes = (node: Node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          const textNode = child as Text;
          const text = textNode.textContent ?? '';
          originalTexts.set(textNode, text);
          textNodes.push({ node: textNode, original: text });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          extractTextNodes(child);
        }
      }
    };

    extractTextNodes(element);
    const totalChars = textNodes.reduce((acc, item) => acc + item.original.length, 0);
    const startTime = performance.now() + delay;

    const step = (now: number) => {
      const elapsed = clamp((now - startTime) / Math.max(1, duration), 0, 1);
      if (now < startTime) {
        const frame = requestAnimationFrame(step);
        animFrameIds.add(frame);
        return;
      }

      let revealedChars = Math.floor(easeOutQuad(elapsed) * totalChars);

      for (const item of textNodes) {
        const len = item.original.length;
        const currentCount = clamp(revealedChars, 0, len);
        revealedChars -= currentCount;

        if (currentCount >= len) {
          item.node.textContent = item.original;
          continue;
        }

        let result = item.original.slice(0, currentCount);
        const scrambleCount = Math.min(len - currentCount, Math.round(scrambleLength));

        for (let i = 0; i < scrambleCount; i++) {
          const char = item.original[currentCount + i];
          if (char === ' ' || Math.random() < preserveChance) {
            result += char;
          } else {
            result += ARTICLE_HEADING_DECODE_POOL[Math.floor(Math.random() * ARTICLE_HEADING_DECODE_POOL.length)];
          }
        }

        result += item.original
          .slice(currentCount + scrambleCount)
          .replace(/\S/g, (char) =>
            Math.random() < tailChance
              ? ARTICLE_HEADING_DECODE_POOL[Math.floor(Math.random() * ARTICLE_HEADING_DECODE_POOL.length)]
              : char
          );

        item.node.textContent = result;
      }

      if (elapsed < 1) {
        const frame = requestAnimationFrame(step);
        animFrameIds.add(frame);
      }
    };

    const initialFrame = requestAnimationFrame(step);
    animFrameIds.add(initialFrame);
  };

  const headingElements = container.querySelectorAll('[data-article-heading]');
  if (headingElements.length > 0) {
    headingElements.forEach((el, index) => {
      decodeElement(el, index * stagger);
    });
  } else {
    // If no data-article-heading attribute, decode container itself
    decodeElement(container, 0);
  }

  return () => {
    animFrameIds.forEach((id) => cancelAnimationFrame(id));
  };
}
