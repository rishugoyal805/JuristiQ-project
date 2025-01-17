import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './components/Home'
import LoginPage from './components/LoginPage'
import SignUp from './components/SignUp'
import NoPage from './components/SignUp'

const router = createBrowserRouter(
  {
    path: "/",
    element: <LoginPage/>
  },
  {
    path: "/signUp",
    element: <SignUp/>
  },
  {
    path: "/home",
    element: <Home/>
  },
  {
    path: "*",
    element: <NoPage/>
  }

)

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
