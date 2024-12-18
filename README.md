# Video Captioning App - Local Setup Guide

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (version 14.0.0 or later)
- npm (Node Package Manager, comes with Node.js)
- Git (optional, but recommended)

## Setup Instructions

### 1. Clone the Repository
```bash
# If using HTTPS
git clone https://github.com/your-username/video-captioning-app.git

# Or if using SSH
git clone git@github.com:your-username/video-captioning-app.git

# Navigate to the project directory
cd video-captioning-app
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using Yarn (if you prefer)
yarn install
```

### 3. Start the Development Server
```bash
# Using npm
npm start

# Or using Yarn
yarn start
```

## Recommended Development Environment
- Visual Studio Code
- React Developer Tools Chrome Extension
- Tailwind CSS IntelliSense (if using VS Code)

## Troubleshooting

### Common Issues
1. **Dependency Conflicts**
   - Delete `node_modules` folder
   - Run `npm cache clean --force`
   - Reinstall dependencies with `npm install`

2. **Port Already in Use**
   - Default React development server runs on port 3000
   - If port is busy, you can specify an alternative:
     ```bash
     PORT=3001 npm start
     ```

## Additional Configuration

### Environment Variables
Create a `.env` file in the project root for any environment-specific configurations:
```
REACT_APP_VIDEO_API_URL=https://your-video-api.com
```

### Tailwind CSS (if not already configured)
1. Install Tailwind:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Configure `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Deployment Considerations
- Build for production: `npm run build`
- Produces optimized static files in `build/` directory

## Recommended Next Steps
1. Test video URL input
2. Try adding/editing captions
3. Export and import caption files
4. Verify responsive design on different devices

## Support
- Check project's GitHub issues for known problems
- Create a new issue for any unexpected behavior
