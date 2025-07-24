import mongoose from 'mongoose'
const { Schema } = mongoose

const carSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    deposit: {
      type: Number,
      required: true,
      min: 0,
    },

    mileage: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ['SUV', 'Sedan', 'Hatchback'],
    },
    
    gearType: {
      type: String,
      required: true,
       enum: ['Manual', 'Automatic'],
    },
    yearModel: {
      type: Number,
      required: true,
       min: 1886, // The first car was made in 1886
  max: new Date().getFullYear(),
    },
    seatCapacity: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    },
    images: [{ type: String, required: true }],
    isReserved: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
)

const Car = mongoose.model('Car', carSchema)

export default Car
