import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import { Provider } from 'react-redux'
import { store } from './redux/store'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/login",
      element: <Login />
    }
  ])

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App
