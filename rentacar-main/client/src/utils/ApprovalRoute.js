import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ApprovalRoute = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.userLogin)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!userInfo) {
      navigate('/sign-in', { replace: true })
    } else if (!userInfo.AcStatus && !userInfo.isAdmin) {
      navigate('/waiting-approval', { replace: true })
    } else {
      setReady(true)
    }
  }, [userInfo, navigate])

  // Render nothing until routing decision is done
  if (!ready) return null

  return <Outlet />
}

export default ApprovalRoute
