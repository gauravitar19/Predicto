# Cricket-O-Meter

A sophisticated cricket match prediction tool powered by AI and real-time data. This application provides accurate match outcome predictions based on team statistics, weather conditions, venue details, and real-time match data.

## Features

- **Real-time Cricket Updates**: Stay informed with live scores, upcoming matches, and match results
- **Advanced Prediction Model**: Uses multiple factors including team stats, pitch conditions, and weather
- **Real-time Data Integration**: Enhances prediction accuracy with live match data from Cricket Data API
- **AI-Powered Analysis**: Optional AI sentiment analysis for improved predictions
- **Interactive UI**: Modern, user-friendly interface with real-time updates
- **Detailed Results**: Comprehensive breakdown of factors influencing the prediction

## Installation

```sh
# Install dependencies
npm install

# Create .env file (based on .env.example)
# Add your Cricket Data API key
VITE_CRICKET_API_KEY=your_api_key_here

# Start the development server
npm run dev
```

## API Key Setup

1. Register for an API key at [Cricket Data](https://cricketdata.org/)
2. Create a `.env` file in the project root
3. Add your API key as shown in the example above

## Technologies Used

- React
- TypeScript
- Vite
- TanStack Query (React Query)
- Tailwind CSS
- Shadcn/UI
- Framer Motion

## Usage

1. View live cricket matches in the "Cricket Updates" section
2. Select a match for prediction or manually enter match details
3. Adjust team statistics as needed
4. Enable AI analysis for enhanced predictions (optional)
5. Submit to receive detailed prediction results

## Credits

This project uses the Cricket Data API for real-time cricket information.
