# 🌍 GeoKeys ⌨️

**Where Geography Meets Typography!**

Transform your typing skills while exploring the United States, one city at a time. 

## 🎮 Play Now!

<p align="center">
  <a href="https://geokeys.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🎮%20Play%20GeoKeys-Live%20Game-blue?style=for-the-badge&color=4F46E5" alt="Play GeoKeys"/>
  </a>
</p>

<p align="center">
  <strong>🌐 <a href="https://geokeys.vercel.app">https://geokeys.vercel.app</a></strong>
</p>

<p align="center">
  <img src="img/02.png" alt="Screenshot" width="600"/>
</p>

## 🎯 What is GeoKeys?

GeoKeys presents you with U.S. cities and challenges you to type the correct state as fast as possible. Watch the responsive QWERTY keyboard light up with every keystroke as you race against the clock.

## ✨ Features

🗺️ **Geography Challenge** - Test your knowledge of U.S. cities and their states  
⌨️ **Visual Keyboard** - Watch keys light up as you type with our gorgeous QWERTY display  
⏱️ **Speed Training** - Race against time to improve both accuracy and speed  
🎮 **Game Mechanics** - Score points, track progress, and climb the leaderboard  
📊 **Performance Stats** - See your typing speed, accuracy, and geography knowledge improve  
🏆 **Leaderboard** - Compete with others for the ultimate GeoKeys champion title  

## 🚀 How to Play

1. **See the City** - A U.S. city name appears with its county
2. **Start Typing** - Begin typing the state name and watch the keyboard light up
3. **Auto-Complete Magic** - The game helps you when you're on the right track
4. **Beat the Clock** - Answer as quickly as possible for maximum points
5. **Climb the Ranks** - Submit your score and see how you stack up!

## 🛠️ Tech Stack

**Frontend:**
- React with modern hooks
- Tailwind CSS
- Real-time keyboard visualization

**Backend:**
- Vercel Serverless Functions (Python)
- Static JSON data (173k+ US cities)
- Edge-deployed API endpoints
- Browser localStorage for personal leaderboards

## 🏁 Local Development

<p align="center">
  <img src="img/game_play.gif" alt="Screenshot" width="600"/>
</p>

### Prerequisites
- Node.js (v16+)
- Git

### Local Setup

```bash
# Clone the repository
git clone https://github.com/whileseated/geokeys.git
cd geokeys

# Install dependencies and run locally
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` 

**Note:** The live game runs on Vercel with serverless functions. For full local testing with API functions, use `npx vercel dev`. 

## 📈 Why GeoKeys?

- **Learn While You Play** - Absorb U.S. geography knowledge naturally
- **Improve Typing Skills** - Build muscle memory and increase WPM
- **Visual Feedback** - See exactly which keys you're pressing
- **Gamification** - Points, timers, and leaderboards keep you engaged
- **Data-Driven** - Track your improvement over time

## 🚀 Deployment

This app is deployed on [Vercel](https://vercel.com) using:
- Serverless Functions for the API
- Static hosting for the React frontend  
- Edge CDN for global performance
- Zero-config deployment from GitHub

---

**Made with ❤️ for geography lovers and typing enthusiasts everywhere**

**🎮 [Play GeoKeys Now](https://geokeys.vercel.app) | 🐙 [View Source](https://github.com/whileseated/geokeys)**