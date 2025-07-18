import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProgram,
  editProgram,
  deleteProgram,
} from "../../../Redux/programs";

const ViewPrograms = () => {
  const { universityName } = useParams();
  const dispatch = useDispatch();
  const { programs, loading, error: fetchError } = useSelector(
    (s) => s.programs
  );
  const token = localStorage.getItem("University authToken");

  const [editingProgram, setEditingProgram] = useState(null);
  const [originalProgram, setOriginalProgram] = useState(null);
  const [error, setError] = useState(null);

  const departments = useSelector((state) => state.department.departments) || [];
  // Fetch on mount or when universityName changes
  useEffect(() => {
    if (token) {
      dispatch(fetchProgram({ token, universityName }));
    }
  }, [dispatch, token, universityName]);

  // Start editing: clone both original + editable
  const handleEdit = (prog) => {
    setOriginalProgram(prog);
    setEditingProgram({ ...prog });
    setError(null);
  };

  // Delete action
  const deleteprogram = (id) =>
    dispatch(deleteProgram({ token, universityName, id }));

  // Save changes: diff and dispatch
  const handleUpdate = () => {
    if (!token) {
      setError("Missing auth token");
      return;
    }
    if (!editingProgram || !originalProgram) {
      setError("No program selected to edit");
      return;
    }
    // console the payload for debugging
    console.log("Editing Program Payload:", {
      token,
      universityName,
      id: editingProgram._id,
      changes: editingProgram,
    });

    // Build a `changes` object
    const changes = {};
    for (const key in editingProgram) {
      if (["_id", "__v", "createdAt"].includes(key)) continue;
      if (editingProgram[key] !== originalProgram[key]) {
        changes[key] = editingProgram[key];
      }
    }

    if (Object.keys(changes).length === 0) {
      return alert("No changes made");
    }

    dispatch(
      editProgram({
        token,
        universityName,
        id: editingProgram._id,
        changes,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setEditingProgram(null);
        setOriginalProgram(null);

      } else {
        setError(res.payload || "Failed to save changes");
      }
    });
  };

  console.log("Programs Data:", programs);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Programs</h1>
      {(fetchError || error) && (
        <div className="text-red-500 mb-4">{fetchError || error}</div>
      )}

      {/* Programs Table */}
      <div className="overflow-auto max-w-full max-h-screen">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1">S.N.</th>
              <th className="border p-1">Name</th>
              <th className="border p-1">Type</th>
              <th className="border p-1">Level</th>
              <th className="border p-1">Duration</th>
              <th className="border p-1">Department</th>
              <th className="border p-1">Syllabus</th>
              <th className="border p-1">Eligibility</th>
              <th className="border p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program, idx) => (
              <tr key={program._id} className="hover:bg-gray-50">
                <td className="border p-1 text-sm">{idx + 1}.</td>
                <td className="border p-1 text-sm">{program.name}</td>
                <td className="border p-1 text-sm">{program.type}</td>
                <td className="border p-1 text-sm">{program.level}</td>
                <td className="border p-1 text-sm">{program.duration}</td>
                <td className="border p-1 text-sm">{program.department?.name || program.department}</td>

                {/* <td className="border p-1 text-sm">
                  {
                    departments.find((d) => d._id === program.department)
                      ?.name
                  }
                </td> */}
                <td className="border p-1 text-sm">
                  <a
                    href={program.syllabus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </td>
                <td className="border p-1 text-sm">
                  {program.eligibilityCriteria}
                </td>
                <td className="border p-1 text-sm">
                  <button
                    onClick={() => handleEdit(program)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteprogram(program._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-3/4 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Edit Program</h2>

            {/* Example fields; repeat pattern for each editable property */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={editingProgram.name}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      name: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Duration</label>
                <input
                  type="number"
                  value={editingProgram.duration}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      duration: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Department</label>
                <select
                  value={editingProgram.department}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      department: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={editingProgram.type}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a type</option>
                  <option value="b.tech">b.tech</option>
                  <option value="bachelors">bachelors</option>
                  <option value="m.tech">m.tech</option>
                  <option value="masters">masters</option>
                  <option value="phd">phd</option>
                  <option value="mba">mba</option>
                  <option value="diploma">diploma</option>
                </select>
              </div>



              {/* Syllabus Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus</label>
                <input
                  type="text"
                  value={editingProgram.syllabus}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, syllabus: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Eligibility Criteria Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
                <input
                  type="text"
                  value={editingProgram.eligibilityCriteria}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, eligibilityCriteria: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Level Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={editingProgram.level}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, level: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleUpdate}
                disabled={!editingProgram}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProgram(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPrograms;