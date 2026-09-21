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
    --ink-soft: #5f5b54;
    --gold: #aa854d;
    --copper: #a86643;
    --rule: rgba(82, 69, 54, 0.22);
    --gold-bg: rgba(170, 133, 77, 0.08);
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
    background: radial-gradient(circle at 50% 30%, #f6f0e6 0%, #efe7d8 65%, #e3d7c3 100%);
    pointer-events: none;
  }

  /* Academic frame */
  .page-frame {
    position: absolute;
    inset: 28px;
    border: 1px solid var(--rule);
    pointer-events: none;
  }
  .page-frame-inner {
    position: absolute;
    inset: 34px;
    border: 1px solid rgba(170, 133, 77, 0.18);
    pointer-events: none;
  }

  /* Gutter offset: odd page (left side) extra right margin, even page (right side) extra left margin */
  .content-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 2;
  }

  .is-odd {
    padding: 72px 88px 72px 64px;
  }
  .is-even {
    padding: 72px 64px 72px 88px;
  }

  /* Header elements */
  .kicker-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 20px;
    background: rgba(168, 102, 67, 0.12);
    border: 1px solid rgba(168, 102, 67, 0.35);
    color: var(--copper);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 24px;
    align-self: flex-start;
  }

  .headline {
    font-size: 42px;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin-bottom: 28px;
    max-width: 580px;
  }

  .body-copy {
    font-size: 21px;
    line-height: 1.62;
    color: var(--ink-soft);
    font-weight: 400;
    margin-bottom: 36px;
    max-width: 580px;
  }

  /* Diagram area */
  .diagram-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    margin: 12px 0 24px 0;
  }

  /* Footer */
  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid var(--rule);
    padding-top: 16px;
    font-size: 13px;
    color: var(--ink-soft);
    letter-spacing: 0.04em;
  }
  .footer-left {
    max-width: 460px;
    line-height: 1.45;
  }
  .page-number {
    font-weight: 700;
    color: var(--copper);
    font-size: 16px;
  }

  /* Common component cards */
  .tag-box {
    background: #f8f4ec;
    border: 1px solid rgba(170, 133, 77, 0.35);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 4px 14px rgba(82, 69, 54, 0.06);
  }
`;

function renderPageHTML(page) {
  const isOdd = page.number % 2 !== 0;
  const paddingClass = isOdd ? 'is-odd' : 'is-even';

  let diagramHTML = '';

  switch (page.layout) {
    case 'definition': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px; max-width: 540px;">
          <div class="tag-box" style="border-left: 6px solid var(--copper); padding: 24px;">
            <div style="font-size: 14px; font-weight: 700; color: var(--copper); margin-bottom: 8px; text-transform: uppercase;">Trọng tâm cốt lõi</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--ink); line-height: 1.4;">
              ${page.labels ? page.labels.join('  ✦  ') : 'Hệ thống các giai tầng xã hội'}
            </div>
          </div>
          <div style="display: flex; gap: 16px; align-items: center; padding: 12px 18px; background: rgba(170, 133, 77, 0.08); border-radius: 8px; border: 1px dashed var(--gold);">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--gold);"></div>
            <div style="font-size: 15px; color: var(--ink-soft);">Xuất phát từ quan hệ sản xuất khách quan trong từng phương thức sản xuất.</div>
          </div>
        </div>
      `;
      break;
    }

    case 'constellation': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px; max-width: 540px;">
          <div style="font-size: 14px; font-weight: 700; color: var(--copper); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">5 Lát Cắt Xã Hội</div>
          ${page.labels.map((lbl, idx) => {
            const isTarget = lbl === 'Giai cấp';
            return `
              <div class="tag-box" style="display: flex; justify-content: space-between; align-items: center; ${isTarget ? 'border: 2px solid var(--copper); background: #fdfaf4;' : ''}">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isTarget ? 'var(--copper)' : 'rgba(82,69,54,0.12)'}; color: ${isTarget ? '#fff' : 'var(--ink)'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                    0${idx + 1}
                  </div>
                  <div style="font-size: 19px; font-weight: ${isTarget ? '700' : '400'}; color: ${isTarget ? 'var(--copper)' : 'var(--ink)'};">
                    ${lbl}
                  </div>
                </div>
                ${isTarget ? '<span style="font-size: 12px; font-weight: 700; background: rgba(168,102,67,0.15); color: var(--copper); padding: 4px 10px; border-radius: 12px;">TRỌNG TÂM NGHIÊN CỨU</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
      break;
    }

    case 'four-dimensions': {
      diagramHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 560px;">
          ${page.labels.map((dim, idx) => `
            <div class="tag-box" style="padding: 22px 18px; border-top: 4px solid var(--gold);">
              <div style="font-size: 13px; font-weight: 700; color: var(--gold); margin-bottom: 8px;">CHIỀU KÍCH 0${idx + 1}</div>
              <div style="font-size: 18px; font-weight: 700; color: var(--ink); line-height: 1.35;">${dim}</div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'orbital': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px; max-width: 550px;">
          <div class="tag-box" style="border: 2px solid var(--copper); background: #fdfaf4; padding: 24px; text-align: center;">
            <div style="font-size: 13px; font-weight: 700; color: var(--copper); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">TÂM ĐIỂM HỆ THỐNG</div>
            <div style="font-size: 26px; font-weight: 700; color: var(--ink);">CƠ CẤU XÃ HỘI – GIAI CẤP</div>
            <div style="font-size: 15px; color: var(--ink-soft); margin-top: 6px;">Giữ vị trí quan trọng hàng đầu</div>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: 8px; color: var(--copper); font-size: 18px; font-weight: 700;">
            <span>▲ Tác động qua lại hai chiều ▼</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="tag-box" style="padding: 14px; text-align: center; font-size: 15px; font-weight: 700;">Dân tộc & Tôn giáo</div>
            <div class="tag-box" style="padding: 14px; text-align: center; font-size: 15px; font-weight: 700;">Dân cư & Nghề nghiệp</div>
          </div>
        </div>
      `;
      break;
    }

    case 'flow': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px; max-width: 540px;">
          ${(page.labels || ['Cơ cấu kinh tế', 'Lao động & nghề nghiệp', 'Cơ cấu XH–GC']).map((step, idx, arr) => `
            <div class="tag-box" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 22px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: var(--copper); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                  ${idx + 1}
                </div>
                <div style="font-size: 18px; font-weight: 700; color: var(--ink);">${step}</div>
              </div>
              ${idx < arr.length - 1 ? '<div style="color: var(--copper); font-weight: 700; font-size: 20px;">↓</div>' : '<div style="color: var(--gold); font-size: 14px; font-weight: 700;">ĐÍCH ĐẾN</div>'}
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'branching': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px; max-width: 540px;">
          <div style="font-size: 14px; font-weight: 700; color: var(--copper); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px;">Các Tiêu Chí Phân Hóa</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            ${(page.labels || ['Nghề nghiệp', 'Trình độ', 'Thu nhập', 'Vị thế']).map((crit) => `
              <div class="tag-box" style="padding: 16px; border-left: 4px solid var(--gold);">
                <div style="font-size: 16px; font-weight: 700; color: var(--ink);">${crit}</div>
              </div>
            `).join('')}
          </div>
          <div class="tag-box" style="margin-top: 8px; background: rgba(170, 133, 77, 0.08); border: 1px dashed var(--gold); padding: 16px;">
            <div style="font-size: 14px; color: var(--ink-soft); line-height: 1.5;">Nền kinh tế nhiều thành phần mở ra cơ hội phát triển cho các tầng lớp mới: doanh nhân, lao động tự do, chuyên gia công nghệ.</div>
          </div>
        </div>
      `;
      break;
    }

    case 'convergence': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px; max-width: 540px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="tag-box" style="border-top: 4px solid #3c825a; padding: 20px;">
              <div style="font-size: 13px; font-weight: 700; color: #3c825a; margin-bottom: 6px;">MẶT THỐNG NHẤT</div>
              <div style="font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 8px;">Liên minh & Hợp tác</div>
              <div style="font-size: 14px; color: var(--ink-soft); line-height: 1.4;">Chung mục tiêu xây dựng đất nước phồn vinh, độc lập và dân chủ.</div>
            </div>
            <div class="tag-box" style="border-top: 4px solid var(--copper); padding: 20px;">
              <div style="font-size: 13px; font-weight: 700; color: var(--copper); margin-bottom: 6px;">MẶT KHÁC BIỆT</div>
              <div style="font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 8px;">Khác biệt & Căng thẳng</div>
              <div style="font-size: 14px; color: var(--ink-soft); line-height: 1.4;">Khác biệt về địa vị, phương thức hưởng thụ và lợi ích cục bộ.</div>
            </div>
          </div>
          <div class="tag-box" style="padding: 16px 22px; text-align: center; border: 1px solid var(--gold); background: #fdfaf4;">
            <div style="font-size: 16px; font-weight: 700; color: var(--copper);">Từng bước xích lại gần nhau — Thu hẹp khoảng cách bất hợp lý</div>
          </div>
        </div>
      `;
      break;
    }

    case 'synthesis': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px; max-width: 540px;">
          ${(page.labels || ['1. Kinh tế', '2. Cơ cấu XH', '3. Lợi ích']).map((pt, i) => `
            <div class="tag-box" style="display: flex; align-items: center; gap: 16px; padding: 20px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--copper); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700;">
                0${i + 1}
              </div>
              <div style="font-size: 19px; font-weight: 700; color: var(--ink);">${pt}</div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'transition': {
      diagramHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; max-width: 520px; margin: auto; padding: 40px 24px;">
          <div style="font-size: 72px; color: var(--copper); line-height: 1; margin-bottom: 24px; font-weight: 700;">?</div>
          <div class="tag-box" style="border: 2px solid var(--gold); padding: 30px; background: #fdfaf4;">
            <div style="font-size: 13px; font-weight: 700; color: var(--copper); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px;">CẦU NỐI SANG QUYỂN II</div>
            <div style="font-size: 24px; font-weight: 700; color: var(--ink); line-height: 1.45;">
              Nội dung cơ cấu xã hội – giai cấp đặt nền tảng tất yếu cho việc nghiên cứu liên minh giai cấp, tầng lớp.
            </div>
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
        <div class="kicker-pill">${page.kicker}</div>
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
          padding: 48px;
        }
        .cover-box {
          width: 100%;
          height: 100%;
          border: 2px solid var(--gold);
          border-radius: 16px;
          padding: 64px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          background: radial-gradient(circle at 50% 25%, #fbf8f2 0%, #efe7d8 70%, #dfd2bd 100%);
          box-shadow: inset 0 0 60px rgba(170, 133, 77, 0.1);
        }
        .cover-inner-border {
          position: absolute;
          inset: 12px;
          border: 1px dashed rgba(168, 102, 67, 0.35);
          border-radius: 10px;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="paper-bg"></div>
      <div class="cover-box">
        <div class="cover-inner-border"></div>
        <div style="font-size: 14px; font-weight: 700; letter-spacing: 0.18em; color: var(--copper); text-transform: uppercase; margin-bottom: 28px;">
          ${data.series}
        </div>
        <div style="width: 64px; height: 2px; background: var(--copper); margin-bottom: 40px;"></div>
        
        <div style="font-size: 16px; font-weight: 700; color: var(--gold); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 12px;">
          ${data.discipline}
        </div>
        <div style="font-size: 20px; font-weight: 700; color: var(--copper); margin-bottom: 36px;">
          ${data.volume}
        </div>

        <h1 style="font-size: 44px; font-weight: 700; line-height: 1.25; color: var(--ink); margin-bottom: 36px; max-width: 560px;">
          ${data.title}
        </h1>

        <div style="font-size: 16px; color: var(--ink-soft); line-height: 1.5; max-width: 480px; margin-bottom: auto;">
          ${data.chapter}
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: auto; padding-top: 36px;">
          <div style="width: 40px; height: 1px; background: var(--rule);"></div>
          <div style="font-size: 13px; letter-spacing: 0.06em; color: var(--ink-soft);">
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
          padding: 48px;
        }
        .back-box {
          width: 100%;
          height: 100%;
          border: 1px solid var(--rule);
          border-radius: 16px;
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
        <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.15em; color: var(--gold); text-transform: uppercase;">
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
