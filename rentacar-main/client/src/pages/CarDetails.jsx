import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Slider from '../components/Slider'
import { FaCalendar, FaGasPump,FaMoneyBillWave,FaRoad } from 'react-icons/fa'
import { MdAirlineSeatReclineExtra } from 'react-icons/md'
import Footer from '../components/Footer'
import Service from '../components/Service'
import { GiGearStick } from "react-icons/gi"
import { useDispatch, useSelector } from 'react-redux'
import { getCarbyId } from '../features/car/carDetailsSlice'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addMonths } from 'date-fns'
import {
  createUserReservation,
  resetReservation,
} from '../features/reservation/reservationSlice'

const CarDetails = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [location, setLocation] = useState('')
  const [dateError, setDateError] = useState('') // State for date validation error

  const navigate = useNavigate()
  const params = useParams()
  const carId = params.id

  const dispatch = useDispatch()
  const carDetails = useSelector((state) => state.carDetails)
  const { loading, error, car } = carDetails

  const reservationUser = useSelector((state) => state.reservationUser)
  const { loading: reservationLoading, success } = reservationUser

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!car || car._id !== carId || success) {
      dispatch(resetReservation())
      dispatch(getCarbyId(carId))
    }
  }, [dispatch, navigate, car, carId, success, userInfo])

  function dateDifference(dateOne, dateTwo) {
    const miliseconds = dateTwo.getTime() - dateOne.getTime()
    let TotalDays = Math.ceil(miliseconds / (1000 * 3600 * 24))
    return TotalDays
  }

  const reserveHandler = () => {
    const diff = dateDifference(startDate, endDate)
    if (diff <= 0) {
      alert('Minimum 1 day reservation required.')
    } else if (!location) {
      alert('Please select pickup & drop-off location.')
    } else {
      const totalCost = diff * car.pricePerDay
      dispatch(
        createUserReservation({
          fromDate: startDate,
          toDate: endDate,
          carId,
          totalCost,
          location,
        })
      )
    }
  }

  const handleEndDateChange = (date) => {
    if (date < startDate) {
      setDateError('End date cannot be earlier than start date.')
    } else {
      setDateError('')
      setEndDate(date)
    }
  }

  if (loading) return <Spinner />

  return (
    <>
      {error ? (
        <Alert variant="alert-error" message={error} />
      ) : (
        <>
          <Slider images={car.images} />
          <div className="w-full flex flex-col md:flex-row md:justify-around mt-20 px-10">
            <div className="md:h-96 flex flex-col">
              <p className="text-4xl mb-5">
                {car.brand}, {car.name}
              </p>
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col shadow w-32 h-32 justify-center items-center">
                  <FaCalendar className="text-5xl" />
                  <p className="text-2xl font-light">{car.yearModel}</p>
                  <p>Year Model</p>
                </div>
                <div className="flex flex-col shadow w-32 h-32 justify-center items-center">
                  <FaGasPump className="text-5xl" />
                  <p className="text-2xl font-light">{car.fuelType}</p>
                  <p>Fuel type</p>
                </div>
                <div className="flex flex-col shadow w-32 h-32 justify-center items-center">
                  <MdAirlineSeatReclineExtra className="text-5xl" />
                  <p className="text-2xl font-light">{car.seatCapacity}</p>
                  <p>Seats</p>
                </div>

                <div className="flex flex-col shadow w-32 h-32 justify-center items-center">
                  <GiGearStick className="text-5xl" />
                  <p className="text-2xl font-light">{car.gearType}</p>
                  <p>GearType</p>
                </div>

                <div className="flex flex-col shadow w-32 h-32 justify-center items-center">
                  <FaMoneyBillWave className="text-5xl" />
                  <p className="text-2xl font-light">{car.deposit}</p>
                  <p>Deposit</p>
                </div>

                <div className="flex flex-col shadow w-32 h-32 justify-center items-center">
                  <FaRoad className="text-5xl" />
                  <p className="text-2xl font-light">{car.mileage}</p>
                  <p>Mileage</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-4xl text-accent mb-5">Price/Day: {car.pricePerDay} Rs</p>

              <label htmlFor="fromdate">From Date</label>
              <DatePicker
                className="bg-neutral rounded-md px-2"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                minDate={new Date()}
                endDate={endDate}
              />

              <label htmlFor="todate">To Date</label>
              <DatePicker
                className="bg-neutral rounded-md px-2"
                selected={endDate}
                onChange={handleEndDateChange} // Updated handler
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={addMonths(startDate, 1)}
                showDisabledMonthNavigation
              />
              {dateError && <p className="text-error">{dateError}</p>} {/* Display error */}

              <label htmlFor="location">Pickup & Drop-off Location</label>
              <select
                id="location"
                className="bg-neutral rounded-md px-2 py-2 mb-3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                <option value="Head Office, Panjim">Head Office, Panjim</option>
                <option value="Dabolim airport">Dabolim airport</option>
                <option value="Mopa airport">Mopa airport</option>
                <option value="Madgaon Railway station">Madgaon Railway station</option>
                <option value="Vasco Railway station">Vasco Railway station</option>
              </select>

              {userInfo ? (
                <button
                  className={`btn btn-accent mt-5 ${
                    reservationLoading ? 'loading' : ''
                  }`}
                  onClick={() => reserveHandler()}
                  disabled={car.isReserved}
                >
                  {car.isReserved ? 'Reserved' : 'Reserve'}
                </button>
              ) : (
                <Link to="/sign-in" className="btn btn-accent mt-5">
                  Sign in for reservations
                </Link>
              )}
            </div>
          </div>
        </>
      )}
      <Service />
      <Footer />
    </>
  )
}

export default CarDetails