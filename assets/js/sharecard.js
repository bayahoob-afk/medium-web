// การ์ดคำทำนายแชร์ได้ + วอลเปเปอร์เสริมดวง — วาดด้วย Canvas ในเครื่องผู้ใช้ทั้งหมด
// ไม่ส่งข้อมูลใดออกนอกเครื่อง: ภาพถูกสร้างและดาวน์โหลด/แชร์จากเบราว์เซอร์ตรง ๆ
window.MEDIUM_CARD = (function () {
  const FONT = "'Noto Sans Thai','Sarabun',system-ui,sans-serif";
  function siteMark() {
    return location.host ? location.host + location.pathname.replace(/[^/]*$/, "") : "Medium";
  }

  // สีมงคลตามวันเกิด (ตำราโหราไทยเดียวกับดวงรายวัน)
  const DAY_META = [
    { d: "อาทิตย์", lucky: "แดง, โอลด์โรส" },
    { d: "จันทร์", lucky: "เหลือง, ขาวนวล" },
    { d: "อังคาร", lucky: "ชมพู" },
    { d: "พุธ", lucky: "เขียว" },
    { d: "พฤหัสบดี", lucky: "ส้ม, แสด" },
    { d: "ศุกร์", lucky: "ฟ้า" },
    { d: "เสาร์", lucky: "ดำ, ม่วงเข้ม" }
  ];

  const GOALS = {
    money: { label: "เสริมการเงิน มั่งคั่ง", emoji: "💰", bless: "ทรัพย์ไหลมา งานปัง เงินคล่องตัว", g1: "#3a2a00", g2: "#0f0a00", accent: "#f5c542", p1: "#fdf4de", p2: "#f4dfae", pa: "#a2761c" },
    love: { label: "เสริมความรัก เมตตามหานิยม", emoji: "💗", bless: "เสน่ห์เปล่งประกาย คนรักดูแล คนรอบข้างเมตตา", g1: "#3a0022", g2: "#14000c", accent: "#ff7eb6", p1: "#fdecf3", p2: "#f8d2e2", pa: "#c04a7e" },
    luck: { label: "เสริมโชคลาภ แคล้วคลาด", emoji: "🍀", bless: "โชคเข้าข้าง เดินทางแคล้วคลาดปลอดภัย", g1: "#00301f", g2: "#00140d", accent: "#5fe0a5", p1: "#eaf8ee", p2: "#cfeeda", pa: "#2e8b5f" },
    work: { label: "เสริมการงาน บารมี", emoji: "💼", bless: "งานราบรื่น ผู้ใหญ่เอ็นดู บารมีโดดเด่น", g1: "#131f45", g2: "#080c1f", accent: "#8ab6ff", p1: "#ecf2fd", p2: "#d4e2f7", pa: "#3c62a8" }
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ดาวพื้นหลังแบบ deterministic (LCG) ให้ภาพเดิมทุกครั้งจาก seed เดียวกัน
  function stars(ctx, w, h, n, seed) {
    let s = seed >>> 0 || 7;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, y = rnd() * h, r = rnd() * 1.8 + 0.4;
      ctx.globalAlpha = 0.25 + rnd() * 0.55;
      ctx.fillStyle = rnd() > 0.85 ? "#f5c542" : "#ffffff";
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ตัดบรรทัดข้อความไทย: แบ่งตามช่องว่างก่อน คำที่ยาวเกินค่อยหั่นทีละอักษร
  function wrap(ctx, text, maxW) {
    const out = [];
    for (const raw of String(text).split("\n")) {
      if (!raw.trim()) { out.push(""); continue; }
      let line = "";
      for (const word of raw.split(" ")) {
        const tryLine = line ? line + " " + word : word;
        if (ctx.measureText(tryLine).width <= maxW) { line = tryLine; continue; }
        if (line) { out.push(line); line = ""; }
        if (ctx.measureText(word).width <= maxW) { line = word; continue; }
        let chunk = "";
        for (const ch of word) {
          if (ctx.measureText(chunk + ch).width > maxW) { out.push(chunk); chunk = ch; }
          else chunk += ch;
        }
        line = chunk;
      }
      if (line) out.push(line);
    }
    return out;
  }

  function thaiDate(d) {
    return d.toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  // ---------- การ์ดคำทำนาย 1080×1350 (แนวตั้ง 4:5 พอดีฟีด IG/FB) ----------
  function drawReadingCard(opts) {
    const W = 1080, H = 1350;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#241540"); bg.addColorStop(1, "#0c081e");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    stars(ctx, W, H, 90, 20260916);

    // กรอบทองสองชั้น
    ctx.strokeStyle = "#f5c542"; ctx.lineWidth = 6;
    roundRect(ctx, 36, 36, W - 72, H - 72, 34); ctx.stroke();
    ctx.strokeStyle = "rgba(245,197,66,.4)"; ctx.lineWidth = 2;
    roundRect(ctx, 56, 56, W - 112, H - 112, 24); ctx.stroke();

    ctx.textAlign = "center"; ctx.fillStyle = "#fff";
    ctx.font = "90px " + FONT;
    ctx.fillText("🔮", W / 2, 190);
    ctx.fillStyle = "#f5c542";
    ctx.font = "700 44px " + FONT;
    ctx.fillText("คำทำนายจาก" + (opts.source || "หมอดูทิพย์"), W / 2, 268);
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = "30px " + FONT;
    ctx.fillText(thaiDate(new Date()), W / 2, 318);

    // เนื้อคำทำนาย: ลดขนาดฟอนต์อัตโนมัติจนพอดีพื้นที่ ถ้ายังเกินให้ตัดท้ายด้วย …
    const maxW = W - 200, top = 400, bottom = H - 240;
    let lines = [], lineH = 0;
    const text = String(opts.text || "").slice(0, 600);
    for (const size of [46, 40, 34, 30]) {
      ctx.font = "500 " + size + "px " + FONT;
      lineH = size * 1.55;
      lines = wrap(ctx, text, maxW);
      if (top + lines.length * lineH <= bottom) break;
    }
    const maxLines = Math.floor((bottom - top) / lineH);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/.{2}$/, "") + "…";
    }
    ctx.fillStyle = "#fff";
    lines.forEach((l, i) => ctx.fillText(l, W / 2, top + (i + 0.8) * lineH));

    // ท้ายการ์ด: คำชี้แจง + ที่มา
    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.font = "26px " + FONT;
    ctx.fillText("เพื่อความบันเทิงและกำลังใจ — ระบบตอบอัตโนมัติ ไม่ใช่บุคคลจริง", W / 2, H - 150);
    ctx.fillStyle = "#f5c542";
    ctx.font = "600 32px " + FONT;
    ctx.fillText("🔮 ดูดวงฟรีที่ " + siteMark(), W / 2, H - 96);
    return c;
  }

  // ---------- ลายมงคล 6 สไตล์ ----------
  const WALL_STYLES = {
    tarot: "🃏 ไพ่มงคล (ฮิต)",
    deity: "🙏 เทพมงคล",
    unalome: "🌀 อุณาโลมมินิมอล",
    yantra: "🔯 เรขาคณิตมงคล",
    moon: "🌙 จันทร์เสี้ยวกลุ่มดาว",
    lotus: "🪷 บัวทองผลิบาน"
  };

  // เทพมงคลประจำด้าน — นำเสนอเชิงสัญลักษณ์อย่างเคารพ (ชื่อ + สัญลักษณ์ + คำขอพร + ไพ่ประจำองค์)
  const GOAL_DEITY = {
    money: {
      name: "ท้าวเวสสุวรรณ", e: "🪔", wish: "ขอบารมีคุ้มครอง ทรัพย์สินมั่งคั่ง กันสิ่งไม่ดีทั้งปวง",
      cards: [{ n: "The Emperor", r: "IV", icon: "emperor" }, { n: "Wheel of Fortune", r: "X", icon: "wheel" }]
    },
    love: {
      name: "พระแม่ลักษมี", e: "🪷", wish: "ขอความรักงอกงาม เสน่ห์เมตตามหานิยม ครอบครัวอบอุ่น",
      cards: [{ n: "The Lovers", r: "VI", icon: "lovers" }, { n: "The Empress", r: "III", icon: "empress" }]
    },
    luck: {
      name: "พระพิฆเนศ", e: "🐘", wish: "ขอความสำเร็จสมปรารถนา อุปสรรคมลายสิ้น โชคลาภเข้ามา",
      cards: [{ n: "The Chariot", r: "VII", icon: "chariot" }, { n: "Wheel of Fortune", r: "X", icon: "wheel" }]
    },
    work: {
      name: "พญาครุฑ", e: "🦅", wish: "ขออำนาจบารมี หน้าที่การงานก้าวหน้า มั่นคงเป็นสง่า",
      cards: [{ n: "The Emperor", r: "IV", icon: "emperor" }, { n: "The Magician", r: "I", icon: "magician" }]
    }
  };

  // ไพ่เสริมดวงประจำแต่ละด้าน (วาดเองทั้งใบ ไม่ใช้ภาพสำรับลิขสิทธิ์)
  const GOAL_EN = { money: "MONEY", love: "LOVE", luck: "LUCKY", work: "POWER" };
  const GOAL_CARDS = {
    money: [{ n: "The Sun", r: "XIX", icon: "sun" }, { n: "Wheel of Fortune", r: "X", icon: "wheel" }, { n: "The Empress", r: "III", icon: "empress" }],
    love: [{ n: "The Lovers", r: "VI", icon: "lovers" }, { n: "The Star", r: "XVII", icon: "star" }, { n: "The Sun", r: "XIX", icon: "sun" }],
    luck: [{ n: "The Star", r: "XVII", icon: "star" }, { n: "The World", r: "XXI", icon: "world" }, { n: "Wheel of Fortune", r: "X", icon: "wheel" }],
    work: [{ n: "The Emperor", r: "IV", icon: "emperor" }, { n: "The Magician", r: "I", icon: "magician" }, { n: "The Chariot", r: "VII", icon: "chariot" }]
  };
  const GOAL_DECO = { money: "🪙", love: "💗", luck: "🍀", work: "👑" };

  // ตัวอักษรลายทองฟอยล์ + แสงเรือง — serif สำหรับหัวเรื่อง/ตัวเลขให้ดูพรีเมียม
  const SERIF = "Georgia,'Times New Roman',serif";
  function goldText(ctx, text, x, y, size, weight, serif, spacing) {
    ctx.font = (weight || 800) + " " + size + "px " + (serif ? SERIF : FONT);
    try { ctx.letterSpacing = (spacing || 0) + "px"; } catch (e) { /* เบราว์เซอร์เก่า */ }
    const g = ctx.createLinearGradient(0, y - size, 0, y);
    g.addColorStop(0, "#fff3cf"); g.addColorStop(0.5, "#f0c95e"); g.addColorStop(1, "#9c7418");
    ctx.fillStyle = g;
    ctx.shadowColor = "rgba(230,184,76,.5)"; ctx.shadowBlur = 45;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
    try { ctx.letterSpacing = "0px"; } catch (e) { /* noop */ }
  }

  // ---------- ไอคอนไพ่ลายเส้นทอง (วาดเวกเตอร์เอง ไม่ใช้อิโมจิ) ----------
  const CARD_GOLD = "#d9b258";
  const CARD_ICONS = {
    sun(ctx) {
      ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 52, Math.sin(a) * 52);
        ctx.lineTo(Math.cos(a) * (i % 2 ? 66 : 80), Math.sin(a) * (i % 2 ? 66 : 80)); ctx.stroke();
      }
    },
    wheel(ctx) {
      ctx.beginPath(); ctx.arc(0, 0, 64, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 47, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 10, Math.sin(a) * 10);
        ctx.lineTo(Math.cos(a) * 47, Math.sin(a) * 47); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();
    },
    empress(ctx) { // สัญลักษณ์วีนัส + มงกุฎสามยอด
      ctx.beginPath(); ctx.arc(0, -14, 32, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(0, 66); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-20, 44); ctx.lineTo(20, 44); ctx.stroke();
      [-26, 0, 26].forEach((x, i) => {
        ctx.beginPath(); ctx.arc(x, i === 1 ? -72 : -60, 5, 0, Math.PI * 2); ctx.fill();
      });
    },
    lovers(ctx) { // แหวนสองวงคล้องกัน + หัวใจ
      ctx.beginPath(); ctx.arc(-19, 14, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(19, 14, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -26);
      ctx.bezierCurveTo(-20, -46, -44, -22, 0, 4);
      ctx.bezierCurveTo(44, -22, 20, -46, 0, -26);
      ctx.stroke();
    },
    star(ctx) {
      function s4(s, rot, fill) {
        ctx.save(); ctx.rotate(rot); ctx.beginPath();
        ctx.moveTo(0, -s); ctx.lineTo(s * .22, -s * .22); ctx.lineTo(s, 0); ctx.lineTo(s * .22, s * .22);
        ctx.lineTo(0, s); ctx.lineTo(-s * .22, s * .22); ctx.lineTo(-s, 0); ctx.lineTo(-s * .22, -s * .22);
        ctx.closePath(); fill ? ctx.fill() : ctx.stroke(); ctx.restore();
      }
      s4(74, 0); s4(48, Math.PI / 4);
      [[-60, -52], [64, 44]].forEach(([x, y]) => {
        ctx.save(); ctx.translate(x, y); s4(13, 0, true); ctx.restore();
      });
    },
    world(ctx) { // ลูกโลกในช่อลอเรล
      ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 38, 15, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -38); ctx.lineTo(0, 38); ctx.stroke();
      [-1, 1].forEach(sg => {
        ctx.beginPath(); ctx.moveTo(sg * 58, 60);
        ctx.quadraticCurveTo(sg * 80, 0, sg * 52, -54); ctx.stroke();
        for (let i = 0; i < 5; i++) {
          const t = 48 - i * 24;
          ctx.beginPath(); ctx.moveTo(sg * (72 - i * 3), t);
          ctx.lineTo(sg * (52 - i * 4), t - 16); ctx.stroke();
        }
      });
    },
    emperor(ctx) { // มงกุฎ + ลูกโลกคทา
      ctx.beginPath();
      ctx.moveTo(-46, 0); ctx.lineTo(-46, -30); ctx.lineTo(-23, -8); ctx.lineTo(0, -44);
      ctx.lineTo(23, -8); ctx.lineTo(46, -30); ctx.lineTo(46, 0); ctx.closePath(); ctx.stroke();
      ctx.strokeRect(-46, 8, 92, 13);
      ctx.beginPath(); ctx.moveTo(0, 28); ctx.lineTo(0, 62); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 72, 9, 0, Math.PI * 2); ctx.stroke();
      [[-46, -38], [0, -52], [46, -38]].forEach(([x, y]) => {
        ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill();
      });
    },
    magician(ctx) { // เครื่องหมายอนันต์ + ไม้กายสิทธิ์
      [-24, 24].forEach(x => { ctx.beginPath(); ctx.arc(x, -22, 24, 0, Math.PI * 2); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(0, 70); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-15, 26); ctx.lineTo(15, 26); ctx.stroke();
    },
    chariot(ctx) { // รถศึก: หลังคา + ตัวรถ + ล้อซี่
      ctx.strokeRect(-44, -14, 88, 34);
      ctx.beginPath(); ctx.moveTo(-44, -14); ctx.lineTo(0, -50); ctx.lineTo(44, -14); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -62, 7, 0, Math.PI * 2); ctx.stroke();
      [-28, 28].forEach(x => {
        ctx.beginPath(); ctx.arc(x, 40, 17, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 4; i++) {
          const a = i * Math.PI / 4;
          ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 17, 40 - Math.sin(a) * 17);
          ctx.lineTo(x + Math.cos(a) * 17, 40 + Math.sin(a) * 17); ctx.stroke();
        }
      });
    }
  };

  // ไพ่ทาโรต์ใบเล็กสไตล์พรีเมียม: พื้นน้ำเงินราตรี กรอบทอง ไอคอนลายเส้นทอง ชื่อ serif
  function miniCard(ctx, cx, cy, rot, card, scale) {
    const w = 260, h = 420;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    if (scale) ctx.scale(scale, scale);
    // ถ้าโหลดสำรับ Medium Arcana ไว้ ใช้ภาพไพ่วาดเองเต็มใบ (สำรับเดียวกับหน้าหมอดูทิพย์)
    const own = window.MEDIUM_DECK && window.MEDIUM_DECK.byName[card.n];
    if (own) {
      ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 14;
      roundRect(ctx, -w / 2, -h / 2, w, h, 18);
      ctx.fillStyle = "#0e0b24"; ctx.fill();
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      window.MEDIUM_DECK.draw(ctx, own.key, -w / 2, -h / 2, w, h);
      ctx.restore();
      return;
    }
    ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 14;
    roundRect(ctx, -w / 2, -h / 2, w, h, 18);
    const face = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    face.addColorStop(0, "#241e52"); face.addColorStop(1, "#0e0b24");
    ctx.fillStyle = face; ctx.fill();
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.strokeStyle = CARD_GOLD; ctx.lineWidth = 4;
    roundRect(ctx, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 13); ctx.stroke();
    ctx.strokeStyle = "rgba(217,178,88,.5)"; ctx.lineWidth = 1.5;
    roundRect(ctx, -w / 2 + 17, -h / 2 + 17, w - 34, h - 34, 9); ctx.stroke();
    // ประกายดาวเล็กสี่มุมไพ่
    ctx.fillStyle = CARD_GOLD;
    [[-w / 2 + 34, -h / 2 + 38], [w / 2 - 34, -h / 2 + 38], [-w / 2 + 34, h / 2 - 34], [w / 2 - 34, h / 2 - 34]].forEach(([x, y]) => {
      ctx.save(); ctx.translate(x, y); ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(2, -2); ctx.lineTo(7, 0); ctx.lineTo(2, 2);
      ctx.lineTo(0, 7); ctx.lineTo(-2, 2); ctx.lineTo(-7, 0); ctx.lineTo(-2, -2);
      ctx.closePath(); ctx.fill(); ctx.restore();
    });
    ctx.textAlign = "center"; ctx.fillStyle = CARD_GOLD;
    ctx.font = "700 34px " + SERIF;
    ctx.fillText(card.r, 0, -h / 2 + 68);
    // ตราจันทร์-ดาวประจำสำรับ Medium (ลายเดียวกับหลังไพ่ในเว็บ)
    ctx.globalAlpha = 0.6; ctx.font = "20px " + FONT;
    ctx.fillText("✦ ☾ ✦", 0, -h / 2 + 100);
    ctx.globalAlpha = 1;
    // ไอคอนลายเส้นทองกลางไพ่
    ctx.save(); ctx.translate(0, 14);
    ctx.strokeStyle = CARD_GOLD; ctx.lineWidth = 5;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    (CARD_ICONS[card.icon] || CARD_ICONS.star)(ctx);
    ctx.restore();
    let nameSize = 23; // ชื่อยาวย่อฟอนต์จนพอดีกรอบ
    ctx.font = "600 " + nameSize + "px " + SERIF;
    while (ctx.measureText(card.n.toUpperCase()).width > w - 52 && nameSize > 12) {
      nameSize -= 1; ctx.font = "600 " + nameSize + "px " + SERIF;
    }
    ctx.fillText(card.n.toUpperCase(), 0, h / 2 - 40);
    ctx.restore();
  }

  const MOTIFS = {
    // เกลียวอุณาโลมอย่างเรียบ (ลายดั้งเดิม)
    unalome(ctx, W, accent, seed) {
      ctx.strokeStyle = accent; ctx.fillStyle = accent; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(W / 2, 300, 10, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 3.5; a += 0.05) {
        const r = 14 + a * 11;
        const x = W / 2 + Math.cos(a - Math.PI / 2) * r;
        const y = 390 + Math.sin(a - Math.PI / 2) * r * 0.8;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2, 490); ctx.lineTo(W / 2, 640); ctx.stroke();
    },
    // เรขาคณิตมงคล: วงซ้อน + สี่เหลี่ยมหมุน + รัศมี + เก้าจุด (ลายเชิงสัญลักษณ์ทั่วไป ไม่อ้างอิงยันต์จริง)
    yantra(ctx, W, accent, seed) {
      const cx = W / 2, cy = 420, rot = (seed % 90) * Math.PI / 720; // เอียงเล็กน้อยตามดวงแต่ละคน
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.strokeStyle = accent; ctx.fillStyle = accent;
      [70, 112, 154].forEach((r, i) => {
        ctx.lineWidth = i === 2 ? 5 : 2.5;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.lineWidth = 3;
      ctx.save(); ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-112 / Math.SQRT2 - 33, -112 / Math.SQRT2 - 33, 224 / Math.SQRT2 + 66, 224 / Math.SQRT2 + 66);
      ctx.restore();
      for (let i = 0; i < 12; i++) { // รัศมี 12 ทิศ
        const a = i * Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 162, Math.sin(a) * 162);
        ctx.lineTo(Math.cos(a) * (i % 3 === 0 ? 205 : 185), Math.sin(a) * (i % 3 === 0 ? 205 : 185));
        ctx.stroke();
      }
      for (let gy = -1; gy <= 1; gy++) for (let gx = -1; gx <= 1; gx++) { // เก้าจุดมงคลกลางวง
        ctx.beginPath(); ctx.arc(gx * 34, gy * 34, gx === 0 && gy === 0 ? 9 : 5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    },
    // จันทร์เสี้ยว + วงโคจร + กลุ่มดาวลากเส้นตามดวง
    moon(ctx, W, accent, seed, bg) {
      const cx = W / 2, cy = 400;
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(cx, cy, 125, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = bg; // เจาะเป็นเสี้ยวด้วยสีพื้นเดิม (ไม่ทะลุเป็นรูโปร่งใส)
      ctx.beginPath(); ctx.arc(cx + 52, cy - 28, 118, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
      [165, 195].forEach(r => { // วงโคจรรอบจันทร์
        ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.15); ctx.stroke();
      });
      // กลุ่มดาวประจำดวง: 6 จุดตำแหน่งจาก seed ลากเส้นต่อกัน
      let s = seed >>> 0 || 9;
      const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
      const pts = Array.from({ length: 6 }, (_, i) => ({
        x: 140 + rnd() * (W - 280), y: 180 + rnd() * 430
      }));
      ctx.lineWidth = 2; ctx.strokeStyle = accent + "88";
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.fillStyle = accent;
      pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); });
    },
    // ดอกบัวผลิบาน: กลีบ 3 ชั้น + รัศมีธรรม + จุดไข่มุก
    lotus(ctx, W, accent, seed) {
      const cx = W / 2, cy = 560;
      function petal(w, h, rot) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(w / 2, -h * 0.72, 0, -h);
        ctx.quadraticCurveTo(-w / 2, -h * 0.72, 0, 0);
        ctx.stroke(); ctx.restore();
      }
      ctx.strokeStyle = accent; ctx.fillStyle = accent;
      ctx.lineWidth = 3.5;
      [-0.9, -0.45, 0, 0.45, 0.9].forEach(r => petal(120, 300, r)); // กลีบนอก
      ctx.lineWidth = 5;
      [-0.4, 0, 0.4].forEach(r => petal(105, 230, r)); // กลีบใน
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 7; i++) { // รัศมีเหนือดอก
        const a = Math.PI + (i / 6) * Math.PI;
        const x1 = cx + Math.cos(a) * 210, y1 = cy - 150 + Math.sin(a) * 190;
        const x2 = cx + Math.cos(a) * 260, y2 = cy - 150 + Math.sin(a) * 240;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      for (let i = 0; i < 9; i++) { // จุดไข่มุกโค้งใต้ดอก
        const a = Math.PI * (0.15 + i * 0.0875);
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 190, cy + 30 + Math.sin(a) * 60, i === 4 ? 7 : 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // เส้นคั่นตกแต่ง: — ◆ — สไตล์ editorial
  function divider(ctx, W, y, color) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 290, y); ctx.lineTo(W / 2 - 45, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2 + 45, y); ctx.lineTo(W / 2 + 290, y); ctx.stroke();
    ctx.save(); ctx.translate(W / 2, y); ctx.rotate(Math.PI / 4);
    ctx.fillRect(-8, -8, 16, 16); ctx.restore();
    ctx.beginPath(); ctx.arc(W / 2 - 310, y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W / 2 + 310, y, 4, 0, Math.PI * 2); ctx.fill();
  }

  // ป้ายชิปโค้งแบบ UI บนเว็บ Medium — สีตามด้านที่เสริม
  function goalChip(ctx, W, y, text, color, textColor) {
    ctx.font = "600 40px " + FONT;
    const tw = ctx.measureText(text).width, pw = tw + 90, ph = 76;
    ctx.fillStyle = color + "1f";
    roundRect(ctx, W / 2 - pw / 2, y - 52, pw, ph, 38); ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 2.5;
    roundRect(ctx, W / 2 - pw / 2, y - 52, pw, ph, 38); ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.fillText(text, W / 2, y);
  }

  // ---------- วอลเปเปอร์เสริมดวง 1080×2340 (จอมือถือ) ----------
  function drawWallpaper(opts) {
    const W = 1080, H = 2340;
    const goalKey = GOALS[opts.goal] ? opts.goal : "money";
    const goal = GOALS[goalKey];
    const styleKey = WALL_STYLES[opts.style] ? opts.style : "tarot";
    const pastel = opts.tone === "pastel";
    const ac = pastel ? goal.pa : goal.accent;          // สีเน้นตามโทน
    const tMain = pastel ? "#413352" : "#ffffff";        // สีข้อความหลัก
    const tSub = pastel ? "rgba(65,51,82,.72)" : "rgba(255,255,255,.85)";
    const dob = opts.dob || null;
    const dayIdx = dob ? new Date(dob).getDay() : new Date().getDay();
    const day = DAY_META[dayIdx] || DAY_META[0];
    const seedStr = (dob || "guest") + "|" + goalKey + "|" + styleKey + "|" + (pastel ? "p" : "d");
    let seed = 5381;
    for (let i = 0; i < seedStr.length; i++) seed = ((seed << 5) + seed + seedStr.charCodeAt(i)) >>> 0;
    const luckyNum = (seed % 9) + 1;          // เลขหลักเดียว (ลายคลาสสิก)
    const luckyNum3 = 100 + (seed % 900);     // เลข 3 หลักสไตล์ยอดนิยม (ลายไพ่/เทพ)

    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    // ธีม "Mystic Medium": พื้นหลังม่วงราตรีเดียวกันทุกภาพ = คอลเลกชันแบรนด์เดียวกัน
    // สีประจำด้าน (การเงิน/รัก/โชค/งาน) ใช้เป็นแสงเรืองกลางภาพ + ป้ายชิปเท่านั้น
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    if (pastel) { bg.addColorStop(0, "#f8f3ff"); bg.addColorStop(0.55, "#f1e7de"); bg.addColorStop(1, "#eadcc4"); }
    else { bg.addColorStop(0, "#2a1747"); bg.addColorStop(0.55, "#150b2b"); bg.addColorStop(1, "#0b0618"); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // แสงเรืองสีประจำด้าน กลางส่วนบนของภาพ
    const hueGlow = ctx.createRadialGradient(W / 2, 720, 80, W / 2, 720, 900);
    hueGlow.addColorStop(0, goal.accent + (pastel ? "20" : "2c"));
    hueGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = hueGlow; ctx.fillRect(0, 0, W, H);
    // ลายเซ็นแบรนด์ Medium: แสงม่วง-ชมพูแบบเดียวกับพื้นหลังเว็บ (Mystic Modern)
    const sig1 = ctx.createRadialGradient(W * 0.82, H * 0.08, 0, W * 0.82, H * 0.08, 700);
    sig1.addColorStop(0, pastel ? "rgba(139,92,246,.12)" : "rgba(139,92,246,.22)");
    sig1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sig1; ctx.fillRect(0, 0, W, H);
    const sig2 = ctx.createRadialGradient(W * 0.08, H * 0.35, 0, W * 0.08, H * 0.35, 550);
    sig2.addColorStop(0, pastel ? "rgba(244,114,182,.08)" : "rgba(244,114,182,.10)");
    sig2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sig2; ctx.fillRect(0, 0, W, H);
    if (!pastel) stars(ctx, W, H, 160, seed);

    // แสงเรืองกลางภาพ
    const glow = ctx.createRadialGradient(W / 2, 980, 60, W / 2, 980, 620);
    glow.addColorStop(0, ac + (pastel ? "22" : "33")); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    // โบเก้ทองนุ่ม ๆ (ตำแหน่งจาก seed) + ขอบมืดวินเยตต์ ให้ภาพมีมิติ
    let sb = (seed ^ 0x9e37) >>> 0 || 5;
    const rndB = () => (sb = (sb * 1664525 + 1013904223) >>> 0) / 4294967296;
    for (let i = 0; i < 7; i++) {
      const bx = rndB() * W, by = rndB() * H * 0.72, br = 50 + rndB() * 95;
      const bok = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bok.addColorStop(0, ac + (pastel ? "26" : "30")); bok.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bok;
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
    }
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.72);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, pastel ? "rgba(122,90,30,.14)" : "rgba(0,0,0,.5)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

    // กรอบทองรอบภาพ + มุมหนาแบบกรอบรูปพรีเมียม
    ctx.strokeStyle = "rgba(217,178,88,.7)"; ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, W - 60, H - 60);
    ctx.strokeStyle = CARD_GOLD; ctx.lineWidth = 7; ctx.lineCap = "square";
    [[30, 30, 1, 1], [W - 30, 30, -1, 1], [30, H - 30, 1, -1], [W - 30, H - 30, -1, -1]].forEach(([x, y, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(x + dx * 85, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * 85); ctx.stroke();
    });
    ctx.lineCap = "butt";

    ctx.textAlign = "center";

    if (styleKey === "tarot" || styleKey === "deity") {
      // โปรยประกาย + สัญลักษณ์ประจำด้าน (ตำแหน่งจาก seed)
      let s2 = seed >>> 0 || 3;
      const rnd2 = () => (s2 = (s2 * 1664525 + 1013904223) >>> 0) / 4294967296;
      for (let i = 0; i < 14; i++) {
        ctx.globalAlpha = 0.22 + rnd2() * 0.4;
        ctx.font = Math.round(30 + rnd2() * 44) + "px " + FONT;
        ctx.fillText(rnd2() > 0.45 ? "✨" : GOAL_DECO[goalKey], 60 + rnd2() * (W - 120), 460 + rnd2() * 980);
      }
      ctx.globalAlpha = 1;
    }

    if (styleKey === "tarot") {
      // สไตล์ยอดนิยม: คำอังกฤษ serif ทองฟอยล์ + ไพ่ 3 ใบซ้อน + เลข 3 หลัก
      goldText(ctx, GOAL_EN[goalKey], W / 2, 340, 168, 700, true, 16);
      goalChip(ctx, W, 448, goal.label, ac, tMain);
      const cards = GOAL_CARDS[goalKey];
      miniCard(ctx, W / 2 - 265, 870, -0.16, cards[0]);
      miniCard(ctx, W / 2 + 265, 870, 0.16, cards[2]);
      miniCard(ctx, W / 2, 825, 0, cards[1]);
      divider(ctx, W, 1180, ac + "aa");
      goldText(ctx, String(luckyNum3), W / 2, 1455, 235, 700, true, 10);
      ctx.fillStyle = ac; ctx.font = "600 38px " + FONT;
      ctx.fillText("เลขนำโชคประจำดวงคุณ", W / 2, 1535);
      ctx.fillStyle = tMain; ctx.font = "500 38px " + FONT;
      wrap(ctx, goal.bless, W - 240).forEach((l, i) => ctx.fillText(l, W / 2, 1615 + i * 56));
      divider(ctx, W, 1720, ac + "66");
    } else if (styleKey === "deity") {
      // คอลเลกชันเทพมงคล: รัศมี + สัญลักษณ์ + ไพ่ประจำองค์ขนาบ + ชื่อเทพอักษรทอง
      const d = GOAL_DEITY[goalKey], cy = 540;
      // ไพ่ประจำองค์ 2 ใบขนาบซุ้ม (วาดก่อนให้ซุ้มอยู่หน้า)
      miniCard(ctx, W / 2 - 350, cy + 210, -0.22, d.cards[0], 0.62);
      miniCard(ctx, W / 2 + 350, cy + 210, 0.22, d.cards[1], 0.62);
      ctx.strokeStyle = ac; ctx.lineWidth = 3;
      [225, 258].forEach(r => { ctx.beginPath(); ctx.arc(W / 2, cy, r, 0, Math.PI * 2); ctx.stroke(); });
      for (let i = 0; i < 16; i++) { // รัศมีรอบซุ้ม
        const a = i * Math.PI / 8;
        ctx.beginPath();
        ctx.moveTo(W / 2 + Math.cos(a) * 270, cy + Math.sin(a) * 270);
        ctx.lineTo(W / 2 + Math.cos(a) * (i % 2 ? 300 : 330), cy + Math.sin(a) * (i % 2 ? 300 : 330));
        ctx.stroke();
      }
      // พื้นวงในทึบเล็กน้อยให้องค์เด่นเหนือไพ่
      const inner = ctx.createRadialGradient(W / 2, cy, 40, W / 2, cy, 225);
      inner.addColorStop(0, pastel ? "rgba(255,252,244,.9)" : "rgba(12,7,26,.88)");
      inner.addColorStop(1, pastel ? "rgba(255,252,244,.25)" : "rgba(12,7,26,.15)");
      ctx.fillStyle = inner;
      ctx.beginPath(); ctx.arc(W / 2, cy, 225, 0, Math.PI * 2); ctx.fill();
      ctx.font = "230px " + FONT;
      ctx.fillText(d.e, W / 2, cy + 80);
      // ฐานกลีบบัวไล่เฉดรองรับซุ้ม
      for (let i = -3; i <= 3; i++) {
        ctx.save(); ctx.translate(W / 2 + i * 58, cy + 322); ctx.rotate(i * 0.17);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(27, -42, 0, -80);
        ctx.quadraticCurveTo(-27, -42, 0, 0); ctx.closePath();
        const pg = ctx.createLinearGradient(0, -80, 0, 0);
        pg.addColorStop(0, ac + "d0"); pg.addColorStop(1, ac + "28");
        ctx.fillStyle = pg; ctx.fill(); ctx.restore();
      }
      goldText(ctx, d.name, W / 2, 1050, 108);
      ctx.fillStyle = tMain; ctx.font = "500 42px " + FONT;
      wrap(ctx, d.wish, W - 240).forEach((l, i) => ctx.fillText(l, W / 2, 1140 + i * 62));
      ctx.fillStyle = tSub; ctx.font = "32px " + FONT;
      ctx.fillText("ไพ่ประจำองค์: " + d.cards.map(c => c.n).join(" · "), W / 2, 1290);
      divider(ctx, W, 1360, ac + "aa");
      goldText(ctx, String(luckyNum3), W / 2, 1560, 210, 700, true, 10);
      ctx.fillStyle = ac; ctx.font = "600 38px " + FONT;
      ctx.fillText("เลขนำโชคประจำดวงคุณ", W / 2, 1640);
      goalChip(ctx, W, 1712, goal.label, ac, tMain);
    } else {
      // ลายคลาสสิก: ลวดลายตอนบน + เลขหลักเดียวในวงแหวน
      MOTIFS[styleKey](ctx, W, ac, seed, pastel ? "#f1e7de" : "#150b2b");
      ctx.fillStyle = tMain;
      ctx.font = "150px " + FONT;
      ctx.fillText(goal.emoji, W / 2, 860);
      goalChip(ctx, W, 985, goal.label, ac, tMain);
      ctx.fillStyle = tMain;
      ctx.font = "500 40px " + FONT;
      wrap(ctx, goal.bless, W - 220).forEach((l, i) => ctx.fillText(l, W / 2, 1090 + i * 60));
      divider(ctx, W, 1225, ac + "88");

      ctx.strokeStyle = ac; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(W / 2, 1440, 150, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = ac + "55"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(W / 2, 1440, 168, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = tMain;
      ctx.font = "700 170px " + FONT;
      ctx.fillText(String(luckyNum), W / 2, 1500);
      ctx.fillStyle = ac;
      ctx.font = "600 38px " + FONT;
      ctx.fillText("เลขนำโชคประจำดวงคุณ", W / 2, 1680);
    }

    ctx.fillStyle = tSub;
    ctx.font = "36px " + FONT;
    ctx.fillText((dob ? "เกิดวัน" : "วัน") + day.d + " · สีมงคล: " + day.lucky, W / 2, 1780);

    // ---------- ลายเซ็นแบรนด์ MEDIUM (โลโก้เดียวกับ navbar เว็บ) ----------
    const by = 2170;
    ctx.font = "700 60px " + FONT;
    const wMED = ctx.measureText("MED").width, wIUM = ctx.measureText("IUM").width;
    const orbR = 26, gapO = 18, totalW = orbR * 2 + gapO + wMED + wIUM;
    let bx = W / 2 - totalW / 2 + orbR;
    // ลูกแก้วพยากรณ์วาดเอง: ทรงกลมม่วงไล่เฉด + ไฮไลต์ + ฐานทอง
    const orb = ctx.createRadialGradient(bx - 8, by - 30, 4, bx, by - 20, orbR + 4);
    orb.addColorStop(0, "#e6dcff"); orb.addColorStop(0.35, "#8b5cf6"); orb.addColorStop(1, "#3b2470");
    ctx.fillStyle = orb;
    ctx.beginPath(); ctx.arc(bx, by - 20, orbR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.beginPath(); ctx.ellipse(bx - 9, by - 31, 6, 3.6, -0.6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CARD_GOLD; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(bx, by + 13, 15, Math.PI * 1.15, Math.PI * 1.85, true); ctx.stroke();
    // MED (สีข้อความหลัก) + IUM (ทองฟอยล์) ต่อกันแบบโลโก้เว็บ
    ctx.textAlign = "left"; ctx.font = "700 60px " + FONT;
    ctx.fillStyle = tMain;
    ctx.fillText("MED", bx + orbR + gapO, by);
    const gIUM = ctx.createLinearGradient(0, by - 52, 0, by);
    gIUM.addColorStop(0, "#fff3cf"); gIUM.addColorStop(0.5, "#f0c95e"); gIUM.addColorStop(1, "#9c7418");
    ctx.fillStyle = gIUM;
    ctx.fillText("IUM", bx + orbR + gapO + wMED, by);
    ctx.textAlign = "center";
    ctx.fillStyle = pastel ? "rgba(65,51,82,.6)" : "rgba(255,255,255,.55)";
    ctx.font = "28px " + FONT;
    ctx.fillText("วอลเปเปอร์เสริมดวง — เพื่อความบันเทิงและกำลังใจ · สร้างฟรีที่ " + siteMark(), W / 2, by + 62);
    return c;
  }

  // แชร์เป็นไฟล์ภาพผ่าน Web Share ถ้าเครื่องรองรับ ไม่งั้นดาวน์โหลดให้เลย
  function toBlob(canvas) {
    return new Promise((resolve, reject) =>
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png"));
  }
  function download(canvas, filename) {
    const a = document.createElement("a");
    a.download = filename;
    a.href = canvas.toDataURL("image/png");
    document.body.appendChild(a); a.click(); a.remove();
  }
  async function share(canvas, filename, text) {
    try {
      const blob = await toBlob(canvas);
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: text || "" });
        return "shared";
      }
    } catch (e) {
      if (e && e.name === "AbortError") return "cancelled"; // ผู้ใช้กดยกเลิกเอง
    }
    download(canvas, filename);
    return "downloaded";
  }

  return { GOALS, WALL_STYLES, drawReadingCard, drawWallpaper, share, download };
})();
