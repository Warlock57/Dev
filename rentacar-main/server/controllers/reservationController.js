import mongoose from 'mongoose'
import Reservation from '../models/reservationModel.js'
import Car from '../models/carModel.js'
import User from '../models/userModel.js'

const createReservation = async (req, res) => {
  const { fromDate, toDate, carId, totalCost, location } = req.body;

  console.log("Authenticated User ID:", req.user._id);
  console.log("Create Reservation Request Received:", req.body);

  try {
    // Validate carId
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ message: "Invalid carId" });
    }

    const car = await Car.findById(carId);
    console.log("Car Found:", car);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const user = await User.findById(req.user._id);
    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reservationItem = {
      car: carId,
      name: car.name,
      image: car.images[0],
      brand: car.brand,
      pricePerDay: car.pricePerDay,
      deposit: car.deposit,
      fname: user.fname,
      lname: user.lname,
    };

    car.isReserved = true;
    await car.save();

    const reservation = await Reservation.create({
      reservationItem,
      user: req.user._id,
      fromDate,
      toDate,
      totalCost,
      location,
    });

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error in createReservation:", error.message);
    res.status(500).json({ message: "Server error while creating reservation" });
  }
};







export const getYearlyProfits = async (req, res) => {
  try {
    const { month: m, year: y } = req.query
    const now = new Date()
    const year = y ? parseInt(y, 10) : now.getFullYear()
    const month = m ? parseInt(m, 10) - 1 : null // null for full year

    let startDate, endDate

    if (month !== null) {
      // Specific month
      startDate = new Date(year, month, 1, 0, 0, 0)
      endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)
    } else {
      // Whole year
      startDate = new Date(year, 0, 1, 0, 0, 0)
      endDate = new Date(year, 11, 31, 23, 59, 59, 999)
    }

    const reservations = await Reservation.find({
      fromDate: { $lte: endDate },
      toDate: { $gte: startDate }
    })
      .populate('reservationItem.car', 'name')
      .select('totalCost reservationItem.car fromDate toDate')

    console.log(`Found ${reservations.length} reservations between`, startDate, endDate)
    return res.json(reservations)
  } catch (error) {
    console.error('Error in getYearlyProfits:', error)
    return res.status(500).json({ message: 'Failed to fetch yearly profits' })
  }
}













// user
const reservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)

    if (reservation) {
      res.json(reservation)
    } else {
      res.status(404).json({ message: 'No Reservation found' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// user
const reservationToPaid = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)

    if (reservation) {
      reservation.isPaid = true
      reservation.paidAt = Date.now()
      await reservation.save()
      res.json(reservation)
    } else {
      res.status(404).json({ message: 'No Reservation found' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// user
const getReservationsByUserId = async (req, res) => {
  try {
    const reservation = await Reservation.find({ user: req.user._id })

    if (reservation && reservation.length > 0) {
      res.json(reservation)
    } else {
      res.status(404).json({ message: 'No Reservations found' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// admin only
const getAllReservations = async (req, res) => {
 
  try {
    const reservations = await Reservation.find({}).populate(
      'user',
      'fname lname phoneNumber'
    ) .populate('reservationItem.car', 'name brand'); 

    if (reservations.length > 0) {
      res.status(200).json(reservations)
    } else {
      res.status(404).json({ message: 'No reservations found' })
    }
  } catch (error) {
    console.error("🔥 Reservation Fetch Error:", error.stack); 
    res.status(500).json({ message: error.message })
  }
}

// admin only
const approveReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)

    if (reservation) {
      reservation.isApproved = true
      await reservation.save()
      res.status(200).json('Reservation approved')
    } else {
      res.status(404).json({ message: 'Cannot be approved' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// admin only
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params
    const reservation = await Reservation.findById(id)

    if (reservation) {
      const car = await Car.findById(reservation.reservationItem.car)
      car.isReserved = false
      await car.save()

      await reservation.remove()
      res.status(200).json('Reservation deleted')
    } else {
      res.status(404).json({ message: 'Could not delete!' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export {
  createReservation,
  getAllReservations,
  approveReservation,
  deleteReservation,
  getReservationsByUserId,
  reservationToPaid,
  reservationById,
}
