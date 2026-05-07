import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import OTPInput from '../components/OTPInput';
import { authService } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: NewPassword
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setIsLoading(true);
    try {
      await authService.verifyOTP(email, otp);
      setStep(3);
    } catch (error) {
      toast.error('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (otp) => {
    if (!newPassword) {
      toast.error('Please enter new password');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
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
        <h1 className="text-3xl font-bold mb-2 gradient-text">Reset Password</h1>
        <p className="text-gray-400 mb-6">Recover your account access</p>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <p className="text-gray-400 mb-6">Enter the OTP sent to {email}</p>
            <OTPInput
              onVerify={handleVerifyOTP}
              isLoading={isLoading}
              onResend={handleSendOTP}
            />
          </div>
        )}

        {step === 3 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Get OTP from localStorage or passed props
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => handleResetPassword('')}
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-6 btn-secondary"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
