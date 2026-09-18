// "Medium Arcana" — สำรับไพ่ทาโรต์ประจำแพลตฟอร์ม Medium วาดเวกเตอร์เองครบ 22 ใบเมเจอร์
// ลายเส้นทองบนน้ำเงินราตรี ตรา ✦ ☾ ✦ ประจำสำรับ — ใช้ร่วมกันทั้งหน้าเปิดไพ่และวอลเปเปอร์
// พื้นที่ออกแบบ 400×640 แล้วสเกลตามขนาดจริงที่เรียกวาด
window.MEDIUM_DECK = (function () {
  const GOLD = "#d9b258", GOLD_SOFT = "rgba(217,178,88,.55)";
  const SERIF = "Georgia,'Times New Roman',serif";

  // ---------- ตัวช่วยวาดสั้น ๆ ----------
  function make(ctx) {
    return {
      L(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); },
      C(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); fill ? ctx.fill() : ctx.stroke(); },
      A(x, y, r, a1, a2, ccw) { ctx.beginPath(); ctx.arc(x, y, r, a1, a2, ccw || false); ctx.stroke(); },
      P(pts, close, fill) {
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        if (close) ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
      },
      Q(x1, y1, cx, cy, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy, x2, y2); ctx.stroke(); },
      star4(x, y, s, fill) {
        ctx.save(); ctx.translate(x, y); ctx.beginPath();
        ctx.moveTo(0, -s); ctx.lineTo(s * .25, -s * .25); ctx.lineTo(s, 0); ctx.lineTo(s * .25, s * .25);
        ctx.lineTo(0, s); ctx.lineTo(-s * .25, s * .25); ctx.lineTo(-s, 0); ctx.lineTo(-s * .25, -s * .25);
        ctx.closePath(); fill !== false ? ctx.fill() : ctx.stroke(); ctx.restore();
      },
      crescent(x, y, r) { // จันทร์เสี้ยวลายเส้น
        ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 0.35, Math.PI * 1.65); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + r * 0.5, y, r * 0.78, Math.PI * 0.42, Math.PI * 1.58); ctx.stroke();
      }
    };
  }

  // ---------- ภาพประกอบกลางไพ่ 22 ใบ (วาดในกรอบ ±150 รอบจุด 0,0) ----------
  const ART = {
    fool(x, c) { // นักเดินทาง: ไม้คอนสัมภาระ กุหลาบขาว ตะวันเบิกทาง ขอบผา
      x.save(); x.globalAlpha = .85; c.C(-88, -98, 22);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.L(-88 + Math.cos(a) * 32, -98 + Math.sin(a) * 32, -88 + Math.cos(a) * 44, -98 + Math.sin(a) * 44); }
      x.restore();
      c.L(-58, 88, 58, -62); c.C(80, -82, 24);               // ไม้คอนพาดบ่า + ถุงสัมภาระ
      c.L(58, -62, 66, -68);
      c.C(-60, 22, 7);                                       // กุหลาบขาวในมือ
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.C(-60 + Math.cos(a) * 14, 22 + Math.sin(a) * 14, 7); }
      c.L(-60, 36, -72, 60);
      c.L(-100, 108, 22, 108); c.L(22, 108, 22, 146);        // ขอบผา
      x.save(); x.globalAlpha = .55; c.L(38, 124, 62, 124); c.L(52, 140, 72, 140); x.restore();
    },
    magician(x, c) { // นักมายา: อนันต์ คทาชูขึ้น โต๊ะเครื่องมือ
      x.lineWidth = 7; c.C(-26, -95, 24); c.C(26, -95, 24); x.lineWidth = 6;
      c.L(0, -40, 0, 26); c.star4(0, -54, 11);               // คทาปลายดาว
      c.L(-95, 70, 95, 70); c.L(-85, 70, -85, 110); c.L(85, 70, 85, 110); // โต๊ะ
      c.C(-52, 52, 12); c.star4(0, 48, 14); c.P([[40, 62], [64, 62], [52, 38]], true); // ถ้วย ดาว ดาบ
    },
    "high-priestess"(x, c) { // ปุโรหิตหญิง: สองเสา ม่านโค้ง คัมภีร์ จันทร์
      c.L(-95, -110, -95, 90); c.L(95, -110, 95, 90);
      c.Q(-95, -110, 0, -160, 95, -110);
      x.save(); x.globalAlpha = .5; c.Q(-95, -66, 0, -114, 95, -66); x.restore(); // ม่านชั้นใน
      x.strokeRect(-38, 10, 76, 52);                          // คัมภีร์
      c.L(0, 10, 0, 62);
      c.crescent(0, 118, 26);
    },
    empress(x, c) { // จักรพรรดินี: ตราวีนัสกลางช่อรวงข้าว มงกุฎดาว
      c.C(0, -34, 42); c.L(0, 8, 0, 74); c.L(-25, 44, 25, 44);
      [-1, 1].forEach(s => {
        c.Q(s * 62, 112, s * 96, 16, s * 58, -78);           // ก้านรวงข้าวโค้งโอบ
        for (let i = 0; i < 5; i++) {                        // เมล็ดกลมเรียงตามก้าน
          const t = .18 + i * .17;
          const qx = (1 - t) * (1 - t) * (s * 62) + 2 * (1 - t) * t * (s * 96) + t * t * (s * 58);
          const qy = (1 - t) * (1 - t) * 112 + 2 * (1 - t) * t * 16 + t * t * (-78);
          c.C(qx + s * 15, qy, 6);
        }
      });
      [[-36, -96], [0, -110], [36, -96]].forEach(p => c.star4(p[0], p[1], 9));
    },
    emperor(x, c) { // จักรพรรดิ: มหามงกุฎเหนือลูกโลกราชัน
      c.P([[-62, -28], [-62, -92], [-31, -56], [0, -104], [31, -56], [62, -92], [62, -28]], true);
      x.strokeRect(-62, -28, 124, 20);
      [[-62, -100], [0, -112], [62, -100]].forEach(p => c.C(p[0], p[1], 5, true));
      c.L(0, 26, 0, 42); c.L(-9, 34, 9, 34);                 // กางเขนยอดลูกโลก
      c.C(0, 84, 40);
      c.L(-40, 84, 40, 84);
      x.beginPath(); x.ellipse(0, 84, 16, 40, 0, 0, Math.PI * 2); x.stroke();
    },
    hierophant(x, c) { // พระอาจารย์: ไม้เท้ากางเขนสาม กุญแจไขว้
      c.L(0, -130, 0, 60);
      [-56, -22, 12].forEach((y, i) => c.L(-(46 - i * 10), y, 46 - i * 10, y));
      [-1, 1].forEach(s => { c.C(s * 42, 102, 16); c.L(s * 42 + s * 12, 112, s * 42 + s * 38, 138); c.L(s * 42 + s * 30, 132, s * 42 + s * 40, 122); });
    },
    lovers(x, c) { // คู่รัก: อาทิตย์อวยพร แหวนคล้อง หัวใจ
      x.save(); x.globalAlpha = .8; c.C(0, -118, 24); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.L(Math.cos(a) * 32, -118 + Math.sin(a) * 32, Math.cos(a) * 44, -118 + Math.sin(a) * 44); } x.restore();
      x.lineWidth = 7; c.C(-24, 55, 34); c.C(24, 55, 34); x.lineWidth = 6;
      x.beginPath(); x.moveTo(0, -20);
      x.bezierCurveTo(-24, -44, -52, -16, 0, 16);
      x.bezierCurveTo(52, -16, 24, -44, 0, -20); x.stroke();
    },
    chariot(x, c) { // ราชรถ: หลังคาดาว ตัวรถ ล้อซี่
      c.L(-70, -55, -70, -110); c.L(70, -55, 70, -110);
      c.Q(-70, -110, 0, -140, 70, -110);
      c.star4(0, -112, 10);
      x.strokeRect(-78, -55, 156, 70);
      c.star4(0, -20, 16);
      [-46, 46].forEach(wx => { c.C(wx, 62, 30); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; c.L(wx - Math.cos(a) * 30, 62 - Math.sin(a) * 30, wx + Math.cos(a) * 30, 62 + Math.sin(a) * 30); } });
    },
    strength(x, c) { // พลังใจ: อนันต์เหนือราชสีห์แผงคอเปลวสงบ
      x.lineWidth = 5; c.C(-17, -114, 15); c.C(17, -114, 15); x.lineWidth = 6;
      x.beginPath();                                         // แผงคอแฉกรอบหน้า
      for (let i = 0; i <= 24; i++) {
        const a = i * Math.PI / 12, r = i % 2 === 0 ? 92 : 60;
        const px = Math.cos(a) * r, py = 24 + Math.sin(a) * r;
        i === 0 ? x.moveTo(px, py) : x.lineTo(px, py);
      }
      x.closePath(); x.stroke();
      c.C(0, 24, 52);                                        // หน้าราชสีห์
      c.A(-20, 14, 9, Math.PI * .15, Math.PI * .85);         // ตาหลับสงบ
      c.A(20, 14, 9, Math.PI * .15, Math.PI * .85);
      c.P([[-9, 36], [9, 36], [0, 48]], true);               // จมูก
      c.A(-10, 48, 10, 0, Math.PI * .85);                    // ปากแมวใหญ่
      c.A(10, 48, 10, Math.PI * .15, Math.PI);
    },
    hermit(x, c) { // ฤๅษี: โคมส่องทาง ไม้เท้า
      c.L(-55, -140, -55, 90);                               // ไม้เท้า
      x.strokeRect(10, -95, 80, 95);                          // โคม
      c.P([[10, -95], [50, -125], [90, -95]], false);
      c.L(50, -125, 50, -140);
      c.star4(50, -48, 20);
      c.L(30, 0, 30, 22); c.L(70, 0, 70, 22);
      x.save(); x.globalAlpha = .5;                          // ลำแสงส่องทาง
      c.L(28, 28, -62, 108); c.L(72, 28, 6, 130);
      x.restore();
      [[-10, 62], [28, 82]].forEach(p => c.star4(p[0], p[1], 6));
    },
    "wheel-of-fortune"(x, c) { // กงล้อชะตา
      c.C(0, 0, 92); c.C(0, 0, 66); c.C(0, 0, 14);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.L(Math.cos(a) * 14, Math.sin(a) * 14, Math.cos(a) * 66, Math.sin(a) * 66); }
      [[-120, -120], [120, -120], [-120, 120], [120, 120]].forEach(p => c.star4(p[0], p[1], 12));
    },
    justice(x, c) { // ตราชู: ดาบกลาง จานชั่งสองข้าง
      c.L(0, -130, 0, 60); c.P([[-12, 60], [12, 60], [0, 95]], true); // ดาบ
      c.L(-14, -116, 14, -116);
      c.L(-90, -70, 90, -70);
      [-1, 1].forEach(s => { c.L(s * 90, -70, s * 90, -30); c.A(s * 90, -30, 26, 0, Math.PI); });
    },
    "hanged-man"(x, c) { // ผู้พลิกมุมมอง: แขวนใต้คาน สามเหลี่ยมคว่ำ รัศมีรู้แจ้ง
      c.L(-84, -124, 84, -124);
      c.L(-84, -124, -84, -100); c.L(84, -124, 84, -100);
      c.L(0, -124, 0, -78);
      c.P([[-54, -78], [54, -78], [0, 26]], true);
      c.C(0, 68, 26);
      x.save(); x.globalAlpha = .7;
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.L(Math.cos(a) * 36, 68 + Math.sin(a) * 36, Math.cos(a) * 50, 68 + Math.sin(a) * 50); }
      x.restore();
    },
    death(x, c) { // การเปลี่ยนผ่าน: ผีเสื้อถือกำเนิดเหนืออรุณรุ่ง
      [-1, 1].forEach(s => {                                  // ปีกบน-ล่างสี่ข้าง
        x.beginPath(); x.ellipse(s * 34, -36, 34, 46, s * .5, 0, Math.PI * 2); x.stroke();
        x.beginPath(); x.ellipse(s * 27, 28, 22, 30, s * .25, 0, Math.PI * 2); x.stroke();
        x.save(); x.globalAlpha = .6; c.C(s * 42, -44, 9); x.restore();
      });
      c.L(0, -56, 0, 48); c.C(0, -66, 8);                     // ลำตัว หัว
      c.Q(-4, -73, -16, -90, -24, -100); c.C(-27, -104, 3, true); // หนวด
      c.Q(4, -73, 16, -90, 24, -100); c.C(27, -104, 3, true);
      c.A(0, 152, 74, Math.PI, Math.PI * 2);                  // อรุณรุ่งขอบฟ้า
      x.save(); x.globalAlpha = .7;
      for (let i = 1; i < 6; i++) { const a = Math.PI + i * Math.PI / 6; c.L(Math.cos(a) * 84, 152 + Math.sin(a) * 84, Math.cos(a) * 100, 152 + Math.sin(a) * 100); }
      c.L(-104, 152, 104, 152);
      x.restore();
    },
    temperance(x, c) { // ความพอดี: สายน้ำถ่ายเทระหว่างสองถ้วย
      c.P([[0, -130], [-22, -92], [22, -92]], true);          // สามเหลี่ยมในวง
      c.C(0, -104, 34);
      [-1, 1].forEach(s => { c.A(s * 58, 48, 30, 0, Math.PI); c.L(s * 28, 48, s * 88, 48); });
      c.Q(-48, 30, 0, -10, 48, 30);                           // สายน้ำโค้ง
      x.save(); x.globalAlpha = .55; c.Q(-40, 38, 0, 2, 40, 38); x.restore();
    },
    devil(x, c) { // พันธนาการที่ปลดได้: โซ่ขาดสะบั้น เปลวรู้ตัว
      x.save(); x.translate(0, -70);
      x.beginPath(); x.ellipse(-54, 0, 28, 16, 0, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.ellipse(54, 0, 28, 16, 0, 0, Math.PI * 2); x.stroke();
      c.A(-20, 0, 16, Math.PI * .55, Math.PI * 1.45);        // ห่วงกลางขาดสองซีก
      c.A(20, 0, 16, -Math.PI * .45, Math.PI * .45);
      c.star4(0, -34, 10);                                   // ประกายหลุดพ้น
      x.restore();
      c.Q(0, 128, -42, 64, 0, 0);                            // เปลวเทียนแห่งสติ
      c.Q(0, 0, 42, 64, 0, 128);
      c.Q(0, 96, -15, 66, 0, 44); c.Q(0, 44, 15, 66, 0, 96);
    },
    tower(x, c) { // หอคอย: สายฟ้า มงกุฎหลุด
      x.strokeRect(-45, -40, 90, 160);
      c.L(-45, -40, -58, -40); c.L(45, -40, 58, -40);
      [[-58, -40], [-20, -40], [18, -40]].forEach(p => x.strokeRect(p[0], -62, 40, 22));
      c.P([[85, -140], [30, -70], [62, -70], [8, 10]], false); // สายฟ้า
      x.save(); x.translate(-88, -100); x.rotate(-.7);
      c.P([[-24, 10], [-24, -12], [-12, 0], [0, -20], [12, 0], [24, -12], [24, 10]], true); x.restore();
      [[-80, 40], [80, 20], [-70, 90]].forEach(p => c.star4(p[0], p[1], 7));
    },
    star(x, c) { // ดวงดาวแห่งหวัง: ดาวแปดแฉกใหญ่ บริวาร สายน้ำชโลมดิน
      c.star4(0, -48, 68);
      x.save(); x.translate(0, -48); x.rotate(Math.PI / 4); c.star4(0, 0, 46); x.restore();
      [[-98, -112], [98, -96], [-86, 10], [90, -4]].forEach(p => c.star4(p[0], p[1], 10));
      c.Q(-92, 112, 0, 92, 92, 112);                          // สายน้ำสองระลอก
      x.save(); x.globalAlpha = .55; c.Q(-84, 132, 0, 112, 84, 132); x.restore();
    },
    moon(x, c) { // จันทรา: จันทร์เสี้ยวหน้าอ่อน สองหอ ทางเดินกลางคืน
      c.crescent(0, -70, 52);
      c.C(-14, -80, 3, true); c.A(-8, -62, 8, Math.PI * .1, Math.PI * .7);
      [-1, 1].forEach(s => { x.strokeRect(s * 92 - 14, -20, 28, 70); c.P([[s * 92 - 18, -20], [s * 92, -42], [s * 92 + 18, -20]], false); });
      c.Q(-100, 130, 0, 70, 100, 130);                        // ทางเดิน
      x.save(); x.globalAlpha = .6; [[-40, 20], [46, 30], [0, 8]].forEach(p => { c.L(p[0], p[1], p[0], p[1] + 10); }); x.restore();
    },
    sun(x, c) { // สุริยา: อาทิตย์สงบเปี่ยมพลัง รัศมีตรงสลับคลื่น ทุ่งทองเบื้องล่าง
      c.C(0, -28, 58);
      x.save(); x.globalAlpha = .5; c.C(0, -28, 45); x.restore();
      c.A(-21, -36, 10, Math.PI * .15, Math.PI * .85);        // ตาหลับสงบ
      c.A(21, -36, 10, Math.PI * .15, Math.PI * .85);
      c.A(0, -10, 15, Math.PI * .2, Math.PI * .8);            // รอยยิ้มละมุน
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        if (i % 2 === 0) c.L(Math.cos(a) * 70, -28 + Math.sin(a) * 70, Math.cos(a) * 102, -28 + Math.sin(a) * 102);
        else c.Q(Math.cos(a) * 70, -28 + Math.sin(a) * 70, Math.cos(a + .2) * 86, -28 + Math.sin(a + .2) * 86, Math.cos(a) * 102, -28 + Math.sin(a) * 102);
      }
      c.Q(-100, 118, 0, 96, 100, 118);                        // ทุ่งทองสองระลอก
      x.save(); x.globalAlpha = .55; c.Q(-88, 136, 0, 116, 88, 136); x.restore();
    },
    judgement(x, c) { // เสียงปลุกตื่น: แตรฟ้า คลื่นเสียง ผู้ตื่นรับพร
      c.L(-84, -110, 24, -80); c.L(-84, -100, 24, -48)        // ลำแตรบานออกเฉียงฟ้า
      c.C(-89, -105, 6);
      x.beginPath(); x.ellipse(29, -64, 11, 24, -.35, 0, Math.PI * 2); x.stroke();
      x.save(); x.globalAlpha = .6;
      [24, 42, 60].forEach(r => c.A(38, -62, r, -.65, .65));
      x.restore();
      c.Q(-100, 120, 0, 80, 100, 120);
      [[-50, 104], [0, 92], [50, 104]].forEach(p => { c.A(p[0], p[1], 12, Math.PI, Math.PI * 2); c.L(p[0] - 12, p[1], p[0] - 12, p[1] + 8); c.L(p[0] + 12, p[1], p[0] + 12, p[1] + 8); });
    },
    world(x, c) { // โลกสมบูรณ์: พวงมาลัยชัยรอบพิภพ
      x.beginPath(); x.ellipse(0, 0, 80, 112, 0, 0, Math.PI * 2); x.stroke();
      for (let i = 0; i < 14; i++) {                          // เม็ดมาลัยเรียงรอบ
        const a = i * Math.PI * 2 / 14;
        c.C(Math.cos(a) * 97, Math.sin(a) * 130, 6);
      }
      [[0, -112], [0, 112]].forEach(p => {                    // ริบบิ้นมัดหัว-ท้าย
        c.L(p[0] - 14, p[1] - 9, p[0] + 14, p[1] + 9); c.L(p[0] - 14, p[1] + 9, p[0] + 14, p[1] - 9);
      });
      c.C(0, 0, 38);                                          // พิภพ
      c.L(-38, 0, 38, 0);
      x.beginPath(); x.ellipse(0, 0, 15, 38, 0, 0, Math.PI * 2); x.stroke();
      [[-125, -130], [125, -130], [-125, 130], [125, 130]].forEach(p => c.star4(p[0], p[1], 11));
    }
  };

  // ---------- เมทาดาทาสำรับ (ลำดับตามเมเจอร์อาร์คานา) ----------
  const CARDS = [
    { key: "fool", n: "The Fool", r: "0" }, { key: "magician", n: "The Magician", r: "I" },
    { key: "high-priestess", n: "The High Priestess", r: "II" }, { key: "empress", n: "The Empress", r: "III" },
    { key: "emperor", n: "The Emperor", r: "IV" }, { key: "hierophant", n: "The Hierophant", r: "V" },
    { key: "lovers", n: "The Lovers", r: "VI" }, { key: "chariot", n: "The Chariot", r: "VII" },
    { key: "strength", n: "Strength", r: "VIII" }, { key: "hermit", n: "The Hermit", r: "IX" },
    { key: "wheel-of-fortune", n: "Wheel of Fortune", r: "X" }, { key: "justice", n: "Justice", r: "XI" },
    { key: "hanged-man", n: "The Hanged Man", r: "XII" }, { key: "death", n: "Death", r: "XIII" },
    { key: "temperance", n: "Temperance", r: "XIV" }, { key: "devil", n: "The Devil", r: "XV" },
    { key: "tower", n: "The Tower", r: "XVI" }, { key: "star", n: "The Star", r: "XVII" },
    { key: "moon", n: "The Moon", r: "XVIII" }, { key: "sun", n: "The Sun", r: "XIX" },
    { key: "judgement", n: "Judgement", r: "XX" }, { key: "world", n: "The World", r: "XXI" }
  ];
  const byKey = {}, byName = {};
  CARDS.forEach((cd, i) => { cd.index = i; byKey[cd.key] = cd; byName[cd.n] = cd; });

  // ---------- วาดไพ่เต็มใบลงพื้นที่ x,y,w,h ----------
  function draw(ctx, key, x, y, w, h) {
    const card = byKey[key] || byName[key] || byKey.star;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(w / 400, h / 640);
    ctx.lineJoin = "round"; ctx.lineCap = "round";

    // พื้นไพ่น้ำเงินราตรีไล่เฉด + ขอบมน
    const rr = 26;
    ctx.beginPath();
    ctx.moveTo(rr, 0); ctx.arcTo(400, 0, 400, 640, rr); ctx.arcTo(400, 640, 0, 640, rr);
    ctx.arcTo(0, 640, 0, 0, rr); ctx.arcTo(0, 0, 400, 0, rr); ctx.closePath();
    const face = ctx.createLinearGradient(0, 0, 0, 640);
    face.addColorStop(0, "#262055"); face.addColorStop(1, "#0d0a22");
    ctx.fillStyle = face; ctx.fill();

    // ดาวพื้นหลังประจำใบ (seed จาก index — ใบเดิมฟ้าเดิมเสมอ)
    let s = (card.index * 2654435761 + 7) >>> 0;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    ctx.fillStyle = "rgba(255,255,255,.8)";
    for (let i = 0; i < 26; i++) {
      ctx.globalAlpha = .15 + rnd() * .4;
      ctx.beginPath(); ctx.arc(20 + rnd() * 360, 20 + rnd() * 600, rnd() * 2.2 + .6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // กรอบทองสองชั้น + ดาวสี่มุม
    ctx.strokeStyle = GOLD; ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, 376, 616);
    ctx.strokeStyle = GOLD_SOFT; ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, 348, 588);
    const c0 = make(ctx);
    ctx.fillStyle = GOLD;
    [[44, 48], [356, 48], [44, 592], [356, 592]].forEach(p => c0.star4(p[0], p[1], 9));

    // หัวไพ่: เลขโรมัน + ตราสำรับ ✦ ☾ ✦
    ctx.textAlign = "center"; ctx.fillStyle = GOLD;
    ctx.font = "700 46px " + SERIF;
    ctx.fillText(card.r, 200, 88);
    ctx.globalAlpha = .65; ctx.font = "26px system-ui,sans-serif";
    ctx.fillText("✦ ☾ ✦", 200, 126);
    ctx.globalAlpha = 1;

    // ภาพประกอบกลางไพ่
    ctx.save(); ctx.translate(200, 330);
    ctx.strokeStyle = GOLD; ctx.fillStyle = GOLD; ctx.lineWidth = 6;
    (ART[card.key] || ART.star)(ctx, make(ctx));
    ctx.restore();

    // ป้ายชื่อ: เส้นคั่นสั้น + ชื่อ serif ย่อจนพอดี
    ctx.strokeStyle = GOLD_SOFT; ctx.lineWidth = 2;
    c0.L(120, 548, 280, 548);
    ctx.fillStyle = GOLD;
    let ns = 34;
    ctx.font = "600 " + ns + "px " + SERIF;
    while (ctx.measureText(card.n.toUpperCase()).width > 330 && ns > 17) {
      ns -= 1; ctx.font = "600 " + ns + "px " + SERIF;
    }
    ctx.fillText(card.n.toUpperCase(), 200, 596);
    ctx.restore();
  }

  // เรนเดอร์ลง <canvas> ให้คมบนจอ retina
  function renderTo(canvas, key, cssW, cssH) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = cssW * dpr; canvas.height = cssH * dpr;
    canvas.style.width = cssW + "px"; canvas.style.height = cssH + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    draw(ctx, key, 0, 0, cssW, cssH);
  }

  return { CARDS, byKey, byName, draw, renderTo };
})();
