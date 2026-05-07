import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import OTPInput from '../components/OTPInput';
import { authService } from '../services/api';
import { useAuthStore } from '../context/authStore';

export default function OTPVerification() {
  const navigate = useNavigate();
  const userEmail = useAuthStore((state) => state.userEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    sendOTP();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const sendOTP = async () => {
    if (!userEmail) {
      toast.error('No user email found. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const res = await authService.sendOTP(userEmail);
      setResendTimer(60);

      if (!res.data?.sentToEmail) {
        toast.warning('OTP email was not sent via SMTP; check EMAIL credentials in backend. Using development OTP if provided.');
      }

      if (res.data?.otp) {
        toast.success(`OTP sent (${res.data.otp}). Check your email or use this code.`);
      } else {
        toast.success('OTP sent to your email');
      }
    } catch (error) {
      console.error('sendOTP error', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerify = async (otp) => {
    setIsLoading(true);
    try {
      await authService.verifyOTP(userEmail, otp);
      toast.success('OTP verified successfully!');
      navigate('/voter/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Verify Your Email</h1>
          <p className="text-gray-400">Enter the 6-digit OTP sent to</p>
          <p className="text-indigo-400 font-semibold">{userEmail}</p>
        </div>

        <OTPInput
          onVerify={handleVerify}
          isLoading={isLoading}
          onResend={() => {
            if (resendTimer === 0) {
              sendOTP();
            }
          }}
        />

        {resendTimer > 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Resend OTP in {resendTimer}s
          </p>
        )}

        <button
          onClick={() => {
            useAuthStore.setState({ isAuthenticated: false });
            navigate('/login');
          }}
          className="w-full mt-6 btn-secondary"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
