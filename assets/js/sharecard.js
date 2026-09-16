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

  // ---------- วอลเปเปอร์เสริมดวง 1080×2340 (จอมือถือ) ----------
  function drawWallpaper(opts) {
    const W = 1080, H = 2340;
    const goal = GOALS[opts.goal] || GOALS.money;
    const dob = opts.dob || null;
    const dayIdx = dob ? new Date(dob).getDay() : new Date().getDay();
    const day = DAY_META[dayIdx] || DAY_META[0];
    const seedStr = (dob || "guest") + "|" + opts.goal;
    let seed = 5381;
    for (let i = 0; i < seedStr.length; i++) seed = ((seed << 5) + seed + seedStr.charCodeAt(i)) >>> 0;
    const luckyNum = (seed % 9) + 1;

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

    // ลายมงคลตอนบน: จุด-เกลียว-เส้นตรง (แนวอุณาโลมอย่างเรียบ)
    ctx.strokeStyle = goal.accent; ctx.fillStyle = goal.accent; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(W / 2, 300, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 3.5; a += 0.05) {
      const r = 14 + a * 11;
      const x = W / 2 + Math.cos(a - Math.PI / 2) * r;
      const y = 300 + 90 + Math.sin(a - Math.PI / 2) * r * 0.8;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2, 490); ctx.lineTo(W / 2, 640); ctx.stroke();

    ctx.textAlign = "center";
    ctx.font = "150px " + FONT;
    ctx.fillText(goal.emoji, W / 2, 860);
    ctx.fillStyle = goal.accent;
    ctx.font = "700 58px " + FONT;
    ctx.fillText(goal.label, W / 2, 990);
    ctx.fillStyle = "#fff";
    ctx.font = "500 40px " + FONT;
    wrap(ctx, goal.bless, W - 220).forEach((l, i) => ctx.fillText(l, W / 2, 1070 + i * 60));

    // วงเลขนำโชคประจำดวง
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
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.font = "36px " + FONT;
    ctx.fillText((dob ? "เกิดวัน" : "วัน") + day.d + " · สีมงคล: " + day.lucky, W / 2, 1745);

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

  return { GOALS, drawReadingCard, drawWallpaper, share, download };
})();
