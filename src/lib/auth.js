import jwt from "jsonwebtoken";

// Secret key for signing JWT tokens (this should be stored in environment variables in production)
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Function to verify JWT token
export const verifyToken = (authHeader) => {
  try {
    const token = authHeader.split(" ")[1];

    const data = jwt.verify(token, SECRET_KEY);

    return data; // Decodes the token
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
