# 🌐 Domain Authority & Spam Score Checker Extension

A lightweight Chrome extension that instantly displays **Domain Authority (DA)** and **Spam Score** for any website — right on your browser toolbar.

---

## 🚀 Features

- ✅ **DA badge** displayed on the extension icon  
- 📊 **Popup interface** with detailed SEO metrics  
- 🌐 **Auto-detects active domain**  
- ⚡ **Smart caching** for better performance  
- 🎨 Sleek, responsive UI — works in light and dark themes  
- 🔐 No login or API key required

---

## 📦 Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** in the top right corner
3. Click **Load unpacked**
4. Select the folder containing the extension files
5. That’s it! You’ll now see the 🐌 icon in your browser

---

## 🧠 How to Use

1. Visit any website
2. The extension icon will show the **DA score** as a badge
3. Click the icon to open the popup and see **Spam Score** and other info
4. Hit **Refresh** to get real-time updates

---

## 📁 File Structure

| File/Folder      | Description                           |
|------------------|---------------------------------------|
| `manifest.json`  | Chrome extension configuration        |
| `background.js`  | Handles background API requests       |
| `content.js`     | (Optional) Page interaction script    |
| `popup.html`     | UI for the extension popup            |
| `popup.js`       | JavaScript for the popup logic        |
| `icons/`         | Folder for all icon sizes             |

---

## 📝 Notes

- This extension fetches SEO data using the [Keyword Everywhere API](https://keywordseverywhere.com/)
- Built specifically for **Chrome**. May require edits for other browsers
- If DA or Spam Score is unavailable, it will gracefully show a fallback symbol

---

## 🙏 Credits

- 📊 **Data Provider**: [Keyword Everywhere](https://keywordseverywhere.com/)  
- 👨‍💻 **Developer**: [Rizwan](https://github.com/rizwanwebdev)  
- 🌐 **Portfolio**: [rizwanweb.site](https://rizwanweb.site)

---

## ⭐ Stay Connected

If you found this useful, consider starring the repo or sharing it:

[GitHub Repository](https://github.com/rizwanwebdev/domain-authority-checker)
