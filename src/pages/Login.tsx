import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const backgroundImageUrl =
  'https://stanwicklakesfisheries.com/wp-content/uploads/2022/11/elsons-mini.jpg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(120deg, #1e293b 0%, #334155 100%)',
      }}
    >
      {/* Blurred background image overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(0.5)',
          opacity: 0.6,
        }}
        aria-hidden="true"
      />
      {/* Blue gradient overlay for extra tint */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(120deg, rgba(37,99,235,0.25) 0%, rgba(30,41,59,0.8) 100%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.25)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-100 mb-2 drop-shadow">
            Admin Login
          </h1>
          <p className="text-blue-300">
            Sign in to access the TackleFlow admin dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/70 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-300" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-500 bg-white/20 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-blue-200"
                placeholder="your@email.com"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-100 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-300" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-500 bg-white/20 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-blue-200"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center font-semibold"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
