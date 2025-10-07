import React from 'react'
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Income from './pages/Income'
import Budget from './pages/Budget'
import Expense from './pages/Expense'
import Goal from './pages/Goal'
import Profile from './pages/Profile'
import Notification from './pages/Notification'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import NotFoundPage from './pages/NotFoundPage'
import IncomeUpdate from './pages/IncomeUpdate'
import Savings from './pages/Savings'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {index:true, element:<Landing />}, // "/"
      {path: "signup", element: <Signup />},  // "/sign-up"
      {path: "login", element: <Login />},
      {path: "*", element: <NotFoundPage />},
    ],
  },
  {
    // Wrap MainLayout with ProtectedRoute
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "home", element: <Home /> },
      { path: "income", element: <Income /> },
      { path: "income-update", element: <IncomeUpdate /> },
      { path: "budget", element: <Budget /> },
      { path: "expense", element: <Expense /> },
      { path: "goal", element: <Goal /> },
      { path: "view-profile", element: <Profile /> },
      { path: "notification", element: <Notification /> },
      { path: "savings", element: <Savings /> },
    ],
  },
])
const App = () => {
  return <RouterProvider router={router} />
}

export default App