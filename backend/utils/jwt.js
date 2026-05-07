import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
return jwt.sign(
{ id: userId, role: role },
process.env.JWT_SECRET || "secretkey",
{ expiresIn: "7d" }
);
};

export const verifyToken = (token) => {
return jwt.verify(
token,
process.env.JWT_SECRET || "secretkey"
);
};
