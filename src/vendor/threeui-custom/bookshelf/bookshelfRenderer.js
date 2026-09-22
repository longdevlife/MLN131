import * as l from "three165";
import { OrbitControls as na } from "./three165/OrbitControls.js";
import { RoomEnvironment as aa } from "./three165/RoomEnvironment.js";
import { RoundedBoxGeometry as Et } from "./three165/RoundedBoxGeometry.js";
import { RectAreaLightUniformsLib as ia } from "./three165/RectAreaLightUniformsLib.js";
import { normalizeVietnameseText, fitTextToWidth, fitSingleLineText } from "./typographyUtils";
function fa(Nr, m, He = {}) {
  let jt = !1;
  const S = [
    {
      id: "part-1",
      title: "Cơ cấu xã hội – giai cấp",
      roman: "I",
      discipline: "Khái luận & Quy luật",
      note: "Khái niệm, vị trí và sự biến đổi có tính quy luật trong TKQĐ.",
      deck: "Khái luận về cơ cấu xã hội – giai cấp trong TKQĐ: giữ vị trí quan trọng hàng đầu và có ảnh hưởng mạnh tới các loại hình cơ cấu xã hội khác cùng sự biến đổi có tính quy luật.",
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
      chapters: ["Khái niệm", "Vị trí", "Biến đổi có tính quy luật"],
      seed: 11
    },
    {
      id: "part-2",
      title: "Liên minh giai cấp, tầng lớp",
      roman: "II",
      discipline: "Cơ sở & nội dung liên minh",
      note: "Tính tất yếu và các phương diện kinh tế, chính trị, văn hóa – xã hội.",
      deck: "Tính tất yếu và nội dung của liên minh giai cấp công nhân với giai cấp nông dân và tầng lớp trí thức trong thời kỳ quá độ.",
      binding: "Burnt-orange cloth · antique-gold foil",
      format: "156 × 228 mm · Giáo trình 2021",
      theme: "Liên minh giai cấp, tầng lớp",
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
      title: "Cơ cấu & liên minh ở Việt Nam",
      roman: "III",
      discipline: "Thực tiễn & phương hướng",
      note: "Cơ cấu xã hội – giai cấp, liên minh và phương hướng củng cố ở Việt Nam.",
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
  ];
  const Vr = "", Yr = "";
  let qt = !1;
  const at = new Image();
  at.decoding = "async", at.src = Yr;
  let Rt = !1;
  const y = Nr, Ht = y.querySelector("#loading"), Fr = y.querySelector("#fallback-status"), zo = y.querySelector("#browse-ui"), Xe = y.querySelector("#detail-panel"), Jr = y.querySelector("#selection-title"), Or = y.querySelector("#selection-note"), Br = y.querySelector("#counter"), Qr = y.querySelector("#palette-label"), Xt = y.querySelector("#markers"), Io = y.querySelector("#previous"), Do = y.querySelector("#next"), ie = y.querySelector("#inspect"), Ut = y.querySelector("#close-detail"), Ko = y.querySelector("#reset-view"), it = y.querySelector("#toggle-book"), st = y.querySelector("#previous-page"), lt = y.querySelector("#next-page"), $r = y.querySelector("#page-label"), _r = y.querySelector("#page-counter"), en = document.querySelector(".detail-controls .microcopy"), tn = y.querySelector("#detail-eyebrow"), on = y.querySelector("#detail-title"), rn = y.querySelector("#detail-deck"), nn = y.querySelector("#detail-binding"), an = y.querySelector("#detail-format"), sn = y.querySelector("#detail-theme"), ln = y.querySelector("#detail-motif"), Ce = y.querySelector("#live-region"), Ue = y.querySelector("#pointer-label"), cn = y.querySelector("#pointer-label-index"), pn = y.querySelector("#pointer-label-title"), Zt = window.matchMedia("(prefers-reduced-motion: reduce)");
  Ht.hidden = !1;
  const A = l.MathUtils.clamp, k = l.MathUtils.damp, ue = l.MathUtils.lerp, Ze = (e) => e * e * (3 - 2 * e), ct = (e) => e * e * e * (e * (e * 6 - 15) + 10), We = (e, o) => (e % o + o) % o, ge = (e) => String(e).padStart(2, "0");
  let X = Zt.matches, D, R, L, z, Wt, W, pt = [], ko = [], ee = 0, Nt = performance.now(), b = "hero", te = 0, oe = 0, V = 0, O = 0, Vt = -1, Ne = 0, dt = ie, u = null, K = !1, me = !1, H = 0, Ve = !1, Ae = !1, G = Math.max(1, y.clientWidth), Se = Math.max(1, y.clientHeight), Ye = 0, se = 0, Ge = G * 0.6, Mo = !1, ft = !1, pendingNavigation = null, _lastSettledReported = null;
  const B = {
    floor: null,
    wall: null,
    shelf: null,
    shelfDark: null,
    shadow: null
  }, I = {
    hemisphere: null,
    key: null,
    softKey: null,
    fill: null,
    rim: null,
    backFill: null,
    spineRake: null,
    pageRake: null
  }, w = {
    floor: new l.Color(14207146),
    wall: new l.Color(15327179),
    shelf: new l.Color(4860701),
    shelfDark: new l.Color(2758415),
    shadow: new l.Color(3087635),
    fog: new l.Color(15327179),
    hemisphere: new l.Color(16775400),
    hemisphereGround: new l.Color(5980208),
    key: new l.Color(16771266),
    fill: new l.Color(14214119),
    rim: new l.Color(14001246)
  }, $ = {
    ndc: new l.Vector2(3, 3),
    clientX: 0,
    clientY: 0
  }, p = {
    active: !1,
    pointerId: null,
    startX: 0,
    startY: 0,
    progress: 0,
    peakProgress: 0,
    committed: !1,
    progressVelocity: 0,
    verticalBias: 0,
    lastProgress: 0,
    lastTime: 0,
    direction: 0,
    kind: null
  }, M = {
    active: !1,
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: !1,
    allowClick: !1
  }, be = new l.Raycaster(), Le = new l.Vector3(), le = new l.Vector3(), Fe = new l.Vector3(), ht = new l.Vector3(), Je = new l.Vector3(), ce = new l.Vector3(), Yt = new l.Vector3(), Gt = new l.Quaternion(), Ft = new l.Vector3(), Eo = new l.Vector3(), jo = new l.Quaternion(), qo = new l.Vector3(), Ro = new l.Quaternion(), Ho = new l.Vector3(), Xo = new l.Vector3(), Uo = new l.Vector3(), dn = new l.Vector3(0, -4.2, -3), fn = new l.Quaternion().setFromEuler(
    new l.Euler(0.055, -0.14, 0)
  ), Zo = new l.Vector3(), Wo = new l.Vector3(), No = new l.Vector3(), Vo = new l.Quaternion(), Yo = new l.Vector3(), hn = new l.Quaternion(), un = new l.Vector3(1.09, 1.09, 1.09), Go = new l.Vector3(), Fo = new l.Quaternion(), Jo = new l.Vector3(), Jt = new l.Vector3(), Oo = new l.Vector3(), gn = new l.Vector3();
  new l.Box3(), new l.Vector3();
  const Ot = 0.47, Bo = 1.5, Bt = 4, Oe = Bt + 1, Qt = 18, Qo = 8, mn = 0.18, bn = 0.16, yn = 0.2, vn = 0.92, xn = 0.92;
  let $o = 0, _o = 0;
  const P = {
    box: new l.BoxGeometry(1, 1, 1),
    plane: new l.PlaneGeometry(1, 1),
    page: new l.MeshPhysicalMaterial({
      color: 15196111,
      roughness: 0.95,
      metalness: 0,
      sheen: 0.025,
      sheenRoughness: 1
    }),
    pageSheet: new l.MeshPhysicalMaterial({
      color: 15656663,
      roughness: 0.955,
      metalness: 0,
      sheen: 0.02,
      sheenRoughness: 1,
      side: l.DoubleSide
    }),
    headband: new l.MeshPhysicalMaterial({
      color: 13018733,
      roughness: 0.58,
      metalness: 0.16,
      sheen: 0.14,
      sheenRoughness: 0.76
    }),
    walnut: new l.MeshStandardMaterial({
      color: 4860701,
      roughness: 0.58,
      metalness: 0
    }),
    walnutDark: new l.MeshStandardMaterial({
      color: 2758415,
      roughness: 0.7,
      metalness: 0
    })
  };
  function ut(e) {
    const o = e.clone();
    return o.transparent = !0, o.opacity = 1, o;
  }
  function pe(e) {
    let o = 2166136261;
    for (let t = 0; t < e.length; t += 1)
      o ^= e.charCodeAt(t), o = Math.imul(o, 16777619);
    return o >>> 0;
  }
  function ye(e) {
    let o = e >>> 0;
    return () => {
      o += 1831565813;
      let t = o;
      return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function $t(e, o, t, r) {
    const a = o.foil;
    e.save(), e.strokeStyle = a, e.fillStyle = a, e.lineWidth = Math.max(3, t * 4e-3), e.globalAlpha = 0.88;
    const n = t * 0.5, c = r * 0.38, i = Math.min(t, r) * 0.22;
    if (o.motifKey === "brackets") {
      for (let d = 0; d < 3; d += 1) {
        const s = d * i * 0.22, h = n - i + s, x = n + i - s, f = c - i * 0.72 + s, g = c + i * 0.72 - s;
        e.beginPath(), e.moveTo(h + i * 0.25, f), e.lineTo(h, f), e.lineTo(h, g), e.lineTo(h + i * 0.25, g), e.moveTo(x - i * 0.25, f), e.lineTo(x, f), e.lineTo(x, g), e.lineTo(x - i * 0.25, g), e.stroke();
      }
      e.fillRect(n - 3, c - 3, 6, 6);
    } else if (o.motifKey === "paths") {
      e.beginPath(), e.moveTo(n - i, c + i * 0.35), e.bezierCurveTo(n - i * 0.2, c - i, n + i * 0.1, c + i, n + i, c - i * 0.25), e.stroke(), e.globalAlpha = 0.52, e.beginPath(), e.moveTo(n - i, c - i * 0.45), e.bezierCurveTo(n - i * 0.25, c + i, n + i * 0.3, c - i, n + i, c + i * 0.45), e.stroke();
      for (let d = -1; d <= 1; d += 1)
        e.beginPath(), e.arc(n + d * i, c - d * i * 0.25, 7, 0, Math.PI * 2), e.fill();
    } else if (o.motifKey === "caret") {
      e.beginPath(), e.moveTo(n - i * 0.9, c + i * 0.6), e.lineTo(n, c - i * 0.65), e.lineTo(n + i * 0.9, c + i * 0.6), e.stroke(), e.globalAlpha = 0.38;
      for (let d = -2; d <= 2; d += 1)
        e.beginPath(), e.moveTo(n - i, c + d * i * 0.28), e.lineTo(n + i, c + d * i * 0.28), e.stroke();
    } else if (o.motifKey === "orbits")
      e.beginPath(), e.ellipse(n, c, i, i * 0.42, -0.35, 0, Math.PI * 2), e.stroke(), e.globalAlpha = 0.58, e.beginPath(), e.ellipse(n, c, i * 0.72, i, 0.52, 0, Math.PI * 2), e.stroke(), e.globalAlpha = 0.9, e.beginPath(), e.arc(n + i * 0.64, c - i * 0.34, 8, 0, Math.PI * 2), e.fill(), e.fillRect(n - 6, c - 6, 12, 12);
    else if (o.motifKey === "modules") {
      const d = i * 0.54;
      [
        [-0.55, -0.5, "circle"],
        [0.25, -0.5, "rect"],
        [-0.55, 0.3, "rect"],
        [0.25, 0.3, "circle"]
      ].forEach(([h, x, f], g) => {
        e.globalAlpha = 0.45 + g * 0.12, f === "circle" ? (e.beginPath(), e.arc(n + h * i, c + x * i, d * 0.48, 0, Math.PI * 2), e.stroke()) : e.strokeRect(
          n + h * i - d * 0.5,
          c + x * i - d * 0.5,
          d,
          d
        );
      });
    } else if (o.motifKey === "frames") {
      for (let d = 0; d < 4; d += 1) {
        e.globalAlpha = 0.9 - d * 0.17;
        const s = d * i * 0.18;
        e.strokeRect(
          n - i + s,
          c - i * 0.7 + s,
          i * 2 - s * 2,
          i * 1.4 - s * 2
        );
      }
      e.beginPath(), e.moveTo(n - i, c - i * 0.7), e.lineTo(n + i, c + i * 0.7), e.stroke();
    } else
      e.beginPath(), e.arc(n, c, i * 0.78, 0.15, Math.PI * 1.82), e.stroke(), e.beginPath(), e.moveTo(n - i * 0.72, c + i * 0.88), e.lineTo(n, c - i * 0.92), e.lineTo(n + i * 0.72, c + i * 0.88), e.stroke(), e.globalAlpha = 0.48, e.beginPath(), e.moveTo(n - i, c), e.lineTo(n + i, c), e.stroke();
    e.restore();
  }
  let _t = null, gt = null, Be = null;
  function Q(e, {
    color: o = !0,
    anisotropy: t = 16
  } = {}) {
    return o && (e.colorSpace = l.SRGBColorSpace), e.anisotropy = Math.min(
      t,
      D.capabilities.getMaxAnisotropy()
    ), e.minFilter = l.LinearMipmapLinearFilter, e.magFilter = l.LinearFilter, e.generateMipmaps = !0, e.needsUpdate = !0, e;
  }
  function wn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d");
    if (qt) {
      const [c, i, d, s] = Gr[S.indexOf(e)];
      t.drawImage(
        nt,
        c,
        i,
        d,
        s,
        0,
        0,
        o.width,
        o.height
      );
      const h = t.createLinearGradient(0, 0, o.width, 0);
      return h.addColorStop(0, "rgba(0,0,0,0.16)"), h.addColorStop(0.055, "rgba(255,255,255,0.015)"), h.addColorStop(0.93, "rgba(255,255,255,0)"), h.addColorStop(1, "rgba(0,0,0,0.1)"), t.fillStyle = h, t.fillRect(0, 0, o.width, o.height), Q(new l.CanvasTexture(o));
    }
    const r = ye(pe(e.id) + e.seed);
    t.fillStyle = e.color, t.fillRect(0, 0, o.width, o.height);
    const a = t.createLinearGradient(0, 0, o.width, 0);
    a.addColorStop(0, "rgba(0,0,0,0.24)"), a.addColorStop(0.075, "rgba(255,255,255,0.035)"), a.addColorStop(0.5, "rgba(255,255,255,0.01)"), a.addColorStop(0.94, "rgba(0,0,0,0.06)"), a.addColorStop(1, "rgba(0,0,0,0.19)"), t.fillStyle = a, t.fillRect(0, 0, o.width, o.height);
    for (let c = 0; c < 1250; c += 1) {
      const i = r() * o.width, d = r() * o.height, s = 4 + r() * 22;
      t.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.024)" : "rgba(0,0,0,0.025)", t.lineWidth = 0.6 + r() * 0.8, t.beginPath(), t.moveTo(i, d), t.lineTo(i + s, d + (r() - 0.5) * 2), t.stroke();
    }
    t.strokeStyle = e.foil, t.globalAlpha = 0.72, t.lineWidth = 2, t.strokeRect(42, 42, o.width - 84, o.height - 84), t.strokeRect(55, 55, o.width - 110, o.height - 110), t.globalAlpha = 1, $t(t, e, o.width, o.height), t.fillStyle = e.foil, t.textAlign = "center", t.textBaseline = "middle";
    t.font = '500 18px MLNBookSans, sans-serif';
    t.fillText(`GIÁO TRÌNH CHƯƠNG V  /  TẬP ${e.roman}`, o.width / 2, 92);
    const normTitle = normalizeVietnameseText(e.title);
    const normDiscipline = normalizeVietnameseText(e.discipline);
    const fittedTitle = fitTextToWidth(t, normTitle, {
      maxWidth: 610,
      maxLines: 2,
      startSize: 68,
      minSize: 42,
      lineHeight: 1.12,
      fontFamily: 'MLNBookSans',
      fontWeight: 700
    });
    if (!fittedTitle.fits) {
      console.warn(`[Bookshelf:Typography] Front cover title "${normTitle}" exceeded bounds (fits=false). Rendering all lines without dropping words.`);
    }
    t.font = `700 ${fittedTitle.fontSize}px MLNBookSans, sans-serif`;
    const centerY = o.height * 0.72;
    const startY = centerY - ((fittedTitle.lines.length - 1) * fittedTitle.lineHeightPx * 0.5);
    fittedTitle.lines.forEach((line, idx) => {
      t.fillText(line, o.width / 2, startY + idx * fittedTitle.lineHeightPx);
    });
    const fittedDiscipline = fitSingleLineText(t, normDiscipline.toUpperCase(), {
      maxWidth: 580,
      startSize: 16,
      minSize: 12,
      fontFamily: 'MLNBookSans',
      fontWeight: 500
    });
    t.font = `500 ${fittedDiscipline.fontSize}px MLNBookSans, sans-serif`;
    t.fillText(fittedDiscipline.text, o.width / 2, o.height * 0.80);
    return Q(new l.CanvasTexture(o));
  }
  function Cn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d"), r = S.indexOf(e) + 1;
    t.clearRect(0, 0, o.width, o.height), t.fillStyle = "#ffffff", t.strokeStyle = "#ffffff", t.textAlign = "left", t.textBaseline = "alphabetic";
    t.font = '500 15px MLNBookSans, sans-serif';
    t.fillText(`GIÁO TRÌNH CHƯƠNG V  /  TẬP ${ge(r)}`, 58, 70);
    t.globalAlpha = 0.7, t.lineWidth = 1, t.beginPath(), t.moveTo(58, 86), t.lineTo(164, 86), t.stroke(), t.globalAlpha = 1;
    const normTitle = normalizeVietnameseText(e.title);
    const normDiscipline = normalizeVietnameseText(e.discipline);
    const fittedTitle = fitTextToWidth(t, normTitle, {
      maxWidth: 610,
      maxLines: 2,
      startSize: 64,
      minSize: 42,
      lineHeight: 1.12,
      fontFamily: 'MLNBookSans',
      fontWeight: 700
    });
    if (!fittedTitle.fits) {
      console.warn(`[Bookshelf:Typography] Secondary title "${normTitle}" exceeded bounds (fits=false). Rendering all lines without dropping words.`);
    }
    t.font = `700 ${fittedTitle.fontSize}px MLNBookSans, sans-serif`;
    const startY = 1010 - ((fittedTitle.lines.length - 1) * fittedTitle.lineHeightPx);
    fittedTitle.lines.forEach((line, idx) => {
      t.fillText(line, 58, startY + idx * fittedTitle.lineHeightPx);
    });
    const fittedDiscipline = fitSingleLineText(t, normDiscipline.toUpperCase(), {
      maxWidth: 610,
      startSize: 14,
      minSize: 11,
      fontFamily: 'MLNBookSans',
      fontWeight: 500
    });
    t.font = `500 ${fittedDiscipline.fontSize}px MLNBookSans, sans-serif`;
    t.fillText(fittedDiscipline.text, 60, 1060);
    return Q(new l.CanvasTexture(o));
  }
  function An(e) {
    const o = document.createElement("canvas");
    o.width = 256, o.height = 256;
    const t = o.getContext("2d"), r = ye(pe(`${e.id}-cloth`) + e.seed);
    t.fillStyle = "#7f7f7f", t.fillRect(0, 0, o.width, o.height);
    for (let n = 0; n < 256; n += 2) {
      const c = Math.round(98 + r() * 70);
      t.strokeStyle = `rgb(${c},${c},${c})`, t.globalAlpha = 0.34 + r() * 0.18, t.lineWidth = 0.65 + r() * 0.45, t.beginPath(), t.moveTo(0, n + (r() - 0.5)), t.lineTo(256, n + (r() - 0.5)), t.stroke();
    }
    for (let n = 1; n < 256; n += 3) {
      const c = Math.round(105 + r() * 58);
      t.strokeStyle = `rgb(${c},${c},${c})`, t.globalAlpha = 0.25 + r() * 0.14, t.lineWidth = 0.55 + r() * 0.35, t.beginPath(), t.moveTo(n + (r() - 0.5), 0), t.lineTo(n + (r() - 0.5), 256), t.stroke();
    }
    t.globalAlpha = 1;
    const a = new l.CanvasTexture(o);
    return a.wrapS = l.RepeatWrapping, a.wrapT = l.RepeatWrapping, a.repeat.set(5, 8), Q(a, {
      color: !1,
      anisotropy: 12
    });
  }
  function Ln(e) {
    const t = new Float32Array(65536), r = document.createElement("canvas"), a = document.createElement("canvas");
    r.width = a.width = 256, r.height = a.height = 256;
    const n = r.getContext("2d"), c = a.getContext("2d"), i = n.createImageData(256, 256), d = c.createImageData(256, 256), s = e.seed % 19 * 0.23;
    for (let f = 0; f < 256; f += 1)
      for (let g = 0; g < 256; g += 1) {
        const v = Math.sin((g + s) * Math.PI * 0.52), C = Math.sin((f - s) * Math.PI * 0.41), F = Math.sin((g + f + s) * Math.PI * 0.19);
        t[f * 256 + g] = 0.5 + v * 0.18 + C * 0.15 + F * 0.045;
      }
    const h = (f, g) => {
      const v = (f + 256) % 256, C = (g + 256) % 256;
      return t[C * 256 + v];
    };
    for (let f = 0; f < 256; f += 1)
      for (let g = 0; g < 256; g += 1) {
        const v = f * 256 + g, C = v * 4, F = (h(g + 1, f) - h(g - 1, f)) * 1.5, N = (h(g, f + 1) - h(g, f - 1)) * 1.5, j = Math.hypot(F, N, 1);
        i.data[C] = Math.round((-F / j * 0.5 + 0.5) * 255), i.data[C + 1] = Math.round((-N / j * 0.5 + 0.5) * 255), i.data[C + 2] = Math.round((1 / j * 0.5 + 0.5) * 255), i.data[C + 3] = 255;
        const E = Math.round(188 + t[v] * 56);
        d.data[C] = E, d.data[C + 1] = E, d.data[C + 2] = E, d.data[C + 3] = 255;
      }
    n.putImageData(i, 0, 0), c.putImageData(d, 0, 0);
    const x = (f, g) => {
      const v = new l.CanvasTexture(f);
      return v.name = `${e.id}-${g}`, v.wrapS = l.RepeatWrapping, v.wrapT = l.RepeatWrapping, v.repeat.set(5, 8), Q(v, {
        color: !1,
        anisotropy: 12
      });
    };
    return {
      normal: x(r, "cloth-normal"),
      roughness: x(a, "cloth-roughness")
    };
  }
  function eo(e, o) {
    const t = new l.CanvasTexture(e.image);
    return t.name = o, t.wrapS = e.wrapS, t.wrapT = e.wrapT, t.repeat.copy(e.repeat), t.offset.copy(e.offset), t.center.copy(e.center), t.rotation = e.rotation, Q(t, {
      color: !1,
      anisotropy: 16
    });
  }
  function to(e, o, t, r) {
    e.fillStyle = "#e8e1d3", e.fillRect(0, 0, o, t);
    const a = e.createLinearGradient(0, 0, o, t);
    a.addColorStop(0, "rgba(255,255,255,0.22)"), a.addColorStop(0.42, "rgba(255,255,255,0.035)"), a.addColorStop(1, "rgba(103,87,64,0.08)"), e.fillStyle = a, e.fillRect(0, 0, o, t);
    for (let n = 0; n < 2400; n += 1) {
      const c = r() * o, i = r() * t, d = 5 + r() * 34, s = r() > 0.44;
      e.strokeStyle = s ? `rgba(255,255,255,${0.025 + r() * 0.045})` : `rgba(92,76,55,${0.018 + r() * 0.035})`, e.lineWidth = 0.45 + r() * 0.65, e.beginPath(), e.moveTo(c, i), e.lineTo(
        Math.min(o, c + d),
        i + (r() - 0.5) * 2.2
      ), e.stroke();
    }
    for (let n = 0; n < 1200; n += 1) {
      const c = Math.round(112 + r() * 94);
      e.fillStyle = `rgba(${c},${c - 5},${c - 13},${0.016 + r() * 0.025})`;
      const i = 0.5 + r() * 1.1;
      e.fillRect(r() * o, r() * t, i, i);
    }
  }
  function Tn(e, o = !1) {
    if (!o && _t) return _t;
    const t = document.createElement("canvas");
    t.width = 768, t.height = 1152;
    const r = t.getContext("2d"), a = ye(o ? pe(`${e.id}-printed-page`) + e.seed : pe("working-volumes-paper-stock"));
    if (to(r, t.width, t.height, a), o) {
      const c = new l.Color(e.palette.ink), i = Math.round(c.r * 255), d = Math.round(c.g * 255), s = Math.round(c.b * 255);
      r.fillStyle = `rgba(${i},${d},${s},0.2)`, r.textAlign = "left", r.textBaseline = "alphabetic";
      const normTnTitle = normalizeVietnameseText(e.title).toUpperCase();
      const fittedTnTitle = fitSingleLineText(r, normTnTitle, {
        maxWidth: 580,
        startSize: 15,
        minSize: 11,
        fontFamily: 'MLNBookSans',
        fontWeight: 500,
      });
      r.font = `500 ${fittedTnTitle.fontSize}px MLNBookSans, sans-serif`;
      r.letterSpacing = "2px";
      r.fillText(fittedTnTitle.text, 84, 98);
      r.fillRect(84, 121, Math.max(190, Math.min(580, fittedTnTitle.width)), 2);
      for (let h = 0; h < 2; h += 1) {
        const x = 84 + h * 316;
        for (let f = 0; f < 34; f += 1) {
          const g = 184 + f * 23, C = f % 7 === 6 ? 108 + a() * 86 : 190 + a() * 72;
          r.globalAlpha = 0.22 + a() * 0.11, r.fillRect(x, g, C, 1.45);
        }
      }
      r.globalAlpha = 0.32, r.font = '400 17px MLNBookSans, sans-serif', r.fillText(e.roman, t.width - 104, t.height - 72), r.globalAlpha = 1;
    }
    const n = Q(new l.CanvasTexture(t));
    return o || (_t = n), n;
  }
  function de(e, o, t, r, a, n, c = 6) {
    const i = o.split(/\s+/);
    let d = "", s = 0;
    i.forEach((h) => {
      if (s >= c) return;
      const x = d ? `${d} ${h}` : h;
      x.length > a && d ? (e.fillText(d, t, r + s * n), d = h, s += 1) : d = x;
    }), d && s < c && e.fillText(d, t, r + s * n);
  }
  function Sn(e) {
    const o = document.createElement("canvas");
    o.width = 512, o.height = 768;
    const t = o.getContext("2d"), r = ye(pe(`${e.id}-endpaper`) + e.seed);
    to(t, o.width, o.height, r), t.save(), t.fillStyle = e.color, t.globalAlpha = 0.14, t.fillRect(0, 0, o.width, o.height), t.globalAlpha = 0.18, t.strokeStyle = e.foil, t.lineWidth = 1;
    for (let n = 28; n < o.width; n += 48)
      t.beginPath(), t.moveTo(n, 0), t.lineTo(n, o.height), t.stroke();
    for (let n = 24; n < o.height; n += 48)
      t.beginPath(), t.moveTo(0, n), t.lineTo(o.width, n), t.stroke();
    t.globalAlpha = 0.42, $t(t, { ...e, foil: e.palette.inkSoft }, o.width, o.height), t.restore();
    const a = Q(new l.CanvasTexture(o), {
      anisotropy: 16
    });
    return a.name = `${e.id}-patterned-endpaper`, a;
  }
  function Pn(e) {
    const r = `#${new l.Color(e.color).lerp(new l.Color(2169622), 0.62).getHexString()}`;
    return Array.from({ length: 8 }, (a, n) => {
      const c = document.createElement("canvas"), i = 512, d = 768;
      c.width = 384, c.height = 576;
      const s = c.getContext("2d");
      s.scale(0.75, 0.75);
      const h = ye(pe(`${e.id}-leaf-${n}`) + e.seed);
      if (to(s, i, d, h), s.fillStyle = r, s.strokeStyle = r, s.textAlign = "left", s.textBaseline = "alphabetic", s.globalAlpha = 0.58, s.font = '500 10px MLNBookSans, sans-serif', s.letterSpacing = "1.8px", s.fillText(`WORKING VOLUMES  /  ${e.roman}`, 48, 48), s.textAlign = "right", s.fillText(ge(n + 1), i - 48, 48), s.textAlign = "left", s.fillRect(48, 64, i - 96, 1), s.globalAlpha = 1, n === 0) {
        const normDiscipline = normalizeVietnameseText(e.discipline).toUpperCase();
        const fittedDiscipline = fitSingleLineText(s, normDiscipline, {
          maxWidth: 400,
          startSize: 12,
          minSize: 9,
          fontFamily: 'MLNBookSans',
          fontWeight: 500,
        });
        s.font = `500 ${fittedDiscipline.fontSize}px MLNBookSans, sans-serif`;
        s.letterSpacing = "2.3px";
        s.fillText(fittedDiscipline.text, 54, 174);
        const fittedLeafTitle = fitTextToWidth(s, normalizeVietnameseText(e.title), {
          maxWidth: 400,
          maxLines: 2,
          startSize: 52,
          minSize: 36,
          fontFamily: 'MLNBookSans'
        });
        s.font = `400 ${fittedLeafTitle.fontSize}px MLNBookSans, sans-serif`;
        s.letterSpacing = "0px";
        fittedLeafTitle.lines.forEach((ln, idx) => {
          s.fillText(ln, 52, 246 + idx * fittedLeafTitle.lineHeightPx);
        });
        s.globalAlpha = 0.55, s.font = '400 22px MLNBookSans, sans-serif', de(s, normalizeVietnameseText(e.note), 54, 462, 36, 30, 4);
      } else if (n === 1 || n === 3) {
        const f = n === 1 ? 0 : 1;
        s.font = '500 11px MLNBookSans, sans-serif', s.letterSpacing = "2px", s.fillText(`CHAPTER ${ge(f + 1)}`, 54, 166), s.font = '400 49px MLNBookSans, sans-serif', s.letterSpacing = "0px", de(s, normalizeVietnameseText(e.chapters[f]), 52, 244, 18, 54, 3), s.globalAlpha = 0.52, s.font = '400 20px MLNBookSans, sans-serif', de(
          s,
          normalizeVietnameseText(f === 0 ? e.note : e.deck),
          54,
          438,
          42,
          28,
          6
        );
      } else if (n === 2)
        s.font = '500 11px MLNBookSans, sans-serif', s.letterSpacing = "2px", s.fillText("PLATE 01  /  SYSTEM MOTIF", 54, 146), s.save(), s.globalAlpha = 0.58, $t(s, { ...e, foil: r }, i, d * 0.92), s.restore(), s.globalAlpha = 0.48, s.font = '400 17px MLNBookSans, sans-serif', de(s, normalizeVietnameseText(e.theme), 54, 650, 44, 24, 3);
      else if (n === 4) {
        const normChapter1 = normalizeVietnameseText(e.chapters[1]).toUpperCase();
        s.font = '500 11px MLNBookSans, sans-serif', s.letterSpacing = "2px", s.fillText(`NOTES  /  ${normChapter1}`, 54, 138), s.globalAlpha = 0.44;
        for (let f = 0; f < 2; f += 1) {
          const g = 54 + f * 214;
          for (let v = 0; v < 24; v += 1) {
            const C = v % 7 === 6 ? 72 + h() * 54 : 138 + h() * 44;
            s.fillRect(g, 190 + v * 18, C, 1.25);
          }
        }
        s.globalAlpha = 0.78, s.strokeRect(54, 654, 404, 54), s.font = '500 10px MLNBookSans, sans-serif', s.letterSpacing = "1.4px", s.fillText(e.motif.toUpperCase(), 70, 686);
      } else if (n === 5)
        s.font = '500 11px MLNBookSans, sans-serif', s.letterSpacing = "2px", s.fillText("CHAPTER 03", 54, 166), s.font = '400 49px MLNBookSans, sans-serif', s.letterSpacing = "0px", de(s, normalizeVietnameseText(e.chapters[2]), 52, 244, 18, 54, 3), s.globalAlpha = 0.52, s.font = '400 20px MLNBookSans, sans-serif', de(s, normalizeVietnameseText(e.deck), 54, 438, 42, 28, 6);
      else if (n === 6) {
        s.font = '500 11px MLNBookSans, sans-serif', s.letterSpacing = "2px", s.fillText("PLATE 02  /  TECHNICAL SYSTEM", 54, 146), s.save(), s.translate(i * 0.5, 380), s.globalAlpha = 0.55;
        for (let f = 0; f < 5; f += 1) {
          const g = 38 + f * 34;
          s.beginPath(), s.arc(0, 0, g, 0, Math.PI * 2), s.stroke();
        }
        for (let f = 0; f < 8; f += 1) {
          const g = f * Math.PI * 0.25;
          s.beginPath(), s.moveTo(Math.cos(g) * 36, Math.sin(g) * 36), s.lineTo(Math.cos(g) * 176, Math.sin(g) * 176), s.stroke();
        }
        s.restore(), s.globalAlpha = 0.48, s.font = '400 17px MLNBookSans, sans-serif', de(s, normalizeVietnameseText(e.theme), 54, 650, 44, 24, 3);
      } else
        s.font = '500 11px MLNBookSans, sans-serif', s.letterSpacing = "2px", s.fillText("COLOPHON", 54, 164), s.font = '400 32px MLNBookSans, sans-serif', s.letterSpacing = "0px", s.fillText(normalizeVietnameseText(e.title), 54, 230), s.globalAlpha = 0.58, s.font = '400 18px MLNBookSans, sans-serif', de(
          s,
          normalizeVietnameseText(`${e.binding}. ${e.format}. Conceived as an original editorial study for Working Volumes.`),
          54,
          306,
          44,
          28,
          7
        ), s.globalAlpha = 0.74, s.font = '500 10px MLNBookSans, sans-serif', s.letterSpacing = "1.8px", s.fillText(`SPECIMEN ${e.roman} / ${e.seed}  ·  IMAGINED EDITION`, 54, 676);
      s.globalAlpha = 0.62, s.fillRect(48, d - 48, i - 96, 1), s.globalAlpha = 1;
      const x = Q(new l.CanvasTexture(c), {
        anisotropy: 16
      });
      return x.name = `${e.id}-interior-page-${n + 1}`, x;
    });
  }
  function er() {
    if (Be) return Be;
    const e = document.createElement("canvas");
    e.width = 512, e.height = 128;
    const o = e.getContext("2d"), t = o.createRadialGradient(256, 64, 10, 256, 64, 254);
    return t.addColorStop(0, "rgba(255,255,255,0.95)"), t.addColorStop(0.38, "rgba(255,255,255,0.62)"), t.addColorStop(0.72, "rgba(255,255,255,0.18)"), t.addColorStop(1, "rgba(255,255,255,0)"), o.fillStyle = t, o.fillRect(0, 0, e.width, e.height), Be = Q(
      new l.CanvasTexture(e),
      { color: !1, anisotropy: 8 }
    ), Be.name = "soft-contact-shadow", Be;
  }
  function zn(e) {
    if (gt) return gt;
    const o = (t, r, a) => {
      const n = document.createElement("canvas");
      n.width = t, n.height = r;
      const c = n.getContext("2d"), i = ye(
        pe(`${e.id}-${a}`) + e.seed
      );
      c.fillStyle = "#dcd5c7", c.fillRect(0, 0, t, r);
      const d = a === "fore-edge" ? 2 : 1.35;
      for (let h = 0; h < r; h += d) {
        const x = Math.round(106 + i() * 74), f = i() > 0.965;
        c.strokeStyle = `rgba(${x},${x - 3},${x - 9},${f ? 0.34 : 0.13 + i() * 0.13})`, c.lineWidth = f ? 1.05 : 0.42 + i() * 0.42, c.beginPath(), c.moveTo(0, h + (i() - 0.5) * 0.5), c.bezierCurveTo(
          t * 0.3,
          h + (i() - 0.5) * 0.9,
          t * 0.72,
          h + (i() - 0.5) * 0.9,
          t,
          h + (i() - 0.5) * 0.5
        ), c.stroke();
      }
      const s = c.createLinearGradient(0, 0, t, 0);
      return s.addColorStop(0, "rgba(58,48,35,0.18)"), s.addColorStop(0.035, "rgba(255,255,255,0.04)"), s.addColorStop(0.86, "rgba(255,255,255,0)"), s.addColorStop(1, "rgba(58,48,35,0.12)"), c.fillStyle = s, c.fillRect(0, 0, t, r), Q(new l.CanvasTexture(n));
    };
    return gt = {
      fore: o(512, 2048, "fore-edge"),
      headTail: o(2048, 384, "head-tail-edge")
    }, gt;
  }
  function oo(e, o, t) {
    const r = e * 0.5, a = o * 0.5, n = Math.min(t, r, a), c = new l.Shape();
    c.moveTo(-r + n, -a), c.lineTo(r - n, -a), c.quadraticCurveTo(r, -a, r, -a + n), c.lineTo(r, a - n), c.quadraticCurveTo(r, a, r - n, a), c.lineTo(-r + n, a), c.quadraticCurveTo(-r, a, -r, a - n), c.lineTo(-r, -a + n), c.quadraticCurveTo(-r, -a, -r + n, -a);
    const i = new l.ShapeGeometry(c, 8), d = i.getAttribute("position"), s = new Float32Array(d.count * 2);
    for (let h = 0; h < d.count; h += 1)
      s[h * 2] = (d.getX(h) + r) / e, s[h * 2 + 1] = (d.getY(h) + a) / o;
    return i.setAttribute("uv", new l.BufferAttribute(s, 2)), i.computeVertexNormals(), i;
  }
  function In(e, o, t, r) {
    const a = new Et(e, o, t, 4, r), n = a.getAttribute("position"), c = e * 0.5;
    for (let i = 0; i < n.count; i += 1) {
      const d = n.getX(i), s = n.getZ(i), h = A((d + c) / e, 0, 1), x = A(h / 0.16, 0, 1), g = (1 - x * x * (3 - 2 * x)) * 0.012, v = Math.pow(h, 8) * Math.sin(n.getY(i) * 31) * 55e-5, C = Math.sign(s || 1) * Math.max(
        0,
        Math.abs(s) - g + v
      );
      n.setZ(i, C);
    }
    return n.needsUpdate = !0, a.computeVertexNormals(), a.computeBoundingBox(), a.computeBoundingSphere(), a.userData.gutterCompression = 0.012, a.userData.pageSignatures = 6, a;
  }
  function Dn(e) {
    const o = document.createElement("canvas");
    o.width = 384, o.height = 1536;
    const t = o.getContext("2d"), r = ye(pe(`${e.id}-spine-cloth`) + e.seed);
    t.fillStyle = e.color, t.fillRect(0, 0, o.width, o.height);
    const a = t.createLinearGradient(0, 0, o.width, 0);
    a.addColorStop(0, "rgba(0,0,0,0.2)"), a.addColorStop(0.14, "rgba(255,255,255,0.055)"), a.addColorStop(0.62, "rgba(255,255,255,0.012)"), a.addColorStop(1, "rgba(0,0,0,0.16)"), t.fillStyle = a, t.fillRect(0, 0, o.width, o.height);
    for (let c = 0; c < 1900; c += 1) {
      const i = r() * o.width, d = r() * o.height, s = r() > 0.42;
      t.strokeStyle = r() > 0.5 ? `rgba(255,255,255,${0.018 + r() * 0.038})` : `rgba(0,0,0,${0.018 + r() * 0.032})`, t.lineWidth = 0.45 + r() * 0.7, t.beginPath(), t.moveTo(i, d), t.lineTo(
        s ? i + (r() - 0.5) * 1.2 : i + 8 + r() * 28,
        s ? d + 8 + r() * 34 : d + (r() - 0.5) * 1.2
      ), t.stroke();
    }
    const n = t.createLinearGradient(
      0,
      o.height * 0.82,
      0,
      o.height
    );
    return n.addColorStop(0, "rgba(0,0,0,0)"), n.addColorStop(1, "rgba(0,0,0,0.12)"), t.fillStyle = n, t.fillRect(0, 0, o.width, o.height), Q(
      new l.CanvasTexture(o),
      { anisotropy: 16 }
    );
  }
  function Kn(e) {
    const o = document.createElement("canvas");
    o.width = 384, o.height = 1536;
    const t = o.getContext("2d");
    t.clearRect(0, 0, o.width, o.height), t.fillStyle = "#ffffff", t.strokeStyle = "#ffffff", t.lineWidth = 2.4, t.strokeRect(34, 38, o.width - 68, o.height - 76), t.textAlign = "center", t.textBaseline = "middle";
    t.font = '500 24px MLNBookSans, sans-serif';
    t.fillText(e.roman, o.width * 0.5, 118);

    const normTitle = normalizeVietnameseText(e.title);
    const fittedSpine = fitSingleLineText(t, normTitle, {
      maxWidth: 960,
      startSize: 58,
      minSize: 34,
      fontFamily: 'MLNBookSans',
      fontWeight: 700
    });

    t.save(), t.translate(o.width * 0.5, o.height * 0.5), t.rotate(Math.PI / 2);
    t.font = `700 ${fittedSpine.fontSize}px MLNBookSans, sans-serif`;
    t.fillText(fittedSpine.text, 0, 0);
    t.restore();

    t.beginPath(), t.arc(o.width * 0.5, o.height - 120, 24, 0, Math.PI * 2), t.stroke();
    t.beginPath(), t.moveTo(o.width * 0.5 - 24, o.height - 120), t.lineTo(o.width * 0.5 + 24, o.height - 120), t.stroke();
    return Q(new l.CanvasTexture(o));
  }
  function kn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d"), r = ye(pe(`${e.id}-back-cloth`) + e.seed);
    t.fillStyle = e.color, t.fillRect(0, 0, o.width, o.height);
    const a = t.createLinearGradient(0, 0, o.width, 0);
    a.addColorStop(0, "rgba(0,0,0,0.15)"), a.addColorStop(0.05, "rgba(255,255,255,0.028)"), a.addColorStop(0.84, "rgba(255,255,255,0)"), a.addColorStop(1, "rgba(0,0,0,0.11)"), t.fillStyle = a, t.fillRect(0, 0, o.width, o.height);
    for (let c = 0; c < 2600; c += 1) {
      const i = r() * o.width, d = r() * o.height, s = 5 + r() * 30;
      t.strokeStyle = r() > 0.5 ? `rgba(255,255,255,${0.018 + r() * 0.03})` : `rgba(0,0,0,${0.016 + r() * 0.028})`, t.lineWidth = 0.45 + r() * 0.65, t.beginPath(), t.moveTo(i, d), t.lineTo(i + s, d + (r() - 0.5) * 1.5), t.stroke();
    }
    const n = t.createRadialGradient(
      o.width * 0.62,
      o.height * 0.38,
      20,
      o.width * 0.62,
      o.height * 0.38,
      o.width * 0.75
    );
    return n.addColorStop(0, "rgba(255,255,255,0.03)"), n.addColorStop(1, "rgba(0,0,0,0.09)"), t.fillStyle = n, t.fillRect(0, 0, o.width, o.height), Q(new l.CanvasTexture(o));
  }
  function Mn(e) {
    const o = document.createElement("canvas");
    o.width = 768, o.height = 1152;
    const t = o.getContext("2d");
    t.clearRect(0, 0, o.width, o.height), t.fillStyle = "#ffffff", t.strokeStyle = "#ffffff", t.textAlign = "left", t.textBaseline = "alphabetic";
    t.font = '500 16px MLNBookSans, sans-serif';
    t.fillText(`WORKING VOLUMES  /  ${e.roman}`, 68, 82);
    t.globalAlpha = 0.72, t.fillRect(68, 108, 176, 2), t.globalAlpha = 1, t.lineWidth = 1.5;
    for (let r = 0; r < 5; r += 1)
      t.globalAlpha = 0.24 - r * 0.032, t.beginPath(), t.arc(548, 374, 74 + r * 38, 0, Math.PI * 2), t.stroke();
    t.globalAlpha = 1, t.beginPath(), t.moveTo(348, 374), t.lineTo(704, 374), t.moveTo(548, 174), t.lineTo(548, 574), t.stroke();

    const normTitle = normalizeVietnameseText(e.title);
    const normDiscipline = normalizeVietnameseText(e.discipline);
    const fittedTitle = fitTextToWidth(t, normTitle, {
      maxWidth: 610,
      maxLines: 2,
      startSize: 58,
      minSize: 38,
      lineHeight: 1.12,
      fontFamily: 'MLNBookSans',
      fontWeight: 700
    });

    if (!fittedTitle.fits) {
      console.warn(`[Bookshelf:Typography] Working volume title "${normTitle}" exceeded bounds (fits=false). Rendering all lines without dropping words.`);
    }
    t.font = `700 ${fittedTitle.fontSize}px MLNBookSans, sans-serif`;
    const startY = 956 - ((fittedTitle.lines.length - 1) * fittedTitle.lineHeightPx);
    fittedTitle.lines.forEach((line, idx) => {
      t.fillText(line, 68, startY + idx * fittedTitle.lineHeightPx);
    });

    const fittedDiscipline = fitSingleLineText(t, normDiscipline.toUpperCase(), {
      maxWidth: 610,
      startSize: 15,
      minSize: 11,
      fontFamily: 'MLNBookSans',
      fontWeight: 500
    });
    t.font = `500 ${fittedDiscipline.fontSize}px MLNBookSans, sans-serif`;
    t.fillText(fittedDiscipline.text, 70, 1004);

    t.globalAlpha = 0.68, t.fillRect(68, 1040, 632, 1.5), t.globalAlpha = 1, t.textAlign = "right";
    t.fillText("AN IMAGINED EDITION", 700, 1080);
    return Q(new l.CanvasTexture(o));
  }
  function T(e, o, t, r = !0, a = !0) {
    const n = new l.Mesh(e, o);
    return n.name = t, n.castShadow = r, n.receiveShadow = a, n;
  }
  function tr(e, o, t, r, a, n, c) {
    const s = r - 0.012599999999999998, h = a - 0.018 * 2.2;
    [
      ["head", r * 0.5, a * 0.5 - 0.018 * 0.56, s, 0.018, 2e-3],
      ["tail", r * 0.5, -a * 0.5 + 0.018 * 0.56, s, 0.018, 2e-3],
      ["spine", 0.018 * 0.56, 0, 0.018, h, 2e-3],
      ["fore", r - 0.018 * 0.56, 0, 0.018, h, 2e-3]
    ].forEach(([f, g, v, C, F, N]) => {
      const j = T(
        P.box,
        c,
        `${o.id}-${t}-turn-in-${f}`,
        !1,
        !0
      );
      j.scale.set(C, F, N), j.position.set(g, v, n), e.add(j);
    });
  }
  function En(e, o) {
    const t = new l.Group();
    t.name = `book-${e.id}`, t.userData.index = o;
    const r = new l.Group();
    r.name = `${e.id}-motion`, t.add(r);
    const a = e.width, n = e.height, c = e.depth, i = 0.032, d = 45e-4, s = 25e-4, h = 15e-4, x = 0.014, f = 0.082, g = a - 0.074, v = n - 0.068, C = c - 0.026, F = wn(e), N = Cn(e), j = An(e), E = Ln(e), Y = Tn(e), _ = Pn(e), J = Sn(e), fe = zn(e), Ee = Dn(e), je = Kn(e), vt = kn(e), xt = Mn(e), Dr = eo(N, `${e.id}-front-foil-emboss`), Kr = eo(je, `${e.id}-spine-foil-emboss`), kr = eo(xt, `${e.id}-back-foil-emboss`), qe = new l.MeshPhysicalMaterial({
      color: e.color,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.34, 0.34),
      roughnessMap: E.roughness,
      roughness: 0.98,
      metalness: 0.02,
      bumpMap: j,
      bumpScale: 45e-4,
      sheen: 0.34,
      sheenRoughness: 0.76,
      sheenColor: new l.Color(e.foil),
      transparent: !0
    }), co = new l.MeshPhysicalMaterial({
      map: F,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.28, 0.28),
      roughnessMap: E.roughness,
      bumpMap: j,
      bumpScale: 35e-4,
      roughness: 0.92,
      metalness: 0.035,
      clearcoat: 0.06,
      clearcoatRoughness: 0.72,
      sheen: 0.26,
      sheenRoughness: 0.78,
      transparent: !0
    }), po = new l.MeshPhysicalMaterial({
      color: e.foil,
      map: N,
      alphaMap: N,
      bumpMap: Dr,
      bumpScale: 0.016,
      roughness: 0.2,
      metalness: 0.94,
      clearcoat: 0.18,
      clearcoatRoughness: 0.12,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2
    }), fo = new l.MeshPhysicalMaterial({
      map: Ee,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.3, 0.3),
      roughnessMap: E.roughness,
      bumpMap: j,
      bumpScale: 4e-3,
      roughness: 0.95,
      metalness: 0.025,
      sheen: 0.27,
      sheenRoughness: 0.78,
      transparent: !0,
      side: l.DoubleSide
    }), ho = new l.MeshPhysicalMaterial({
      color: e.foil,
      map: je,
      alphaMap: je,
      bumpMap: Kr,
      bumpScale: 0.017,
      roughness: 0.19,
      metalness: 0.92,
      clearcoat: 0.16,
      clearcoatRoughness: 0.13,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2,
      side: l.DoubleSide
    }), uo = new l.MeshPhysicalMaterial({
      map: vt,
      normalMap: E.normal,
      normalScale: new l.Vector2(0.28, 0.28),
      roughnessMap: E.roughness,
      bumpMap: j,
      bumpScale: 35e-4,
      roughness: 0.96,
      metalness: 0.025,
      sheen: 0.25,
      sheenRoughness: 0.8,
      transparent: !0,
      side: l.DoubleSide
    }), go = new l.MeshPhysicalMaterial({
      color: e.foil,
      map: xt,
      alphaMap: xt,
      bumpMap: kr,
      bumpScale: 0.016,
      roughness: 0.21,
      metalness: 0.9,
      clearcoat: 0.14,
      clearcoatRoughness: 0.14,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -2,
      side: l.DoubleSide
    }), et = new l.MeshPhysicalMaterial({
      color: new l.Color(e.palette.paperPale).lerp(new l.Color(15919832), 0.5),
      map: J,
      bumpMap: Y,
      bumpScale: 18e-4,
      roughness: 0.94,
      metalness: 0,
      sheen: 0.025,
      sheenRoughness: 1,
      side: l.DoubleSide,
      transparent: !0
    }), mo = new l.MeshPhysicalMaterial({
      color: 16777215,
      map: fe.fore,
      bumpMap: fe.fore,
      bumpScale: 22e-4,
      roughness: 0.93,
      metalness: 0,
      sheen: 0.018,
      sheenRoughness: 1,
      side: l.DoubleSide,
      transparent: !0
    }), bo = new l.MeshPhysicalMaterial({
      color: 16777215,
      map: fe.headTail,
      bumpMap: fe.headTail,
      bumpScale: 15e-4,
      roughness: 0.94,
      metalness: 0,
      sheen: 0.014,
      sheenRoughness: 1,
      side: l.DoubleSide,
      transparent: !0
    }), wt = new l.MeshPhysicalMaterial({
      color: new l.Color(e.color).multiplyScalar(0.42),
      roughness: 0.9,
      metalness: 0,
      bumpMap: j,
      bumpScale: 6e-3,
      side: l.DoubleSide,
      transparent: !0
    }), we = ut(P.page), yo = ut(P.headband), Ct = _.map((Z) => {
      const q = ut(P.pageSheet);
      return q.map = Z, q.bumpMap = Y, q.bumpScale = 12e-4, q.roughness = 0.96, q.side = l.FrontSide, q.needsUpdate = !0, q;
    }), re = ut(P.pageSheet);
    re.map = Y, re.bumpMap = Y, re.bumpScale = 12e-4, re.roughness = 0.96, re.side = l.FrontSide, re.needsUpdate = !0;
    const vo = new l.MeshPhysicalMaterial({
      color: new l.Color(9273711).lerp(new l.Color(e.palette.paperPale), 0.34),
      roughness: 0.98,
      metalness: 0,
      transparent: !0
    }), xo = new l.MeshPhysicalMaterial({
      color: new l.Color(e.foil).lerp(new l.Color(e.color), 0.28),
      roughness: 0.62,
      metalness: 0.08,
      sheen: 0.36,
      sheenRoughness: 0.68,
      side: l.DoubleSide,
      transparent: !0
    });
    we.map = Y, we.bumpMap = Y, we.bumpScale = 14e-4, we.roughness = 0.95, we.needsUpdate = !0;
    const Mr = new Et(
      a,
      n,
      i,
      2,
      d
    ), wo = In(
      g,
      v,
      C,
      s
    ), At = oo(
      a - 7e-3,
      n - 7e-3,
      35e-4
    ), Er = oo(
      a - 0.045,
      n - 0.045,
      3e-3
    );
    t.userData.construction = {
      board: i,
      coverRadius: d,
      pageRadius: s,
      spineRadius: h,
      spineBoardThickness: x,
      spineProfile: "flat",
      spineFoilLayered: !0,
      backSurfaceLayered: !0,
      clothPbrMaps: !0,
      foilEmbossed: !0,
      interiorPageDesigns: _.length,
      flexiblePageSegments: Qt,
      clothLikePageDeformation: !0,
      turnInStrips: 8,
      ribbonBookmark: !0,
      pageSignatures: wo.userData.pageSignatures,
      gutterCompression: wo.userData.gutterCompression,
      coverArtInset: 7e-3,
      coverOverhangX: (a - g) * 0.5,
      coverOverhangY: (n - v) * 0.5
    };
    const Lt = T(wo, we, `${e.id}-page-block`);
    Lt.position.x = 0.018, r.add(Lt);
    const he = new l.Group();
    he.name = `${e.id}-back-cover-pivot`, he.position.set(-a * 0.5, 0, -c * 0.5 - i * 0.5);
    const jr = T(Mr, qe, `${e.id}-back-cover`);
    jr.position.x = a * 0.5, he.add(jr);
    const Co = T(
      At,
      uo,
      `${e.id}-back-cover-art`,
      !1,
      !1
    );
    Co.position.set(a * 0.5, 0, -i * 0.55), Co.rotation.y = Math.PI, he.add(Co);
    const Ao = T(
      At,
      go,
      `${e.id}-back-foil-art`,
      !1,
      !1
    );
    Ao.position.set(a * 0.5, 0, -i * 0.605), Ao.rotation.y = Math.PI, he.add(Ao);
    const qr = T(
      Er,
      et,
      `${e.id}-back-endpaper`,
      !1,
      !0
    );
    qr.position.set(a * 0.5, 0, i * 0.515), he.add(qr), tr(
      he,
      e,
      "back",
      a,
      n,
      i * 0.53,
      qe
    );
    const Tt = T(
      P.plane,
      wt,
      `${e.id}-back-hinge-groove`,
      !1,
      !1
    );
    Tt.scale.set(0.012, n * 0.94, 1), Tt.position.set(0.038, 0, -i * 0.535), Tt.rotation.y = Math.PI, he.add(Tt), r.add(he);
    const ne = new l.Group();
    ne.name = `${e.id}-front-cover-pivot`, ne.position.set(-a * 0.5, 0, c * 0.5 + i * 0.5);
    const Lo = T(Mr, qe, `${e.id}-front-cover`);
    Lo.position.x = a * 0.5, ne.add(Lo);
    const Rr = T(
      At,
      co,
      `${e.id}-cover-art`,
      !1,
      !1
    );
    Rr.position.set(a * 0.5, 0, i * 0.55), ne.add(Rr);
    const Hr = T(
      At,
      po,
      `${e.id}-foil-art`,
      !1,
      !1
    );
    Hr.position.set(a * 0.5, 0, i * 0.605), ne.add(Hr);
    const To = T(
      Er,
      et,
      `${e.id}-front-endpaper`,
      !1,
      !0
    );
    To.position.set(a * 0.5, 0, -i * 0.515), To.rotation.y = Math.PI, ne.add(To), tr(
      ne,
      e,
      "front",
      a,
      n,
      -i * 0.53,
      qe
    );
    const So = T(
      P.plane,
      wt,
      `${e.id}-front-hinge-groove`,
      !1,
      !1
    );
    So.scale.set(0.012, n * 0.94, 1), So.position.set(0.038, 0, i * 0.655), ne.add(So), r.add(ne);
    const Xr = [], St = [];
    for (let Z = 0; Z < 6; Z += 1) {
      const q = 5 - Z, ot = q < 4 ? Ct[q * 2] : re, ra = q < 4 ? Ct[q * 2 + 1] : re, ae = new l.Group();
      ae.name = `${e.id}-page-${Z}`, ae.position.set(
        -a * 0.5 + f * 0.65,
        0,
        C * 0.5 + 15e-4 + Z * 15e-4
      ), ae.userData.restZ = ae.position.z, ae.userData.turnedZ = c * 0.5 + i + 4e-3 + q * 15e-4;
      const Dt = new l.PlaneGeometry(
        1,
        1,
        Qt,
        Qo
      ), Kt = new l.PlaneGeometry(
        1,
        1,
        Qt,
        Qo
      ), kt = g - f * 0.42, Mt = T(
        Dt,
        ot,
        `${e.id}-page-sheet-${Z}-front`,
        !1,
        !0
      );
      Mt.scale.set(kt, v - 0.014, 1), Mt.position.set(kt * 0.5, 0, 22e-5), ae.add(Mt), St.push(Mt);
      const rt = T(
        Kt,
        ra,
        `${e.id}-page-sheet-${Z}-back`,
        !1,
        !0
      );
      rt.scale.set(kt, v - 0.014, 1), rt.position.set(kt * 0.5, 0, -22e-5), rt.rotation.y = Math.PI, ae.add(rt), St.push(rt), ae.userData.flex = {
        curve: 0,
        curveVelocity: 0,
        twist: 0,
        twistVelocity: 0,
        surfaces: [
          {
            geometry: Dt,
            position: Dt.attributes.position,
            base: Float32Array.from(Dt.attributes.position.array),
            direction: 1
          },
          {
            geometry: Kt,
            position: Kt.attributes.position,
            base: Float32Array.from(Kt.attributes.position.array),
            direction: -1
          }
        ]
      }, r.add(ae), Xr.push(ae);
    }
    const ta = new Et(
      x,
      n - 0.012,
      c + i * 1.88,
      1,
      h
    ), Pt = T(ta, fo, `${e.id}-flat-spine`);
    Pt.position.x = -a * 0.5 - x * 0.35, Pt.userData.profile = "flat", r.add(Pt);
    const zt = T(
      P.plane,
      ho,
      `${e.id}-spine-foil`,
      !1,
      !1
    );
    zt.scale.set(c + i * 1.82, n - 0.018, 1), zt.rotation.y = -Math.PI * 0.5, zt.position.set(
      Pt.position.x - x * 0.505,
      0,
      0
    ), r.add(zt);
    const Ur = T(
      new Et(
        f * 0.68,
        n - 0.056,
        Math.max(0.045, C - 8e-3),
        1,
        15e-4
      ),
      et,
      `${e.id}-spine-lining`
    );
    Ur.position.set(-a * 0.5 + f * 0.38, 0, 0), r.add(Ur), [-1, 1].forEach((Z) => {
      const q = new l.CylinderGeometry(
        0.012,
        0.012,
        C * 0.88,
        12,
        1,
        !1
      ), ot = T(
        q,
        yo,
        `${e.id}-headband-${Z}`
      );
      ot.rotation.x = Math.PI * 0.5, ot.position.set(
        -g * 0.5 + 0.046,
        Z * (v * 0.5 - 4e-3),
        0
      ), r.add(ot);
    });
    const oa = oo(
      0.034,
      v * 0.76,
      2e-3
    ), Po = T(
      oa,
      xo,
      `${e.id}-ribbon-bookmark`,
      !1,
      !0
    );
    Po.position.set(
      -g * 0.5 + 0.09 + e.seed % 3 * 0.018,
      -v * 0.17,
      C * 0.5 + 3e-3
    ), Po.rotation.z = (e.seed % 2 ? -1 : 1) * 0.014, r.add(Po);
    for (let Z = 0; Z < 6; Z += 1) {
      const q = T(
        P.box,
        vo,
        `${e.id}-page-signature-${Z + 1}`,
        !1,
        !0
      );
      q.scale.set(35e-4, 135e-5, C * 0.91), q.position.set(
        0.018 + g * 0.5 + 1e-3,
        -v * 0.5 + (Z + 1) / 7 * v,
        0
      ), r.add(q);
    }
    const It = T(
      P.plane,
      mo,
      `${e.id}-fore-edge`,
      !1,
      !0
    );
    It.scale.set(C * 0.94, v - 0.028, 1), It.rotation.y = Math.PI * 0.5, It.position.set(0.018 + g * 0.5 + 2e-3, 0, 0), r.add(It), [-1, 1].forEach((Z) => {
      const q = T(
        P.plane,
        bo,
        `${e.id}-${Z > 0 ? "head" : "tail"}-edge`,
        !1,
        !0
      );
      q.scale.set(g - 0.035, C * 0.94, 1), q.rotation.x = Z > 0 ? -Math.PI * 0.5 : Math.PI * 0.5, q.position.set(
        0.018,
        Z * (v * 0.5 + 2e-3),
        0
      ), r.add(q);
    });
    const Zr = new l.MeshBasicMaterial({
      transparent: !0,
      opacity: 0,
      depthWrite: !1
    }), Re = T(P.box, Zr, `${e.id}-hit-target`, !1, !1);
    Re.scale.set(a * 1.34, n * 1.2, Math.max(c * 4, 1)), Re.position.set(-f * 0.18, 0, 0.12), Re.userData.index = o, r.add(Re), ko.push(Re);
    const Wr = new l.MeshBasicMaterial({
      color: new l.Color(e.palette.shelfDark),
      alphaMap: er(),
      transparent: !0,
      opacity: 0.24,
      depthWrite: !1,
      side: l.DoubleSide
    }), tt = T(
      P.plane,
      Wr,
      `${e.id}-contact-shadow`,
      !1,
      !1
    );
    return tt.scale.set(a * 1.22, c * 2.05, 1), tt.rotation.x = -Math.PI * 0.5, tt.position.set(0, -n * 0.5 - 0.022, 0.025), t.add(tt), {
      data: e,
      root: t,
      motion: r,
      frontPivot: ne,
      frontCover: Lo,
      pageBlock: Lt,
      pagePivots: Xr,
      pageSurfaces: St,
      pageGestureSurfaces: [...St, Lt],
      hit: Re,
      coverTexture: F,
      foilTexture: N,
      clothBumpTexture: j,
      clothSurfaceMaps: E,
      paperFaceTexture: Y,
      interiorPageTextures: _,
      endpaperTexture: J,
      pageEdgeTextures: fe,
      spineTexture: Ee,
      spineFoilTexture: je,
      backCoverTexture: vt,
      backFoilTexture: xt,
      foilEmbossTexture: Dr,
      spineEmbossTexture: Kr,
      backEmbossTexture: kr,
      contactShadow: tt,
      opacity: 1,
      lastOffset: null,
      fadeMaterials: [
        qe,
        co,
        po,
        fo,
        ho,
        uo,
        go,
        et,
        mo,
        bo,
        wt,
        we,
        ...Ct,
        re,
        yo,
        vo,
        xo
      ],
      materials: [
        qe,
        co,
        po,
        fo,
        ho,
        uo,
        go,
        et,
        mo,
        bo,
        wt,
        we,
        ...Ct,
        re,
        yo,
        vo,
        xo,
        Wr,
        Zr
      ],
      base: {
        width: a,
        height: n,
        depth: c
      }
    };
  }
  function or() {
    const e = G < 820;
    if (Le.set(0, e ? 2.02 : 1.92, e ? 8.7 : 8.1), le.set(0, e ? 1.57 : 1.55, 0), Fe.set(e ? 0 : -2.25, e ? 2.3 : 1.56, e ? 0.15 : 0), ht.set(e ? 0 : -0.52, e ? 2.46 : 1.78, e ? 5.7 : 5.25), Je.copy(Fe), e) {
      Ye = 0, Ge = G;
      return;
    }
    const o = Xe.getBoundingClientRect();
    if (o.width <= 0 && o.height <= 0) {
      Ye = 0, Ge = G;
      return;
    }
    const t = o.left > 0 ? o.left : G * 0.64, r = A(G * 0.035, 32, 56);
    Ge = Math.max(G * 0.42, t - r);
    const a = A((G - 820) / 620, 0, 1), n = l.MathUtils.lerp(0.55, 0.615, a), c = Ge * n;
    Ye = Math.max(0, G * 0.5 - c);
  }
  function rr() {
    if (!u || G < 820) return 0.82;
    const o = 2 * Math.abs(ht.z - Fe.z) * Math.tan(l.MathUtils.degToRad(L.fov * 0.5)), t = Se / Math.max(o, 1e-3), r = u.base.width * t * 1.16, a = Ge * 0.72 / Math.max(r, 1);
    return A(a, 0.9, 1.32);
  }
  function Pe() {
    if (Math.abs(se) < 0.5) {
      L.clearViewOffset();
      return;
    }
    L.setViewOffset(
      G,
      Se,
      se,
      0,
      G,
      Se
    );
  }
  function jn(e, o, t = 0) {
    if (!Rt) return null;
    const r = new l.Texture(at);
    return r.name = "editorial-walnut", r.colorSpace = l.SRGBColorSpace, r.wrapS = l.RepeatWrapping, r.wrapT = l.RepeatWrapping, r.repeat.set(e, o), r.center.set(0.5, 0.5), r.rotation = t, r.anisotropy = Math.min(8, D.capabilities.getMaxAnisotropy()), r.needsUpdate = !0, r;
  }
  function qn() {
    if (!Rt || !D) return;
    const e = jn(7, 1.65, Math.PI * 0.5), o = e?.clone() || null;
    o && (o.name = "editorial-walnut-dark", o.needsUpdate = !0), P.walnut.map = e, P.walnut.needsUpdate = !0, P.walnutDark.map = o, P.walnutDark.needsUpdate = !0, U();
  }
  function Rn() {
    const e = T(P.plane, new l.MeshStandardMaterial({
      color: 14207146,
      roughness: 0.92,
      metalness: 0
    }), "paper-floor", !1, !0);
    e.scale.set(30, 20, 1), e.rotation.x = -Math.PI * 0.5, e.position.y = -0.02, R.add(e);
    const o = T(P.plane, new l.MeshStandardMaterial({
      color: 15327179,
      roughness: 1,
      metalness: 0
    }), "paper-backdrop", !1, !0);
    o.scale.set(28, 14, 1), o.position.set(0, 5.5, -3.3), R.add(o);
    const t = T(P.box, P.walnut, "walnut-shelf");
    t.scale.set(17, 0.28, 1.08), t.position.set(0, 0.33, -0.03), W.add(t);
    const r = T(P.box, P.walnutDark, "walnut-shelf-lip");
    r.scale.set(17.05, 0.075, 1.14), r.position.set(0, 0.205, 0.02), W.add(r);
    const a = T(P.box, P.walnut, "walnut-back-rail");
    a.scale.set(17, 0.17, 0.2), a.position.set(0, 0.68, -0.52), W.add(a), [-7.65, 7.65].forEach((c, i) => {
      const d = T(P.box, P.walnutDark, `shelf-upright-${i}`);
      d.scale.set(0.2, 3.8, 0.72), d.position.set(c, 2.05, -0.28), W.add(d);
    });
    const n = T(P.plane, new l.MeshBasicMaterial({
      color: 3087635,
      alphaMap: er(),
      transparent: !0,
      opacity: 0.22,
      depthWrite: !1
    }), "shelf-contact-shadow", !1, !1);
    n.scale.set(16, 0.85, 1), n.rotation.x = -Math.PI * 0.5, n.position.set(0, 0.49, 0.06), W.add(n), B.floor = e.material, B.wall = o.material, B.shelf = P.walnut, B.shelfDark = P.walnutDark, B.shadow = n.material;
  }
  function Hn() {
    I.hemisphere = new l.HemisphereLight(16775400, 5980208, 0.56), R.add(I.hemisphere);
    const e = new l.DirectionalLight(16771266, 1.42);
    e.name = "shadow-key", e.position.set(-4.6, 7.4, 5.8), e.castShadow = !0, e.shadow.mapSize.set(2048, 2048), e.shadow.camera.left = -6, e.shadow.camera.right = 6, e.shadow.camera.top = 6, e.shadow.camera.bottom = -1.5, e.shadow.camera.near = 1, e.shadow.camera.far = 18, e.shadow.bias = -18e-5, e.shadow.normalBias = 0.018, e.shadow.radius = 3.5, R.add(e), I.key = e;
    const o = new l.RectAreaLight(16771266, 5.4, 4.8, 5.6);
    o.name = "cloth-softbox", o.position.set(-3.2, 5.5, 4.6), o.lookAt(0, 1.45, 0), R.add(o), I.softKey = o;
    const t = new l.DirectionalLight(14214119, 0.3);
    t.name = "cool-fill", t.position.set(5.5, 3.6, 4.2), R.add(t), I.fill = t;
    const r = new l.RectAreaLight(14001246, 3.45, 1.6, 4.8);
    r.name = "foil-rake", r.position.set(3.8, 3.6, -2.1), r.lookAt(-0.2, 1.5, 0), R.add(r), I.rim = r;
    const a = new l.RectAreaLight(14214119, 2.7, 3.8, 4.8);
    a.name = "back-cover-softbox", a.position.set(-1.8, 2.9, -4.5), a.lookAt(-0.1, 1.45, 0), R.add(a), I.backFill = a;
    const n = new l.RectAreaLight(16771266, 1.9, 0.9, 4.6);
    n.name = "spine-rake", n.position.set(-4.6, 3.2, 1.1), n.lookAt(-0.55, 1.5, 0), R.add(n), I.spineRake = n;
    const c = new l.RectAreaLight(16775143, 2.15, 1.15, 3.8);
    c.name = "page-edge-rake", c.position.set(4.2, 4.8, 3.1), c.lookAt(0.65, 1.55, 0), R.add(c), I.pageRake = c;
  }
  const _markerListeners = [];
  function Xn() {
    S.forEach((e, o) => {
      const t = document.createElement("button");
      const isInit = o === (typeof He.initialIndex === "number" ? We(He.initialIndex, S.length) : 0);
      t.className = "marker", t.type = "button", t.role = "tab", t.setAttribute("aria-label", `Select volume ${o + 1}: ${e.title}`), t.setAttribute("aria-current", isInit ? "true" : "false"), t.setAttribute("aria-selected", isInit ? "true" : "false");
      const clickHandler = () => ar(o, t);
      t.addEventListener("click", clickHandler);
      _markerListeners.push({ el: t, handler: clickHandler });
      Xt.append(t);
    });
  }
  function nr() {
    B.floor?.color.copy(w.floor), B.wall?.color.copy(w.wall), B.shelf?.color.copy(w.shelf), B.shelfDark?.color.copy(w.shelfDark), B.shadow?.color.copy(w.shadow), R?.fog?.color.copy(w.fog), I.hemisphere?.color.copy(w.hemisphere), I.hemisphere?.groundColor.copy(w.hemisphereGround), I.key?.color.copy(w.key), I.softKey?.color.copy(w.key), I.fill?.color.copy(w.fill), I.rim?.color.copy(w.rim), I.backFill?.color.copy(w.fill), I.spineRake?.color.copy(w.key), I.pageRake?.color.copy(w.hemisphere), ft = !1;
  }
  function Un(e) {
    const o = e.palette, t = y.style;
    t.setProperty("--paper", o.paper), t.setProperty("--paper-deep", o.paperDeep), t.setProperty("--paper-pale", o.paperPale), t.setProperty("--ink", o.ink), t.setProperty("--ink-soft", o.inkSoft), t.setProperty("--walnut", o.shelf), t.setProperty("--walnut-deep", o.shelfDark), t.setProperty("--rule", `color-mix(in srgb, ${o.ink} 24%, transparent)`), t.setProperty("--accent", e.foil), y.querySelector('meta[name="theme-color"]')?.setAttribute("content", o.paper), w.floor.set(o.paperDeep), w.wall.set(o.wall), w.shelf.set(o.shelf), w.shelfDark.set(o.shelfDark), w.shadow.set(o.shelfDark), w.fog.set(o.wall), w.hemisphere.set(o.paperPale), w.hemisphereGround.set(o.shelf), w.key.set(o.light), w.fill.set(o.fill), w.rim.set(e.foil), !Mo || X ? (Mo = !0, nr()) : (ft = !0, U());
  }
  function Zn(e) {
    if (!ft) return !1;
    const o = 1 - Math.exp(-e * 5.5);
    let t = 0;
    const r = (a, n) => {
      if (!a) return;
      const c = a.r - n.r, i = a.g - n.g, d = a.b - n.b;
      t = Math.max(
        t,
        c * c + i * i + d * d
      ), a.lerp(n, o);
    };
    return r(B.floor?.color, w.floor), r(B.wall?.color, w.wall), r(B.shelf?.color, w.shelf), r(B.shelfDark?.color, w.shelfDark), r(B.shadow?.color, w.shadow), r(R?.fog?.color, w.fog), r(I.hemisphere?.color, w.hemisphere), r(I.hemisphere?.groundColor, w.hemisphereGround), r(I.key?.color, w.key), r(I.softKey?.color, w.key), r(I.fill?.color, w.fill), r(I.rim?.color, w.rim), r(I.backFill?.color, w.fill), r(I.spineRake?.color, w.key), r(I.pageRake?.color, w.hemisphere), t < 25e-7 && nr(), ft;
  }
  function mt(e, o = !1) {
    const t = We(e, S.length);
    if (t === O && !o) return;
    O = t;
    const r = S[O];
    Jr.textContent = r.title, Or.textContent = r.note, Br.textContent = `${ge(O + 1)} / ${ge(S.length)}`, Qr.textContent = r.paletteLabel, ie.setAttribute("aria-label", `Open ${r.title}`), Un(r), He.onSelectionChange?.({ index: O, total: S.length, title: r.title }), [...Xt.children].forEach((a, n) => {
      const c = n === O;
      a.setAttribute("aria-current", c ? "true" : "false"), a.setAttribute("aria-selected", c ? "true" : "false"), a.tabIndex = c ? 0 : -1;
    }), o && (Ce.textContent = `Selected volume ${O + 1} of ${S.length}: ${r.title}. ${r.note}`);
  }
  function Wn(e) {
    tn.textContent = `Volume ${e.roman} · ${e.discipline}`, on.textContent = e.title, rn.textContent = e.deck, nn.textContent = e.binding, an.textContent = e.format, sn.textContent = e.theme, ln.textContent = e.motif;
  }
  function Nn(e) {
    return [
      "Title page",
      `${e.chapters[0]} · Plate`,
      `${e.chapters[1]} · Notes`,
      `${e.chapters[2]} · System`,
      "Colophon"
    ];
  }
  function Qe(e = !1) {
    const o = u?.data || S[O], t = Nn(o), r = b !== "detail" || !K, a = r || H === 0, n = r || H === Oe - 1;
    st.disabled = a, lt.disabled = n, $r.textContent = K ? t[H] : "Closed", _r.textContent = K ? `${ge(H + 1)} / ${ge(Oe)}` : "Click book to open", it.textContent = K ? "Close book" : "Open book", it.setAttribute("aria-pressed", String(K)), en.textContent = K ? "Drag pages · Drag cover to close · Background to orbit" : "Drag cover or click once to open · Background to orbit", st.setAttribute(
      "aria-label",
      a ? "Previous sample page" : `Previous sample page: ${t[H - 1]}`
    ), lt.setAttribute(
      "aria-label",
      n ? "Next sample page" : `Next sample page: ${t[H + 1]}`
    ), e && u && K && (Ce.textContent = `Page ${H + 1} of ${Oe}: ${t[H]}.`);
  }
  function ve(e, o = !0) {
    b !== "detail" || K === e || (Ke(), K = e, K || (H = 0), m.classList.remove("has-page-hover", "has-closed-book-hover"), Qe(!1), Ve = !0, o && u && (Ce.textContent = K ? `${u.data.title} opened to its title page. Drag a page horizontally or use the arrow controls to read.` : `${u.data.title} closed. Drag the cover, click the book, or use Open book to begin reading.`), U());
  }
  function ze(e) {
    if (b !== "detail" || !K) return;
    const o = A(
      H + e,
      0,
      Oe - 1
    );
    o !== H && (H = o, Qe(!0), U());
  }
  function ro(e, o, t, r = !1, a = 0) {
    const n = e.userData.flex;
    if (!n) return;
    const c = r || X, i = Math.min(t, 0.033);
    let d = o, s = a;
    if (c)
      n.curveVelocity = 0, n.twistVelocity = 0;
    else {
      const h = (o - n.curve) * 178 - n.curveVelocity * 19, x = (a - n.twist) * 210 - n.twistVelocity * 21;
      n.curveVelocity = A(
        n.curveVelocity + h * i,
        -1.8,
        1.8
      ), n.twistVelocity = A(
        n.twistVelocity + x * i,
        -1.6,
        1.6
      ), d = A(
        n.curve + n.curveVelocity * i,
        -0.025,
        0.19
      ), s = A(
        n.twist + n.twistVelocity * i,
        -0.12,
        0.12
      ), Math.abs(o - d) < 2e-5 && Math.abs(n.curveVelocity) < 8e-4 && (d = o, n.curveVelocity = 0), Math.abs(a - s) < 2e-5 && Math.abs(n.twistVelocity) < 8e-4 && (s = a, n.twistVelocity = 0);
    }
    !c && Math.abs(d - n.curve) < 1e-5 && Math.abs(o - d) < 1e-5 && Math.abs(s - n.twist) < 1e-5 && Math.abs(a - s) < 1e-5 || (n.curve = d, n.twist = s, n.surfaces.forEach((h) => {
      const { position: x, base: f, direction: g, geometry: v } = h;
      for (let C = 0; C < x.count; C += 1) {
        const F = C * 3, N = f[F], j = f[F + 1], E = N + 0.5, Y = g > 0 ? E : 1 - E, _ = Math.sin(Math.PI * Y), J = Y * Y * 0.16, fe = _ * 0.84 + J, Ee = s * j * Math.pow(Y, 1.35), je = s * Math.sin(Y * Math.PI * 2) * (1 - Math.min(1, Math.abs(j) * 1.65)) * 0.09, vt = (d * fe * (1 + j * 0.14) + Ee + je) * g;
        x.setXYZ(C, N, j, vt);
      }
      x.needsUpdate = !0, v.computeVertexNormals();
    }));
  }
  function no(e, o, t = 1) {
    const r = A(t, 0, 1), a = X ? 1e3 : 10.5, n = b === "detail" && !K && me && !X ? -0.16 : 0, c = r > 0 ? (-Math.PI + 0.055) * r : n;
    e.frontPivot.rotation.y = k(
      e.frontPivot.rotation.y,
      c,
      a,
      o
    ), e.pagePivots.forEach((i, d) => {
      const s = e.pagePivots.length - 1 - d;
      let h = 0, x = i.userData.restZ, f = 0, g = 0, v = 0;
      if (s < Bt) {
        const N = s < H, j = -0.038 + s * 8e-3, E = -Math.PI + 0.085 + s * 0.014;
        if (h = N ? E : j, x = N ? i.userData.turnedZ : i.userData.restZ, p.active && p.direction !== 0) {
          const Y = p.direction > 0 ? H : H - 1;
          if (s === Y) {
            const _ = Ze(p.progress), J = Math.sin(Math.PI * _), fe = A(
              Math.abs(p.progressVelocity) / 5.5,
              0,
              1
            ), Ee = A(
              p.progressVelocity / 5.5,
              -1,
              1
            );
            h = p.direction > 0 ? ue(j, E, _) : ue(E, j, _), x = p.direction > 0 ? ue(i.userData.restZ, i.userData.turnedZ, _) : ue(i.userData.turnedZ, i.userData.restZ, _), f = p.direction * J * (0.014 + p.verticalBias * 0.026), g = J * (0.032 + fe * 0.064), v = J * (p.verticalBias * 0.08 + Ee * p.direction * 0.03);
          }
        }
        i.position.z = k(
          i.position.z,
          i.userData.restZ + (x - i.userData.restZ) * r,
          a,
          o
        );
      } else
        h = -6e-3 + (s - Bt) * 3e-3, i.position.z = k(
          i.position.z,
          i.userData.restZ,
          a,
          o
        );
      i.rotation.y = k(
        i.rotation.y,
        h * r,
        a,
        o
      ), i.rotation.z = k(
        i.rotation.z,
        f * r,
        a,
        o
      );
      const C = A(
        Math.abs(i.rotation.y) / Math.PI,
        0,
        1
      ), F = r > 0 ? r * (4e-3 + Math.sin(Math.PI * C) * 0.082 + g) : 0;
      ro(
        i,
        F,
        o,
        !1,
        v * r
      );
    });
  }
  function ar(e, o) {
    if (b !== "hero") return;
    const t = Math.round(V), r = We(t, S.length);
    let a = e - r;
    a > S.length / 2 && (a -= S.length), a < -S.length / 2 && (a += S.length), V = t + a, dt = o, mt(e, !0), U();
    checkAndNotifySettled();
  }
  function Ie(e, o) {
    b === "hero" && (V = Math.round(V) + e, dt = o, mt(We(Math.round(V), S.length), !0), U(), checkAndNotifySettled());
  }
  function Vn() {
    const e = Math.round(V), o = We(e, S.length);
    let t = O - o;
    t > S.length / 2 && (t -= S.length), t < -S.length / 2 && (t += S.length), V = e + t, oe = V;
  }
  function ir(e, o) {
    let t = o - oe;
    t -= Math.round(t / S.length) * S.length;
    const r = Math.abs(t), a = 1 - A(r, 0, 1), n = A((r - 2.55) / 0.7, 0, 1), c = 1 - Ze(n);
    e.root.position.set(
      t * Bo,
      Ot + e.base.height * 0.5 + a * 0.15,
      0.13 + a * 0.24 - Math.min(r, 2.8) * 0.07
    ), e.root.rotation.set(0, -t * 0.105, -t * 0.018), e.root.scale.setScalar(1 + a * 0.09), e.motion.position.y = 0, e.motion.rotation.set(0, 0, 0), e.frontPivot.rotation.y = 0, e.pagePivots.forEach((i) => {
      i.rotation.y = 0, i.rotation.z = 0, i.position.z = i.userData.restZ, ro(i, 0, 0, !0);
    }), e.opacity = c, e.fadeMaterials.forEach((i) => {
      i.opacity = c;
    }), e.contactShadow.visible = !0, e.contactShadow.material.opacity = c * 0.24, e.hit.visible = c > 0.12, e.lastOffset = t;
  }
  function De(e) {
    const o = m.getBoundingClientRect();
    $.clientX = e.clientX, $.clientY = e.clientY, $.ndc.x = (e.clientX - o.left) / o.width * 2 - 1, $.ndc.y = -((e.clientY - o.top) / o.height) * 2 + 1, Ve = !0;
  }
  function Yn() {
    if (Ve = !1, b === "detail" && u) {
      _e(-1), K ? (me = !1, m.classList.remove("has-closed-book-hover"), m.classList.toggle(
        "has-page-hover",
        p.active || !!cr() || !!ao()
      )) : (me = !!ao(), m.classList.remove("has-page-hover"), m.classList.toggle(
        "has-closed-book-hover",
        me
      ));
      return;
    }
    if (me = !1, m.classList.remove("has-page-hover", "has-closed-book-hover"), b !== "hero") {
      _e(-1);
      return;
    }
    _e(sr());
  }
  function sr() {
    be.setFromCamera($.ndc, L);
    const e = be.intersectObjects(ko, !1);
    return e.length ? e[0].object.userData.index : -1;
  }
  function lr() {
    return b !== "detail" || !u ? !1 : (u.root.updateWorldMatrix(!0, !0), be.setFromCamera($.ndc, L), be.intersectObject(u.hit, !1).length > 0);
  }
  function cr() {
    if (b !== "detail" || !u || !K) return null;
    u.root.updateWorldMatrix(!0, !0), be.setFromCamera($.ndc, L);
    const e = be.intersectObjects(
      u.pageGestureSurfaces,
      !1
    );
    return e.length ? e[0].object : null;
  }
  function ao() {
    if (b !== "detail" || !u || H !== 0) return null;
    u.root.updateWorldMatrix(!0, !0), be.setFromCamera($.ndc, L);
    const e = be.intersectObject(u.frontCover, !1);
    return e.length ? e[0].object : null;
  }
  function pr() {
    const e = p.pointerId;
    p.active = !1, p.pointerId = null, p.progress = 0, p.peakProgress = 0, p.committed = !1, p.progressVelocity = 0, p.verticalBias = 0, p.lastProgress = 0, p.lastTime = 0, p.direction = 0, p.kind = null, m.classList.remove("is-page-dragging"), z.enabled = b === "detail", e !== null && m.hasPointerCapture?.(e) && m.releasePointerCapture(e);
  }
  function Gn(e) {
    if (!u || e === 0) return;
    const o = e > 0 ? H : H - 1, t = u.pagePivots.length - 1 - o, a = u.pagePivots[t]?.userData.flex;
    if (!a) return;
    const n = A(
      Math.abs(p.progressVelocity) / 5.5,
      0.12,
      1
    );
    a.curveVelocity = A(
      a.curveVelocity + n * 0.46,
      -1.8,
      1.8
    ), a.twistVelocity = A(
      a.twistVelocity + p.verticalBias * 0.38 + A(
        p.progressVelocity / 5.5,
        -1,
        1
      ) * e * 0.14,
      -1.6,
      1.6
    );
  }
  function $e(e = !1) {
    if (!p.active) return !1;
    const o = p.direction, t = e && p.kind === "cover-close" && p.committed, r = e && p.kind === "cover-open" && p.committed, a = e && p.kind === "page" && p.committed && o !== 0;
    return a && Gn(o), pr(), t ? ve(!1) : r ? ve(!0) : a ? ze(o) : U(), t || r || a;
  }
  function Ke() {
    $e(!1);
  }
  function Te() {
    M.active = !1, M.pointerId = null, M.moved = !1, M.allowClick = !1;
  }
  function dr(e) {
    b !== "detail" || K || e.button !== 0 || e.isPrimary === !1 || (De(e), M.allowClick = !1, lr() && (M.active = !0, M.pointerId = e.pointerId, M.startX = e.clientX, M.startY = e.clientY, M.moved = !1));
  }
  function fr(e) {
    !M.active || e.pointerId !== M.pointerId || Math.hypot(
      e.clientX - M.startX,
      e.clientY - M.startY
    ) > 16 && (M.moved = !0);
  }
  function ke(e) {
    !M.active || e.pointerId !== M.pointerId || (M.allowClick = e.type === "pointerup" && !M.moved, M.active = !1, M.pointerId = null);
  }
  function hr(e) {
    if (b !== "detail" || !u || e.button !== 0 || e.isPrimary === !1) return;
    De(e);
    const o = ao(), t = K ? cr() : null;
    !o && !t || (e.preventDefault(), e.stopImmediatePropagation(), p.active = !0, p.pointerId = e.pointerId, p.startX = e.clientX, p.startY = e.clientY, p.progress = 0, p.peakProgress = 0, p.committed = !1, p.progressVelocity = 0, p.verticalBias = 0, p.lastProgress = 0, p.lastTime = e.timeStamp || performance.now(), p.direction = 0, p.kind = o ? K ? "cover-close" : "cover-open" : "page", z.enabled = !1, m.classList.add("has-page-hover", "is-page-dragging"), m.setPointerCapture?.(e.pointerId), U());
  }
  function ur(e, o) {
    const t = e.timeStamp || performance.now(), r = A(
      (t - p.lastTime) / 1e3,
      8e-3,
      0.08
    ), a = A(
      (p.progress - p.lastProgress) / r,
      -8,
      8
    );
    p.progressVelocity = ue(
      p.progressVelocity,
      a,
      0.42
    ), p.verticalBias = ue(
      p.verticalBias,
      A(o / 180, -1, 1),
      0.36
    ), p.lastProgress = p.progress, p.lastTime = t;
  }
  function io(e) {
    De(e);
    const o = e.clientX - p.startX, t = e.clientY - p.startY, r = Math.abs(o);
    if (p.kind === "cover-open" || p.kind === "cover-close") {
      const a = p.kind === "cover-open", n = a ? -o : o, c = a ? bn : yn;
      p.direction = 0, p.progress = r >= 3 && r >= Math.abs(t) * 0.72 ? A(Math.max(0, n) / 140, 0, 1) : 0, p.peakProgress = Math.max(
        p.peakProgress,
        p.progress
      ), p.peakProgress >= c && (p.committed = !0), ur(e, t);
      return;
    }
    if (r < 3 || r < Math.abs(t) * 0.72)
      p.progress = 0;
    else {
      if (p.direction === 0 && r >= 6) {
        const n = o < 0 ? 1 : -1, c = n > 0 ? H < Oe - 1 : H > 0;
        p.direction = c ? n : 0;
      }
      const a = p.direction > 0 ? -o : o;
      p.progress = p.direction !== 0 ? A(Math.max(0, a) / 150, 0, 1) : 0, p.peakProgress = Math.max(
        p.peakProgress,
        p.progress
      ), p.peakProgress >= mn && (p.committed = !0);
    }
    ur(e, t);
  }
  function gr(e) {
    !p.active || e.pointerId !== p.pointerId || (e.preventDefault(), e.stopImmediatePropagation(), io(e), U());
  }
  function Me(e) {
    if (!p.active || e.pointerId !== p.pointerId) return;
    e.cancelable && e.preventDefault(), e.stopImmediatePropagation(), e.type === "pointerup" && io(e);
    const o = p.kind, t = Math.hypot(
      e.clientX - p.startX,
      e.clientY - p.startY
    ), r = e.type === "pointerup" && o === "cover-open" && !p.committed && t <= 12;
    p.committed ? $e(!0) : r ? (pr(), M.allowClick = !1, ve(!0)) : (o === "cover-open" && (M.allowClick = !1), Ke());
  }
  function bt(e) {
    !p.active || e.pointerId !== p.pointerId || (e.type === "pointerup" && io(e), $e(!0));
  }
  function _e(e) {
    if (Vt !== e) {
      if (Vt = e, m.classList.toggle("has-book-hover", e >= 0), e >= 0) {
        const o = S[e];
        cn.textContent = `Volume ${ge(e + 1)}`, pn.textContent = o.title, Ue.setAttribute("aria-hidden", "false");
      } else
        Ue.setAttribute("aria-hidden", "true");
      U();
    }
  }
  function Fn() {
    Ue.style.left = `${$.clientX}px`, Ue.style.top = `${$.clientY}px`;
  }
  function mr(e) {
    De(e), Fn(), U();
  }
  function br() {
    $.ndc.set(3, 3), Ve = !1, me = !1, _e(-1), p.active || m.classList.remove("has-page-hover", "has-closed-book-hover");
  }
  function isShelfSettled() {
    const diff = Math.abs(oe - V);
    return diff < 1e-3 && b === "hero" && Ne <= 0;
  }
  function checkAndNotifySettled() {
    const physicallySettled = isShelfSettled();

    // If motion has settled and there is a queued navigation, consume it first!
    if (physicallySettled && pendingNavigation) {
      const nav = pendingNavigation;
      pendingNavigation = null;

      if (nav.type === "open-book") {
        He.onOpenBook?.(nav.index, S[nav.index]);
        return;
      } else if (nav.type === "open-cover") {
        He.onOpenCover?.();
        return;
      } else if (nav.type === "close-to-library") {
        // Safe close-to-library completed, nothing more to rotate
      } else {
        // "select" intent: initiates a new rotation
        ar(nav.index);
        if (_lastSettledReported !== false) {
          _lastSettledReported = false;
          He.onSettledChange?.(false);
        }
        return;
      }
    }

    // Only report settled=true when no pending navigation remains and shelf is truly settled
    const trulySettled = isShelfSettled() && !pendingNavigation;
    if (trulySettled !== _lastSettledReported) {
      _lastSettledReported = trulySettled;
      He.onSettledChange?.(trulySettled);
    }
  }
  function yr(e) {
    if (b === "detail" && !K && e.button === 0) {
      if (!M.allowClick || (M.allowClick = !1, De(e), !lr())) return;
      e.preventDefault(), ve(!0);
      return;
    }
    if (b !== "hero" || e.button !== 0) return;
    De(e);
    const o = sr();
    if (o < 0) return;
    e.preventDefault();
    const centeredIndex = We(Math.round(V), S.length);
    if (o !== centeredIndex || !isShelfSettled()) {
      ar(o, m);
    } else {
      xe(m);
    }
  }
  function vr(e) {
    if (b !== "hero") return;
    e.preventDefault();
    const o = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    V += A(o * 22e-4, -0.72, 0.72), Ne = 0.14, U(), checkAndNotifySettled();
  }
  function xe(e = ie) {
    if (b !== "hero") return;
    b = "opening", te = 0, K = !1, me = !1, H = 0, Te(), dt = e === m ? Xt.children[O] || ie : e instanceof HTMLElement ? e : ie, u = pt[O], u.contactShadow.visible = !1, Wn(u.data), Qe(!1), Xe.inert = !1, Xe.setAttribute("aria-hidden", "false"), zo.inert = !0, y.classList.add("mode-detail", "is-opening"), Ue.setAttribute("aria-hidden", "true"), _e(-1), u.root.updateWorldMatrix(!0, !0), u.root.matrixWorld.decompose(
      Yt,
      Gt,
      Ft
    ), Ho.copy(L.position), Xo.copy(ce), Uo.copy(W.position), Eo.copy(u.motion.position), jo.copy(u.motion.quaternion), $o = se, R.add(u.root), u.root.position.copy(Yt), u.root.quaternion.copy(Gt), u.root.scale.copy(Ft), Pe(), z.enabled = !1, Ce.textContent = `Opening a closed copy of ${u.data.title}. Drag the cover, click the book, or use Open book to begin reading.`, He.onModeChange?.("opening"), checkAndNotifySettled(), X && wr(), U();
  }
  function xr(e) {
    const o = ct(A(e, 0, 1)), t = ct(A(e / 0.68, 0, 1));
    Zo.setScalar(rr()), W.position.lerpVectors(
      Uo,
      dn,
      t
    ), u.root.position.lerpVectors(
      Yt,
      Fe,
      o
    ), u.root.quaternion.slerpQuaternions(
      Gt,
      fn,
      o
    ), u.root.scale.lerpVectors(
      Ft,
      Zo,
      o
    ), u.motion.position.lerpVectors(
      Eo,
      qo,
      o
    ), u.motion.quaternion.slerpQuaternions(
      jo,
      Ro,
      o
    ), L.position.lerpVectors(
      Ho,
      ht,
      o
    ), ce.lerpVectors(
      Xo,
      Je,
      o
    ), se = ue($o, Ye, o), Pe(), L.lookAt(ce);
  }
  function wr() {
    u && (xr(1), b = "detail", te = 1, He.onModeChange?.("detail"), checkAndNotifySettled(), He.onOpenBook?.(O, S[O]), z.target.copy(Je), z.enabled = !0, z.enableDamping = !X, z.update(), Qe(!1), y.classList.remove("is-opening"), Ut.focus({ preventScroll: !0 }));
  }
  function so() {
    if (b !== "detail" && b !== "opening") return;
    Ke(), Te(), b = "closing", te = 0, K = !1, me = !1, H = 0, m.classList.remove("has-page-hover", "has-closed-book-hover"), Qe(!1), z.enabled = !1, No.copy(u.root.position), Vo.copy(u.root.quaternion), Yo.copy(u.root.scale), Go.copy(u.motion.position), Fo.copy(u.motion.quaternion), Jo.copy(L.position), Jt.copy(z.target), Oo.copy(W.position), _o = se, ce.copy(Jt), y.classList.remove("is-opening"), Vn(), Wo.set(
      0,
      Ot + u.base.height * 0.5 + 0.15,
      0.37
    ), pt.forEach((e, o) => {
      e !== u && e.root.parent === W && ir(e, o);
    }), y.classList.remove("mode-detail"), Xe.setAttribute("aria-hidden", "true"), Xe.inert = !0, Ce.textContent = `Returning ${u.data.title} to the shelf.`, He.onModeChange?.("closing"), checkAndNotifySettled(), X && Ar(), U();
  }
  function Cr(e) {
    const o = ct(A(e, 0, 1)), t = ct(
      A((e - 0.24) / 0.76, 0, 1)
    );
    W.position.lerpVectors(
      Oo,
      gn,
      t
    ), u.root.position.lerpVectors(
      No,
      Wo,
      o
    ), u.root.quaternion.slerpQuaternions(
      Vo,
      hn,
      o
    ), u.root.scale.lerpVectors(
      Yo,
      un,
      o
    ), u.motion.position.lerpVectors(
      Go,
      qo,
      o
    ), u.motion.quaternion.slerpQuaternions(
      Fo,
      Ro,
      o
    ), L.position.lerpVectors(
      Jo,
      Le,
      o
    ), ce.lerpVectors(
      Jt,
      le,
      o
    ), se = ue(_o, 0, o), Pe(), L.lookAt(ce);
  }
  function Ar() {
    u && (
      Cr(1),
      W.attach(u.root),
      ir(u, O),
      u.contactShadow.visible = !0,
      z.target.copy(le),
      zo.inert = !1,
      b = "hero",
      te = 0,
      He.onModeChange?.("hero"),
      u = null,
      Ce.textContent = `${S[O].title} returned to the shelf.`,
      requestAnimationFrame(() => dt?.focus?.({ preventScroll: !0 }))
    );
    checkAndNotifySettled();
    if (pendingNavigation) {
      const nav = pendingNavigation;
      if (nav.type === "open-book") {
        if (isShelfSettled()) {
          pendingNavigation = null;
          He.onOpenBook?.(nav.index, S[nav.index]);
        }
      } else if (nav.type === "close-to-library") {
        pendingNavigation = null;
        // Safe close-to-library completed: physical book returned, mode is hero, remain at current book O
      } else {
        pendingNavigation = null;
        ar(nav.index);
      }
    }
  }
  function Lr() {
    b === "detail" && (L.position.copy(ht), z.target.copy(Je), z.update(), Ce.textContent = `Inspection view reset for ${S[O].title}.`, U());
  }
  function Jn(e, o) {
    if (b === "hero") {
      oe = X ? V : k(oe, V, 9.5, e), Math.abs(oe - V) < 5e-4 && (oe = V), Ne > 0 && (Ne -= e, Ne <= 0 && (V = Math.round(V)));
      const isTargetSettled = Math.abs(oe - V) < 1e-3;
      if (isTargetSettled || Ne > 0 || p.active) {
        const t = We(Math.round(oe), S.length);
        t !== O && mt(t, !1);
      }
    }
    pt.forEach((t, r) => {
      if (t.root.parent !== W) return;
      let a = r - oe;
      a -= Math.round(a / S.length) * S.length;
      const n = Math.abs(a), c = t.lastOffset !== null && Math.abs(a - t.lastOffset) > S.length * 0.5, i = 1 - A(n, 0, 1), d = a * Bo, s = Ot + t.base.height * 0.5 + i * 0.15, h = 0.13 + i * 0.24 - Math.min(n, 2.8) * 0.07, x = -a * 0.105, f = -a * 0.018, g = 1 + i * 0.09, v = X ? 1e3 : 12;
      c && (t.root.position.x = d, t.opacity = 0), t.lastOffset = a, t.root.position.x = k(t.root.position.x, d, v, e), t.root.position.y = k(t.root.position.y, s, v, e), t.root.position.z = k(t.root.position.z, h, v, e), t.root.rotation.y = k(t.root.rotation.y, x, v, e), t.root.rotation.z = k(t.root.rotation.z, f, v, e);
      const C = k(t.root.scale.x, g, v, e);
      t.root.scale.setScalar(C);
      const F = A((n - 2.55) / 0.7, 0, 1), N = 1 - Ze(F);
      t.opacity = X ? N : k(t.opacity, N, 18, e), t.fadeMaterials.forEach((J) => {
        J.opacity = t.opacity;
      }), t.contactShadow.visible = !0, t.contactShadow.material.opacity = t.opacity * 0.24, t.hit.visible = t.opacity > 0.12;
      const E = Vt === r && b === "hero" && !X, Y = E ? -0.085 : 0;
      t.frontPivot.rotation.y = k(
        t.frontPivot.rotation.y,
        Y,
        X ? 1e3 : 13,
        e
      ), t.pagePivots.forEach((J) => {
        J.rotation.y = k(
          J.rotation.y,
          0,
          X ? 1e3 : 13,
          e
        ), J.rotation.z = k(
          J.rotation.z,
          0,
          X ? 1e3 : 13,
          e
        ), ro(J, 0, e);
      });
      const _ = X ? 0 : Math.sin(o * 0.72 + r * 0.8) * 0.012 * i;
      t.motion.position.y = k(t.motion.position.y, _ + (E ? 0.035 : 0), 9, e), t.motion.rotation.x = k(
        t.motion.rotation.x,
        E ? $.ndc.y * 0.035 : 0,
        10,
        e
      ), t.motion.rotation.y = k(
        t.motion.rotation.y,
        E ? -$.ndc.x * 0.035 : 0,
        10,
        e
      );
    });
  }
  function On(e) {
    if (b === "opening") {
      te = Math.min(1, te + e / vn);
      xr(te);
      no(u, e, 0);
      if (te >= 1) {
        wr();
      }
    } else if (b === "closing") {
      te = Math.min(1, te + e / xn);
      Cr(te);
      no(u, e, 0);
      if (te >= 1) {
        Ar();
      }
    } else if (b === "hero") {
      W.position.y = k(W.position.y, 0, 10, e);
      W.position.z = k(W.position.z, 0, 10, e);
      L.position.x = k(L.position.x, Le.x, 8, e);
      L.position.y = k(L.position.y, Le.y, 8, e);
      L.position.z = k(L.position.z, Le.z, 8, e);
      ce.copy(le);
      se = 0;
      Pe();
      L.lookAt(le);
    }
  }
  function Bn(e) {
    if (X) return;
    const o = R.getObjectByName("paper-dust");
    o && (o.rotation.y = e * 0.012, o.position.y = Math.sin(e * 0.17) * 0.025);
  }
  function U() {
    if (!ee && !Ae) {
      ee = requestAnimationFrame($n);
    }
  }
  function Qn() {
    return p.active && p.kind === "cover-open" ? Ze(p.progress) : K ? p.active && p.kind === "cover-close" ? 1 - Ze(p.progress) : 1 : 0;
  }
  function $n(e) {
    ee = 0;
    const o = Math.min((e - Nt) / 1e3, 0.05), t = e / 1e3;
    Nt = e, Ve && Yn(), Jn(o, t), On(o), Bn(t);
    const r = Zn(o);
    b === "detail" && (p.active && (p.progressVelocity = k(
      p.progressVelocity,
      0,
      9,
      o
    )), z.update(), no(u, o, Qn())), D.render(R, L);
    const a = Math.abs(oe - V) > 5e-4 || Ne > 0;
    checkAndNotifySettled();
    (!X || b === "opening" || b === "closing" || a || r) && !Ae && U();
  }
  function yt() {
    G = Math.max(1, y.clientWidth), Se = Math.max(1, y.clientHeight), or(), D.setSize(G, Se, !1), D.setPixelRatio(Math.min(window.devicePixelRatio || 1, G < 820 ? 1.5 : 2)), L.aspect = G / Se, L.updateProjectionMatrix(), b === "hero" ? (L.position.copy(Le), ce.copy(le), se = 0, Pe(), L.lookAt(le)) : b === "detail" && u && (u.root.position.copy(Fe), u.root.scale.setScalar(rr()), ce.copy(Je), se = Ye, Pe(), Lr()), U();
  }
  function Tr(e) {
    if (e.key === "Escape" && (b === "detail" || b === "opening" || b === "closing")) {
      e.preventDefault();
      e.stopPropagation();
      so();
      return;
    }
    if (b === "detail" && !e.metaKey && !e.ctrlKey && !e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault(), ze(e.key === "ArrowLeft" ? -1 : 1);
      return;
    }
    if (b === "detail" && e.key === "Tab") {
      const o = [
        Ut,
        it,
        st,
        lt,
        Ko
      ].filter((a) => !a.disabled), t = o.indexOf(document.activeElement), r = e.shiftKey ? t <= 0 ? o.length - 1 : t - 1 : t >= o.length - 1 ? 0 : t + 1;
      e.preventDefault(), o[r].focus();
      return;
    }
    b !== "hero" || e.metaKey || e.ctrlKey || e.altKey || (e.key === "ArrowLeft" ? (e.preventDefault(), Ie(-1, document.activeElement)) : e.key === "ArrowRight" ? (e.preventDefault(), Ie(1, document.activeElement)) : (e.key === "Enter" || e.key === " ") && document.activeElement === ie && (e.preventDefault(), xe(ie)));
  }
  function Sr() {
    Ae = document.hidden, Ae ? ($e(!0), Te(), ee && (cancelAnimationFrame(ee), ee = 0)) : (Nt = performance.now(), U());
  }
  function Pr() {
    $e(!0), Te();
  }
  function zr(e) {
    Ke(), Te(), X = e.matches, z.enableDamping = !X, X && (oe = V), U();
  }
  function lo(e) {
    Ht.hidden = !0, y.classList.remove("webgl-ready"), Fr.textContent = e, He.onError?.(e);
  }
  function Ir(e) {
    e.preventDefault(), Ke(), Te(), Ae = !0, ee && cancelAnimationFrame(ee), ee = 0, lo("The 3D view paused after losing its graphics context. The complete static catalog remains available; reload to restore inspection.");
  }
  function _n() {
    jt = !0, Ae = !0, Ke(), Te(), ee && cancelAnimationFrame(ee), ee = 0, m.removeEventListener("pointermove", mr), m.removeEventListener("pointerleave", br), m.removeEventListener("click", yr), m.removeEventListener("pointerdown", dr, !0), m.removeEventListener("pointermove", fr, !0), m.removeEventListener("pointerup", ke, !0), m.removeEventListener("pointercancel", ke, !0), m.removeEventListener("lostpointercapture", ke, !0), m.removeEventListener("pointerdown", hr, !0), m.removeEventListener("pointermove", gr, !0), m.removeEventListener("pointerup", Me, !0), m.removeEventListener("pointercancel", Me, !0), m.removeEventListener("lostpointercapture", Me, !0), window.removeEventListener("pointerup", bt), window.removeEventListener("pointercancel", bt), y.removeEventListener("wheel", vr), m.removeEventListener("webglcontextlost", Ir), window.removeEventListener("resize", yt), y.removeEventListener("keydown", Tr), window.removeEventListener("blur", Pr), document.removeEventListener("visibilitychange", Sr), Zt.removeEventListener("change", zr),
    Io?.removeEventListener("click", onPrevClick),
    Do?.removeEventListener("click", onNextClick),
    ie?.removeEventListener("click", onInspectClick),
    Ut?.removeEventListener("click", onCloseDetailClick),
    it?.removeEventListener("click", onToggleBookClick),
    st?.removeEventListener("click", onPrevPageClick),
    lt?.removeEventListener("click", onNextPageClick),
    Ko?.removeEventListener("click", onResetViewClick),
    z?.removeEventListener("change", U),
    _markerListeners.forEach(({ el, handler }) => el.removeEventListener("click", handler)),
    _markerListeners.length = 0,
    z?.dispose(), R?.traverse((e) => {
      e.geometry?.dispose(), (Array.isArray(e.material) ? e.material : [e.material]).filter(Boolean).forEach((t) => {
        Object.values(t).forEach((r) => {
          r?.isTexture && r.dispose();
        }), t.dispose();
      });
    }), Wt?.dispose(), D?.dispose();
  }
  let onPrevClick, onNextClick, onInspectClick, onCloseDetailClick, onToggleBookClick, onPrevPageClick, onNextPageClick, onResetViewClick;
  async function ea() {
    const e = at.decode().then(
      () => !0,
      () => !1
    );
    try {
      qt = !1;
    } catch {
      qt = !1;
    }
    if (jt) return;
    try {
      D = new l.WebGLRenderer({
        canvas: m,
        antialias: !0,
        alpha: !0,
        powerPreference: "high-performance"
      });
    } catch {
      lo("WebGL is unavailable in this browser. The complete static catalog remains available.");
      return;
    }
    D.outputColorSpace = l.SRGBColorSpace, D.toneMapping = l.ACESFilmicToneMapping, D.toneMappingExposure = 0.9, D.shadowMap.enabled = !0, D.shadowMap.type = l.PCFSoftShadowMap, D.setClearColor(0, 0), R = new l.Scene(), R.fog = new l.FogExp2(15327179, 0.027);
    const o = new l.PMREMGenerator(D);
    Wt = o.fromScene(new aa(), 0.04), R.environment = Wt.texture, R.environmentIntensity = 0.72, o.dispose(), L = new l.PerspectiveCamera(32, 1, 0.1, 60), W = new l.Group(), W.name = "continuous-shelf-stage", R.add(W), or(), L.position.copy(Le), L.lookAt(le), z = new na(L, m), z.enabled = !1, z.enableDamping = !X, z.dampingFactor = 0.075, z.enablePan = !0, z.screenSpacePanning = !0, z.minDistance = 2.8, z.maxDistance = 7.2, z.minPolarAngle = Math.PI * 0.24, z.maxPolarAngle = Math.PI * 0.76, z.target.copy(le), z.addEventListener("change", U), ia.init(), Rn(), Hn(), Xn(), pt = S.map((t, r) => {
      const a = En(t, r);
      return W.add(a.root), a;
    });
    const _initialVol = typeof He.initialIndex === "number" ? We(He.initialIndex, S.length) : 0;
    V = _initialVol;
    oe = _initialVol;
    mt(_initialVol, !0);
    yt();
    m.addEventListener("pointermove", mr), m.addEventListener("pointerleave", br), m.addEventListener("click", yr), m.addEventListener("pointerdown", dr, { capture: !0 }), m.addEventListener("pointermove", fr, { capture: !0 }), m.addEventListener("pointerup", ke, { capture: !0 }), m.addEventListener("pointercancel", ke, { capture: !0 }), m.addEventListener("lostpointercapture", ke, { capture: !0 }), m.addEventListener("pointerdown", hr, { capture: !0 }), m.addEventListener("pointermove", gr, { capture: !0 }), m.addEventListener("pointerup", Me, { capture: !0 }), m.addEventListener("pointercancel", Me, { capture: !0 }), m.addEventListener("lostpointercapture", Me, { capture: !0 }), window.addEventListener("pointerup", bt), window.addEventListener("pointercancel", bt), y.addEventListener("wheel", vr, { passive: !1 }), m.addEventListener("webglcontextlost", Ir), window.addEventListener("resize", yt), y.addEventListener("keydown", Tr), window.addEventListener("blur", Pr), document.addEventListener("visibilitychange", Sr), Zt.addEventListener("change", zr), onPrevClick = () => Ie(-1, Io), onNextClick = () => Ie(1, Do), onInspectClick = () => xe(ie), onCloseDetailClick = so, onToggleBookClick = () => ve(!K), onPrevPageClick = () => ze(-1), onNextPageClick = () => ze(1), onResetViewClick = Lr, Io.addEventListener("click", onPrevClick), Do.addEventListener("click", onNextClick), ie.addEventListener("click", onInspectClick), Ut.addEventListener("click", onCloseDetailClick), it.addEventListener("click", onToggleBookClick), st.addEventListener("click", onPrevPageClick), lt.addEventListener("click", onNextPageClick), Ko.addEventListener("click", onResetViewClick), D.render(R, L), Ht.hidden = !0, y.classList.add("webgl-ready"), U(), checkAndNotifySettled(), He.onReady?.(), e.then((t) => {
      !t || Ae || !D || (Rt = !0, qn());
    });
  }
  function getBookScreenPosition(index) {
    if (!D || !L || !m || !pt) return null;
    const targetIdx = We(index, S.length);
    const target = pt[targetIdx];
    if (!target) return null;
    target.root.updateWorldMatrix(!0, !0);
    const rect = m.getBoundingClientRect();
    const vec = new l.Vector3();
    target.root.getWorldPosition(vec);
    vec.project(L);
    const x = rect.left + (vec.x * 0.5 + 0.5) * rect.width;
    const y = rect.top + (-vec.y * 0.5 + 0.5) * rect.height;
    return {
      x,
      y,
      visible: vec.z < 1 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    };
  }
  return {
    ready: ea().catch((e) => {
      throw lo("The interactive Bookshelf collection could not be prepared."), e;
    }),
    resize: () => {
      D && !jt && yt();
    },
    open: () => {
      b === "hero" && D && xe(m);
    },
    openSelected: () => {
      b === "hero" && D && xe(m);
    },
    close: () => {
      (b === "detail" || b === "opening") && D && so();
    },
    previousVolume: () => {
      b === "hero" && D && Ie(-1, m);
    },
    nextVolume: () => {
      b === "hero" && D && Ie(1, m);
    },
    toggle: () => {
      D && (b === "hero" ? xe(m) : b === "detail" && ve(!K));
    },
    previousPage: () => {
      D && (b === "hero" ? xe(m) : b === "detail" && !K ? ve(!0) : b === "detail" && ze(-1));
    },
    nextPage: () => {
      D && (b === "hero" ? xe(m) : b === "detail" && !K ? ve(!0) : b === "detail" && ze(1));
    },
    dispose: _n,
    selectVolume: (index, immediate = false) => {
      if (!D || jt) return { accepted: false, queued: false };
      const targetIdx = We(index, S.length);
      // Latest user intent wins: cancel any older pending navigation
      pendingNavigation = null;

      if (b !== "hero") {
        pendingNavigation = { type: "select", index: targetIdx };
        if (b === "opening" || b === "detail") {
          so();
        }
        return { accepted: false, queued: true };
      }
      if (immediate) {
        V = targetIdx;
        oe = targetIdx;
        mt(targetIdx, !0);
        U();
        checkAndNotifySettled();
        return { accepted: true, queued: false };
      }
      ar(targetIdx);
      return { accepted: true, queued: false };
    },
    requestNavigation: (intent) => {
      if (!D || jt) return { accepted: false, queued: false };
      const type = intent.type || "select";
      const targetIdx = intent.index !== undefined ? We(intent.index, S.length) : O;
      // Latest user intent wins: replace any older pending navigation
      pendingNavigation = null;

      if (b !== "hero") {
        pendingNavigation = { type, index: targetIdx };
        if (b === "opening" || b === "detail") {
          so();
        }
        return { accepted: false, queued: true };
      }
      if (type === "open-book") {
        if (targetIdx !== O) {
          pendingNavigation = { type, index: targetIdx };
          ar(targetIdx);
          return { accepted: false, queued: true };
        }
        if (!isShelfSettled()) {
          pendingNavigation = { type, index: targetIdx };
          return { accepted: false, queued: true };
        }
        He.onOpenBook?.(targetIdx, S[targetIdx]);
        return { accepted: true, queued: false };
      }
      if (type === "open-cover") {
        if (!isShelfSettled()) {
          pendingNavigation = { type, index: targetIdx };
          return { accepted: false, queued: true };
        }
        He.onOpenCover?.();
        return { accepted: true, queued: false };
      }
      if (type === "close-to-library") {
        if (!isShelfSettled()) {
          pendingNavigation = { type, index: targetIdx };
          return { accepted: false, queued: true };
        }
        return { accepted: true, queued: false };
      }
      ar(targetIdx);
      return { accepted: true, queued: false };
    },
    getMode: () => b,
    isSettled: () => isShelfSettled(),
    isShelfSettled: () => isShelfSettled(),
    getSelectedVolume: () => O,
    getSnapshot: () => ({
      mode: b,
      selectedIndex: O,
      settled: isShelfSettled(),
    }),
    getBookScreenPosition
  };
}
export {
  fa as createBookshelfRenderer
};
