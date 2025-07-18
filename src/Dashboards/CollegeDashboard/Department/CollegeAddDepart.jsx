import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch,useSelector } from "react-redux";
import { adddept } from "../../../Redux/DepartmentSlice";
import { fetchColleges } from "../../../Redux/UniversitySlice";

const CollegeAddDepart = () => {
  const { universityName } = useParams(); // Get university name dynamically
  const location = useLocation(); // Access user data from state
  const user = location.state?.user || {}; // Extract user data from state
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    head: { name: "", phone: "" },
    contactEmail: "",
    contactPhone: "",
    email: "",
    password: "",
    address: { roomNumber: "", building: "" },
    college: "",
    universityId: user.universityId || "",  
  });

     const colleges = useSelector((state) => state.colleges.colleges) || [];
      const departments = useSelector((state) => state.department.departments) || [];
      const programs = useSelector((state) => state.programs.programs) || [];
      const students = useSelector((state) => state.students.students) || [];

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  console.log("program in deaprtment page:", programs)

 // 🔥 FIX: Retrieve correct token from localStorage
 const token = localStorage.getItem("University authToken");
 console.log("Token in Department Management Management:", token);

 const fetchcolleges = async () => {
   if (!token) {
     setError("Authentication token is missing.");
     return;
   }
      dispatch(fetchColleges({token,universityName}))
 };

 useEffect(() => {
   fetchcolleges();
   console.log("in mdept",colleges)
 }, [universityName]);



  const handleNestedArrayChange = (field, index, key, value) => {
    const updatedArray = formData[field].map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addToArrayField = (field) => {
    const defaultItem = {
      // programs: { name: "", duration: 0, intake: 0 },
      faculty: { name: "", designation: "", phone: "" },
      achievements: { title: "", description: "", date: "" },
      research: { title: "", description: "", publishedDate: "", link: "" },
      events: { title: "", description: "", date: "", attendees: 0 },
      labs: { name: "", equipment: [""], inCharge: "" },
    }[field];
    setFormData({ ...formData, [field]: [...formData[field], defaultItem] });
  };

  const removeFromArrayField = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.head.name || !formData.contactEmail || !formData.contactPhone ||
      !formData.email || !formData.password || !formData.address.roomNumber || !formData.address.building ||
      !formData.college || !formData.universityId) {
      setError("Please fill out all required fields.");
      return;
    }
    setLoading(true);
   const res = await dispatch(adddept({token,formData,universityName}))
   if (res.meta.requestStatus === "fulfilled") {
    console.log("eww sucesssssss")
       setSuccess("addedsucess")
  } else {
    setError( "Something went wrong.");
    
  }
     
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add Departments</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Department Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Department Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          {/* Head of Department */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Head of Department Name</label>
            <input
              type="text"
              value={formData.head.name}
              onChange={(e) => setFormData({ ...formData, head: { ...formData.head, name: e.target.value } })}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Head of Department Phone</label>
            <input
              type="text"
              value={formData.head.phone}
              onChange={(e) => setFormData({ ...formData, head: { ...formData.head, phone: e.target.value } })}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          {/* Contact Details */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          {/* Authentication Details */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Authentication Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4 relative">
  <label className="block text-sm font-medium">Password</label>
  <input
    type={showAdminPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    className="p-2 border rounded-md w-full"
    required
  />
  <button
    type="button"
    className="absolute inset-y-0 right-2 top-5 flex items-center pr-3 focus:outline-none text-gray-600"
    onClick={() => setShowAdminPassword(!showAdminPassword)}
    aria-label={showAdminPassword ? "Hide password" : "Show password"}
  >
    {showAdminPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.address.roomNumber}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, roomNumber: e.target.value } })
              }
              className="p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Building</label>
            <input
              type="text"
              name="building"
              value={formData.address.building}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, building: e.target.value } })
              }
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          {/* College Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Select College</label>
            <select
              name="college"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="p-2 border rounded-md w-full"
              required
            >
              <option value="">Select College</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>{college.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="">

{/* Submit Button */}
<button
  type="submit"
  className="px-4 py-2 bg-blue-600 text-white rounded-md mt-4"
  disabled={loading}
>
  {loading ? "Submitting..." : "Add Department"}
</button>

        </div>
      </form>
    </div>
  );
};

export default CollegeAddDepart;
