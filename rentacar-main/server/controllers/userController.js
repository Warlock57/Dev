import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcryptjs'
import trLocale from 'date-fns/locale/tr/index.js'
import multer from 'multer'
import path from 'path'

// Set up Multer storage configuration for the license file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/licenses/') // Directory to store uploaded license files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Ensure each file has a unique name
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only PDF or image files
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and image files are allowed'), false)
    }
  },
})

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (user && (await user.comparePasswords(password))) {
    res.json({
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      AcStatus: user.AcStatus, // Include AcStatus
      token: generateToken(user._id),
    })
  } else {
    res.status(401).json({ message: 'Invalid email or password!' })
  }
}
// REGISTER USER WITH LICENSE FILE
const registerUser = async (req, res) => {
  try {
    const { fname, lname, email, password, phoneNumber } = req.body
    const userExist = await User.findOne({ email })

    if (userExist) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const lisPath = req.file ? req.file.path : null // Save the license file path

    const user = await User.create({
      fname,
      lname,
      email,
      phoneNumber: phoneNumber?.toString(),
      password,
      lis: lisPath, // Store the license file path
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        lis: user.lis, // Return the file path
        token: generateToken(user._id),
      })
    } else {
      return res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET USER BY TOKEN
const getUserById = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      lis: user.lis,
      AcStatus: user.AcStatus, // Include AcStatus
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

// GET USER BY ID
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    res.json({
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      lis: user.lis, // Include lis (license file path)
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

// UPDATE USER (SELF)
const updateUserById = async (req, res) => {
  const { email, password, phoneNumber, AcStatus } = req.body
  const user = await User.findById(req.user._id)

  if (user) {
    user.email = email || user.email
    user.phoneNumber = phoneNumber?.toString() || user.phoneNumber

    if (req.file) {
      user.lis = req.file.path // Update license file path
      user.AcStatus = false // Reset account status if license is updated
    }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      fname: updatedUser.fname,
      lname: updatedUser.lname,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      isAdmin: updatedUser.isAdmin,
      lis: updatedUser.lis,
      AcStatus: updatedUser.AcStatus,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404).json({ message: 'Could not update user!' })
  }
}

//UPDATE USER APPROVAL (ADMIN)
const updateUserApproval = async (req, res) => {
 
  const { id } = req.params;
  const { AcStatus } = req.body;

  console.log('Update User Approval:', { id, AcStatus }); // Debugging log

  try {
    const user = await User.findById(id);

    if (user) {
      user.AcStatus = AcStatus;
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: UPDATE ANY USER
const updateUsersById = async (req, res) => {
  const { fname, lname, email, isAdmin, phoneNumber } = req.body
  const user = await User.findById(req.params.id)

  if (user) {
    user.fname = fname || user.fname
    user.lname = lname || user.lname
    user.email = email || user.email
    user.phoneNumber = phoneNumber?.toString() || user.phoneNumber
    user.isAdmin = isAdmin

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      fname: updatedUser.fname,
      lname: updatedUser.lname,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      lis: updatedUser.lis, // Include lis (license file path)
    })
  } else {
    res.status(404).json({ message: 'Could not update user!' })
  }
}

// ADMIN: GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    if (users.length > 0) {
      res.json(users)
    } else {
      res.status(404).json({ message: 'No users found!' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ADMIN: DELETE USER
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      await User.deleteOne({ _id: req.params.id }) // Fixed remove() deprecation
      res.json({ message: 'User deleted successfully' })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export {
  loginUser,
  getUserById,
  updateUserById,
  updateUsersById,
  updateUserApproval,
  registerUser,
  getAllUsers,
  deleteUser,
  getUser,

  upload, // Export the upload middleware
}
