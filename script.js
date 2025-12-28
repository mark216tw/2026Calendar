/**
 * 好用的2026年月曆
 * Core Logic: Calendar Generation, Holidays, Lunar Dates, Schedule Management
 */

// --- 1. Data Sources ---

// 台灣國定假日資料 (2026)
const HOLIDAYS = [
    { "Subject": "中華民國開國紀念日", "Start Date": "2026/1/1" },
    { "Subject": "小年夜", "Start Date": "2026/2/15" },
    { "Subject": "農曆除夕", "Start Date": "2026/2/16" },
    { "Subject": "春節", "Start Date": "2026/2/17" },
    { "Subject": "春節", "Start Date": "2026/2/18" },
    { "Subject": "春節", "Start Date": "2026/2/19" },
    { "Subject": "補假", "Start Date": "2026/2/20" },
    { "Subject": "補假", "Start Date": "2026/2/27" },
    { "Subject": "和平紀念日", "Start Date": "2026/2/28" },
    { "Subject": "補假", "Start Date": "2026/4/3" },
    { "Subject": "兒童節", "Start Date": "2026/4/4" },
    { "Subject": "民族掃墓節", "Start Date": "2026/4/5" },
    { "Subject": "補假", "Start Date": "2026/4/6" },
    { "Subject": "勞動節", "Start Date": "2026/5/1" },
    { "Subject": "端午節", "Start Date": "2026/6/19" },
    { "Subject": "中秋節", "Start Date": "2026/9/25" },
    { "Subject": "教師節", "Start Date": "2026/9/28" },
    { "Subject": "補假", "Start Date": "2026/10/9" },
    { "Subject": "國慶日", "Start Date": "2026/10/10" },
    { "Subject": "光復節", "Start Date": "2026/10/25" },
    { "Subject": "補假", "Start Date": "2026/10/26" },
    { "Subject": "行憲紀念日", "Start Date": "2026/12/25" }
];

// Simplified Lunar Month Start Dates for 2026 (based on UTC+8 new moons)
// Format matches the start of the lunar month.
const LUNAR_ANCHORS_2026 = [
    { start: '2025-12-20', monthName: '十一月' }, // Late 2025 (Snake)
    { start: '2026-01-19', monthName: '臘月' },   // 12th Month (Snake)
    { start: '2026-02-17', monthName: '正月' },   // 1st Month (Horse) - CNY
    { start: '2026-03-19', monthName: '二月' },
    { start: '2026-04-17', monthName: '三月' },
    { start: '2026-05-17', monthName: '四月' },
    { start: '2026-06-15', monthName: '五月' },
    { start: '2026-07-14', monthName: '六月' },
    { start: '2026-08-13', monthName: '七月' },
    { start: '2026-09-11', monthName: '八月' },
    { start: '2026-10-10', monthName: '九月' },
    { start: '2026-11-09', monthName: '十月' },
    { start: '2026-12-08', monthName: '十一月' }
];

const CHINESE_NUMS = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// 10 Themes Configuration
const THEMES = [
    { id: 'default', name: '預設午夜 (Midnight)', color: '#818cf8' },
    { id: 'sunset', name: '日落暖陽 (Sunset)', color: '#fb923c' },
    { id: 'forest', name: '迷霧森林 (Forest)', color: '#34d399' },
    { id: 'ocean', name: '深海湛藍 (Ocean)', color: '#38bdf8' },
    { id: 'sakura', name: '粉嫩櫻花 (Sakura)', color: '#fca5a5' },
    { id: 'lavender', name: '夢幻紫羅蘭 (Lavender)', color: '#c084fc' },
    { id: 'cyberpunk', name: '賽博龐克 (Cyberpunk)', color: '#22d3ee' },
    { id: 'coffee', name: '濃醇咖啡 (Coffee)', color: '#d4a373' },
    { id: 'bordeaux', name: '波爾多紅 (Bordeaux)', color: '#fecaca' },
    { id: 'sky', name: '清澈天空 (Sky)', color: '#5eead4' },
    { id: 'monochrome', name: '極簡黑白 (Monochrome)', color: '#e4e4e7' }
];

// --- 2. Application Logic ---

class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.schedules = this.loadSchedules();
        this.selectedDate = null; // YYYY-MM-DD
        this.editingId = null;
        this.currentTheme = localStorage.getItem('calendar_2026_theme') || 'default';

        // Initialize Year check
        if (this.currentDate.getFullYear() !== 2026) {
            this.currentDate = new Date(2026, 0, 1);
        }

        this.applyTheme(this.currentTheme);
        this.initDOM();
        this.initThemeUI(); // New method for theme UI
        this.initEvents();
        this.render();
    }

    initDOM() {
        this.dom = {
            prevBtn: document.getElementById('prev-month-btn'),
            nextBtn: document.getElementById('next-month-btn'),
            monthSelect: document.getElementById('month-select'),
            displayYear: document.getElementById('current-year-display'),
            calendarGrid: document.getElementById('calendar-days'),
            modal: document.getElementById('schedule-modal'),
            closeModalBtn: document.getElementById('close-modal-btn'),
            modalTitle: document.getElementById('modal-date-title'),
            scheduleList: document.getElementById('schedule-list'),
            form: document.getElementById('schedule-form'),
            inputTime: document.getElementById('event-time'),
            inputTitle: document.getElementById('event-title'),
            inputDesc: document.getElementById('event-desc'),
            saveBtn: document.getElementById('save-btn'),
            deleteBtn: document.getElementById('delete-btn'),
            editIdInput: document.getElementById('edit-id'),
            // Theme DOM
            themeBtn: document.getElementById('theme-btn'),
            themeModal: document.getElementById('theme-modal'),
            themeList: document.getElementById('theme-list'),
            // Delete Confirm Modal
            confirmModal: document.getElementById('confirm-modal'),
            cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
            confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
            cancelEditBtn: document.getElementById('cancel-edit-btn')
        };

        // Populate Month Select
        for (let i = 0; i < 12; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `${i + 1}月`;
            this.dom.monthSelect.appendChild(opt);
        }
    }

    initThemeUI() {
        // Render theme options
        this.dom.themeList.innerHTML = '';
        THEMES.forEach(theme => {
            const btn = document.createElement('button');
            btn.className = `theme-option ${this.currentTheme === theme.id ? 'active' : ''}`;
            btn.innerHTML = `
                <span class="theme-preview" style="background-color: ${theme.color}"></span>
                <span>${theme.name}</span>
            `;
            btn.addEventListener('click', () => {
                this.applyTheme(theme.id);
                this.dom.themeModal.classList.add('hidden');
                // Update active state
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            this.dom.themeList.appendChild(btn);
        });
    }

    applyTheme(themeId) {
        this.currentTheme = themeId;
        localStorage.setItem('calendar_2026_theme', themeId);

        if (themeId === 'default') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', themeId);
        }
    }

    initEvents() {
        // Navigation
        this.dom.prevBtn.addEventListener('click', () => this.changeMonth(-1));
        this.dom.nextBtn.addEventListener('click', () => this.changeMonth(1));
        this.dom.monthSelect.addEventListener('change', (e) => {
            this.currentDate.setMonth(parseInt(e.target.value));
            this.render();
        });

        // Theme Modal Toggle
        this.dom.themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dom.themeModal.classList.toggle('hidden');
        });

        // Close theme modal when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.dom.themeWrapper?.contains(e.target) && !this.dom.themeModal.contains(e.target) && e.target !== this.dom.themeBtn) {
                this.dom.themeModal.classList.add('hidden');
            }
        });

        // Modal Styling (Close on click outside)
        this.dom.modal.addEventListener('click', (e) => {
            if (e.target === this.dom.modal) this.closeModal();
        });
        this.dom.closeModalBtn.addEventListener('click', () => this.closeModal());

        // Form Submit
        this.dom.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Delete Button (Opens Confirm Modal)
        this.dom.deleteBtn.addEventListener('click', () => {
            this.dom.confirmModal.classList.remove('hidden');
        });

        // Cancel Edit Button
        this.dom.cancelEditBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Confirm Delete Actions
        this.dom.cancelDeleteBtn.addEventListener('click', () => {
            this.dom.confirmModal.classList.add('hidden');
        });

        this.dom.confirmDeleteBtn.addEventListener('click', () => {
            this.executeDelete();
            this.dom.confirmModal.classList.add('hidden');
        });
    }

    // --- Core Rendering ---

    // ... (This section render method is unchanged, skipping for brevity in replacement but in real file it is preserved if not matched)
    // Wait, the tool requires contiguous replacement. I should be careful not to overwrite render.
    // I will target up to initEvents end.

    // Actually, I can just replace handleDelete and rewrite initEvents/initDOM parts.
    // But they are spread out.
    // I'll replace from initDOM start to handleDelete end? No that's too much.
    // I'll use multi_replace.

    // wait, I must use single replacement if I can.
    // Let's replace from initDOM to initEvents end.

    // No, wait. The user only wants to change handleDelete to use modal.
    // I need to:
    // 1. Update initDOM to get new modal elements. (Lines 110-115)
    // 2. Update initEvents to attach listeners to new modal parts. (Lines 189-191)
    // 3. Update handleDelete to executeDelete. (Lines 434-443)

    // Let's do it in one big block if possible, or use multi_replace. 
    // I will use multi_replace_file_content since I need to touch initDOM, initEvents, and handleDelete.


    // --- Core Rendering ---

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth(); // 0-indexed

        // Update Headers
        this.dom.displayYear.textContent = year;
        this.dom.monthSelect.value = month;

        // Clear Grid
        this.dom.calendarGrid.innerHTML = '';

        // Calculate Calendar Days
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

        // Padding Days (Previous Month)
        for (let i = 0; i < startDayOfWeek; i++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell empty';
            this.dom.calendarGrid.appendChild(cell);
        }

        // Actual Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = this.formatDateKey(dateObj); // YYYY-MM-DD

            const cell = document.createElement('div');
            cell.className = 'day-cell';

            // Check Today (Real time check)
            const realToday = new Date();
            if (year === realToday.getFullYear() &&
                month === realToday.getMonth() &&
                day === realToday.getDate()) {
                cell.classList.add('is-today');
            }

            // Check Holiday
            const holiday = this.getHoliday(dateStr);
            if (holiday) {
                cell.classList.add('is-holiday');
            }

            // Lunar Date
            const lunarText = this.getLunarDateText(dateObj);

            // Events display (Titles instead of dots)
            const dayEvents = this.schedules.filter(s => s.date === dateStr);

            // Limit shown events to avoid overflow (e.g., max 3)
            const MAX_EVENTS_SHOWN = 3;
            const shownEvents = dayEvents.slice(0, MAX_EVENTS_SHOWN);
            const hiddenCount = dayEvents.length - MAX_EVENTS_SHOWN;

            let eventsHTML = shownEvents.map(ev => `
                <div class="event-title-display" title="${ev.time} ${ev.title}">
                    ${ev.title}
                </div>
            `).join('');

            if (hiddenCount > 0) {
                eventsHTML += `<div style="font-size:0.7rem; color:var(--text-muted); padding-left:4px;">+${hiddenCount} 接續...</div>`;
            }

            // Construct HTML
            cell.innerHTML = `
                <div class="day-header-row">
                    <span class="solar-date">${day}</span>
                    <span class="lunar-date">${lunarText}</span>
                </div>
                ${holiday ? `<div class="holiday-name">${holiday.Subject}</div>` : ''}
                ${eventsHTML}
            `;

            cell.addEventListener('click', () => this.openModal(dateStr, dayEvents));
            this.dom.calendarGrid.appendChild(cell);
        }
    }

    // --- Helpers ---

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.render();
    }

    formatDateKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    getHoliday(dateStr) {
        // holidays source uses YYYY/M/D or YYYY/MM/DD, need normalization
        // My dateStr is YYYY-MM-DD
        const formattedForSource = dateStr.replace(/-/g, '/').replace(/\/0/g, '/'); // simple strip
        // Or better: parse holiday source to standard YYYY-MM-DD

        return HOLIDAYS.find(h => {
            const hDate = new Date(h['Start Date']);
            return this.formatDateKey(hDate) === dateStr;
        });
    }

    getLunarDateText(solarDate) {
        const solarStr = this.formatDateKey(solarDate);
        const solarTime = solarDate.getTime();

        // 1. Find the lunar month this date belongs to
        // We search backwards from the last anchor
        let anchor = null;
        for (let i = LUNAR_ANCHORS_2026.length - 1; i >= 0; i--) {
            const aDate = new Date(LUNAR_ANCHORS_2026[i].start);
            if (solarTime >= aDate.getTime()) {
                anchor = LUNAR_ANCHORS_2026[i];
                break;
            }
        }

        if (!anchor) return ''; // Out of range

        const anchorDate = new Date(anchor.start);
        const diffTime = Math.abs(solarTime - anchorDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Lunar Day 1 is index 0 in diffDays? No.
        // If solarDate == anchorDate, diffDays = 0. That is Day 1.
        // So day index = diffDays.

        if (diffDays === 0) return `${anchor.monthName}`; // Show Month Name on Day 1

        return CHINESE_NUMS[diffDays] || '??';
    }

    // --- Schedule Manager ---

    loadSchedules() {
        const db = localStorage.getItem('calendar_2026_events');
        return db ? JSON.parse(db) : [];
    }

    saveSchedules() {
        localStorage.setItem('calendar_2026_events', JSON.stringify(this.schedules));
        this.render(); // Re-render markers
        this.renderScheduleList(); // Refresh list in modal
    }

    // --- Modal & Form ---

    openModal(dateStr, events) {
        this.selectedDate = dateStr;
        this.dom.modal.classList.remove('hidden');

        // Title formatting
        const [y, m, d] = dateStr.split('-');
        this.dom.modalTitle.textContent = `${y}年${parseInt(m)}月${parseInt(d)}日`;

        // Render List
        this.renderScheduleList();

        // Reset Form
        this.resetForm();
    }

    closeModal() {
        this.dom.modal.classList.add('hidden');
        this.selectedDate = null;
    }

    renderScheduleList() {
        if (!this.selectedDate) return;
        const events = this.schedules.filter(s => s.date === this.selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time));

        this.dom.scheduleList.innerHTML = '';

        if (events.length === 0) {
            this.dom.scheduleList.innerHTML = '<p style="color:var(--text-muted); text-align:center;">尚無行程</p>';
            return;
        }

        events.forEach(ev => {
            const el = document.createElement('div');
            el.className = 'schedule-item';
            el.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <span class="item-time">${ev.time}</span>
                    <span class="item-title">${ev.title}</span>
                </div>
                <div style="font-size:0.8rem; color: #94a3b8;">✎</div>
            `;
            el.addEventListener('click', () => this.loadEventIntoForm(ev));
            this.dom.scheduleList.appendChild(el);
        });
    }

    loadEventIntoForm(ev) {
        this.dom.inputTitle.value = ev.title;
        this.dom.inputTime.value = ev.time;
        this.dom.inputDesc.value = ev.desc || '';
        this.dom.editIdInput.value = ev.id;
        this.dom.deleteBtn.classList.remove('hidden');
        this.dom.cancelEditBtn.classList.remove('hidden'); // Show Cancel
        this.dom.saveBtn.textContent = '更新';
    }

    resetForm() {
        this.dom.form.reset();
        this.dom.editIdInput.value = '';
        this.dom.deleteBtn.classList.add('hidden');
        this.dom.cancelEditBtn.classList.add('hidden'); // Hide Cancel
        this.dom.saveBtn.textContent = '新增';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const id = this.dom.editIdInput.value;
        const newEvent = {
            id: id || Date.now().toString(),
            date: this.selectedDate,
            time: this.dom.inputTime.value,
            title: this.dom.inputTitle.value,
            desc: this.dom.inputDesc.value
        };

        if (id) {
            // Edit
            const idx = this.schedules.findIndex(s => s.id === id);
            if (idx !== -1) this.schedules[idx] = newEvent;
        } else {
            // Create
            this.schedules.push(newEvent);
        }

        this.saveSchedules();
        this.resetForm();
    }

    handleDelete() {
        // Now handled by modal open in initEvents
    }

    executeDelete() {
        const id = this.dom.editIdInput.value;
        if (!id) return;

        this.schedules = this.schedules.filter(s => s.id !== id);
        this.saveSchedules();
        this.resetForm();
        this.closeModal(); // Close the main schedule modal too
    }
}

// Start App
document.addEventListener('DOMContentLoaded', () => {
    new CalendarApp();
});
