import { Route, Routes } from "react-router-dom";
import Register from "./Register";
import RegisterCustomer from "./Register-Customer";
import Login from "./Login";
import LabourerProfile from "./Labourer-Profile";
import HomePage from "./HomePage";
import LabourerProfileView from "./Labourer-Profile-view";
import History from "./History";
import CustomerProfile from "./Customer-Profile";
import HomePageCustomer from "./HomePage-Customer";
import CustomerProfileView from "./Customer-Profile-View";
import MyJobs from "./MyJobs";
import Request from "./Request";

function App() {


    return (
        <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/Register-Customer" element={<RegisterCustomer />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Labourer-Profile" element={<LabourerProfile />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/LabourerProfileView" element={<LabourerProfileView />} />
            <Route path = "/Customer-Profile" element={<CustomerProfile/>}/>
            <Route path="/History" element={<History/>} />
            <Route path = "/HomePageCustomer" element= {<HomePageCustomer/>}/>
            <Route path = "/CustomerProfileView" element= {<CustomerProfileView/>}/>
            <Route path = "/MyJobs" element= {<MyJobs/>}/>
            <Route path = "/RequestPage" element= {<Request/>}/>
        </Routes>
    )
}
export default App;