import { useEffect, useState } from "react";
import axios from "axios";
import VehiculeCard from "./VehiculeCard";

const API_BASE = "http://localhost:8000/vehicules";

export default function VehiculeList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/`);
      setVehicles(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce véhicule ?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEdit = (vehicule) => {
    alert("Fonction de modification à implémenter !");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Liste des véhicules</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : vehicles.length === 0 ? (
        <p>Aucun véhicule trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicule) => (
            <VehiculeCard
              key={vehicule.id}
              vehicule={vehicule}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
