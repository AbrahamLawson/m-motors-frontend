import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css"; // Import du fichier CSS

const API_BASE = "http://localhost:8000";

export default function VehicleFilter() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelSearch, setModelSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [year, setYear] = useState("");
  const [contractType, setContractType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dates, setDates] = useState({ start: "", end: "" });
  const [error, setError] = useState("");

  // Liste des marques disponibles
  const availableBrands = ["Toyota", "BMW", "Renault", "Mercedes", "Audi"];

  // Charger toutes les voitures au chargement de la page
  useEffect(() => {
    fetchAllVehicles();
  }, []);

  // Fonction pour récupérer toutes les voitures
  const fetchAllVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/vehicules/`);
      setVehicles(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des véhicules :", err);
      setVehicles([]);
      setError("Impossible de charger les véhicules. Veuillez réessayer plus tard.");
      setLoading(false);
    }
  };

  // Gérer la sélection/désélection des marques
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  // Sélectionner toutes les marques
  const selectAllBrands = () => {
    setSelectedBrands(availableBrands);
  };

  // Désélectionner toutes les marques
  const deselectAllBrands = () => {
    setSelectedBrands([]);
  };

  // Fonction pour filtrer les véhicules
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Vérifier si des filtres sont appliqués
      const hasFilters = modelSearch || selectedBrands.length > 0 || year || contractType || 
                        (priceRange.min && priceRange.max) || 
                        (dates.start && dates.end);
      
      // Si aucun filtre n'est appliqué, charger tous les véhicules
      if (!hasFilters) {
        fetchAllVehicles();
        return;
      }
      
      // Construire l'URL avec le filtre approprié
      let url = "";
      
      if (modelSearch) {
        url = `${API_BASE}/filters/vehicules/filters/model/?model=${modelSearch}`;
      } else if (selectedBrands.length > 0) {
        // Si on a plusieurs marques sélectionnées, on fait plusieurs requêtes et on combine les résultats
        if (selectedBrands.length === 1) {
          url = `${API_BASE}/filters/vehicules/brand/${selectedBrands[0]}`;
        } else {
          const brandPromises = selectedBrands.map(brand => 
            axios.get(`${API_BASE}/filters/vehicules/brand/${brand}`)
          );
          
          const responses = await Promise.all(brandPromises);
          const allVehicles = responses.flatMap(res => res.data);
          
          // Éliminer les doublons si nécessaire (par ID)
          const uniqueVehicles = Array.from(new Map(allVehicles.map(v => [v.id, v])).values());
          
          setVehicles(uniqueVehicles);
          setLoading(false);
          return;
        }
      } else if (year) {
        url = `${API_BASE}/filters/vehicules/filters/year/?year=${year}`;
      } else if (contractType) {
        url = `${API_BASE}/filters/vehicules/contract_type/${contractType}`;
      } else if (priceRange.min && priceRange.max) {
        url = `${API_BASE}/filters/vehicules/price/?price_min=${priceRange.min}&price_max=${priceRange.max}`;
      } else if (dates.start && dates.end) {
        url = `${API_BASE}/filters/vehicules/availability/?start_date=${dates.start}&end_date=${dates.end}`;
      }

      if (url) {
        const res = await axios.get(url);
        setVehicles(res.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
      setVehicles([]);
      setError("Erreur lors de la recherche. Veuillez vérifier vos filtres et réessayer.");
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setModelSearch("");
    setSelectedBrands([]);
    setYear("");
    setContractType("");
    setPriceRange({ min: "", max: "" });
    setDates({ start: "", end: "" });
    setError("");
    fetchAllVehicles();
  };

  return (
    <div className="vehicle-container">
      <h1 className="page-title">Nos Véhicules</h1>
      
      <div className="layout-container">
        {/* Filtres - Colonne de gauche */}
        <div className="filters-column">
          <h2 className="section-title">Filtres</h2>
          
          {/* Barre de recherche */}
          <div className="filter-group">
            <label className="filter-label">Rechercher par modèle</label>
            <input
              type="text"
              placeholder="Ex: Corolla, Clio..."
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Marques - Cases à cocher */}
          <div className="filter-group">
            <p className="filter-label">Marque</p>
            <div className="brands-actions">
              <button 
                onClick={selectAllBrands} 
                className="brand-action-btn"
                type="button"
              >
                Toutes
              </button>
              <button 
                onClick={deselectAllBrands} 
                className="brand-action-btn"
                type="button"
              >
                Aucune
              </button>
            </div>
            <div className="checkbox-group">
              {availableBrands.map((brand) => (
                <label key={brand} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type de contrat */}
          <div className="filter-group">
            <p className="filter-label">Type de contrat</p>
            <div className="radio-group">
              {[
                { value: "", label: "Tous" },
                { value: "location", label: "Location" },
                { value: "achat", label: "Achat" }
              ].map((type) => (
                <label key={type.value} className="radio-label">
                  <input
                    type="radio"
                    name="contractType"
                    value={type.value}
                    checked={contractType === type.value}
                    onChange={(e) => setContractType(e.target.value)}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Année */}
          <div className="filter-group">
            <label className="filter-label">Année</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-field"
              placeholder="Ex: 2020"
            />
          </div>

          {/* Prix */}
          <div className="filter-group">
            <p className="filter-label">Prix (€)</p>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Disponibilité */}
          <div className="filter-group">
            <p className="filter-label">Disponibilité</p>
            <div className="date-inputs">
              <div className="date-field">
                <label className="date-label">Date début</label>
                <input
                  type="date"
                  value={dates.start}
                  onChange={(e) => setDates({ ...dates, start: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="date-field">
                <label className="date-label">Date fin</label>
                <input
                  type="date"
                  value={dates.end}
                  onChange={(e) => setDates({ ...dates, end: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="button-group">
            <button
              onClick={fetchVehicles}
              className="button primary-button"
            >
              Appliquer les filtres
            </button>
            <button
              onClick={resetFilters}
              className="button secondary-button"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Liste des véhicules - Colonne de droite */}
        <div className="vehicles-column">
          <h2 className="section-title">Résultats</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="loading-state">
              <p>Chargement des véhicules...</p>
            </div>
          ) : vehicles.length > 0 ? (
            <div className="vehicles-list">
              {vehicles.map((vehicle) => (
                <Link 
                  to={`/vehicles/${vehicle.id}`} 
                  key={vehicle.id} 
                  className="vehicle-item"
                >
                  <div className="vehicle-header">
                    <h3 className="vehicle-title">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div>
                      {vehicle.contract_type === "ACHAT" ? (
                        <p className="vehicle-price">{vehicle.sell_price} €</p>
                      ) : (
                        <p className="vehicle-price">{vehicle.location_price} €/jour</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="vehicle-tags">
                    <span className="vehicle-tag">
                      {vehicle.year}
                    </span>
                    <span className="vehicle-tag">
                      {vehicle.kilometers} km
                    </span>
                    <span className="vehicle-tag">
                      {vehicle.contract_type === "LOCATION" 
                        ? "Location" 
                        : vehicle.contract_type === "ACHAT" 
                          ? "Achat" 
                          : "LOA"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Aucun véhicule trouvé pour cette recherche</p>
              <button 
                onClick={resetFilters} 
                className="button secondary-button"
              >
                Voir tous les véhicules
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
