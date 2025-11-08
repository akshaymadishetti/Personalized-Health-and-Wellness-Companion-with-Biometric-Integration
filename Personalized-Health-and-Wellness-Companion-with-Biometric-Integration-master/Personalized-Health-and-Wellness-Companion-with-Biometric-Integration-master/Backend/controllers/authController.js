const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId ,role: User.role }, 
    process.env.JWT_SECRET, { expiresIn: "1h" });
};

// REGISTER
exports.register = async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
   

    // check if user exists
    let exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      role,
      password
    });

    // return token
    const token = generateToken(User);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error of registration", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials " });

    // compare password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials " });

    // return token
    const token = generateToken(user._id);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, password:user.password, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error on login ", error: err.message });
  }
};
