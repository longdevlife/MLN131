const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'node_modules', '@designcodeio', 'threeui', 'lib-dist', 'shaders', 'bookshelf', 'bookshelfRenderer.js');
let content = fs.readFileSync(srcPath, 'utf8');

// 1. Locate S definition
const sStart = content.indexOf('const S = [');
const vrIdx = content.indexOf(', Vr = "data:image');
if (sStart === -1 || vrIdx === -1) {
  console.error('Failed to locate S array or Vr');
  process.exit(1);
}

const mlnBooksCode = `const S = [
    {
      id: "part-1",
      title: "Cơ cấu xã hội – giai cấp",
      roman: "I",
      discipline: "Khái luận & Quy luật",
      note: "Khái niệm, vị trí và các quy luật biến đổi trong TKQĐ.",
      deck: "Khái luận về cơ cấu xã hội - giai cấp trong thời kỳ quá độ lên chủ nghĩa xã hội: vị trí trung tâm chi phối các cơ cấu xã hội khác và xu hướng biến đổi có tính quy luật.",
      binding: "Ultramarine cloth · copper foil",
      format: "148 × 216 mm · Giáo trình 2021",
      theme: "Cơ cấu xã hội – giai cấp",
      motif: "Nested brackets",
      motifKey: "brackets",
      paletteLabel: "Ultramarine · bone · copper",
      color: "#182a43",
      foil: "#c87046",
      palette: {
        paper: "#171a24",
        paperDeep: "#10131b",
        paperPale: "#f1eadf",
        ink: "#f4eee6",
        inkSoft: "#b9b4ae",
        wall: "#171a24",
        shelf: "#3a2118",
        shelfDark: "#1c0e0a",
        light: "#f4d7b9",
        fill: "#9fb3c9"
      },
      width: 1.05,
      height: 1.58,
      depth: 0.28,
      chapters: ["Khái niệm", "Vị trí", "Quy luật biến đổi"],
      seed: 11
    },
    {
      id: "part-2",
      title: "Tính tất yếu của liên minh",
      roman: "II",
      discipline: "Cơ sở lý luận & thực tiễn",
      note: "Yêu cầu khách quan về kinh tế, chính trị và văn hóa - xã hội.",
      deck: "Tính tất yếu và nội dung của liên minh giai cấp công nhân với giai cấp nông dân và tầng lớp trí thức trong thời kỳ quá độ.",
      binding: "Burnt-orange cloth · antique-gold foil",
      format: "156 × 228 mm · Giáo trình 2021",
      theme: "Tính tất yếu của liên minh",
      motif: "Interlaced paths",
      motifKey: "paths",
      paletteLabel: "Burnt orange · cream · gold",
      color: "#c24d24",
      foil: "#efc16d",
      palette: {
        paper: "#762f1b",
        paperDeep: "#4a1c10",
        paperPale: "#f7f0e6",
        ink: "#fff7ed",
        inkSoft: "#ddc6b4",
        wall: "#171415",
        shelf: "#331c17",
        shelfDark: "#1a0e0c",
        light: "#ffe3ba",
        fill: "#e4a57b"
      },
      width: 1.08,
      height: 1.62,
      depth: 0.3,
      chapters: ["Kinh tế", "Chính trị", "Văn hóa - Xã hội"],
      seed: 19
    },
    {
      id: "part-3",
      title: "Việt Nam hiện nay",
      roman: "III",
      discipline: "Thực tiễn & Biến đổi",
      note: "Đặc điểm cơ cấu và liên minh trong bối cảnh đổi mới.",
      deck: "Cơ cấu xã hội - giai cấp và liên minh giai cấp, tầng lớp trong thời kỳ đổi mới và phát triển kinh tế thị trường định hướng XHCN tại Việt Nam.",
      binding: "Forest-emerald cloth · warm-gold foil",
      format: "152 × 222 mm · Giáo trình 2021",
      theme: "Thực tiễn Việt Nam",
      motif: "Orbits",
      motifKey: "orbits",
      paletteLabel: "Deep teal · gold · cream",
      color: "#1d3e35",
      foil: "#d4af37",
      palette: {
        paper: "#122b25",
        paperDeep: "#0a1c18",
        paperPale: "#e8f0ec",
        ink: "#f0f7f4",
        inkSoft: "#abc4bc",
        wall: "#101917",
        shelf: "#2e1e17",
        shelfDark: "#160e0a",
        light: "#fae8b2",
        fill: "#76a394"
      },
      width: 1.04,
      height: 1.56,
      depth: 0.27,
      chapters: ["Công nhân", "Nông dân", "Trí thức", "Doanh nhân"],
      seed: 27
    },
    {
      id: "part-4",
      title: "Phương hướng & giải pháp",
      roman: "IV",
      discipline: "Định hướng chiến lược",
      note: "Hệ thống giải pháp tăng cường liên minh và đồng thuận xã hội.",
      deck: "Phương hướng và các giải pháp cơ bản nhằm tăng cường khối đại đoàn kết toàn dân tộc và liên minh giai cấp trong giai đoạn hiện nay.",
      binding: "Crimson velvet cloth · muted-gold foil",
      format: "150 × 220 mm · Giáo trình 2021",
      theme: "Phương hướng & Giải pháp",
      motif: "Modules",
      motifKey: "modules",
      paletteLabel: "Crimson · gold · parchment",
      color: "#5c1d24",
      foil: "#dfb15b",
      palette: {
        paper: "#3d1116",
        paperDeep: "#240a0d",
        paperPale: "#f5ece8",
        ink: "#fdf2f2",
        inkSoft: "#cfb4b6",
        wall: "#1b1214",
        shelf: "#351b18",
        shelfDark: "#1a0c0a",
        light: "#ffe6c7",
        fill: "#bd7880"
      },
      width: 1.02,
      height: 1.54,
      depth: 0.26,
      chapters: ["Kinh tế", "Chính trị", "Văn hóa", "Xã hội"],
      seed: 33
    }
  ]`;

// Find end of base64 images declaration.
// Looking for `let qt = !1;` or `const at = new Image();`
const atIdx = content.indexOf('const at = new Image();');
if (atIdx === -1) {
  console.error('Failed to find atIdx');
  process.exit(1);
}

// Replace S and base64 strings
const beforeS = content.slice(0, sStart);
const afterAt = content.slice(atIdx);

let replaced = beforeS + mlnBooksCode + ';\n  const Vr = "", Yr = "";\n  let qt = !1;\n  ' + afterAt;

// Ensure qt is never set to true:
replaced = replaced.replace('await nt.decode(), qt = !0;', 'qt = !1;');

// In wn(e), enhance Vietnamese cover rendering:
// Replace header text
replaced = replaced.replace('`WORKING VOLUMES  /  ${e.roman}`', '`GIÁO TRÌNH CHƯƠNG V  /  TẬP ${e.roman}`');
replaced = replaced.replace('`WORKING VOLUMES  /  ${ge(r)}`', '`GIÁO TRÌNH CHƯƠNG V  /  TẬP ${ge(r)}`');

// Make sure onOpenBook is called when detail mode opens or toggle book
replaced = replaced.replace(
  'He.onModeChange?.("detail")',
  'He.onModeChange?.("detail"), He.onOpenBook?.(O, S[O])'
);

// Save to vendor destination
const destPath = path.join(__dirname, '..', 'src', 'vendor', 'threeui-custom', 'bookshelf', 'bookshelfRenderer.js');
fs.writeFileSync(destPath, replaced, 'utf8');
console.log('Successfully generated clean bookshelfRenderer.js at', destPath);
console.log('Original size:', content.length, '-> New size:', replaced.length);
