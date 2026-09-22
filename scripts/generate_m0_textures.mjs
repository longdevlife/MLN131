import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('public/magazine/book1');
fs.mkdirSync(outputDir, { recursive: true });

const pages = [
  {
    filename: 'cover-front.png',
    title: 'QUYỂN I',
    subtitle: 'CƠ CẤU XÃ HỘI – GIAI CẤP',
    header: 'CHỦ NGHĨA XÃ HỘI KHOA HỌC · CHƯƠNG 5',
    footer: 'TẠP CHÍ HỌC THUẬT & TRUYỀN THÔNG TRI THỨC',
    isCover: true,
    bg: '#0F1115',
    accent: '#C8A86A',
  },
  {
    filename: 'spread-01-front.png',
    title: '01 / KHÁI NIỆM',
    subtitle: 'Cơ cấu xã hội - giai cấp trong thời kỳ quá độ',
    header: 'QUYỂN I · CHƯƠNG 5',
    footer: 'Trang 1 · Editorial Prototype',
    isCover: false,
    bg: '#F5EFE6',
    accent: '#8A5A36',
  },
  {
    filename: 'spread-01-back.png',
    title: '02 / CẤU TRÚC',
    subtitle: 'Vị trí và mối quan hệ giữa các giai cấp, tầng lớp xã hội',
    header: 'QUYỂN I · CHƯƠNG 5',
    footer: 'Trang 2 · Visual Prototype',
    isCover: false,
    bg: '#F5EFE6',
    accent: '#8A5A36',
  },
  {
    filename: 'spread-02-front.png',
    title: '03 / BIẾN ĐỔI',
    subtitle: 'Tính quy luật của sự biến đổi cơ cấu xã hội - giai cấp',
    header: 'QUYỂN I · CHƯƠNG 5',
    footer: 'Trang 3 · Editorial Prototype',
    isCover: false,
    bg: '#F5EFE6',
    accent: '#8A5A36',
  },
  {
    filename: 'spread-02-back.png',
    title: '04 / LIÊN MINH',
    subtitle: 'Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên CNXH',
    header: 'QUYỂN I · CHƯƠNG 5',
    footer: 'Trang 4 · Visual Prototype',
    isCover: false,
    bg: '#F5EFE6',
    accent: '#8A5A36',
  },
  {
    filename: 'cover-back.png',
    title: 'HẾT QUYỂN I',
    subtitle: 'CHỦ NGHĨA XÃ HỘI KHOA HỌC',
    header: 'ĐẠI HỌC FPT · BỘ MÔN LÝ LUẬN CHÍNH TRỊ',
    footer: 'BẢN QUYỀN THUỘC VỀ NHÓM THỰC HIỆN ĐỀ TÀI',
    isCover: true,
    bg: '#0F1115',
    accent: '#C8A86A',
  },
];

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1368 },
    deviceScaleFactor: 1,
  });

  for (const p of pages) {
    const textColor = p.isCover ? '#F5EFE6' : '#1A1815';
    const subColor = p.isCover ? '#C8A86A' : '#5A4634';
    const borderColor = p.isCover ? '#C8A86A' : '#C4B59D';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1024px;
            height: 1368px;
            background: ${p.bg};
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${textColor};
          }
          .frame {
            width: 920px;
            height: 1264px;
            border: 2px solid ${borderColor};
            padding: 60px 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
          }
          .header {
            font-size: 18px;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: ${subColor};
            font-weight: 600;
            border-bottom: 1px solid ${borderColor};
            padding-bottom: 20px;
          }
          .center {
            margin: auto 0;
          }
          .title {
            font-size: 56px;
            font-weight: 800;
            letter-spacing: 0.08em;
            line-height: 1.2;
            margin-bottom: 24px;
            color: ${p.isCover ? p.accent : '#201810'};
          }
          .subtitle {
            font-size: 28px;
            font-weight: 500;
            line-height: 1.4;
            color: ${textColor};
            max-width: 800px;
          }
          .tag {
            display: inline-block;
            margin-top: 32px;
            padding: 8px 18px;
            border: 1px solid ${subColor};
            border-radius: 4px;
            font-size: 14px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: ${subColor};
          }
          .footer {
            font-size: 15px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: ${subColor};
            border-top: 1px solid ${borderColor};
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="frame">
          <div class="header">${p.header}</div>
          <div class="center">
            <div class="title">${p.title}</div>
            <div class="subtitle">${p.subtitle}</div>
            <div class="tag">${p.isCover ? 'Ấn phẩm số 01 · 2026' : 'Mô hình nghiên cứu học thuật'}</div>
          </div>
          <div class="footer">
            <span>${p.footer}</span>
            <span>MLN131</span>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'load' });
    const targetPath = path.join(outputDir, p.filename);
    await page.screenshot({ path: targetPath, type: 'png' });
    console.log(`Generated: ${targetPath}`);
  }

  await browser.close();
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
