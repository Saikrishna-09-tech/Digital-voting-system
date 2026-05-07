export const validateEmail = (email) => {
return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
return password && password.length >= 6;
};

export const sanitizeEmail = (email) => {
return email.toLowerCase().trim();
};

export const generateOTP = () => {
return Math.floor(100000 + Math.random() * 900000).toString();
};
