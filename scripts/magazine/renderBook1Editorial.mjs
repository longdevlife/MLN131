import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { coverFront, coverBack, pages } from './book1EditorialRenderData.mjs';

const VIEWPORT = { width: 768, height: 1152 };
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/magazine/book1');

// Base64 encode local fonts for zero-network deterministic rendering
const fontRegularPath = path.resolve(process.cwd(), 'public/fonts/roboto-regular.woff');
const fontBoldPath = path.resolve(process.cwd(), 'public/fonts/roboto-bold.woff');
const fontRegularB64 = fs.readFileSync(fontRegularPath).toString('base64');
const fontBoldB64 = fs.readFileSync(fontBoldPath).toString('base64');

const BASE_CSS = `
  @font-face {
    font-family: 'MLNBookSans';
    src: url('data:font/woff;base64,${fontRegularB64}') format('woff');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'MLNBookSans';
    src: url('data:font/woff;base64,${fontBoldB64}') format('woff');
    font-weight: 700;
    font-style: normal;
  }

  :root {
    --paper: #efe7d8;
    --paper-deep: #ded3bf;
    --ink: #151719;
    --ink-soft: #555047;
    --ink-faint: #827b70;
    --gold: #aa854d;
    --copper: #a86643;
    --rule: rgba(82, 69, 54, 0.20);
    --rule-light: rgba(82, 69, 54, 0.10);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 768px;
    height: 1152px;
    overflow: hidden;
    background-color: var(--paper);
    color: var(--ink);
    font-family: 'MLNBookSans', sans-serif;
    position: relative;
    -webkit-font-smoothing: antialiased;
  }

  .paper-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 28%, #faf6ee 0%, #efe7d8 60%, #e2d5be 100%);
    pointer-events: none;
  }

  /* Academic editorial frame */
  .page-frame {
    position: absolute;
    inset: 28px;
    border: 1px solid var(--rule);
    pointer-events: none;
  }
  .page-frame-inner {
    position: absolute;
    inset: 34px;
    border: 1px solid rgba(170, 133, 77, 0.15);
    pointer-events: none;
  }

  /* Gutter offset: odd page (left page) extra right margin, even page (right page) extra left margin */
  .content-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 2;
  }

  .is-odd {
    padding: 68px 84px 64px 68px;
  }
  .is-even {
    padding: 68px 68px 64px 84px;
  }

  /* Editorial header */
  .kicker-line {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .kicker-text {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: var(--copper);
    text-transform: uppercase;
  }
  .kicker-rule {
    flex: 1;
    height: 1px;
    background: var(--rule);
  }

  .headline {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.22;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-bottom: 24px;
    max-width: 580px;
  }

  .body-copy {
    font-size: 20px;
    line-height: 1.62;
    color: var(--ink-soft);
    font-weight: 400;
    margin-bottom: 28px;
    max-width: 580px;
  }

  /* Diagram workspace with ample negative space (>= 40%) */
  .diagram-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 8px 0 20px 0;
  }

  /* Footer */
  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid var(--rule);
    padding-top: 14px;
    font-size: 13px;
    color: var(--ink-faint);
    letter-spacing: 0.04em;
  }
  .footer-left {
    max-width: 500px;
    line-height: 1.45;
  }
  .page-number {
    font-weight: 700;
    color: var(--copper);
    font-size: 15px;
  }

  /* Editorial SVG & typography elements (NO DASHBOARD CARDS) */
  .equation-container {
    width: 100%;
    max-width: 540px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px 0;
  }
  .equation-term {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--ink);
    padding: 14px 28px;
    border-bottom: 1px solid var(--rule);
    text-transform: uppercase;
  }
  .equation-op {
    font-size: 32px;
    font-weight: 700;
    color: var(--copper);
    margin: 12px 0;
    line-height: 1;
  }
  .equation-result {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--copper);
    padding: 16px 36px;
    border-top: 2px solid var(--gold);
    border-bottom: 2px solid var(--gold);
    text-transform: uppercase;
    margin-top: 4px;
  }
`;

function renderPageHTML(page) {
  const isOdd = page.number % 2 !== 0;
  const paddingClass = isOdd ? 'is-odd' : 'is-even';

  let diagramHTML = '';

  switch (page.layout) {
    // PAGE 01 & 03: Editorial Typographic Equation
    case 'definition': {
      const term1 = page.labels?.[0] || 'CỘNG ĐỒNG NGƯỜI';
      const term2 = page.labels?.[1] || 'MỐI QUAN HỆ XÃ HỘI';
      diagramHTML = `
        <div class="equation-container">
          <div class="equation-term">${term1}</div>
          <div class="equation-op">+</div>
          <div class="equation-term">${term2}</div>
          <div class="equation-op">=</div>
          <div class="equation-result">CƠ CẤU XÃ HỘI</div>
        </div>
      `;
      break;
    }

    // PAGE 02: Constellation / Radial Diagram with SVG linework
    case 'constellation': {
      diagramHTML = `
        <div style="width: 100%; max-width: 550px; display: flex; flex-direction: column; align-items: center;">
          <svg viewBox="0 0 540 340" width="540" height="340" style="overflow: visible;">
            <!-- Subtle background orbit guide -->
            <ellipse cx="270" cy="170" rx="200" ry="115" fill="none" stroke="rgba(170, 133, 77, 0.15)" stroke-dasharray="4,4" />
            
            <!-- Connecting lines from center to nodes -->
            <line x1="270" y1="170" x2="270" y2="52" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3,3" />
            <line x1="270" y1="170" x2="435" y2="125" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3,3" />
            <line x1="270" y1="170" x2="385" y2="285" stroke="var(--copper)" stroke-width="1.8" />
            <line x1="270" y1="170" x2="155" y2="285" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3,3" />
            <line x1="270" y1="170" x2="105" y2="125" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3,3" />

            <!-- Node 1: Top - Dân cư -->
            <g transform="translate(270, 52)">
              <circle r="22" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="12" font-weight="700" fill="var(--copper)" font-family="MLNBookSans">01</text>
              <text y="-30" text-anchor="middle" font-size="16" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Dân cư</text>
            </g>

            <!-- Node 2: Right - Nghề nghiệp -->
            <g transform="translate(435, 125)">
              <circle r="22" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="12" font-weight="700" fill="var(--copper)" font-family="MLNBookSans">02</text>
              <text x="32" y="5" text-anchor="start" font-size="16" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Nghề nghiệp</text>
            </g>

            <!-- Node 3: Bottom Right - Giai cấp (HIGHLIGHTED) -->
            <g transform="translate(385, 285)">
              <circle r="26" fill="var(--copper)" stroke="#faf6ee" stroke-width="2" />
              <circle r="32" fill="none" stroke="var(--copper)" stroke-width="1.2" stroke-dasharray="3,2" />
              <text y="6" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="MLNBookSans">03</text>
              <text x="40" y="5" text-anchor="start" font-size="18" font-weight="700" fill="var(--copper)" font-family="MLNBookSans">Giai cấp</text>
              <text x="40" y="24" text-anchor="start" font-size="11" font-weight="700" fill="var(--gold)" letter-spacing="0.08em" font-family="MLNBookSans">TRỌNG TÂM</text>
            </g>

            <!-- Node 4: Bottom Left - Dân tộc -->
            <g transform="translate(155, 285)">
              <circle r="22" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="12" font-weight="700" fill="var(--copper)" font-family="MLNBookSans">04</text>
              <text x="-32" y="5" text-anchor="end" font-size="16" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Dân tộc</text>
            </g>

            <!-- Node 5: Left - Tôn giáo -->
            <g transform="translate(105, 125)">
              <circle r="22" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="12" font-weight="700" fill="var(--copper)" font-family="MLNBookSans">05</text>
              <text x="-32" y="5" text-anchor="end" font-size="16" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Tôn giáo</text>
            </g>

            <!-- CENTER NODE: Cơ cấu xã hội -->
            <g transform="translate(270, 170)">
              <circle r="48" fill="#faf6ee" stroke="var(--gold)" stroke-width="2" />
              <circle r="54" fill="none" stroke="var(--rule)" stroke-width="1" />
              <text y="-6" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="0.14em" fill="var(--copper)" font-family="MLNBookSans">TRUNG TÂM</text>
              <text y="14" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">CƠ CẤU XÃ HỘI</text>
            </g>
          </svg>
        </div>
      `;
      break;
    }

    // PAGE 04: Four Dimensions (Linework Quadrant, No Boxes)
    case 'four-dimensions': {
      diagramHTML = `
        <div style="width: 100%; max-width: 540px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px 36px; padding: 20px 0; position: relative;">
          <!-- Quadrant central thin axis lines -->
          <div style="position: absolute; top: 12px; bottom: 12px; left: 50%; width: 1px; background: var(--rule);"></div>
          <div style="position: absolute; left: 12px; right: 12px; top: 50%; height: 1px; background: var(--rule);"></div>

          ${(page.labels || []).map((dim, idx) => `
            <div style="padding: 12px 18px;">
              <div style="font-size: 13px; font-weight: 700; color: var(--copper); letter-spacing: 0.14em; margin-bottom: 8px;">
                0${idx + 1} / QUAN HỆ
              </div>
              <div style="font-size: 19px; font-weight: 700; color: var(--ink); line-height: 1.4;">
                ${dim}
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    // PAGE 05 & 06: Orbital Diagrams
    // Page 05: Outward influence (Centrifugal / Influence outward)
    // Page 06: Reciprocal influence (Bidirectional arrows)
    case 'orbital': {
      const isPage6 = page.number === 6;
      const arrowSymbol = isPage6 ? '↔' : '→';

      diagramHTML = `
        <div style="width: 100%; max-width: 550px; display: flex; flex-direction: column; align-items: center;">
          <svg viewBox="0 0 540 360" width="540" height="360" style="overflow: visible;">
            <defs>
              <marker id="arrow-gold" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--copper)" />
              </marker>
              <marker id="arrow-gold-rev" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 8 1.5 L 0 5 L 8 8.5 z" fill="var(--copper)" />
              </marker>
            </defs>

            <!-- Concentric orbital rings -->
            <ellipse cx="270" cy="180" rx="130" ry="75" fill="none" stroke="rgba(170, 133, 77, 0.2)" stroke-dasharray="3,3" />
            <ellipse cx="270" cy="180" rx="210" ry="120" fill="none" stroke="rgba(170, 133, 77, 0.3)" stroke-width="1.2" />

            <!-- Connecting Rays with directional markers -->
            <!-- Top: Dân cư -->
            <line x1="270" y1="120" x2="270" y2="72" stroke="var(--copper)" stroke-width="1.5" marker-end="url(#arrow-gold)" ${isPage6 ? 'marker-start="url(#arrow-gold-rev)"' : ''} />
            <!-- Right: Nghề nghiệp -->
            <line x1="365" y1="180" x2="425" y2="180" stroke="var(--copper)" stroke-width="1.5" marker-end="url(#arrow-gold)" ${isPage6 ? 'marker-start="url(#arrow-gold-rev)"' : ''} />
            <!-- Bottom: Tôn giáo -->
            <line x1="270" y1="240" x2="270" y2="288" stroke="var(--copper)" stroke-width="1.5" marker-end="url(#arrow-gold)" ${isPage6 ? 'marker-start="url(#arrow-gold-rev)"' : ''} />
            <!-- Left: Dân tộc -->
            <line x1="175" y1="180" x2="115" y2="180" stroke="var(--copper)" stroke-width="1.5" marker-end="url(#arrow-gold)" ${isPage6 ? 'marker-start="url(#arrow-gold-rev)"' : ''} />

            <!-- Orbital Peripheral Nodes -->
            <!-- Node: Dân cư -->
            <g transform="translate(270, 48)">
              <circle r="20" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Dân cư</text>
            </g>

            <!-- Node: Nghề nghiệp -->
            <g transform="translate(450, 180)">
              <circle r="20" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Nghề nghiệp</text>
            </g>

            <!-- Node: Tôn giáo -->
            <g transform="translate(270, 312)">
              <circle r="20" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Tôn giáo</text>
            </g>

            <!-- Node: Dân tộc -->
            <g transform="translate(90, 180)">
              <circle r="20" fill="#faf6ee" stroke="var(--gold)" stroke-width="1.5" />
              <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">Dân tộc</text>
            </g>

            <!-- CENTER ORBITAL NUCLEUS: Cơ cấu xã hội – giai cấp -->
            <g transform="translate(270, 180)">
              <circle r="52" fill="#faf6ee" stroke="var(--copper)" stroke-width="2" />
              <circle r="60" fill="none" stroke="var(--copper)" stroke-width="1" stroke-dasharray="4,2" />
              <text y="-8" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="0.12em" fill="var(--copper)" font-family="MLNBookSans">VỊ TRÍ HÀNG ĐẦU</text>
              <text y="10" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" font-family="MLNBookSans">CƠ CẤU XH – GC</text>
            </g>
          </svg>

          <!-- Editorial subtitle under diagram -->
          <div style="margin-top: 10px; font-size: 14px; font-weight: 700; letter-spacing: 0.12em; color: var(--copper); text-transform: uppercase;">
            ${isPage6 ? 'Tác động qua lại hai chiều (Reciprocal)' : 'Tác động chi phối lan tỏa (Outward Influence)'}
          </div>
        </div>
      `;
      break;
    }

    // PAGE 07 & 08: Flow / Sequential Transition
    case 'flow': {
      const steps = page.labels || ['Cơ cấu kinh tế', 'Lao động & nghề nghiệp', 'Cơ cấu XH–GC'];
      diagramHTML = `
        <div style="width: 100%; max-width: 520px; display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 12px 0;">
          ${steps.map((step, idx, arr) => `
            <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--rule);">
              <div style="display: flex; align-items: center; gap: 16px;">
                <span style="font-size: 13px; font-weight: 700; color: var(--copper); letter-spacing: 0.1em;">
                  BƯỚC 0${idx + 1}
                </span>
                <span style="font-size: 19px; font-weight: 700; color: var(--ink);">
                  ${step}
                </span>
              </div>
              <div style="font-size: 18px; color: var(--gold); font-weight: 700;">
                ${idx < arr.length - 1 ? '↓' : '●'}
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    // PAGE 09 & 10: Branching / Diversification (Linework Tree, ZERO academic text)
    case 'branching': {
      const items = page.labels || ['Nghề nghiệp', 'Trình độ', 'Thu nhập', 'Vị thế'];
      diagramHTML = `
        <div style="width: 100%; max-width: 540px; display: flex; flex-direction: column; align-items: center; padding: 10px 0;">
          <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.14em; color: var(--copper); text-transform: uppercase; margin-bottom: 16px;">
            CÁC TIÊU CHÍ PHÂN HÓA NỘI BỘ
          </div>
          <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 18px 24px;">
            ${items.map((crit, idx) => `
              <div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-left: 2px solid var(--gold);">
                <span style="font-size: 12px; font-weight: 700; color: var(--copper);">0${idx + 1}</span>
                <span style="font-size: 17px; font-weight: 700; color: var(--ink);">${crit}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }

    // PAGE 11 & 12: Convergence / Dual Trends (ZERO hard-coded claims)
    case 'convergence': {
      diagramHTML = `
        <div style="width: 100%; max-width: 540px; display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 16px 0;">
          <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; position: relative;">
            <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: var(--rule);"></div>
            
            <div style="padding: 10px 16px; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: var(--gold); text-transform: uppercase; margin-bottom: 8px;">
                MẶT THỐNG NHẤT
              </div>
              <div style="font-size: 20px; font-weight: 700; color: var(--ink);">
                Hợp tác & Liên minh
              </div>
            </div>

            <div style="padding: 10px 16px; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: var(--copper); text-transform: uppercase; margin-bottom: 8px;">
                MẶT KHÁC BIỆT
              </div>
              <div style="font-size: 20px; font-weight: 700; color: var(--ink);">
                Khác biệt & Đấu tranh
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 16px; width: 100%; justify-content: center; padding-top: 12px; border-top: 1px dashed var(--rule);">
            <span style="font-size: 18px; color: var(--copper); font-weight: 700;">→</span>
            <span style="font-size: 15px; font-weight: 700; letter-spacing: 0.08em; color: var(--copper); text-transform: uppercase;">
              Từng bước xích lại gần nhau
            </span>
            <span style="font-size: 18px; color: var(--copper); font-weight: 700;">←</span>
          </div>
        </div>
      `;
      break;
    }

    // PAGE 13: Synthesis (Interlinked Sequence, Clean Editorial)
    case 'synthesis': {
      const pts = page.labels || ['Kinh tế thay đổi', 'Cơ cấu XH–GC thay đổi', 'Lợi ích vừa thống nhất vừa khác biệt'];
      diagramHTML = `
        <div style="width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 20px; padding: 16px 0;">
          ${pts.map((pt, i) => `
            <div style="display: flex; align-items: baseline; gap: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--rule);">
              <span style="font-size: 22px; font-weight: 700; color: var(--copper);">0${i + 1}</span>
              <span style="font-size: 20px; font-weight: 700; color: var(--ink); line-height: 1.35;">${pt}</span>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    // PAGE 14: Bridge / Question-only Transition to Book II
    // MUST NOT assert any answer or necessity of alliance
    case 'transition': {
      diagramHTML = `
        <div style="width: 100%; max-width: 520px; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 20px;">
          <div style="font-size: 64px; color: var(--copper); font-weight: 700; margin-bottom: 24px; line-height: 1;">
            ?
          </div>
          <div style="width: 48px; height: 1px; background: var(--gold); margin-bottom: 24px;"></div>
          <div style="font-size: 14px; font-weight: 700; letter-spacing: 0.16em; color: var(--copper); text-transform: uppercase;">
            CÂU HỎI MỞ RA QUYỂN II
          </div>
        </div>
      `;
      break;
    }

    default:
      diagramHTML = '';
  }

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <style>${BASE_CSS}</style>
    </head>
    <body>
      <div class="paper-bg"></div>
      <div class="page-frame"></div>
      <div class="page-frame-inner"></div>
      <div class="content-container ${paddingClass}">
        <div class="kicker-line">
          <span class="kicker-text">${page.kicker}</span>
          <div class="kicker-rule"></div>
        </div>
        <h1 class="headline">${page.headline}</h1>
        ${page.body ? `<div class="body-copy">${page.body}</div>` : ''}
        <div class="diagram-stage">
          ${diagramHTML}
        </div>
        <div class="page-footer">
          <div class="footer-left">
            ${page.footer ? page.footer : 'Giáo trình Chủ nghĩa xã hội khoa học (2021) · Chương 5'}
          </div>
          <div class="page-number">${String(page.number).padStart(2, '0')}</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function renderCoverFrontHTML(data) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <style>
        ${BASE_CSS}
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 44px;
        }
        .cover-box {
          width: 100%;
          height: 100%;
          border: 1px solid var(--rule);
          border-radius: 4px;
          padding: 64px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          background: radial-gradient(circle at 50% 25%, #fbf8f2 0%, #efe7d8 65%, #decfae 100%);
        }
        .cover-frame-inner {
          position: absolute;
          inset: 8px;
          border: 1px solid rgba(170, 133, 77, 0.25);
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="paper-bg"></div>
      <div class="cover-box">
        <div class="cover-frame-inner"></div>
        
        <!-- Header Series -->
        <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.2em; color: var(--copper); text-transform: uppercase; margin-bottom: 24px;">
          ${data.series}
        </div>
        <div style="width: 48px; height: 1.5px; background: var(--copper); margin-bottom: 44px;"></div>
        
        <!-- Academic Hierarchy -->
        <div style="font-size: 15px; font-weight: 700; color: var(--gold); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px;">
          ${data.discipline}
        </div>
        <div style="font-size: 14px; font-weight: 700; color: var(--ink-soft); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 32px;">
          CHƯƠNG 5
        </div>

        <div style="font-size: 22px; font-weight: 700; color: var(--copper); letter-spacing: 0.12em; margin-bottom: 28px;">
          ${data.volume}
        </div>

        <!-- Book Title: Strictly CƠ CẤU XÃ HỘI – GIAI CẤP -->
        <h1 style="font-size: 46px; font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; color: var(--ink); margin-bottom: 36px; max-width: 540px; text-transform: uppercase;">
          ${data.title}
        </h1>

        <div style="width: 32px; height: 1px; background: var(--rule); margin-bottom: 28px;"></div>

        <div style="font-size: 16px; color: var(--ink-soft); line-height: 1.5; max-width: 460px; margin-bottom: auto;">
          ${data.chapter}
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: auto; padding-top: 32px;">
          <div style="font-size: 13px; letter-spacing: 0.08em; color: var(--ink-soft);">
            Bộ Giáo dục và Đào tạo · Năm 2021
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function renderCoverBackHTML(data) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <style>
        ${BASE_CSS}
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 44px;
        }
        .back-box {
          width: 100%;
          height: 100%;
          border: 1px solid var(--rule);
          border-radius: 4px;
          padding: 64px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          background: #efe7d8;
        }
      </style>
    </head>
    <body>
      <div class="paper-bg"></div>
      <div class="back-box">
        <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.16em; color: var(--gold); text-transform: uppercase;">
          TỔNG KẾT XUẤT BẢN
        </div>

        <div style="max-width: 480px;">
          <div style="font-size: 24px; font-weight: 700; color: var(--ink); margin-bottom: 18px;">
            ${data.title}
          </div>
          <div style="font-size: 16px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 24px;">
            ${data.summary}
          </div>
          <div style="font-size: 13px; color: var(--copper); font-weight: 700;">
            ${data.edition}
          </div>
        </div>

        <div style="font-size: 12px; color: var(--ink-soft); letter-spacing: 0.04em;">
          ${data.colophon}
        </div>
      </div>
    </body>
    </html>
  `;
}

async function run() {
  console.log('[RenderBook1] Starting deterministic texture rendering...');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // 1. Render Cover Front
  console.log('[RenderBook1] Rendering cover-front.png...');
  await page.setContent(renderCoverFrontHTML(coverFront));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'cover-front.png'),
    clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
  });

  // 2. Render Pages 01 to 14
  for (const p of pages) {
    const filename = `page-${String(p.number).padStart(2, '0')}.png`;
    console.log(`[RenderBook1] Rendering ${filename} (layout: ${p.layout})...`);
    await page.setContent(renderPageHTML(p));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, filename),
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
    });
  }

  // 3. Render Cover Back
  console.log('[RenderBook1] Rendering cover-back.png...');
  await page.setContent(renderCoverBackHTML(coverBack));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'cover-back.png'),
    clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
  });

  await browser.close();
  console.log('[RenderBook1] Finished generating all 16 textures at 768x1152.');
}

run().catch((err) => {
  console.error('[RenderBook1] Fatal error:', err);
  process.exit(1);
});
