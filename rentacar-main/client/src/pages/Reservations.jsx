import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllReservations } from '../features/reservation/reservationListSlice'
import { TbCircleX, TbCircleCheck } from 'react-icons/tb'
import {
  reservationToApprove,
  resetApproveReservation,
} from '../features/reservation/reservationApproveSlice'
import {
  deleteReservation,
  resetReservationDelete,
} from '../features/reservation/reservationDeleteSlice'
import { compareAsc, format, parseISO } from 'date-fns'

const Reservations = () => {
  const [todayDate] = useState(new Date())
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { reservations } = useSelector((state) => state.reservationList)
  const { success } = useSelector((state) => state.reservationApprove)
  const { success: successDelete } = useSelector((state) => state.reservationDelete)

  useEffect(() => {
    if (userInfo || success || successDelete) {
      dispatch(resetReservationDelete())
      dispatch(resetApproveReservation())
      dispatch(getAllReservations())
    }
  }, [dispatch, userInfo, success, successDelete])

  const approveHandler = (id) => {
    dispatch(reservationToApprove(id))
  }

  const deleteHandler = (id) => {
    dispatch(deleteReservation(id))
    console.log('Reservation Deleted')
  }

  const isPastDate = (toDate) => compareAsc(todayDate, new Date(toDate)) === 1

  const formatDate = (date) => format(parseISO(date), 'dd-MM-yyyy')

  return (
    <div className="overflow-x-auto mb-20">
      <table className="table table-compact w-full z-0">
        <thead>
          <tr>
            <th>#</th>
            <th>CarId</th>
            <th>Car</th>
            <th>Total Cost</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Phone</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
  {reservations.length > 0 &&
    reservations.map((reservation, index) => {
     const car = reservation.reservationItem?.car?.brand + ' ' + reservation.reservationItem?.car?.name || 'N/A';

      const name = reservation.reservationItem?.name || 'N/A'; // Handle undefined name
      const totalCost = reservation.totalCost || 'N/A'; // Handle undefined totalCost

      return (
        <tr key={reservation._id}>
          <th>{index + 1}</th>
          <td>{car}</td>
          <td>{name}</td>
          <td>{totalCost}</td>
          <td>{reservation.user?.fname || 'N/A'}</td>
          <td>{reservation.user?.lname || 'N/A'}</td>
          <td>{reservation.user?.phoneNumber || 'N/A'}</td>
          <td>{reservation.fromDate ? formatDate(reservation.fromDate) : 'N/A'}</td>
          <td>{reservation.toDate ? formatDate(reservation.toDate) : 'N/A'}</td>
          <td>
            {reservation.isApproved ? (
              <TbCircleCheck className="text-2xl text-success" />
            ) : (
              <TbCircleX className="text-2xl text-error text-center" />
            )}
          </td>
          <td className="flex gap-2">
            {!reservation.isApproved && (
              <button
                className="btn btn-outline btn-xs btn-warning"
                onClick={() => approveHandler(reservation._id)}
              >
                Approve
              </button>
            )}
            {isPastDate(reservation.toDate) && (
              <button
                className="btn btn-outline btn-xs btn-error"
                onClick={() => deleteHandler(reservation._id)}
              >
                Delete
              </button>
            )}
          </td>
        </tr>
      );
    })}
</tbody>
        <tfoot>
          <tr>
            <th>#</th>
            <th>CarId</th>
            <th>Car</th>
            <th>Total Cost</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Phone</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Reservations
