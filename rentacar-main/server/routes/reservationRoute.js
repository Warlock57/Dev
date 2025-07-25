import express from 'express'
import {
  createReservation,
  getAllReservations,
  approveReservation,
  deleteReservation,
  getReservationsByUserId,
  reservationToPaid,
  reservationById,
  getYearlyProfits, // Import the new controller
} from '../controllers/reservationController.js'
import { admin, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/create').post(protect, createReservation)
router.route('/').get(protect, getReservationsByUserId)
router.route('/admin').get(protect, admin, getAllReservations)

// New route for fetching yearly profits
router.route('/yearly-profits').get(protect, admin, getYearlyProfits)

router
  .route('/:id')
  .put(protect, admin, approveReservation)
  .delete(protect, admin, deleteReservation)
  .get(protect, reservationToPaid)

router.route('/:id/paid').put(protect, reservationToPaid)

router.route('/:id/details').get(protect, reservationById)

export default router