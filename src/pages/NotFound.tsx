import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-100 px-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Fish className="h-24 w-24 text-primary-600" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-900 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary-800 mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-primary-600 mb-8 max-w-md mx-auto">
          Looks like you've ventured into uncharted waters! 
          The page you're looking for doesn't exist.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center bg-primary-600 hover:bg-primary-800 text-white py-3 px-6 rounded-full transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;