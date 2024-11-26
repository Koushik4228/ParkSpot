




import { useEffect, useState } from 'react'; // Import useState and useEffect

import AOS from 'aos';

import 'aos/dist/aos.css';

import { BrowserRouter as  Router,Routes, Route } from 'react-router-dom';

import LandingPage from './Components/Landingpage/landingpage';

import AboutUs from './Components/AboutUs/AboutUs';

import Features from './Components/Features/features';

import ContactUs from './Components/ContactUs/contact';

import JustVeiwSlot from './Components/JustView/justview';
 
////Service Provider
 
import DashHeader from './Components/ServiceProviderForm/Dashboardheader/dasheader';

import AddSlot from './Components/ServiceProviderForm/AddSlotComponent/addslot';

import SlotsManager from './Components/ServiceProviderForm/ViewSlot/viewslot';

import Servicelanding from './Components/ServiceProviderForm/AddSlotComponent/Servicelandingpage/Servicelanding';
 
//////USer Dashboard
 
import UserBooking from './Components/UserForm/UserBooking/userbooking';

import Userheader from './Components/UserForm/UserDashboardheader/Userheader';

import ViewBookDetails from './Components/UserForm/Userbookingcards/userbookingcard';

import BookingsTable from './Components/UserForm/ViewUserBooking/viewuserbooking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faComments } from '@fortawesome/free-solid-svg-icons'; // Import the chat/message icon

import ThankYou from './Components/UserForm/ThankYou/Thankyou';

import Payments from './Components/UserForm/Payments/payments';

import Userlanding from './Components/UserForm/Userlandingpage/userlanding';

import FeedbackForm from './Components/Feedback/Feedback';
 
/////////Accounts
 
import Login from './Components/Accounts/Login';

import SignUp from './Components/Accounts/SignUp';

import Faq from './Components/FAQ/Faq';

import SignUpService from './Components/Accounts/SignUpService';

import EmailCheck from './Components/Accounts/ForgetPassword';

import { useSelector } from 'react-redux';

import { UserRole } from './Components/Accounts/Service/Role';

import { RootState } from './Components/Accounts/Store/mystore';

import EditProfile from './Components/Profile/EditProfile';

import ViewProfile from './Components/Profile/ViewProfile';
 
 
/////////Admin Dashboard

import AdminDashboard from './Components/AdminDashboard/admindashboard';

import ViewUserData from './Components/AdminDashboard/viewuserdata';

import ViewServiceProviderData from './Components/AdminDashboard/viewserviceproviderdata';

import FeedbackList from './Components/Feedback/Viewfeedback';

import AcceptedData from './Components/AdminDashboard/AcceptedData/accepteddata';

import RejectedData from './Components/AdminDashboard/RejectedData/rejecteddata';

import Statistics from './Components/statistics/statistics';

import AdminSlotManagement from './Components/AdminDashboard/AdminSlotManagement/adminslotmanagement';
import ProtectedRoute from './services/ProtectedRoute';
import ResetPassword from './Components/Accounts/ForgetPassword';
 
 


const App: React.FC = () => {
 
 // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
    });
  }, []);
  const role = useSelector((state: RootState) => state.user.role);


    return (
 
      <>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/forgotpassword" element={<ResetPassword/>}/>
<Route path="/Contact" element={<ContactUs />} />
<Route path="/AboutUs" element={<AboutUs />} />
<Route path="/Features" element={<Features />} />
<Route path="/signupuser" element={<SignUp />} />
<Route path="/FAQ" element={<Faq />} />
<Route path="/signupservice" element={<SignUpService />} />
<Route path="/login" element={<Login/>}/>
<Route path='/justview' element={<JustVeiwSlot/>}></Route>
<Route path='/viewprofile' element={<ViewProfile/>}></Route>
<Route path='/editprofile' element={<EditProfile/>}></Route>
 
 
    
<Route element={<ProtectedRoute allowedRoles={[UserRole.Admin]} />}  >
<Route path="/admindashboard" element={<AdminDashboard></AdminDashboard>}> 
<Route path='userbookingdetails' element={<ViewUserData></ViewUserData>}> </Route>
<Route path='adminslotmanagement' element={<AdminSlotManagement/>}></Route>
<Route path='viewserviceproviderdata' element={<ViewServiceProviderData></ViewServiceProviderData>}> </Route>
<Route path='viewuserfeedback' element={<FeedbackList></FeedbackList>}></Route> 
<Route path='statistics' element={<Statistics></Statistics>}></Route>
</Route>
<Route path='/accepteddata' element={<AcceptedData/>}></Route>
<Route path='/rejecteddata' element={<RejectedData/>}></Route>
</Route>
 
 
<Route element={<ProtectedRoute allowedRoles={[UserRole.User]} />}>
<Route path='/userlandingpage' element={<Userlanding/>}></Route>
<Route path="/userbooking" element={<UserBooking />} />
<Route path="/userheader" element={<Userheader />} />
<Route path="/viewslots" element={<ViewBookDetails />} />
<Route path="/viewuserbooking" element={<BookingsTable />} />
<Route path="/thank-you" element={<ThankYou />} />
<Route path='/payNow' element={<Payments/>}></Route>
<Route path='/feedback' element={<FeedbackForm/>}></Route>
</Route>
 
 
<Route element={<ProtectedRoute allowedRoles={[UserRole.Service]} />}>
<Route path='/servicelandingpage' element={<Servicelanding/>}></Route>
<Route path="/DashboardHeaders" element={<DashHeader />}> </Route>
<Route path="/addbooking" element={<AddSlot />}></Route> 
<Route path="/viewbooking" element={<SlotsManager />} ></Route>
 
 
</Route>
 
 
</Routes>
</>
 
)

}
 
export default App;

 
