// สคริปต์ร่วมทุกหน้า: navbar + footer + ตัวช่วยทั่วไป
(function () {
  const page = document.body.dataset.page || "";

  const nav = `
    <div class="nav-inner">
      <a class="brand" href="index.html"><span class="orb">🔮</span>MED<em>IUM</em></a>
      <nav class="nav-links">
        <a href="index.html" ${page === "home" ? 'class="active"' : ""}>หน้าแรก</a>
        <a href="seers.html" ${page === "seers" ? 'class="active"' : ""}>หาหมอดู</a>
        <a href="medium.html" ${page === "medium" ? 'class="active"' : ""}>หมอดูทิพย์</a>
        <a href="session.html" ${page === "session" ? 'class="active"' : ""}>เดโมเซสชัน</a>
        <a href="dashboard.html" ${page === "dashboard" ? 'class="active"' : ""}>หลังบ้านหมอดู</a>
      </nav>
    </div>`;

  const footer = `
    <div class="container">
      <div class="disclaimer">
        <b>⚠️ คำชี้แจง:</b> บริการดูดวงและหมอดูทิพย์บนแพลตฟอร์ม Medium มีไว้เพื่อความบันเทิง
        เป็นแนวทางและกำลังใจในการใช้ชีวิตเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ การเงิน หรือกฎหมาย
        โปรดใช้วิจารณญาณ การตัดสินใจสำคัญในชีวิตควรปรึกษาผู้เชี่ยวชาญเฉพาะด้าน
        วิดีโอเซสชันถูกบันทึกเมื่อได้รับความยินยอมจากทั้งสองฝ่ายเท่านั้น และคุณมีสิทธิ์ขอลบข้อมูลได้ตาม PDPA
      </div>
      <div class="footer-grid">
        <div>
          <h4>🔮 MEDIUM</h4>
          <p>ตัวกลางที่พาหมอดูกับคุณมาเจอกัน — ดูดวงสดผ่านวิดีโอ อัดคลิปให้ พร้อมส่งสรุปคำทำนายหลังจบทุกครั้ง
          และพบ "หมอดูทิพย์" ที่ศึกษาศาสตร์ความเชื่อมาอย่างลึกซึ้ง</p>
        </div>
        <div>
          <h4>บริการ</h4>
          <a href="seers.html">ค้นหาหมอดู</a>
          <a href="medium.html">หมอดูทิพย์</a>
          <a href="session.html">ตัวอย่างเซสชัน</a>
        </div>
        <div>
          <h4>แพลตฟอร์ม</h4>
          <a href="#">สมัครเป็นหมอดู</a>
          <a href="#">นโยบายความเป็นส่วนตัว</a>
          <a href="#">เงื่อนไขการใช้งาน</a>
        </div>
      </div>
      <div class="copyright">© 2026 Medium — แพลตฟอร์มหมอดูออนไลน์ · ทุกเซสชันมีคลิปและสรุปให้เสมอ</div>
    </div>`;

  const navEl = document.getElementById("app-nav");
  if (navEl) navEl.innerHTML = nav;
  const footEl = document.getElementById("app-footer");
  if (footEl) footEl.innerHTML = footer;
})();

// ตัวช่วยกัน XSS สำหรับข้อความผู้ใช้
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function starText(rating) {
  return "★".repeat(Math.round(rating));
}

// PWA: ลงทะเบียน service worker (ติดตั้งเป็นแอป + เปิดออฟไลน์ได้)
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
