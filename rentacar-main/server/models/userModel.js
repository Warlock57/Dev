import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema } = mongoose

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String, // Changed from Number to String
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,12}$/.test(v) // Ensures phone number is 10-12 digits
        },
        message: 'Phone number must be between 10-12 digits!',
      },
    },
    lis: {
      type: String, // Assuming file is stored as a URL or filename
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    AcStatus: {
      type: Boolean,
      required: true,
      default: false, // Assuming false means not approved
    },
  },
  { timestamps: true }
)

userSchema.methods.comparePasswords = async function (data) {
  return await bcrypt.compare(data, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error) // Fixed 'err' to 'error'
  }
})

const User = mongoose.model('User', userSchema)

export default User
