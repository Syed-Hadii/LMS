import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

const LandxHaari = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [haari, setHaari] = useState([]);
  const [lands, setLands] = useState([]);
  const [editLandId, setEditLandId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [totalPages, setTotalPages] = useState(1);
  const [newData, setNewData] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: "", order: "asc" });
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
  const filteredHaari = newData
    .filter((data) =>
      data.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder.key) {
        if (sortOrder.order === "asc") {
          return a[sortOrder.key] > b[sortOrder.key] ? 1 : -1;
        } else {
          return a[sortOrder.key] < b[sortOrder.key] ? 1 : -1;
        }
      }
      return 0;
    });

const fetchData = async () => {
  setLoading(true);
  try {
    // Fetch haari data
    const haariResponse = await axios.get(`${url}/haari/gethaari?all=true`);
    console.log("Haaris:", haariResponse.data);
    setHaari(haariResponse.data.haari);

    // Fetch all lands
    const landResponse = await axios.get(`${url}/land/list_land?all=true`);
    const allLands = landResponse.data.land;
    console.log("Lands:", allLands);

    // Fetch landxHaari records to get assigned lands
    const response = await axios.get(
      `${url}/landxhaari/get?page=${currentPage}&limit=${recordsPerPage}&search=${searchQuery}`
    );

    if (response) {
      const landxHaariList = response.data.landxHaariList;
      console.log("LandxHaari List:", landxHaariList);

      // Extract assigned land IDs from landxHaari data
      const assignedLandIds = landxHaariList.flatMap(
        (item) => item.land.map((land) => land.land_id._id) // Extract land_id from nested structure
      );

      console.log("Assigned Land IDs:", assignedLandIds);

      // Update lands with assigned state
      const updatedLands = allLands.map((land) => ({
        ...land,
        assigned: assignedLandIds.includes(land._id), // Mark assigned lands
      }));

      console.log("Updated Lands:", updatedLands);

      // Update state with all lands (some may be marked as assigned)
      setLands(updatedLands);

      // Update other necessary states
      setNewData(landxHaariList);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};

// In your select component
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
  className="border rounded px-2 w-full"
>
  <option value="" disabled>
    Select a land
  </option>
  {lands.map((landItem) => (
    <option
      key={landItem._id}
      value={landItem._id}
      disabled={landItem.assigned} // Disable if already assigned
    >
      {landItem.name} {landItem.assigned ? "(Assigned)" : "(Available)"}
    </option>
  ))}
</select>;



  useEffect(() => {
    console.log("LandWithHaari State:", newData);
    console.log("Lands State:", lands);
    console.log("Haari State:", haari);
  }, [newData, lands, haari]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const selectedLandId = newLand.land[0]?.land_id;
      const selectedLand = lands.find((land) => land._id === selectedLandId);

      if (selectedLand && selectedLand.assigned) {
        toast.warning("This land is already assigned!"); // Prevent adding assigned land
        return;
      }

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
      toast.success("Land Assigned Successfully!");
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      toast.error("Error assigning land. Please try again.");
    }
  };

  const handleEdit = async (e, haariId, land) => {
    e.preventDefault();
    try {
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
      setEditLandId(null);
      fetchData();
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditLandId(null);
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
    const confirmDelete = () => {
      toast.dismiss();
      deleteVoucher(haariId, landId);
    };

    toast.info(
      <div>
        Are you sure you want to delete?
        <div className="flex justify-end mt-2">
          <button
            onClick={confirmDelete}
            className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-2 py-1 bg-gray-400 text-white rounded"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const deleteVoucher = async (haariId, landId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/landxhaari/delete`, {
        haariId,
        Id: landId,
      });
      if (response.data.success) {
        toast.success("Deleted successfully!");
        fetchData();
      } else {
        toast.error("Error deleting ");
      }
    } catch (error) {
      console.error("Error deleting :", error);
      toast.error("Error deleting ");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleSort = (key) => {
    setSortOrder((prevSortOrder) => ({
      key,
      order: prevSortOrder.order === "asc" ? "desc" : "asc",
    }));
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);
  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">
        Assigned Lands to Haaries
      </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="h-full px-4 text-lg text-gray-500">
            <FaSearch />
          </button>
        </div>
        <div>
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
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">
              Assign New Land to Haari
            </h1>
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
                    value={newLand.land[0].land_id}
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
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#067528" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-7 bg-[#e0f2e9] text-xs md:text-base">
              {[
                "Haari Name",
                "Land Name",
                "Crop Name",
                "Start Date",
                "End Date",
                "Details",
                "Actions",
              ].map((header) => (
                <div
                  key={header}
                  className="py-3 text-center text-gray-800 font-semibold"
                >
                  {header}
                </div>
              ))}
            </div>

            {/* Data Rows */}
            {Array.isArray(newData) && newData.length > 0
              ? newData.map((haariItem) =>
                  Array.isArray(haariItem.land) && haariItem.land.length > 0
                    ? haariItem.land.map((land) => (
                        <div
                          key={`${haariItem.haariId?._id}-${land._id}`}
                          className="grid grid-cols-7 px-2 gap-2 border-b text-gray-700 md:text-sm text-[10px] hover:bg-gray-100"
                        >
                          <div className="py-3 text-center max-w-xs">
                            {editLandId === land._id ? (
                              <select
                                name="haariName"
                                value={newLand.haariId}
                                onChange={(e) =>
                                  setNewLand({
                                    ...newLand,
                                    haariId: e.target.value,
                                  })
                                }
                                className="border rounded px-2 w-full"
                              >
                                {haari.map((h) => (
                                  <option key={h._id} value={h._id}>
                                    {h.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              haariItem.haariId?.name || "N/A"
                            )}
                          </div>

                          <div className="py-3 text-center max-w-xs">
                            {editLandId === land._id ? (
                              <select
                                name="landName"
                                value={newLand.land[0]?.land_id || ""}
                                onChange={(e) => {
                                  const selectedLand = lands.find(
                                    (landItem) =>
                                      landItem._id === e.target.value
                                  );
                                  // Only update if the land is not assigned
                                  if (!selectedLand?.assigned) {
                                    setNewLand({
                                      ...newLand,
                                      land: [
                                        {
                                          ...newLand.land[0],
                                          land_id: selectedLand._id,
                                        },
                                      ],
                                    });
                                  }
                                }}
                                className="border rounded px-2 w-full"
                              >
                                <option value="" disabled>
                                  Select a land
                                </option>
                                {lands.map((landItem) => (
                                  <option
                                    key={landItem._id}
                                    value={landItem._id}
                                    className={
                                      landItem.assigned
                                        ? "bg-red-200"
                                        : "bg-green-200"
                                    } // Change background color based on assignment
                                    disabled={landItem.assigned}
                                  >
                                    {landItem.name}{" "}
                                    {landItem.assigned
                                      ? "(Assigned)"
                                      : "(Available)"}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              land.land_id?.name || "N/A"
                            )}
                          </div>

                          <div className="py-3 text-center max-w-xs">
                            {editLandId === land._id ? (
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
                                className="border rounded px-2 w-full"
                              />
                            ) : (
                              land.crop_name || "N/A"
                            )}
                          </div>

                          <div className="py-3 text-center max-w-xs">
                            {editLandId === land._id ? (
                              <input
                                type="date"
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
                                className="border rounded px-2 w-full"
                              />
                            ) : (
                              land.start_date || "N/A"
                            )}
                          </div>

                          <div className="py-3 text-center max-w-xs">
                            {editLandId === land._id ? (
                              <input
                                type="date"
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
                                className="border rounded px-2 w-full"
                              />
                            ) : (
                              land.end_date || "N/A"
                            )}
                          </div>

                          <div className="py-3 text-center max-w-xs">
                            {editLandId === land._id ? (
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
                                className="border rounded px-2 w-full"
                              />
                            ) : (
                              land.details || "N/A"
                            )}
                          </div>

                          <div className="py-3 text-center flex justify-center">
                            {editLandId === land._id ? (
                              <>
                                <button
                                  className="text-green-500 py-1 px-1 md:px-2 rounded-md flex items-center gap-2"
                                  onClick={(e) =>
                                    handleEdit(e, haariItem.haariId._id, land)
                                  }
                                >
                                  <FaSave className="text-sm" />
                                </button>
                                <button
                                  className="text-gray-700 py-1 md:px-2 rounded-md flex items-center gap-2"
                                  onClick={handleCancelEdit}
                                >
                                  <FaTimes className="text-sm" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="text-green-600 py-1 px-1 md:px-2 rounded-md flex items-center gap-2"
                                  onClick={() => {
                                    setEditLandId(land._id);
                                    setNewLand({
                                      haariId: haariItem.haariId._id,
                                      land: [{ ...land }],
                                    });
                                  }}
                                >
                                  <FaEdit className="text-sm" />
                                </button>
                                <button
                                  className="text-red-600 py-1 md:px-2 rounded-md flex items-center"
                                  onClick={() =>
                                    handleDelete(
                                      haariItem.haariId._id,
                                      land._id
                                    )
                                  }
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    : null
                )
              : null}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 border rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          &laquo; Previous
        </button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 border rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default LandxHaari;
