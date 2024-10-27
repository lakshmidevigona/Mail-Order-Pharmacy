import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navigation } from './navigation'
import { Login } from './login.jsx';
import { Order } from './order.jsx';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { DeliveryDashboard } from './DeliveryDashboard';
import {Protected} from './protected.jsx'
import { ContactUs } from './contactus.jsx';
import {Drugs} from './Drugs';
import {Delivery} from './Delivery.jsx'; 
import { Orders } from './orders.jsx';

import { NotFound } from './notfound.jsx';
function App() {
  localStorage.clear()
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route element={<Protected/>}> 
          
          <Route path="/order" element={<Order/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/delivery" element={<DeliveryDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/deliver" element={<Delivery />} />
          <Route path="/drugs" element={<Drugs />} />
         

        </Route>
         <Route path="/" element={<Navigation />} />
         <Route path="/contact" element={<ContactUs />} />
         
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
