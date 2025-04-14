import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VehicleDetails from "./pages/VehicleDetails";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

// Composant de route protégée qui vérifie si l'utilisateur est connecté
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Si chargement en cours, afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // Si pas d'utilisateur connecté, rediriger vers la page de connexion
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Sinon, afficher le contenu de la route protégée
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

