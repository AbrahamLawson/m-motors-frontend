import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/vehicules"; 

export default function AddVehiculeForm() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    picture: "",
    kilometers: 0,
    year: 2024,
    location_price: 0,
    sell_price: 0,
    description: "",
    comprehensive_insurance: false,
    breakdown_assistance: false,
    maintenance_and_ass: false,
    technical_inspection: false,
    contract_type: "location",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/`, formData);
      alert("Véhicule ajouté avec succès !");
      setFormData({
        brand: "",
        model: "",
        picture: "",
        kilometers: 0,
        year: 2024,
        location_price: 0,
        sell_price: 0,
        description: "",
        comprehensive_insurance: false,
        breakdown_assistance: false,
        maintenance_and_ass: false,
        technical_inspection: false,
        contract_type: "location",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule :", error);
      alert("Échec de l'ajout du véhicule.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-semibold">Ajouter un véhicule</h2>

      <input name="brand" placeholder="Marque" value={formData.brand} onChange={handleChange} className="w-full border p-2" />
      <input name="model" placeholder="Modèle" value={formData.model} onChange={handleChange} className="w-full border p-2" />
      <input name="picture" placeholder="URL de l'image" value={formData.picture} onChange={handleChange} className="w-full border p-2" />
      
      <input name="kilometers" type="number" placeholder="Kilométrage" value={formData.kilometers} onChange={handleChange} className="w-full border p-2" />
      <input name="year" type="number" placeholder="Année" value={formData.year} onChange={handleChange} className="w-full border p-2" />
      <input name="location_price" type="number" placeholder="Prix de location" value={formData.location_price} onChange={handleChange} className="w-full border p-2" />
      <input name="sell_price" type="number" placeholder="Prix de vente" value={formData.sell_price} onChange={handleChange} className="w-full border p-2" />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-2" />

      <div className="space-x-2">
        <label><input type="checkbox" name="comprehensive_insurance" checked={formData.comprehensive_insurance} onChange={handleChange} /> Assurance tous risques</label>
        <label><input type="checkbox" name="breakdown_assistance" checked={formData.breakdown_assistance} onChange={handleChange} /> Assistance panne</label>
        <label><input type="checkbox" name="maintenance_and_ass" checked={formData.maintenance_and_ass} onChange={handleChange} /> Entretien</label>
        <label><input type="checkbox" name="technical_inspection" checked={formData.technical_inspection} onChange={handleChange} /> Contrôle technique</label>
      </div>

      <div>
        <label className="block mb-1">Type de contrat :</label>
        {["location", "achat", "loa"].map((type) => (
          <label key={type} className="mr-4">
            <input
              type="radio"
              name="contract_type"
              value={type}
              checked={formData.contract_type === type}
              onChange={handleChange}
            />{" "}
            {type}
          </label>
        ))}
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Ajouter le véhicule
      </button>
    </form>
  );
}
