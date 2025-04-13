import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
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
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vehicules/:id" element={<VehiculeDetails />} />
        <Route path="/vehicules" element={<VehiculeList />} />
        
        {/* Routes protégées pour les utilisateurs authentifiés */}
        <Route
          path="/reservation/:id"
          element={
            <ProtectedRoute>
              <ReservationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Routes protégées pour les administrateurs */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-vehicle"
          element={
            <ProtectedRoute requireAdmin>
              <AddVehicle />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;

