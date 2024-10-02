import React, { useState, useEffect } from "react";
import axios from "axios";

const StockRecieved = () => {
  const url = "http://localhost:3002";
  const [vendor, setVendor] = useState([]);
  const [items, setItems] = useState([]);
  const [bank, setBank] = useState([]);
  const [appendedItems, setAppendedItems] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const fetchVendor = async () => {
    try {
      const response = await axios.get(`${url}/supplier/get`);
      setVendor(response.data.data);
    } catch (error) {
      console.error("Error fetching vendor:", error);
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
  const fetchBank = async () => {
    try {
      const response = await axios.get(`${url}/bank/get`);
      setBank(response.data.data);
    } catch (error) {
      console.error("Error fetching bank:", error);
    }
  };

  const handleSaveItems = async () => {
    if (!selectedVendor || appendedItems.length === 0) {
      alert("Please select a vendor and add items before saving.");
      return;
    }

    const stockCon = appendedItems.map((item) => ({
      item_id: item.itemId,
      stock_recieved: item.stockToRecieve,
      stock_amount: item.stockAmount,
      payment_method: item.paymentMethod,
      bank_name: item.paymentMethod === "bank" ? item.bankName : "",
    }));

    try {
      const response = await axios.post(`${url}/stockrecieve/add`, {
        vendorId: selectedVendor,
        stockCon,
      });

      if (response.data.success) {
        alert("Items saved successfully!");
        setAppendedItems([]);
        setSelectedVendor("");
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error saving items:", error);
      alert("Error saving items. Please try again.");
    }
  };

  const handleAddItem = () => {
    setAppendedItems((prevItems) => [
      ...prevItems,
      {
        itemId: "",
        stockToRecieve: "",
        stockAvailable: "",
        stockAmount: "",
        paymentMethod: "",
        bankName: "",
      },
    ]);
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

  const handleRemoveItem = (index) => {
    setAppendedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchVendor();
    fetchItems();
    fetchBank();
  }, []);

  return (
    <div>
      <h2 className="text-2xl text-center font-bold mb-10 mt-5">
        Stock Recieved
      </h2>
      <div className="p-6 bg-gray-100 rounded-lg ">
        <div className="mb-4">
          <label
            htmlFor="vendor"
            className="block text-gray-700 font-semibold mb-1"
          >
            Vendor:
          </label>
          <select
            id="vendor"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            required
          >
            <option value="">Select Vendor</option>
            {vendor.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
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
              <th className="py-3 px-5 text-center text-gray-600 font-semibold border-b border-gray-300">
                Stock Available
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-b border-gray-300">
                Stock Recieve
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-b border-gray-300">
                Stock Amount
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-b border-gray-300">
                Payment Method
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-b border-gray-300">
                Bank Name
              </th>
              <th className="py-3 px-8 text-left text-gray-600 font-semibold border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300 text-sm">
            {appendedItems.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100 transition-colors">
                <td className="py-3 pl-4 pr-2">
                  <select
                    className="border outline-none border-gray-300 rounded-md p-2 w-36"
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

                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={row.stockAvailable}
                    disabled
                    className="border border-gray-300 rounded-md p-2 text-center w-[90px]"
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={row.stockToRecieve}
                    onChange={(e) =>
                      handleRowChange(index, "stockToRecieve", e.target.value)
                    }
                    className="border border-gray-300 text-center rounded-md p-2 w-[90px]"
                    required
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={row.stockAmount}
                    onChange={(e) =>
                      handleRowChange(index, "stockAmount", e.target.value)
                    }
                    className="border border-gray-300 text-center rounded-md p-2 w-36"
                    required
                  />
                </td>
                <td className="py-3 px-2">
                  <select
                    className="border outline-none border-gray-300 rounded-md p-2 w-[135px] text-sm"
                    value={row.paymentMethod}
                    onChange={(e) =>
                      handleRowChange(index, "paymentMethod", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Method</option>
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank">Bank</option>
                  </select>
                </td>
                <td className="py-3 px-2">
                  <input
                    type="text"
                    value={row.bankName}
                    onChange={(e) =>
                      handleRowChange(index, "bankName", e.target.value)
                    }
                    className="border border-gray-300 text-center rounded-md p-2 w-36"
                    disabled={row.paymentMethod !== "bank"}
                    placeholder="Enter Bank Name"
                  />
                </td>
                <td className="py-3 pr-4 pl-2 text-center">
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
            className="bg-green-500 text-white px-4 py-1 rounded-md mb-4"
          >
            Save 
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockRecieved;
