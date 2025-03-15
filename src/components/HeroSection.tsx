
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Zap, Trophy, Activity } from 'lucide-react';

interface HeroSectionProps {
  onScrollToForm: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToForm }) => {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center relative px-4 py-12 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptMTIgMTJjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTZjLTMuMzE0IDAtNiAyLjY4Ni02IDZzMi42ODYgNiA2IDZ6TTEyIDQyYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02cy02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIGZpbGw9IiMzZDhlNDMiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      
      {/* Floating cricket elements */}
      <motion.div 
        className="absolute top-1/4 left-1/6 w-12 h-12 rounded-full bg-cricket-100 dark:bg-cricket-800 opacity-40"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/6 w-20 h-20 rounded-full bg-cricket-200 dark:bg-cricket-700 opacity-30"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="text-center z-10 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="inline-block mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        >
          <span className="px-4 py-2 text-xs font-medium rounded-full bg-cricket-100 text-cricket-800 dark:bg-cricket-800 dark:text-cricket-100 uppercase tracking-wider flex items-center">
            <Zap className="h-3 w-3 mr-1 text-cricket-500" />
            Powered by Machine Learning
          </span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight relative">
          <motion.span 
            className="inline-block text-cricket-600 dark:text-cricket-400"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Cricket
          </motion.span>{" "}
          <motion.span 
            className="inline-block"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Match Prediction
          </motion.span>
          <motion.div
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-cricket-400 dark:bg-cricket-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 1, delay: 1 }}
          />
        </h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Advanced analytics to predict cricket match outcomes with precision. Input match details and get instant win probability predictions.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <Trophy className="h-6 w-6 text-cricket-500" />, title: "Accurate Predictions", description: "Based on historical data and current form" },
            { icon: <Activity className="h-6 w-6 text-cricket-500" />, title: "Multiple Factors", description: "Weather, venue, player stats, and team form" },
            { icon: <Zap className="h-6 w-6 text-cricket-500" />, title: "Instant Results", description: "Get predictions in seconds with confidence score" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + (index * 0.2) }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 p-3 bg-cricket-50 dark:bg-cricket-900 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          onClick={onScrollToForm}
          className="bg-cricket-500 hover:bg-cricket-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all hover:shadow-lg flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Start Predicting
          <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
        </motion.button>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 right-[10%] w-20 h-20 rounded-full bg-cricket-200/30 blur-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div 
        className="absolute bottom-20 left-[10%] w-32 h-32 rounded-full bg-cricket-300/20 blur-3xl"
        initial={{ scale: 0.9, opacity: 0.3 }}
        animate={{ scale: 1.1, opacity: 0.6 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
      />
    </section>
  );
};

export default HeroSection;
