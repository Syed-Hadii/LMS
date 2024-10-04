import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StockConsume = () => {
  const url = "http://localhost:3002";
  const [haari, setHaari] = useState([]);
  const [landNames, setLandNames] = useState([]);
  const [landxHaari, setLandxHaari] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedHaari, setSelectedHaari] = useState("");
  const [appendedItems, setAppendedItems] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);

  const fetchHaari = async () => {
    try {
      const response = await axios.get(`${url}/haari/gethaari`);
      setHaari(response.data.data);
    } catch (error) {
      console.error("Error fetching haari:", error);
    }
  };

  const fetchLandNames = async () => {
    try {
      const response = await axios.get(`${url}/land/list_land`);
      setLandNames(response.data.data);
    } catch (error) {
      console.error("Error fetching land names:", error);
    }
  };
  const fetchLandxHaari = async () => {
    try {
      const response = await axios.get(`${url}/landxhaari/get`);
      setLandxHaari(response.data.data);
    } catch (error) {
      console.error("Error fetching land names:", error);
    }
  };
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${url}/items/view`);
      setItems(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const handleHaariChange = (e) => {
    const selectedHaariId = e.target.value;
    setSelectedHaari(selectedHaariId);
    const assignedLandIds = landxHaari
      .filter((lxh) => lxh.haariId._id === selectedHaariId)
      .flatMap((lxh) => lxh.land.map((land) => land.land_id._id));

    console.log("Assigned land IDs:", assignedLandIds);
    const filteredLands = landNames.filter((land) =>
      assignedLandIds.includes(land._id)
    );
    setFilteredLands(filteredLands);
  };
  const handleAddItem = () => {
    setAppendedItems((prevItems) => [
      ...prevItems,
      { itemId: "", land_id: "", stockToConsume: "", stockAvailable: "" },
    ]);
  };

  const handleRemoveItem = (index) => {
    setAppendedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleSaveItems = async () => {
    if (!selectedHaari || appendedItems.length === 0) {
      alert("Please select a haari and add items before saving.");
      return;
    }

    for (const item of appendedItems) {
      if (item.stockToConsume > item.stockAvailable) {
        alert(`Insufficient stock for item ${item.itemId}.`);
        return;
      }
    }

    const stockCon = appendedItems.map((item) => ({
      item_id: item.itemId,
      land_id: item.land_id,
      stock_con: item.stockToConsume,
      date: new Date().toISOString(),
    }));

    try {
      const response = await axios.post(`${url}/stockconsume/add`, {
        haariId: selectedHaari,
        stockCon,
      });

      if (response.data.success) {
       toast.success("Stock Consumed Successfully!");
        setAppendedItems([]);
        setSelectedHaari("");
        await fetchHaari();
        window.location.reload();
      }
      else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error saving items:", error);
      alert("Error saving items. Please try again.");
    }
  };

  const handleRowChange = (index, field, value) => {
    const updatedItems = [...appendedItems];
    updatedItems[index][field] = value;

    if (field === "itemId" && value) {
      const selectedItem = items.find((item) => item._id === value);
      updatedItems[index].stockAvailable = selectedItem?.pkg_qty || 0;
    }

    setAppendedItems(updatedItems);
  };

  useEffect(() => {
    fetchHaari();
    fetchLandNames();
    fetchLandxHaari();
    fetchItems();
  }, []);
  useEffect(() => {
    console.log(landxHaari);
  }, [landxHaari]);

  return (
    <div>
      <h2 className="text-2xl text-center font-bold mb-10 mt-5">
        Stock Consume
      </h2>
      <div className="p-6 bg-gray-100 rounded-lg ">
        <div className="mb-4">
          <label
            htmlFor="haari"
            className="block text-gray-700 font-semibold mb-1"
          >
            Haari:
          </label>
          <select
            id="haari"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={selectedHaari}
            onChange={handleHaariChange}
            required
          >
            <option value="">Select Haari</option>
            {haari.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <table className="min-w-full bg-white border rounded-lg shadow-lg mb-6">
          <thead>
            <tr>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold border-b border-gray-300">
                Items
              </th>
              <th className="py-3 px-5 text-left text-gray-600 font-semibold border-b border-gray-300">
                Land Name
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-b border-gray-300">
                Stock Available
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-b border-gray-300">
                Stock Consume
              </th>
              <th className="py-3 px-9 text-left text-gray-600 font-semibold border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {appendedItems.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 px-4">
                  <select
                    className="border outline-none border-gray-300 rounded-md p-2 w-72"
                    value={row.itemId}
                    onChange={(e) =>
                      handleRowChange(index, "itemId", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Item</option>
                    {items.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <select
                    className="border outline-none border-gray-300 rounded-md p-2 w-72"
                    value={row.land_id}
                    onChange={(e) =>
                      handleRowChange(index, "land_id", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Land Name</option>
                    {filteredLands.map((land) => (
                      <option key={land._id} value={land._id}>
                        {land.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={row.stockAvailable}
                    disabled
                    className="border border-gray-300 rounded-md p-2 text-center w-full"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={row.stockToConsume}
                    onChange={(e) =>
                      handleRowChange(index, "stockToConsume", e.target.value)
                    }
                    className="border border-gray-300 text-center rounded-md p-2 w-full"
                    required
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 px-4 py-1 rounded hover:bg-red-100"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-x-2">
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-2 py-1 rounded-md mb-4"
          >
            Add Item
          </button>

          <button
            onClick={handleSaveItems}
            className="bg-green-500 text-white px-4 py-1 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockConsume;
