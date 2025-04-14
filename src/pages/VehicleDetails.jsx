import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VehicleDetails.css';

const API_BASE = "http://localhost:8000";

// Images de véhicules par défaut pour démonstration
const DEFAULT_IMAGES = {
  "Toyota": "https://cdn.motor1.com/images/mgl/kXQEM/s1/2021-toyota-mirai-front.jpg",
  "BMW": "https://cdn.bmwblog.com/wp-content/uploads/2020/06/2021-bmw-m4-coupe-rendering-01-830x553.jpg",
  "Renault": "https://images.caradisiac.com/images/1/8/7/0/181870/S1-renault-clio-5-a-partir-de-14-100eur-573348.jpg",
  "Mercedes": "https://images.caradisiac.com/images/6/9/5/5/186955/S0-salon-de-geneve-2019-mercedes-amg-gt-r-roadster-en-fuite-605291.jpg",
  "Audi": "https://images.caradisiac.com/images/5/5/7/5/185575/S0-l-audi-q4-e-tron-sera-decline-en-sportback-603113.jpg"
};

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationDates, setReservationDates] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/vehicules/${id}`);
        setVehicle(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du véhicule:", err);
        setError("Impossible de charger les détails de ce véhicule.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationDates(prev => ({ ...prev, [name]: value }));
  };

  const handleReservation = () => {
    // Rediriger vers la page de réservation
    if (vehicle.contract_type === "LOCATION" || vehicle.contract_type === "LOA") {
      // Vérifier les dates pour la location
      if (vehicle.contract_type === "LOCATION" && (!reservationDates.start || !reservationDates.end)) {
        alert("Veuillez sélectionner les dates de location");
        return;
      }
      
      // Ajouter les dates à l'URL si c'est une location
      const queryParams = vehicle.contract_type === "LOCATION" 
        ? `?startDate=${reservationDates.start}&endDate=${reservationDates.end}` 
        : '';
        
      navigate(`/reservation/${id}${queryParams}`);
    } else {
      // Pour l'achat, rediriger sans dates
      navigate(`/reservation/${id}`);
    }
  };

  // Obtenir l'image du véhicule soit depuis l'API, soit depuis les images par défaut
  const getVehicleImage = (vehicle) => {
    if (vehicle?.image_url) {
      return vehicle.image_url;
    }
    
    // Utiliser l'image par défaut de la marque, ou une image générique
    return DEFAULT_IMAGES[vehicle?.brand] || 'https://via.placeholder.com/600x400?text=Véhicule';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du véhicule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={handleGoBack} className="back-button">
          Retour
        </button>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="not-found-container">
        <p>Véhicule non trouvé</p>
        <button onClick={handleGoBack} className="back-button">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="vehicle-details-container">
      <button onClick={handleGoBack} className="back-link">
        &larr; Retour aux véhicules
      </button>
      
      <div className="vehicle-details-content">
        <div className="vehicle-details-card">
          <div className="vehicle-details-grid">
            <div className="vehicle-image-container">
              <img 
                src={getVehicleImage(vehicle)} 
                alt={`${vehicle.brand} ${vehicle.model}`} 
                className="vehicle-image"
              />
            </div>
            
            <div className="vehicle-info">
              <h1 className="vehicle-title">{vehicle.brand} {vehicle.model}</h1>
              
              <div className="vehicle-price-section">
                <h2 className="price-title">Prix</h2>
                {vehicle.contract_type === "ACHAT" ? (
                  <p className="vehicle-price">{vehicle.sell_price} €</p>
                ) : (
                  <div>
                    <p className="vehicle-price">{vehicle.location_price} €</p>
                    <p className="price-per-day">par jour</p>
                  </div>
                )}
              </div>
              
              <div className="vehicle-specs">
                <div className="spec-item">
                  <span className="spec-label">Année</span>
                  <span className="spec-value">{vehicle.year}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Kilométrage</span>
                  <span className="spec-value">{vehicle.kilometers} km</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Type de contrat</span>
                  <span className="spec-value spec-highlight">
                    {vehicle.contract_type === "LOCATION" 
                      ? "Location" 
                      : vehicle.contract_type === "ACHAT" 
                        ? "Achat" 
                        : "LOA"}
                  </span>
                </div>
              </div>

              <div className="vehicle-description">
                <h2 className="section-title">Description</h2>
                <p>{vehicle.description || "Aucune description disponible pour ce véhicule."}</p>
              </div>

              <div className="vehicle-availability">
                <h2 className="section-title">Disponibilité</h2>
                <p className={vehicle.is_available ? "status-available" : "status-unavailable"}>
                  Ce véhicule est {vehicle.is_available ? "disponible" : "indisponible"} actuellement.
                </p>
              </div>

              {vehicle.contract_type === "LOCATION" && vehicle.is_available && (
                <div className="reservation-dates">
                  <h2 className="section-title">Dates de location</h2>
                  <div className="dates-inputs">
                    <div className="date-field">
                      <label htmlFor="start">Du</label>
                      <input 
                        type="date" 
                        id="start"
                        name="start"
                        value={reservationDates.start}
                        onChange={handleReservationChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="date-field">
                      <label htmlFor="end">Au</label>
                      <input 
                        type="date" 
                        id="end"
                        name="end"
                        value={reservationDates.end}
                        onChange={handleReservationChange}
                        min={reservationDates.start || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <a href="mailto:contact@m-motors.com" className="contact-button">
                  Contacter M-Motors
                </a>
                {vehicle.is_available && (
                  <button 
                    onClick={handleReservation} 
                    className="reserve-button"
                  >
                    {vehicle.contract_type === "ACHAT" ? "Acheter ce véhicule" : "Réserver ce véhicule"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
