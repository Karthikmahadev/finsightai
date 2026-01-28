import jwt from "jsonwebtoken";

/**
 * Generates JWT token with user info in payload
 * @param {Object} user - Mongoose user object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;
