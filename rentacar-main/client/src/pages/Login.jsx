import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import { loginUser } from '../features/user/userSlice'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, error } = userLogin

  useEffect(() => {
    console.log('User Info Updated:', userInfo) // Debugging log

    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin/dashboard', { replace: true }) // Redirect admin to dashboard
      } else if (userInfo.AcStatus) {
        navigate('/', { replace: true }) // Redirect approved users to home
      } else {
        navigate('/waiting-approval', { replace: true }) // Redirect unapproved users to waiting page
      }
    }
  }, [userInfo, navigate])

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

 return (
  <div className="relative flex justify-center flex-col items-center pt-12 mx-2 bg-gray-100 min-h-screen">
    {error && <Alert variant="alert-error" message={error} />}
    <h1 style={{ color: 'black' }} className="text-center text-2xl">Login</h1>

    <form    style={{
    border: '2px solid black',
    padding: '20px',
    borderRadius: '10px',
  }} className="form-control w-full max-w-md" onSubmit={submitHandler}>
      <label style={{ color: 'black' }} htmlFor="email">Email</label>
      <input
        type="text"
        placeholder="Enter email"
        name="email"
        value={email}
        onChange={onChange}
        className="input input-bordered w-full mb-6"
      />
      <label style={{ color: 'black' }} htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Enter password"
        name="password"
        value={password}
        onChange={onChange}
        className="input input-bordered w-full"
      />
      <Link style={{ color: 'black' }} to="/sign-up" className="link link-primary">
        Register
      </Link>
      <button className="btn mt-6">Sign in</button>
    </form>
  </div>
)
}

export default Login