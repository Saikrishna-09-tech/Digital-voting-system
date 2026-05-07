import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center px-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute blur-3xl bg-indigo-500/20 rounded-full"
          style={{ width: 400, height: 400, top: '-10%', left: '-10%' }}
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute blur-3xl bg-pink-500/20 rounded-full"
          style={{ width: 400, height: 400, bottom: '-10%', right: '-10%' }}
          animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-black mb-6 gradient-text tracking-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Secure Blockchain E-Voting System
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Transparent, Secure, and Decentralized Voting Platform powered by Blockchain Technology
        </motion.p>

        <motion.div
          className="grid grid-cols-3 gap-4 mb-12 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="glass p-4 rounded-lg">
            <div className="text-2xl mb-2">🔐</div>
            <p className="text-gray-300">Secure</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-gray-300">Transparent</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <div className="text-2xl mb-2">⛓️</div>
            <p className="text-gray-300">Decentralized</p>
          </div>
        </motion.div>

        <motion.button
          onClick={() => navigate('/login')}
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Enter System
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
