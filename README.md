# Dhikr Reminder 🌙

A beautiful Chrome extension that displays Islamic dhikr (remembrance) reminders throughout your day. Get gentle reminders with beautiful Arabic text and English translations from the Quran and Hadith, helping you maintain mindfulness and spiritual connection while browsing.

## ✨ Features

- **Beautiful Modal Design**: Large, readable Arabic text with elegant English translations
- **Customizable Intervals**: Choose how often reminders appear (every 10 minutes to every 12 hours)
- **Configurable Duration**: Set how long each reminder stays visible (in seconds)
- **Real-time Quranic Verses**: Fetches random verses from the Quran API with fallback to curated dhikr
- **Multi-tab Support**: Reminders appear on all your open tabs
- **Easy Controls**: Start, stop, or change settings anytime with a simple popup interface
- **Persistent Scheduling**: Uses browser alarms API for reliable reminders across browser sessions

## 🎯 How It Works

1. **Configure Your Preferences**: Open the extension popup and set your desired reminder frequency and display duration
2. **Start Reminders**: Click "Start Dhikr Reminders" to begin receiving gentle reminders
3. **Receive Reminders**: Beautiful modals will appear on your active tabs at the intervals you've set
4. **Manage Settings**: Easily update your settings or stop reminders at any time

## 🚀 Installation

### Development Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd akir
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Build the extension:
```bash
yarn build
# or
npm run build
```

4. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

### Development Mode

Run the extension in development mode with hot reload:
```bash
yarn dev
# or
npm run dev
```

## 📖 Usage

1. Click the extension icon in your browser toolbar
2. Choose your reminder frequency (e.g., "Every 1 hour")
3. Set the duration in seconds (how long each modal should stay visible)
4. Click "Start Dhikr Reminders" to begin
5. Reminders will appear automatically on all your open tabs

**Available Actions:**
- **Test Modal**: See how the reminder looks before starting
- **Change Settings**: Update your preferences while reminders are active
- **Stop**: Completely stop all reminders

## 🛠️ Tech Stack

- **Framework**: [WXT](https://wxt.dev/) - Next-generation web extension framework
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: [Al Quran Cloud API](https://alquran.cloud/api) for fetching Quranic verses
- **Storage**: Browser Storage API for persistent settings
- **Scheduling**: Browser Alarms API for reliable reminders

## 📁 Project Structure

```
akir/
├── entrypoints/
│   ├── popup/           # Extension popup UI
│   │   ├── dhikr-settings.tsx
│   │   └── App.tsx
│   ├── content/         # Content script for modal injection
│   │   ├── DhikrModal.tsx
│   │   └── index.tsx
│   └── background.ts    # Background script for scheduling
├── components/          # Reusable UI components
└── wxt.config.ts        # WXT configuration
```

## 🎨 Design

The extension features a clean, modern design with:
- Large, readable Arabic text using traditional Arabic fonts
- Elegant English translations
- Smooth animations and transitions
- Responsive modal that works on all screen sizes
- Beautiful blue color scheme with excellent contrast

## 🔧 Configuration

Customize reminder intervals from:
- Every 10 minutes
- Every 30 minutes
- Every 1 hour
- Every 2, 3, 4, 6, 8, or 12 hours

Each reminder displays for a configurable duration (default: 10 seconds).

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

---

Made with ❤️ for spiritual mindfulness and daily remembrance.
