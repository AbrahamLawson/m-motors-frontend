import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReservationForm from "./pages/ReservationForm";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddVehicle from "./pages/AddVehicle";
import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import VehiculeList from "./components/VehicleList";
import VehiculeDetails from "./pages/VehicleDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vehicules/:id" element={<VehiculeDetails />} />
        <Route path="/vehicules" element={<VehiculeList />} />
        <Route path="/reservation/:id" element={<ReservationForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-vehicle" element={<AddVehicle />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

