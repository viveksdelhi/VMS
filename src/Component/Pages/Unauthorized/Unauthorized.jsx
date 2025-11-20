import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import svg from '../../../../src/assets/unauthorized.png';

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      className="flex flex-col items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.5, 1, 0.5] }} // 👈 looping opacity
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.img
        src={svg}
        alt="404 Not Found"
        className="w-full max-w-[600px] object-contain mb-8"
        whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
        transition={{ type: 'spring', stiffness: 150 }}
      />

      <motion.button
        onClick={() => navigate('/')}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-1 rounded-full shadow-lg hover:opacity-90 transition duration-300"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to Home
      </motion.button>
    </motion.div>
  );
};

export default Unauthorized;
