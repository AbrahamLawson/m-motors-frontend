import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8000/vehicules";

export default function VehiculeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicule, setVehicule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicule = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${id}`);
        setVehicule(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicule();
  }, [id]);

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!vehicule) return <p className="p-4 text-red-500">Véhicule introuvable</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Retour
      </button>

      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={vehicule.picture}
          alt={`${vehicule.brand} ${vehicule.model}`}
          className="w-full h-64 object-cover rounded"
        />

        <div className="flex flex-col space-y-2 text-gray-700">
          <h2 className="text-2xl font-bold">
            {vehicule.brand} {vehicule.model}
          </h2>
          <p>Année : {vehicule.year}</p>
          <p>Kilométrage : {vehicule.kilometers} km</p>
          <p>Prix location : {vehicule.location_price} €</p>
          <p>Prix vente : {vehicule.sell_price} €</p>
          <p>Description : {vehicule.description}</p>
          <p>Contrat : {vehicule.contract_type}</p>

          <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
            {vehicule.comprehensive_insurance && <li>Assurance tous risques</li>}
            {vehicule.breakdown_assistance && <li>Assistance panne</li>}
            {vehicule.maintenance_and_ass && <li>Entretien inclus</li>}
            {vehicule.technical_inspection && <li>Contrôle technique à jour</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
