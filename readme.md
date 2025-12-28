# 好用的2026年月曆 (Pure Frontend Calendar) 📅

一個專注於 **2026年** 的互動式月曆網頁應用，採用純 HTML/CSS/Vanilla JS 開發，無任何外部相依套件。結合現代化 **Glassmorphism (玻璃擬態)** 設計風格與實用的個人行程管理功能。

## 🎯 專案特色

### 1. 2026 專屬行事曆
*   系統預設鎖定 **2026 年**，自動校正初始日期。
*   內建完整 **2026 年台灣國定假日** 資料（春節、二二八、中秋等），並以紅字顯眼標示。
*   提供該年度專屬的 **農曆日期對照** 功能。

### 2. 🎨 10 款精美主題切換
*   提供 **10 種** 精心調配的色彩主題，滿足不同使用者的喜好：
    *   🌌 **午夜 (Midnight)** - 預設深藍質感
    *   🌅 **日落 (Sunset)** - 溫暖橘紅漸層
    *   🌲 **森林 (Forest)** - 清新深綠風格
    *   🌊 **深海 (Ocean)** - 湛藍寧靜氛圍
    *   🌸 **櫻花 (Sakura)** - 粉嫩柔和色系
    *   🟣 **紫羅蘭 (Lavender)** - 夢幻紫色調
    *   🤖 **賽博龐克 (Cyberpunk)** - 霓虹科技感
    *   ☕ **咖啡 (Coffee)** - 沉穩大地色系
    *   🍷 **波爾多 (Bordeaux)** - 成熟酒紅風格
    *   ⚫ **極簡 (Monochrome)** - 經典黑白灰
*   **自動記憶**：瀏覽器會自動記住您上次選擇的主題。

### 3. 📝 聰明的行程管理
*   **直覺操作**：點擊任一日期格子即可新增、編輯或瀏覽行程。
*   **美觀顯示**：行程標題直接顯示於月曆格中，並套用主題強調色。
*   **資料持久化**：使用 `LocalStorage` 技術，資料儲存於瀏覽器端，關閉視窗後資料**不會消失**。
*   **編輯功能**：支援資料更新、取消編輯、以及具備防呆機制的刪除確認。

### 4. 💎 極致 UI/UX 體驗
*   **Pure CSS Glassmorphism**：全站採用毛玻璃特效，背景模糊與半透明層次感。
*   **響應式設計 (RWD)**：完美支援桌機、平板與手機介面。
*   **自定義彈窗 (Custom Modals)**：捨棄醜陋的系統預設 `confirm` 視窗，全面採用風格統一的自製模態視窗。
*   **友善互動**：按鈕懸浮特效、月份平滑切換、清楚的輸入提示。

## 📂 檔案結構

```text
/calendar-2026
 ├─ index.html   # 網頁主結構 (語意化 HTML5)
 ├─ style.css    # 核心樣式 (CSS Variables, Flex/Grid, RWD)
 └─ script.js    # 核心邏輯 (Holiday/Lunar Data, DOM Manipulation, LocalStorage)
```

## 🚀 如何使用

1.  **下載/Clone** 本專案資料夾。
2.  直接雙擊 **`index.html`**，使用任一現代瀏覽器 (Chrome, Edge, Firefox, Safari) 開啟即可。
3.  無需安裝任何伺服器或 Node.js 環境，隨開隨用！

## 🛠 技術棧 (Tech Stack)

*   **HTML5** - 語意化標籤，結構清晰。
*   **CSS3** - 使用 CSS Variables 進行主題管理，Flexbox/Grid 進行排版，無使用 Tailwind 或 Bootstrap。
*   **Vanilla JavaScript (ES6+)** - 原生 JS 實作所有邏輯，無 React/Vue/jQuery 依賴。

---
*Created by Antigravity for VibeCoding Project 2026*
