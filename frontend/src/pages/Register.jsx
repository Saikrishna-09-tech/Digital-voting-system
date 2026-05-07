import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    voterId: '',
    aadhaar: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.voterId ||
      !formData.aadhaar
    ) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.voterId.trim().length < 4) {
      toast.error('Voter ID must be at least 4 characters');
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhaar.trim())) {
      toast.error('Aadhaar must be exactly 12 digits');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.voterId,
        formData.aadhaar
      );
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
        <h1 className="text-3xl font-bold mb-2 gradient-text">Create Account</h1>
        <p className="text-gray-400 mb-6">Join the secure voting system</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
            />
          </div>

          {/* Voter ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Voter ID</label>
            <input
              type="text"
              name="voterId"
              value={formData.voterId}
              onChange={handleChange}
              placeholder="Voter ID"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
            />
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Aadhaar Number</label>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              placeholder="12-digit Aadhaar"
              maxLength={12}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
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
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-3.5 text-gray-400"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
}
