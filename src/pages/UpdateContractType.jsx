import React, { useState } from "react";
import axios from "axios";

const UpdateContractType = ({ vehiculeId }) => {
  const [contractType, setContractType] = useState("location");

  const handleChange = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/vehicules/${vehiculeId}/contract-type`,
        { contract_type: contractType }
      );
      alert("Contrat mis à jour !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contrat", error);
    }
  };

  return (
    <div>
      <label htmlFor="contractType">Choisissez un type de contrat: </label>
      <select
        id="contractType"
        value={contractType}
        onChange={(e) => setContractType(e.target.value)}
      >
        <option value="location">Location</option>
        <option value="achat">Achat</option>
        <option value="loa">LOA</option>
      </select>
      <button onClick={handleChange}>Mettre à jour le contrat</button>
    </div>
  );
};

export default UpdateContractType;
