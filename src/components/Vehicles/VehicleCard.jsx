export default function VehiculeCard({ vehicule, onDelete, onEdit }) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between space-y-3 hover:shadow-lg transition duration-300">
        <img
          src={vehicule.picture}
          alt={`${vehicule.brand} ${vehicule.model}`}
          className="w-full h-48 object-cover rounded-lg"
        />
  
        <div className="flex flex-col space-y-1 text-sm text-gray-700">
          <h3 className="text-lg font-semibold">
            {vehicule.brand} {vehicule.model}
          </h3>
          <p>Année : {vehicule.year}</p>
          <p>Kilométrage : {vehicule.kilometers} km</p>
          <p>Prix location : {vehicule.location_price} €</p>
          <p>Prix vente : {vehicule.sell_price} €</p>
          <p className="italic text-gray-500">Contrat : {vehicule.contract_type}</p>
        </div>
  
        <div className="flex justify-between pt-2">
          <button
            onClick={() => onEdit(vehicule)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(vehicule.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    );
  }
  