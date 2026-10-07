# Gladys Evangeline & Vikash Varma — Digital Wedding Invitation

A polished, luxury, mobile-first Christian wedding invitation website designed for public sharing via WhatsApp and social media.

Inspired by physical luxury stationery, featuring warm ivory cotton paper textures, blush pink and dusty rose peonies, deep burgundy typography, and antique gold foil accents.

---

## ✨ Features

- **Envelope Opening Experience**: An immersive physical-stationery-inspired opening screen with an antique gold "G & V" wax seal, delicate cross emblem, and cinematic 3D unfold transition upon tapping **"OPEN INVITATION"**.
- **Official Family Voice**: Written with dignity and warmth on behalf of the family and wedding organizers.
- **Visual Language of Traditional Stationery**:
  - Warm cream/ivory handmade cotton paper background with fine fiber texture.
  - Botanical floral framing with blush pink peonies, dusty rose blooms, and eucalyptus.
  - Symmetrical antique gold corner filigree and flourishing line dividers.
  - Geometric gold wireframe centerpiece enclosing the bride and groom's names in calligraphy script.
- **Both Ceremonies Highlighted**:
  - **Betrothal Ceremony**: Friday, 16 October 2026 at 7:00 PM (Community Hall, Cantonment Baptist Church). Dinner follows.
  - **Wedding Ceremony (The Holy Matrimony)**: Saturday, 17 October 2026 at 10:00 AM (Cantonment Baptist Church). Lunch follows.
- **Add to Calendar**: One-click Google Calendar integration and RFC 5545 `.ics` file generation for Apple Calendar (iPhone/Mac) and Microsoft Outlook.
- **Special Guests Section**: Formal stationery presentation for Guest of Honour (**Sis. Shantha Kumari Mondithoka**) and Chief Guest (**Rev. Dr. M. Vijaya Kumar**).
- **Scripture Verses Tastefully Placed**:
  - *Proverbs 31:25*: “She is clothed with strength and dignity; she can laugh at the days to come.”
  - *Psalms 145:9*: “The Lord is good to everyone. He showers compassion on all his creation.”
- **Background Worship Music**:
  - Featured Song: *"Goodness of God"* by Bethel Music ft. Jenn Johnson.
  - YouTube IFrame API integration with floating vinyl disc and waveform toggle.
  - Zero autoplay on initial load (strictly respects mobile autoplay policies).
  - Graceful Web Audio API fallback (synthesizes gentle romantic worship chords if YouTube is blocked or offline).
- **Venue & Google Maps**: Cantonment Baptist Church, Vizianagaram with embedded map preview and direct Google Maps navigation button.
- **Live Countdown Timer**: Real-time counter to October 17, 2026, 10:00 AM IST.
- **WhatsApp Sharing & Copy Link**: Instant WhatsApp sharing with pre-formatted invitation message.
- **Accessibility & Performance**:
  - Lightweight vanilla HTML5, CSS3, and JavaScript (zero heavy frameworks).
  - Respects `prefers-reduced-motion: reduce`.
  - 100% responsive and mobile-first.

---

## 📁 Project Structure

```
wedding-invitation/
├── index.html                   # Main semantic HTML structure
├── README.md                    # Documentation & GitHub Pages guide
├── css/
│   ├── style.css                # Color variables, typography, baseline
│   ├── components.css           # Envelope, ceremony cards, venue, music pill
│   └── animations.css           # Keyframes, scroll reveals, reduced-motion
├── js/
│   ├── config.js                # Centralized event data & settings
│   ├── app.js                   # Application controller & calendar generators
│   └── audio-fallback.js        # Web Audio API backup music synthesizer
└── assets/
    ├── images/                  # Peonies, wax seal, geometric frame, paper
    └── icons/                   # Antique gold SVGs (cross, dividers, corners)
```

---

## ⚙️ How to Customize

All event information, dates, names, scripture, venue URLs, and music are organized inside `js/config.js`:

```javascript
const WEDDING_CONFIG = {
  couple: {
    bride: "Gladys Evangeline",
    groom: "Vikash Varma",
    ...
  },
  events: {
    betrothal: { ... },
    wedding: { ... }
  },
  venue: {
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=..."
  },
  music: {
    youtubeVideoId: "n0FBb6hnwTo" // Bethel Music - Goodness of God
  }
};
```

Simply update values in `js/config.js` and save!

---

## 🚀 How to Deploy on GitHub Pages

1. Push this folder to a GitHub repository (e.g. `wedding-invitation`).
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and `/ (root)` directory.
4. Click **Save**.
5. Your wedding invitation will be live at:
   `https://<your-username>.github.io/<repository-name>/`
