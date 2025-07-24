import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import { registerUser, reset } from '../features/user/userSlice'

const Register = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const { fname, lname, email, phoneNumber, password, confirmPassword } = formData
  const [lis, setLis] = useState(null) // Separate state for file input
  const [errors, setErrors] = useState({}) // State for validation errors

  const dispatch = useDispatch()
  const userRegister = useSelector((state) => state.userLogin)
  const { userInfo, error } = userRegister
  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
    dispatch(reset())
  }, [navigate, userInfo, dispatch])

  const validateFields = () => {
    const newErrors = {}

    // Validate first name
    if (!fname.trim()) {
      newErrors.fname = 'First name is required'
    } else if (/\d/.test(fname)) {
      newErrors.fname = 'First name cannot contain numbers'
    }

    // Validate last name
    if (!lname.trim()) {
      newErrors.lname = 'Last name is required'
    } else if (/\d/.test(lname)) {
      newErrors.lname = 'Last name cannot contain numbers'
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format'
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10,12}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10-12 digits'
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onFileChange = (e) => {
    setLis(e.target.files[0]) // Handle file separately
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (!validateFields()) return

    const userData = new FormData()
    userData.append('fname', fname)
    userData.append('lname', lname)
    userData.append('email', email)
    userData.append('phoneNumber', phoneNumber)
    userData.append('password', password)
    if (lis) {
      userData.append('lis', lis) // Append file properly
    }

    dispatch(registerUser(userData))
  }

  return (
    <div  className="relative flex justify-center flex-col items-center pt-12 mx-2 bg-gray-100 min-h-screen">
      {error && <Alert variant="text-error" message={error} />}
      <h1 style={{ color: 'black' }} className="text-center text-2xl">Register</h1>
      <form
  style={{
    border: '2px solid black',
    padding: '20px',
    borderRadius: '10px',
  }}
  className="form-control w-full max-w-md"
  onSubmit={submitHandler}
  encType="multipart/form-data"
>
        <label style={{ color: 'black' }} htmlFor="fname">First Name</label>
        <input
          type="text"
          placeholder="Enter first name"
          name="fname"
          value={fname}
          className={`input input-bordered w-full mb-6 ${errors.fname ? 'input-error' : ''}`}
          onChange={onChange}
          required
        />
        {errors.fname && <p className="text-error">{errors.fname}</p>}

        <label style={{ color: 'black' }} htmlFor="lname">Last Name</label>
        <input
          type="text"
          placeholder="Enter last name"
          name="lname"
          value={lname}
          className={`input input-bordered w-full mb-6 ${errors.lname ? 'input-error' : ''}`}
          onChange={onChange}
          required
        />
        {errors.lname && <p className="text-error">{errors.lname}</p>}

        <label style={{ color: 'black' }} htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          value={email}
          className={`input input-bordered w-full mb-6 ${errors.email ? 'input-error' : ''}`}
          onChange={onChange}
          required
        />
        {errors.email && <p className="text-error">{errors.email}</p>}

        <label style={{ color: 'black' }} htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          placeholder="Enter phone number"
          name="phoneNumber"
          value={phoneNumber}
          maxLength={12}
          pattern="[0-9]+"
          className={`input input-bordered w-full mb-6 ${errors.phoneNumber ? 'input-error' : ''}`}
          onChange={onChange}
          required
        />
        {errors.phoneNumber && <p className="text-error">{errors.phoneNumber}</p>}

        <label style={{ color: 'black' }} htmlFor="lis">License</label>
        <input
          type="file"
          name="lis"
          className="input input-bordered w-full mb-6"
          onChange={onFileChange}
          required
        />

        <label style={{ color: 'black' }} htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={password}
          className={`input input-bordered w-full mb-6 ${errors.password ? 'input-error' : ''}`}
          onChange={onChange}
          required
        />
        {errors.password && <p className="text-error">{errors.password}</p>}

        <label style={{ color: 'black' }} htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={confirmPassword}
          className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
          onChange={onChange}
          required
        />
        {errors.confirmPassword && <p className="text-error">{errors.confirmPassword}</p>}

        <Link style={{ color: 'black' }} to="/sign-in" className="link link-primary">
          Sign in
        </Link>
        <button className="btn mt-6">Sign up</button>
      </form>
    </div>
  )
}

export default Register