import jwt from 'jsonwebtoken';

const buildMissingEnvMessage = () => {
  return 'ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET must be set in the backend .env file.';
};

export const loginAdmin = async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !adminPassword || !jwtSecret) {
    return res.status(500).json({ message: buildMissingEnvMessage() });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (email !== adminEmail.toLowerCase() || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const token = jwt.sign(
    {
      role: 'admin',
      email: adminEmail,
    },
    jwtSecret,
    { expiresIn: '12h' }
  );

  return res.json({
    token,
    admin: {
      email: adminEmail,
      role: 'admin',
    },
  });
};