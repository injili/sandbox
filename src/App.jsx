import {
  RouterProvider,
  createHashRouter,
  Outlet
} from 'react-router-dom';
import Dashboard from "./pages/Dashboard";

const Layout = () => {
  return (
    <div className='text-second bg-first'>
      <Outlet/>
    </div>
  )
}


const router = createHashRouter([
  {
    path: '/',
    element:<Layout/>,
    children:[
      {
        path: '/',
        element: <Dashboard/>
      }
    ]
  }
])

export default function App(){
  return(
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}