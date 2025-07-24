import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const Year = () => {
  const { userInfo } = useSelector((state) => state.userLogin)

  const now = new Date()
  const [month, setMonth] = useState(0) // 0 means Whole Year by default
  const [year, setYear] = useState(now.getFullYear())
  const [periodLabel, setPeriodLabel] = useState('')
  const [carProfits, setCarProfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const calculateProfits = (reservations) => {
    const map = {}
    reservations.forEach(({ totalCost, reservationItem }) => {
      const car = reservationItem?.car
      if (!car) return
      const key = car._id
      if (!map[key]) map[key] = { carId: key, name: car.name, profit: 0 }
      map[key].profit += totalCost
    })
    return Object.values(map)
  }

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        setLoading(true)
        setError(null)

        const queryParams =
          month === 0 ? `year=${year}` : `month=${month}&year=${year}`

        const { data: reservations } = await axios.get(
          `http://localhost:5000/api/reservation/yearly-profits?${queryParams}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        )

        // Label
        if (month === 0) {
          setPeriodLabel(`Full Year ${year}`)
        } else {
          const d = new Date(year, month - 1, 1)
          const monthName = d.toLocaleString('default', { month: 'long' })
          setPeriodLabel(`${monthName} ${year}`)
        }

        setCarProfits(calculateProfits(reservations))
      } catch (err) {
        console.error('Error fetching monthly profits:', err)
        setError(err.response?.data?.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchMonthly()
  }, [userInfo, month, year])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-error">{error}</p>

  const totalProfit = carProfits.reduce((sum, c) => sum + c.profit, 0)

  return (
    <div className="p-4">
      {/* Month & Year Picker */}
      <div className="flex items-center mb-4 space-x-2">
        <label>
          Month:
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="ml-1 border px-2"
          >
            <option value={0}>Whole Year</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'short' })}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="ml-1 w-20 border px-2"
          />
        </label>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        Total profit for {periodLabel}
      </h1>

      <table style={{
    color: 'black',
    backgroundColor: 'beige',
  }} className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-black px-4 py-2">Car Name</th>
            <th className="border border-black px-4 py-2">
              Reservation Price (Rs)
            </th>
          </tr>
        </thead>
        <tbody>
          {carProfits.map((car) => (
            <tr key={car.carId}>
              <td className="border border-black px-4 py-2">{car.name}</td>
              <td className="border border-black px-4 py-2">
                {car.profit}
              </td>
            </tr>
          ))}

          <tr className="font-bold bg-black text-white">
            <td className="border border-gray-300 px-4 py-2">Total</td>
            <td className="border border-gray-300 px-4 py-2">
              {totalProfit}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Year
