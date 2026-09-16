// สมุดคำทำนาย — เก็บผลดูดวงไว้ในเครื่องผู้ใช้ (localStorage) จำกัด 50 รายการล่าสุด
// ผู้ใช้ติ๊กย้อนหลังได้ว่า "ตรง/ไม่ตรง" และล้างสมุดทั้งเล่มได้หนึ่งคลิก
window.MEDIUM_JOURNAL = (function () {
  const LS_KEY = "medium_reading_journal";
  const MAX = 50;

  function all() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch (e) { return []; } }
  function persist(list) { try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, MAX))); } catch (e) {} }

  function save(source, text) {
    if (!text || !text.trim()) return null;
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      at: new Date().toISOString(),
      source: source || "หมอดูทิพย์",
      text: text.trim().slice(0, 2000),
      accurate: null // null = ยังไม่ประเมิน, true/false = ผู้ใช้ติ๊กเอง
    };
    persist([entry, ...all()]);
    return entry;
  }
  function mark(id, val) {
    persist(all().map(e => e.id === id ? { ...e, accurate: val } : e));
  }
  function remove(id) { persist(all().filter(e => e.id !== id)); }
  function clear() { try { localStorage.removeItem(LS_KEY); } catch (e) {} }

  function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }) +
      " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  // วาดรายการลงใน container ที่กำหนด (ใช้ escapeHtml จาก app.js)
  function render(container) {
    const list = all();
    if (!list.length) {
      container.innerHTML = '<p class="muted tc">สมุดยังว่างอยู่ — กด "บันทึกลงสมุด" หลังได้คำทำนายเพื่อเก็บไว้เช็คว่าตรงไหม</p>';
      return;
    }
    container.innerHTML = list.map(e => `
      <div class="journal-item" data-id="${e.id}">
        <div class="journal-head">
          <b>${escapeHtml(e.source)}</b>
          <span class="muted">${fmtDate(e.at)}</span>
        </div>
        <p>${escapeHtml(e.text)}</p>
        <div class="journal-actions">
          <span class="muted">ตรงไหม?</span>
          <button class="chip ${e.accurate === true ? "active" : ""}" data-acc="yes">✅ ตรง</button>
          <button class="chip ${e.accurate === false ? "active" : ""}" data-acc="no">❌ ไม่ตรง</button>
          <button class="chip" data-del="1">🗑️</button>
        </div>
      </div>`).join("");
  }

  return { all, save, mark, remove, clear, render };
})();
