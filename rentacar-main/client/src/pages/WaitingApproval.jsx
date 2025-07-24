import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const WaitingApproval = () => {
  const { userInfo } = useSelector((state) => state.userLogin)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('WaitingApproval User Info:', userInfo) // Debugging log
    if (userInfo && userInfo.AcStatus) {
      navigate('/', {replace: true}) // Redirect to home once approved
    }
  }, [userInfo?.AcStatus, navigate]) // Only trigger when AcStatus changes

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl font-bold text-center">
        Your account is awaiting admin approval. Please wait for approval to access the platform.
      </h1>
    </div>

    
  )
}

export default WaitingApproval