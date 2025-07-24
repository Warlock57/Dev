import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NavBar from './components/NavBar'
import UserProfile from './components/UserProfile'
import UserReservations from './components/UserReservations'
import About from './pages/About'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'
import MyAccount from './pages/MyAccount'
import Register from './pages/Register'
import ProtectedRoute from './utils/ProtectedRoute'
import ApprovalRoute from './utils/ApprovalRoute'
import Reservations from './pages/Reservations'
import RedirectRoutes from './utils/RedirectRoutes'
import NoMatch from './pages/NoMatch'
import AdminHome from './pages/AdminHome'
import AdminCarLists from './pages/AdminCarLists'
import UsersList from './pages/UsersList'
import EditUser from './pages/EditUser'
import EditCars from './pages/EditCars'
import CreateCars from './pages/CreateCars'
import StripeContainer from './components/StripeContainer'
import WaitingApproval from './pages/WaitingApproval'
import Year from './pages/Year'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route element={<RedirectRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/cars/" element={<Cars />} />

            

            <Route path="/cars/:rangeValue" element={<Cars />} />
            <Route path="/cars/page/:pageNumber" element={<Cars />} />
            <Route path="/cars/page/:pageNumber/:rangeValue" element={<Cars />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<Register />} />
          </Route>

          {/* Route for users awaiting admin approval (Exclude Admins) */}
          <Route element={<ApprovalRoute />}>
            
          </Route>

          <Route path="/waiting-approval" element={<WaitingApproval />} />

          {/* Protected Routes for Users (Require Account Approval, Excluding Admins) */}
          <Route element={<ApprovalRoute />}>
            <Route path="my-account" element={<MyAccount />}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="reservations" element={<UserReservations />} />
            </Route>
            <Route path="/reservation/payment/:id" element={<StripeContainer />} />
          </Route>

          {/* Admin Protected Routes (Bypasses Waiting Approval) */}
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminHome />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/:id" element={<EditUser />} />
              <Route path="cars" element={<AdminCarLists />} />
              <Route path="cars/:id" element={<EditCars />} />
              <Route path="cars/create" element={<CreateCars />} />
              <Route path="year" element={<Year />} />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App