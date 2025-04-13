import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/filters";

export default function VehicleFilter() {
  const [vehicles, setVehicles] = useState([]);
  const [modelSearch, setModelSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [contractType, setContractType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dates, setDates] = useState({ start: "", end: "" });

  const fetchVehicles = async () => {
    try {
      let url = "";

      if (modelSearch) {
        url = `${API_BASE}/vehicules/filters/model/?model=${modelSearch}`;
      } else if (brand) {
        url = `${API_BASE}/vehicules/brand/${brand}`;
      } else if (year) {
        url = `${API_BASE}/vehicules/filters/year/?year=${year}`;
      } else if (contractType) {
        url = `${API_BASE}/vehicules/contract_type/${contractType}`;
      } else if (priceRange.min && priceRange.max) {
        url = `${API_BASE}/vehicules/price/?price_min=${priceRange.min}&price_max=${priceRange.max}`;
      } else if (dates.start && dates.end) {
        url = `${API_BASE}/vehicules/availability/?start_date=${dates.start}&end_date=${dates.end}`;
      }

      if (url) {
        const res = await axios.get(url);
        setVehicles(res.data);
      } else {
        alert("Veuillez remplir au moins un filtre.");
      }
    } catch (err) {
      console.error("Erreur lors de la recherche :", err);
      setVehicles([]);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par modèle"
        value={modelSearch}
        onChange={(e) => setModelSearch(e.target.value)}
        className="border px-2 py-1 w-full mb-4"
      />

      {/* Marque */}
      <div className="mb-4">
        <p>Filtrer par marque:</p>
        {["Toyota", "BMW", "Renault"].map((b) => (
          <label key={b} className="block">
            <input
              type="radio"
              name="brand"
              value={b}
              onChange={(e) => setBrand(e.target.value)}
            />
            {b}
          </label>
        ))}
      </div>

      {/* Contrat */}
      <div className="mb-4">
        <p>Type de contrat:</p>
        {["location", "achat"].map((type) => (
          <label key={type} className="block">
            <input
              type="radio"
              name="contractType"
              value={type}
              onChange={(e) => setContractType(e.target.value)}
            />
            {type}
          </label>
        ))}
      </div>

      {/* Année */}
      <div className="mb-4">
        <p>Année du véhicule:</p>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-2 py-1"
        />
      </div>

      {/* Prix */}
      <div className="mb-4">
        <p>Gamme de prix:</p>
        <input
          type="number"
          placeholder="Prix min"
          value={priceRange.min}
          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="number"
          placeholder="Prix max"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          className="border px-2 py-1"
        />
      </div>

      {/* Disponibilité */}
      <div className="mb-4">
        <p>Disponibilité (date):</p>
        <input
          type="date"
          value={dates.start}
          onChange={(e) => setDates({ ...dates, start: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="date"
          value={dates.end}
          onChange={(e) => setDates({ ...dates, end: e.target.value })}
          className="border px-2 py-1"
        />
      </div>

      {/* Bouton Rechercher */}
      <button
        onClick={fetchVehicles}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Rechercher
      </button>

      {/* Résultats */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Résultats :</h2>
      <ul>
        {vehicles.length > 0 ? (
          vehicles.map((v) => (
            <li key={v.id} className="border p-2 mb-2">
              {v.brand} {v.model} - {v.year} - {v.sell_price}€
            </li>
          ))
        ) : (
          <p className="text-gray-500">Aucun résultat</p>
        )}
      </ul>
    </div>
  );
}
