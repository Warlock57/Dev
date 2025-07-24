import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  resetProfilTimeout,
  userUpdateProfile,
} from '../features/user/userUpdateSlice'
import Alert from './Alert'

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    lis: '',
  })
  const [lisChanged, setLisChanged] = useState(false)
  const { fname, lname, email, phoneNumber, password, confirmPassword, lis } = formData

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdate = useSelector((state) => state.userUpdate)
  const { success, error } = userUpdate

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) {
      navigate('/sign-in')
    } else {
      if (error || success) {
        dispatch(resetProfilTimeout())
      } else {
        setFormData((prev) => ({
          ...prev,
          fname: userInfo.fname,
          lname: userInfo.lname,
          email: userInfo.email,
          phoneNumber: '' + userInfo.phoneNumber,
          lis: userInfo.lis || '',
        }))
      }
    }
  }, [navigate, userInfo, success, dispatch, error])

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      lis: e.target.files[0],
    }))
    setLisChanged(true)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if ((password || confirmPassword) && password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    const data = new FormData()
    data.append('email', email)
    data.append('phoneNumber', phoneNumber)

    if (password) {
      data.append('password', password)
    }

    if (lisChanged) {
      data.append('lis', lis)
      data.append('AcStatus', false)
    }

    dispatch(userUpdateProfile(data))
  }

  return (
    <>
      <form
        className="form-control w-[300px] mx-auto mb-20"
        onSubmit={submitHandler}
      >
        {error && <Alert variant="alert-error" message={error} />}
        {success && <Alert variant="alert-success" message="User Updated" />}

        <label htmlFor="fname">First Name</label>
        <input
          type="text"
          name="fname"
          value={fname}
          disabled
          className="input input-bordered w-full mb-6"
        />

        <label htmlFor="lname">Last Name</label>
        <input
          type="text"
          name="lname"
          value={lname}
          disabled
          className="input input-bordered w-full mb-6"
        />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          value={email}
          className="input input-bordered w-full mb-6"
          onChange={onChange}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={phoneNumber}
          maxLength={12}
          pattern="[0-9]+"
          className="input input-bordered w-full mb-6"
          onChange={onChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          className="input input-bordered w-full mb-6"
          onChange={onChange}
        />

        <input
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={confirmPassword}
          className="input input-bordered w-full"
          onChange={onChange}
        />

        <label htmlFor="lis">License File</label>
        <input
          type="file"
          name="lis"
          accept="application/pdf,image/*"
          className="file-input file-input-bordered file-input-accent w-full mb-1"
          onChange={onFileChange}
        />
        <small className="text-red-500 text-xs">
          Updating your license will require admin re-approval.
        </small>

        <button className="btn mt-6">Save</button>
      </form>
    </>
  )
}

export default UserProfile
