import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function OTPInput({ onVerify, isLoading, onResend }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold bg-slate-800 border-2 border-slate-700 rounded-lg focus:border-indigo-500 focus:outline-none transition-all"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={otp.join('').length !== 6 || isLoading}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Verify OTP
      </button>

      <button
        onClick={onResend}
        disabled={isLoading}
        className="w-full btn-ghost text-center"
      >
        Resend OTP
      </button>
    </div>
  );
}
