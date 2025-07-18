import React, { useState } from 'react';

function CollegeInfoForm() {
  const [collegeInfo, setCollegeInfo] = useState({
    name: '',
    university: '',
    type: '',
    established: '',
    accreditation: '',
    ranking: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    principal: '',
    principalContact: '',
    principalEmail: '',
    majorCourses: '',
    researchAreas: '',
    notableAlumni: '',
    achievements: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollegeInfo({ ...collegeInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('College information submitted!');
    console.log(collegeInfo);
  };

  return (
    <div className="p-6 mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">College Information Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Basic Details */}
        <div className="col-span-2 text-lg font-semibold">Basic Details</div>
        <input type="text" name="name" placeholder="College Name" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="university" placeholder="Affiliated University" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="type" placeholder="College Type (Govt/Private/Autonomous)" className="p-2 border rounded" onChange={handleChange} />
        <input type="number" name="established" placeholder="Established Year" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="accreditation" placeholder="Accreditation" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="ranking" placeholder="Ranking (e.g., NAAC, NIRF)" className="p-2 border rounded" onChange={handleChange} />

        {/* Contact Details */}
        <div className="col-span-2 text-lg font-semibold">Contact Details</div>
        <input type="text" name="address" placeholder="Address" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="city" placeholder="City" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="state" placeholder="State" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="country" placeholder="Country" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" className="p-2 border rounded" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email Address" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="website" placeholder="Website URL" className="p-2 border rounded" onChange={handleChange} />

        {/* Administrative Details */}
        <div className="col-span-2 text-lg font-semibold">Administrative Details</div>
        <input type="text" name="principal" placeholder="Principal/Dean Name" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="principalContact" placeholder="Principal's Contact" className="p-2 border rounded" onChange={handleChange} />
        <input type="email" name="principalEmail" placeholder="Principal's Email" className="p-2 border rounded" onChange={handleChange} />

        {/* Social Media Links */}
        <div className="col-span-2 text-lg font-semibold">Social Media Links</div>
        <input type="text" name="linkedin" placeholder="LinkedIn Profile" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="facebook" placeholder="Facebook Page" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="instagram" placeholder="Instagram Handle" className="p-2 border rounded" onChange={handleChange} />
        <input type="text" name="twitter" placeholder="Twitter Handle" className="p-2 border rounded" onChange={handleChange} />

        {/* Additional Information */}
        <textarea name="achievements" placeholder="Major Achievements" className="p-2 border rounded col-span-2" onChange={handleChange}></textarea>
        <textarea name="notableAlumni" placeholder="Notable Alumni" className="p-2 border rounded col-span-2" onChange={handleChange}></textarea>

        <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CollegeInfoForm;
