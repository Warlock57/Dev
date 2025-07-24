import React from 'react'
import { useEffect } from 'react'
import { TbCircleCheck, TbCircleX } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  deleteUser,
  deleteUserReset,
} from '../features/user/adminUserDeleteSlice'
import { getAllUsers,updateUserApproval } from '../features/user/userListSlice'


const UsersList = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userList = useSelector((state) => state.userList)
  const { users } = userList

  const userDelete = useSelector((state) => state.userDelete)
  const { success } = userDelete

  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo || success) {
      dispatch(deleteUserReset())
      dispatch(getAllUsers())
    }
  }, [dispatch, success, userInfo])

  const toggleApproval = (id, status) => {
  if (window.confirm(`Are you sure you want to ${status ? 'approve' : 'unapprove'} this account?`)) {
    // Dispatch an action or make an API call to update the user's AcStatus
    dispatch(updateUserApproval({ id, AcStatus: status }));
  }
};

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      //dispatch delete
      dispatch(deleteUser(id))
    }
  }
  const editHandler = (id) => {
    navigate(`/admin/users/${id}`)
  }
  return (
    <>
      <div className="overflow-x-auto mb-20">
        <table className="table table-compact w-full z-0">
          <thead>
            <tr>
              <th></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License</th>
               <th>AcStauts</th>
              <th>Admin</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => (
                <tr key={user._id}>
                  <th>{index + 1}</th>
                  <td>{user.fname}</td>
                  <td>{user.lname}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                   <td>
  {user.lis ? (
    <a
      href={`http://localhost:5000/${user.lis}`} // Prepend the server URL
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      View License
    </a>
  ) : (
    <span className="text-gray-500">No License</span>
  )}
</td>
                  <td>
  {user.AcStatus ? (
    <button
      onClick={() => toggleApproval(user._id, false)} // Set AcStatus to false
      className="flex items-center text-success"
    >
      <TbCircleCheck className="text-2xl" />
      <span className="ml-2">Approved</span>
    </button>
  ) : (
    <button
      onClick={() => toggleApproval(user._id, true)} // Set AcStatus to true
      className="flex items-center text-error"
    >
      <TbCircleX className="text-2xl" />
      <span className="ml-2">Unapproved</span>
    </button>
  )}
</td>
                  <td>
                    {user.isAdmin ? (
                      <TbCircleCheck className="text-2xl text-success" />
                    ) : (
                      <TbCircleX className="text-2xl text-error text-center" />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-outline btn-warning"
                      onClick={() => editHandler(user._id)}
                    >
                      Edit
                    </button>
                  </td>
                  {userInfo._id !== user._id && (
                    <td>
                      <button
                        className="btn btn-xs btn-outline btn-error"
                        onClick={() => deleteHandler(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
               <th></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License</th>
               <th>AcStauts</th>
              <th>Admin</th>
              <th></th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

export default UsersList
