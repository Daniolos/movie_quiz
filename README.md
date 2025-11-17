# 🎬 Movie Quiz

An interactive web-based movie quiz game powered by AI-generated images and movie data from TMDb. Test your movie knowledge with visual clues, keywords, and descriptions!

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)

## ✨ Features

- **AI-Generated Images**: Powered by Google's Gemini 2.5 Flash Image (Nano Banana) for unique visual clues
- **Progressive Hints**: Keywords reveal one by one to help you guess the movie
- **Customizable Experience**: Adjust difficulty, typing effects, image generation, and more
- **Modern UI**: Beautiful dark mode interface with glassmorphism and smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Local Storage**: All settings and API keys are stored locally in your browser
- **70+ Curated Movies**: Hand-picked collection from popular franchises (Marvel, Star Wars, Harry Potter, etc.)

## 🚀 Quick Start

### Prerequisites

You'll need API keys for:
1. **TMDb API** (free) - Get it from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. **Google Gemini API** (for image generation) - Get it from [https://ai.google.dev/](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie_quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

5. **Configure API Keys**
   - Go to Settings page
   - Enter your TMDb API key
   - Enter your Gemini API key
   - Click "Test Connection" to validate
   - Save settings

6. **Start Playing!**
   Click "Start Quiz" on the home page

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server
- **Tailwind CSS 4.1** - Styling
- **Framer Motion 12** - Animations

### State Management & Data
- **Zustand 5** - Lightweight state management
- **Axios 1.13** - HTTP client
- **React Router 7** - Routing

### APIs
- **TMDb API** - Movie data (titles, descriptions, keywords, ratings)
- **Google Gemini API** - AI image generation

## 📁 Project Structure

```
movie_quiz/
├── src/
│   ├── components/
│   │   ├── quiz/              # Quiz-specific components
│   │   │   ├── ImagePhase.tsx
│   │   │   ├── KeywordPhase.tsx
│   │   │   ├── DescriptionPhase.tsx
│   │   │   └── TitleReveal.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Container.tsx
│   │   ├── shared/            # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── TypingText.tsx
│   │   └── settings/          # Settings components
│   ├── pages/
│   │   ├── HomePage.tsx       # Landing page
│   │   ├── QuizPage.tsx       # Main quiz game
│   │   ├── SettingsPage.tsx   # API configuration
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── movieService.ts    # TMDb API integration
│   │   ├── geminiService.ts   # Gemini image API
│   │   └── storageService.ts  # LocalStorage management
│   ├── stores/
│   │   ├── settingsStore.ts   # Settings state (Zustand)
│   │   ├── quizStore.ts       # Quiz state (Zustand)
│   │   └── uiStore.ts         # UI state (Zustand)
│   ├── types/                 # TypeScript type definitions
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions & constants
│   ├── routes/                # Route configuration
│   └── styles/                # Global CSS
├── public/                    # Static assets
├── dist/                      # Production build (generated)
└── index.html                 # Entry HTML file
```

## 🎮 How to Play

1. **Image Phase**: Study an AI-generated image related to the movie
2. **Keyword Phase**: Keywords reveal progressively (up to 10-20 based on settings)
3. **Description Phase**: Read the full movie plot description
4. **Title Reveal**: The answer is revealed with movie poster and details!

## ⚙️ Configuration

### Game Preferences (Settings Page)

- **Maximum Keywords**: 5-20 (default: 10)
- **Typing Speed**: 20-200 chars/sec (default: 80)
- **Enable AI Images**: Toggle AI-generated images on/off
- **Enable Typing Effect**: Toggle typewriter animation
- **Auto-advance**: Skip manual "Enter" key presses

### API Cost Estimation

Per game (with images enabled):
- **TMDb API**: Free
- **Gemini Image Generation**:
  - Main movie image: $0.039
  - Description image: $0.039
  - **Total**: ~$0.08 per game

To reduce costs, disable image generation in Settings.

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css   (~20 KB)
│   └── index-[hash].js    (~407 KB)
```

## 🎨 Customization

### Adding More Movies

Edit `src/utils/constants.ts`:

```typescript
export const CURATED_MOVIES = {
  'Your Movie Title': 12345, // TMDb movie ID
  // Add more...
};
```

Find TMDb IDs at [https://www.themoviedb.org/](https://www.themoviedb.org/)

### Styling

- Global styles: `src/styles/globals.css`
- Tailwind config: `tailwind.config.js`
- Custom classes: `.glass`, `.glass-dark`, `.gradient-text`

## 🐛 Troubleshooting

### API Key Validation Fails
- Ensure API keys are correct (no extra spaces)
- Check internet connection
- Verify API quotas haven't been exceeded

### Images Not Generating
- Verify Gemini API key is valid
- Check that "Enable AI Images" is toggled ON in Settings
- Try reducing image quality in Settings

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📄 License

ISC

## 🙏 Acknowledgments

- **TMDb** for providing comprehensive movie data
- **Google Gemini** for AI image generation
- **Vite** for blazing-fast development experience
- Original Python CLI version for inspiration

## 🔮 Future Enhancements

- [ ] Multiplayer mode
- [ ] Leaderboard and score tracking
- [ ] Difficulty levels (easy/medium/hard)
- [ ] Genre filtering
- [ ] Custom movie lists
- [ ] Share results on social media
- [ ] Guess input with fuzzy matching
- [ ] Hint system (year, actors, director)

---

**Built with ❤️ using React + TypeScript + Vite**

*Migrated from Python CLI to modern React web app (v2.0.0)*
