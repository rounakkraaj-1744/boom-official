const bcrypt = require("bcryptjs");
const prisma = require("../config/database");
const { generateToken } = require("../config/jwt");

const registerUser = async ({ username, email, password }) => {
  // Checking if user exists or not
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    },
  });

  if (existingUser) 
    throw new Error("User with this email or username already exists");

  const hashedPassword = await bcrypt.hash(password, 12)

  // Creating a user
  const user = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      walletBalance: 500,
    },
  });

  const token = generateToken({
    userId: user.id,
    username: user.username,
    email: user.email,
  })

  return { success: true, token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      walletBalance: user.walletBalance,
    },
  }
}

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) 
    throw new Error("Invalid email or password");

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword)
    throw new Error("Invalid email or password");

  const token = generateToken({
    userId: user.id,
    username: user.username,
    email: user.email,
  });

  return { success: true, token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      walletBalance: user.walletBalance,
    },
  }
}

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      walletBalance: true,
      createdAt: true,
    },
  });

  if (!user)
    throw new Error("User not found");

  return user;
}

module.exports = { registerUser, loginUser, getUserById }