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
    money: { label: "เสริมการเงิน มั่งคั่ง", emoji: "💰", bless: "ทรัพย์ไหลมา งานปัง เงินคล่องตัว", g1: "#3a2a00", g2: "#0f0a00", accent: "#f5c542" },
    love: { label: "เสริมความรัก เมตตามหานิยม", emoji: "💗", bless: "เสน่ห์เปล่งประกาย คนรักดูแล คนรอบข้างเมตตา", g1: "#3a0022", g2: "#14000c", accent: "#ff7eb6" },
    luck: { label: "เสริมโชคลาภ แคล้วคลาด", emoji: "🍀", bless: "โชคเข้าข้าง เดินทางแคล้วคลาดปลอดภัย", g1: "#00301f", g2: "#00140d", accent: "#5fe0a5" },
    work: { label: "เสริมการงาน บารมี", emoji: "💼", bless: "งานราบรื่น ผู้ใหญ่เอ็นดู บารมีโดดเด่น", g1: "#131f45", g2: "#080c1f", accent: "#8ab6ff" }
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

  // เทพมงคลประจำด้าน — นำเสนอเชิงสัญลักษณ์อย่างเคารพ (ชื่อ + สัญลักษณ์ + คำขอพร)
  const GOAL_DEITY = {
    money: { name: "ท้าวเวสสุวรรณ", e: "🪔", wish: "ขอบารมีคุ้มครอง ทรัพย์สินมั่งคั่ง กันสิ่งไม่ดีทั้งปวง" },
    love: { name: "พระแม่ลักษมี", e: "🪷", wish: "ขอความรักงอกงาม เสน่ห์เมตตามหานิยม ครอบครัวอบอุ่น" },
    luck: { name: "พระพิฆเนศ", e: "🐘", wish: "ขอความสำเร็จสมปรารถนา อุปสรรคมลายสิ้น โชคลาภเข้ามา" },
    work: { name: "พญาครุฑ", e: "🦅", wish: "ขออำนาจบารมี หน้าที่การงานก้าวหน้า มั่นคงเป็นสง่า" }
  };

  // ไพ่เสริมดวงประจำแต่ละด้าน (วาดเองทั้งใบ ไม่ใช้ภาพสำรับลิขสิทธิ์)
  const GOAL_EN = { money: "MONEY", love: "LOVE", luck: "LUCKY", work: "POWER" };
  const GOAL_CARDS = {
    money: [{ n: "The Sun", r: "XIX", e: "☀️" }, { n: "Wheel of Fortune", r: "X", e: "🎡" }, { n: "The Empress", r: "III", e: "🌾" }],
    love: [{ n: "The Lovers", r: "VI", e: "💞" }, { n: "The Star", r: "XVII", e: "⭐" }, { n: "The Sun", r: "XIX", e: "☀️" }],
    luck: [{ n: "The Star", r: "XVII", e: "⭐" }, { n: "The World", r: "XXI", e: "🌍" }, { n: "Wheel of Fortune", r: "X", e: "🎡" }],
    work: [{ n: "The Emperor", r: "IV", e: "🏛️" }, { n: "The Magician", r: "I", e: "✨" }, { n: "The Chariot", r: "VII", e: "🏇" }]
  };
  const GOAL_DECO = { money: "🪙", love: "💗", luck: "🍀", work: "👑" };

  // ตัวอักษรลายทองฟอยล์ + แสงเรือง
  function goldText(ctx, text, x, y, size, weight) {
    ctx.font = (weight || 800) + " " + size + "px " + FONT;
    const g = ctx.createLinearGradient(0, y - size, 0, y);
    g.addColorStop(0, "#fff3cf"); g.addColorStop(0.5, "#f0c95e"); g.addColorStop(1, "#9c7418");
    ctx.fillStyle = g;
    ctx.shadowColor = "rgba(230,184,76,.5)"; ctx.shadowBlur = 45;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
  }

  // ไพ่ทาโรต์ใบเล็กสไตล์วินเทจ: พื้นครีม กรอบทอง เลขโรมัน + สัญลักษณ์ + ชื่อ
  function miniCard(ctx, cx, cy, rot, card) {
    const w = 260, h = 420;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12;
    roundRect(ctx, -w / 2, -h / 2, w, h, 18);
    ctx.fillStyle = "#f8efd8"; ctx.fill();
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "#b98a2e"; ctx.lineWidth = 5;
    roundRect(ctx, -w / 2 + 11, -h / 2 + 11, w - 22, h - 22, 12); ctx.stroke();
    ctx.strokeStyle = "rgba(185,138,46,.45)"; ctx.lineWidth = 2;
    roundRect(ctx, -w / 2 + 20, -h / 2 + 20, w - 40, h - 40, 8); ctx.stroke();
    ctx.textAlign = "center"; ctx.fillStyle = "#7a5a14";
    ctx.font = "700 36px " + FONT; ctx.fillText(card.r, 0, -h / 2 + 66);
    ctx.font = "125px " + FONT; ctx.fillText(card.e, 0, 45);
    let nameSize = 24; // ชื่อยาว (เช่น WHEEL OF FORTUNE) ย่อฟอนต์จนพอดีกรอบ
    ctx.font = "600 " + nameSize + "px " + FONT;
    while (ctx.measureText(card.n.toUpperCase()).width > w - 48 && nameSize > 13) {
      nameSize -= 1; ctx.font = "600 " + nameSize + "px " + FONT;
    }
    ctx.fillText(card.n.toUpperCase(), 0, h / 2 - 36);
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

  // ---------- วอลเปเปอร์เสริมดวง 1080×2340 (จอมือถือ) ----------
  function drawWallpaper(opts) {
    const W = 1080, H = 2340;
    const goalKey = GOALS[opts.goal] ? opts.goal : "money";
    const goal = GOALS[goalKey];
    const styleKey = WALL_STYLES[opts.style] ? opts.style : "tarot";
    const dob = opts.dob || null;
    const dayIdx = dob ? new Date(dob).getDay() : new Date().getDay();
    const day = DAY_META[dayIdx] || DAY_META[0];
    const seedStr = (dob || "guest") + "|" + goalKey + "|" + styleKey;
    let seed = 5381;
    for (let i = 0; i < seedStr.length; i++) seed = ((seed << 5) + seed + seedStr.charCodeAt(i)) >>> 0;
    const luckyNum = (seed % 9) + 1;          // เลขหลักเดียว (ลายคลาสสิก)
    const luckyNum3 = 100 + (seed % 900);     // เลข 3 หลักสไตล์ยอดนิยม (ลายไพ่/เทพ)

    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, goal.g1); bg.addColorStop(0.55, goal.g2); bg.addColorStop(1, "#050308");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    stars(ctx, W, H, 160, seed);

    // แสงเรืองกลางภาพ
    const glow = ctx.createRadialGradient(W / 2, 980, 60, W / 2, 980, 620);
    glow.addColorStop(0, goal.accent + "33"); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

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
      // สไตล์ยอดนิยม: คำอังกฤษตัวใหญ่ + ไพ่ 3 ใบซ้อน + เลข 3 หลัก
      goldText(ctx, GOAL_EN[goalKey], W / 2, 350, 185);
      ctx.fillStyle = "#fff"; ctx.font = "600 46px " + FONT;
      ctx.fillText(goal.label, W / 2, 435);
      const cards = GOAL_CARDS[goalKey];
      miniCard(ctx, W / 2 - 265, 850, -0.16, cards[0]);
      miniCard(ctx, W / 2 + 265, 850, 0.16, cards[2]);
      miniCard(ctx, W / 2, 805, 0, cards[1]);
      goldText(ctx, String(luckyNum3), W / 2, 1450, 250);
      ctx.fillStyle = goal.accent; ctx.font = "600 38px " + FONT;
      ctx.fillText("เลขนำโชคประจำดวงคุณ", W / 2, 1530);
      ctx.fillStyle = "#fff"; ctx.font = "500 38px " + FONT;
      wrap(ctx, goal.bless, W - 240).forEach((l, i) => ctx.fillText(l, W / 2, 1610 + i * 56));
    } else if (styleKey === "deity") {
      // คอลเลกชันเทพมงคล: รัศมี + สัญลักษณ์ + ชื่อเทพอักษรทอง + คำขอพร
      const d = GOAL_DEITY[goalKey], cy = 560;
      ctx.strokeStyle = goal.accent; ctx.lineWidth = 3;
      [225, 258].forEach(r => { ctx.beginPath(); ctx.arc(W / 2, cy, r, 0, Math.PI * 2); ctx.stroke(); });
      for (let i = 0; i < 16; i++) { // รัศมีรอบซุ้ม
        const a = i * Math.PI / 8;
        ctx.beginPath();
        ctx.moveTo(W / 2 + Math.cos(a) * 270, cy + Math.sin(a) * 270);
        ctx.lineTo(W / 2 + Math.cos(a) * (i % 2 ? 300 : 330), cy + Math.sin(a) * (i % 2 ? 300 : 330));
        ctx.stroke();
      }
      ctx.font = "230px " + FONT;
      ctx.fillText(d.e, W / 2, cy + 80);
      ctx.fillStyle = goal.accent; // จุดไข่มุกฐานบัวใต้ซุ้ม
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (0.2 + i * 0.075);
        ctx.beginPath();
        ctx.arc(W / 2 + Math.cos(a) * 300, cy + 120 + Math.sin(a) * 80, i === 4 ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();
      }
      goldText(ctx, d.name, W / 2, 1030, 108);
      ctx.fillStyle = "#fff"; ctx.font = "500 42px " + FONT;
      wrap(ctx, d.wish, W - 240).forEach((l, i) => ctx.fillText(l, W / 2, 1120 + i * 62));
      goldText(ctx, String(luckyNum3), W / 2, 1480, 230);
      ctx.fillStyle = goal.accent; ctx.font = "600 38px " + FONT;
      ctx.fillText("เลขนำโชคประจำดวงคุณ · " + goal.label, W / 2, 1560);
    } else {
      // ลายคลาสสิก: ลวดลายตอนบน + เลขหลักเดียวในวงแหวน
      MOTIFS[styleKey](ctx, W, goal.accent, seed, goal.g1);
      ctx.fillStyle = "#fff";
      ctx.font = "150px " + FONT;
      ctx.fillText(goal.emoji, W / 2, 860);
      ctx.fillStyle = goal.accent;
      ctx.font = "700 58px " + FONT;
      ctx.fillText(goal.label, W / 2, 990);
      ctx.fillStyle = "#fff";
      ctx.font = "500 40px " + FONT;
      wrap(ctx, goal.bless, W - 220).forEach((l, i) => ctx.fillText(l, W / 2, 1070 + i * 60));

      ctx.strokeStyle = goal.accent; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(W / 2, 1440, 150, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = goal.accent + "55"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(W / 2, 1440, 168, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "700 170px " + FONT;
      ctx.fillText(String(luckyNum), W / 2, 1500);
      ctx.fillStyle = goal.accent;
      ctx.font = "600 38px " + FONT;
      ctx.fillText("เลขนำโชคประจำดวงคุณ", W / 2, 1680);
    }

    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.font = "36px " + FONT;
    ctx.fillText((dob ? "เกิดวัน" : "วัน") + day.d + " · สีมงคล: " + day.lucky, W / 2, 1780);

    ctx.fillStyle = "rgba(255,255,255,.5)";
    ctx.font = "30px " + FONT;
    ctx.fillText("วอลเปเปอร์เสริมดวง — เพื่อความบันเทิงและกำลังใจ", W / 2, 2180);
    ctx.fillStyle = goal.accent;
    ctx.font = "600 32px " + FONT;
    ctx.fillText("🔮 สร้างของคุณเองฟรีที่ " + siteMark(), W / 2, 2240);
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
