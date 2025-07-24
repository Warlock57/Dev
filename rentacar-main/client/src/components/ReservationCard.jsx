import React, { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'
import API from '../api/api'

const ReservationCard = ({ reservation }) => {
  const [car, setCar] = useState(null)

  // Fetch car details using carId
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const { data } = await API.get(`/api/cars/${reservation.reservationItem.car}`)
        setCar(data)
      } catch (error) {
        console.error('Error fetching car details:', error)
      }
    }

    fetchCarDetails()
  }, [reservation.reservationItem.car])

  function formatDate(date) {
    return format(parseISO(date), 'dd-MM-yyyy')
  }

  // Calculate total cost (if car details are available)
  const total = car ? reservation.totalCost + car.deposit : reservation.totalCost

  return (
    <div className="card card-compact max-w-sm w-full bg-base-100 shadow-xl image-full z-0">
      <figure>
        <img   src={`http://localhost:5000${reservation.reservationItem.image}`} alt="carimg" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{reservation.reservationItem.brand}</h2>
        <h2 className="card-title">{reservation.reservationItem.name}</h2>
        <p>
          The car is reserved from {formatDate(reservation.fromDate)} to{' '}
          {formatDate(reservation.toDate)}. Total cost: {total} Rs  
          after adding deposit.
        </p>
        <div>
          {reservation.isApproved ? (
            <button className="btn btn-xs btn-success btn-outline">
              Confirmed
            </button>
          ) : (
            <button className="btn btn-xs btn-warning btn-outline">
              Not Confirmed
            </button>
          )}
          {reservation.isPaid && (
            <button className="btn btn-xs btn-success btn-outline">Paid</button>
          )}
        </div>
        {/* <div className="card-actions justify-end">
          {reservation.isApproved && !reservation.isPaid && (
            <Link
              className="btn btn-secondary btn-sm md:btn-md"
              to={`/reservation/payment/${reservation._id}`}
            >
              Pay
            </Link>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default ReservationCard