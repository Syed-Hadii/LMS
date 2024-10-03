import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

const LandxHaari = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [haari, setHaari] = useState([]);
  const [lands, setLands] = useState([]);
  const [landxHaariList, setLandxHaariList] = useState([]);
  const [newLand, setNewLand] = useState({
    haariId: "",
    land: [
      {
        land_id: "",
        crop_name: "",
        start_date: "",
        end_date: "",
        details: "",
      },
    ],
  });
 

  const [editLand, setEditLand] = useState(null);

  useEffect(() => {
    const fetchHaari = async () => {
      try {
        const response = await axios.get(`${url}/haari/gethaari`);
        setHaari(response.data.data);
      } catch (error) {
        console.error("Error fetching haari:", error);
      }
    };

    fetchHaari();
  }, []);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const response = await axios.get(`${url}/land/list_land`);
        setLands(response.data.data);
      } catch (error) {
        console.error("Error fetching lands:", error);
      }
    };

    fetchLand();
  }, []);

  const fetchLandxHaari = async () => {
    try {
      const response = await axios.get(`${url}/landxhaari/get`);
      // console.log(response.data);
      setLandxHaariList(response.data.data);
    } catch (error) {
      console.error("Error fetching LandxHaari:", error);
    }
  };

    const handleAdd = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          haariId: newLand.haariId,
          landId: newLand.land.map((item) => ({
            land_id: item.land_id,
            crop_name: item.crop_name,
            start_date: item.start_date,
            end_date: item.end_date,
            details: item.details,
          })),
        };
        await axios.post(`${url}/landxhaari/add`, payload);
        setShowAddForm(false);
        fetchLandxHaari();
      } catch (error) {
        console.error("Error adding item:", error);
      }
    };


const handleEdit = async (e, haariId, land) => {
  e.preventDefault();
  try {
    // console.log(land._id);
    const updatedLand = {
      haariId: haariId,
      landId: [
        {
          land_id: land._id,
          crop_name: newLand.land[0].crop_name,
          start_date: newLand.land[0].start_date,
          end_date: newLand.land[0].end_date,
          details: newLand.land[0].details,
        },
      ],
    };

    await axios.put(`${url}/landxhaari/update`, updatedLand);
    setEditLand(null);
    fetchLandxHaari();
  } catch (error) {
    console.error("Error editing item:", error);
  }
};

const handleCancelEdit = () => {
  setEditLand(null);
  setNewLand({
    haariId: "",
    land: [
      {
        land_id: "",
        crop_name: "",
        start_date: "",
        end_date: "",
        details: "",
      },
    ],
  });
};


 const handleDelete = async (haariId, landId) => {
   try {
     const response = await axios.post(`${url}/landxhaari/delete`, {
       haariId,
       Id: landId,
     });
     if (response.data.success) {
       fetchLandxHaari(); // Refresh the list after deletion
       console.log("Delete successful:", response.data.message);
     } else {
       console.error("Delete failed:", response.data.message);
     }
   } catch (error) {
     console.error("Error deleting item:", error);
   }
 };



  useEffect(() => {
    fetchLandxHaari();
  }, []);
  useEffect(() => {
    console.log("Updated landxHaariList:", landxHaariList);
    // console.log(landxHaariList.haariId[0]);
  }, [landxHaariList]);
 
  return (
    <div className="p-6">
      <h1 className="text-3xl underline font-bold text-center">
        Assigned Lands to Haaries
      </h1>
      <button
        className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mb-5"
        onClick={() => {
          setShowAddForm(true);
          setNewLand({
            haariId: "",
            land: [
              {
                land_id: "",
                crop_name: "",
                start_date: "",
                end_date: "",
                details: "",
              },
            ],
          });
        }}
      >
        <FaPlus className="text-sm" /> Assign Land
      </button>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">Add New LandxHaari</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAdd}>
              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="haariId"
                  >
                    Haari ID
                  </label>
                  <select
                    value={newLand.haariId}
                    className="border w-full px-2 outline-none py-2 rounded-md text-black bg-white"
                    onChange={(e) =>
                      setNewLand({ ...newLand, haariId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Haari</option>
                    {Array.isArray(haari) && haari.length > 0 ? (
                      haari.map((hari) => (
                        <option key={hari._id} value={hari._id}>
                          {hari.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No haari available</option>
                    )}
                  </select>
                </div>
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="land"
                  >
                    Land ID
                  </label>
                  <select
                    value={newLand.land[0].land_id} // Update this line to reflect the correct structure
                    className="border w-full px-2 outline-none py-2 rounded-md text-black bg-white"
                    onChange={(e) => {
                      setNewLand({
                        ...newLand,
                        land: [
                          {
                            land_id: e.target.value,
                            crop_name: newLand.land[0].crop_name,
                            start_date: newLand.land[0].start_date,
                            end_date: newLand.land[0].end_date,
                            details: newLand.land[0].details,
                          },
                        ],
                      });
                    }}
                    required
                  >
                    <option value="">Select Land</option>
                    {Array.isArray(lands) && lands.length > 0 ? (
                      lands.map((land) => (
                        <option key={land._id} value={land._id}>
                          {land.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Land available</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="crop_name"
                  >
                    Crop Name
                  </label>
                  <input
                    type="text"
                    name="crop_name"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Crop Name"
                    value={newLand.land[0].crop_name}
                    onChange={(e) =>
                      setNewLand({
                        ...newLand,
                        land: [
                          { ...newLand.land[0], crop_name: e.target.value },
                        ],
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="start_date"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    value={newLand.land[0].start_date}
                    onChange={(e) =>
                      setNewLand({
                        ...newLand,
                        land: [
                          { ...newLand.land[0], start_date: e.target.value },
                        ],
                      })
                    }
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="end_date"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    value={newLand.land[0].end_date}
                    onChange={(e) =>
                      setNewLand({
                        ...newLand,
                        land: [
                          { ...newLand.land[0], end_date: e.target.value },
                        ],
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="details"
                  >
                    Details
                  </label>
                  <textarea
                    name="details"
                    className="border w-full h-24 px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Details"
                    value={newLand.land[0].details}
                    onChange={(e) =>
                      setNewLand({
                        ...newLand,
                        land: [{ ...newLand.land[0], details: e.target.value }],
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className=" flex justify-end gap-7">
                <button
                  className="text-red-600 font-semibold px-3 py-1 rounded-md"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-3 py-1 rounded-md"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              className="mt-4 text-red-500"
              onClick={() => setShowAddForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Display LandxHaari List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-2 text-left text-gray-600 font-semibold w-1/6">
                Haari Name
              </th>
              <th className="py-3 px-2 text-left text-gray-600 font-semibold w-1/6">
                Land Name
              </th>
              <th className="py-3 px-2 text-left text-gray-600 font-semibold w-1/6">
                Crop Name
              </th>
              <th className="py-3 px-2 text-left text-gray-600 font-semibold w-1/6">
                Start Date
              </th>
              <th className="py-3 px-2 text-left text-gray-600 font-semibold w-1/6">
                End Date
              </th>
              <th className="py-3 px-2 text-left text-gray-600 font-semibold w-1/6">
                Details
              </th>
              <th className="py-3 px-2 text-left text-gray-600 font-semibold w-1/6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {landxHaariList.map((haariItem) =>
              haariItem.land.map((land, index) => (
                <tr
                  key={`${haariItem.haariId._id}-${land.land_id._id}`}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="py-3 px-2 w-1/6">
                    {editLand === haariItem.haariId._id ? (
                      <select
                        name="haariName"
                        value={newLand.haariId}
                        onChange={(e) =>
                          setNewLand({
                            ...newLand,
                            haariId: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded max-w-28"
                      >
                        {haari.map((haari) => (
                          <option key={haari._id} value={haari._id}>
                            {haari.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      haariItem.haariId.name
                    )}
                  </td>
                  <td className="py-3 px-2 w-1/6">
                    {editLand === haariItem.haariId._id ? (
                      <select
                        name="landName"
                        value={newLand.land[0]?.land_id || ""}
                        onChange={(e) =>
                          setNewLand({
                            ...newLand,
                            land: [
                              {
                                ...newLand.land[0],
                                land_id: e.target.value,
                              },
                            ],
                          })
                        }
                        className="border px-2 py-1 rounded max-w-full"
                      >
                        {lands.map((landItem) => (
                          <option key={landItem._id} value={landItem._id}>
                            {landItem.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      land.land_id.name
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {editLand === haariItem.haariId._id ? (
                      <input
                        type="text"
                        name="cropName"
                        value={newLand.land[0]?.crop_name || ""}
                        onChange={(e) =>
                          setNewLand({
                            ...newLand,
                            land: [
                              {
                                ...newLand.land[0],
                                crop_name: e.target.value,
                              },
                            ],
                          })
                        }
                        className="border px-2 py-1 rounded max-w-32"
                      />
                    ) : (
                      land.crop_name
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {editLand === haariItem.haariId._id ? (
                      <input
                        type="text"
                        name="startDate"
                        value={newLand.land[0]?.start_date || ""}
                        onChange={(e) =>
                          setNewLand({
                            ...newLand,
                            land: [
                              {
                                ...newLand.land[0],
                                start_date: e.target.value,
                              },
                            ],
                          })
                        }
                        className="border px-2 py-1 rounded max-w-28"
                      />
                    ) : (
                      land.start_date
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {editLand === haariItem.haariId._id ? (
                      <input
                        type="text"
                        name="endDate"
                        value={newLand.land[0]?.end_date || ""}
                        onChange={(e) =>
                          setNewLand({
                            ...newLand,
                            land: [
                              {
                                ...newLand.land[0],
                                end_date: e.target.value,
                              },
                            ],
                          })
                        }
                        className="border px-2 py-1 rounded max-w-28"
                      />
                    ) : (
                      land.end_date
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {editLand === haariItem.haariId._id ? (
                      <input
                        type="text"
                        name="details"
                        value={newLand.land[0]?.details || ""}
                        onChange={(e) =>
                          setNewLand({
                            ...newLand,
                            land: [
                              {
                                ...newLand.land[0],
                                details: e.target.value,
                              },
                            ],
                          })
                        }
                        className="border px-2 py-1 rounded max-w-40"
                      />
                    ) : (
                      land.details
                    )}
                  </td>
                  <td className="px-2 py-4 flex gap-2 items-center justify-center">
                    {editLand === haariItem.haariId._id ? (
                      <>
                        <button
                          onClick={(e) =>
                            handleEdit(e, haariItem.haariId._id, land)
                          }
                          className="bg-green-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditLand(haariItem.haariId._id);
                            // Populate the newLand state with the current land details for editing
                            setNewLand({
                              haariId: haariItem.haariId._id,
                              land: [
                                {
                                  land_id: land.land_id._id,
                                  crop_name: land.crop_name,
                                  start_date: land.start_date,
                                  end_date: land.end_date,
                                  details: land.details,
                                },
                              ],
                            });
                          }}
                          className="bg-blue-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(haariItem.haariId._id, land._id)
                          }
                          className="bg-red-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LandxHaari;
