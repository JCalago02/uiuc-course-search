import './App.css';
import Header from './Components/Header/Header';
import FindClasses from './Pages/FindClasses/FindClasses';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider
} from "react-router-dom";



const NotImplemented = () => {
  return (
    <div>Not implemented lmfao</div>
  )
}

function Root() {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
  
}
 


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root/>}>
        <Route index element={<NotImplemented/>}></Route>
        <Route path="/find-classes" element={<FindClasses/>}/>
      </Route>
      
    )
  )
  return (
      <div className="App">
        <RouterProvider router={router}></RouterProvider> 
      </div>
  );
}

export default App;
