import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../services/api';
import { useAuthStore } from '../context/authStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login(formData.email, formData.password, isAdmin ? 'admin' : 'voter');
      const { token, userId, role, isEmailVerified } = res.data;

      if (!isAdmin && role === 'voter' && !isEmailVerified) {
        toast.success('Login successful! Please verify your email with OTP.');
      }

      localStorage.setItem('authToken', token);
      login(formData.email, role, userId, token);

      toast.success('Login successful!');

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/otp-verification');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-2 gradient-text">Login</h1>
        <p className="text-gray-400 mb-6">Secure Blockchain E-Voting System</p>

        {/* Role Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              !isAdmin
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            Voter
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              isAdmin
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white placeholder-gray-500 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white placeholder-gray-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-2 text-center text-sm">
          {!isAdmin && (
            <>
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Create one
                </button>
              </p>
              <p className="text-gray-400">
                Forgot password?{' '}
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Reset here
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
