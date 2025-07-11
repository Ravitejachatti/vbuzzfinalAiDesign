// import React, { useState } from 'react';
// import Select from 'react-select';
// import { Country, State, City } from 'country-state-city';
// import axios from 'axios';

// const UniversityOnboarding = () => {
//   const [form, setForm] = useState({
//     basicInformation: {
//       instituteName: '',
//       instituteType: '',
//       affiliatedUniversity: '',
//       otherInstituteType: '',
//       visionMission: '',
//     },
//     accreditation: [], // Array of accreditation details
//     location: {
//       country: '',
//       state: '',
//       city: '',
//       fullAddress: '',
//     },
//     contactInformation: {
//       primaryContact: {
//         name: '',
//         designation: '',
//         phone: '',
//         email: '',
//       },
//       secondaryContact: {
//         name: '',
//         designation: '',
//         phone: '',
//         email: '',
//       },
//     },
//     socialMediaLinks: {
//       linkedin: '',
//       youtube: '',
//       instagram: '',
//     },
//     website: '',
//     goalsOnPlatform: [],
//     rankings: {
//       internationalRankings: [],
//       nationalRankings: [],
//     },
//     documents: {
//       registrationCertificate: null,
//       accreditationDocuments: [],
//       brochure: null,
//       placementReport: null,
//       campusPhotos: [],
//     },
//     authentication: {
//       email: '',
//       password: '',
//     },
//   });

//   const [step, setStep] = useState(1); // To track the current step
//   const [errors, setErrors] = useState({});

//   const instituteTypeOptions = [
//     { value: 'Central University', label: 'Central University' },
//     { value: 'State University', label: 'State University' },
//     { value: 'Deemed to be University', label: 'Deemed to be University' },
//     { value: 'Private Universities', label: 'Private Universities' },
//     { value: 'Autonomous Institutions', label: 'Autonomous Institutions' },
//     { value: 'Affiliated Colleges', label: 'Affiliated Colleges' },
//     { value: 'Institutes of National Importance', label: 'Institutes of National Importance' },
//     { value: 'Open Universities', label: 'Open Universities' },
//     { value: 'Polytechnic and Vocational Institutions', label: 'Polytechnic and Vocational Institutions' },
//     { value: 'Research Institutes', label: 'Research Institutes' },
//     { value: 'Coaching Institutions', label: 'Coaching Institutions' },
//     { value: 'Teacher Training Institutes', label: 'Teacher Training Institutes' },
//     { value: 'Any Other', label: 'Any Other' },
//   ];

//   const accreditationOptions = [
//     'UGC',
//     'NAAC',
//     'AICTE',
//     'NBA',
//     'MCI',
//     'ICMR',
//     'CCIM',
//     'DCI',
//     'PCI',
//     'COA',
//     'NCTE',
//     'ICAI',
//     'NCHMCT',
//     'AIU',
//     'IAI',
//     'IIL',
//     'QCI',
//     'BCI',
//     'NIOS',
//     'Others',
//   ];

//   const platformGoalsOptions = [
//     { value: 'Education Enhancement', label: 'Education Enhancement' },
//     { value: 'Placement & Recruitment', label: 'Placement & Recruitment' },
//     { value: 'Industry Collaboration', label: 'Industry Collaboration' },
//     { value: 'Skill Development', label: 'Skill Development' },
//   ];

//   const countryOptions = Country.getAllCountries().map((country) => ({
//     value: country.isoCode,
//     label: country.name,
//   }));

//   const stateOptions = form.country
//     ? State.getStatesOfCountry(form.country.value).map((state) => ({
//         value: state.isoCode,
//         label: state.name,
//       }))
//     : [];
//   const cityOptions = form.state
//     ? City.getCitiesOfState(form.country.value, form.state.value).map((city) => ({
//         value: city.name,
//         label: city.name,
//       }))
//     : [];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prevForm) => ({ ...prevForm, [name]: value }));
//   };

//   const handleNestedInputChange = (e, contactType) => {
//     const { name, value } = e.target;
//     setForm((prevForm) => ({
//       ...prevForm,
//       [contactType]: { ...prevForm[contactType], [name]: value },
//     }));
//   };

//   const handleDropdownChange = (value, action) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       [action.name]: value,
//     }));
//   };

//   const handleCountryChange = (value) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       country: value,
//       state: null,
//       city: null,
//     }));
//   };

//   const handleStateChange = (value) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       state: value,
//       city: null,
//     }));
//   };

//   const handleCheckboxChange = (name) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       accreditation: prevForm.accreditation.includes(name)
//         ? prevForm.accreditation.filter((acc) => acc !== name)
//         : [...prevForm.accreditation, name],
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files && files.length > 0) {
//       setForm((prevForm) => ({
//         ...prevForm,
//         documents: {
//           ...prevForm.documents,
//           [name]: files[0],
//         },
//       }));
//     }
//   };

//   const handleSocialMediaChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prevForm) => ({
//       ...prevForm,
//       socialMediaLinks: { ...prevForm.socialMediaLinks, [name]: value },
//     }));
//   };

//   const handleNextStep = () => {
//     let validationErrors = {};
//     if (step === 1) {
//       if (!form.instituteName) validationErrors.instituteName = 'Institute name is required';
//       if (!form.instituteType) validationErrors.instituteType = 'Institute type is required';
//       if (!form.country) validationErrors.country = 'Country is required';
//     }

//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length === 0) setStep(step + 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const formData = new FormData();
//     formData.append('basicInformation', JSON.stringify(form.basicInformation));
//     formData.append('accreditation', JSON.stringify(form.accreditation));
//     formData.append('location', JSON.stringify(form.location));
//     formData.append('contactInformation', JSON.stringify(form.contactInformation));
//     formData.append('socialMediaLinks', JSON.stringify(form.socialMediaLinks));
//     formData.append('website', form.website);
//     formData.append('goalsOnPlatform', JSON.stringify(form.goalsOnPlatform));
//     formData.append('rankings', JSON.stringify(form.rankings));
//     Object.keys(form.documents).forEach((key) => {
//       if (Array.isArray(form.documents[key])) {
//         form.documents[key].forEach((file, index) =>
//           formData.append(`${key}[${index}]`, file)
//         );
//       } else if (form.documents[key]) {
//         formData.append(key, form.documents[key]);
//       }
//     });
//     formData.append('authentication', JSON.stringify(form.authentication));

//     try {
//       const response = await axios.post(
//         'http://192.168.84.59:8080/api/admin/register',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       console.log('Success:', response.data);
//     } catch (error) {
//       console.error('Error submitting form:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 sm:px-8 md:px-12">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">University Onboarding</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//       {step === 1 && (
//         <>
//         {/* Name of the Educational Institute */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Name of the Educational Institute</label>
//           <input
//             type="text"
//             name="instituteName"
//             placeholder="Enter institute name"
//             value={form.instituteName}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           {errors.instituteName && <p className="text-sm text-red-500">{errors.instituteName}</p>}
//         </div>

//         {/* Type of Institute */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Type of Institute</label>
//           <Select
//             options={instituteTypeOptions}
//             name="instituteType"
//             placeholder="Select institute type"
//             value={form.instituteType}
//             onChange={(value) => handleDropdownChange(value, { name: 'instituteType' })}
//             className="w-full"
//           />
//           {errors.instituteType && <p className="text-sm text-red-500">{errors.instituteType}</p>}
//         </div>

//         {/* Conditional Fields for Affiliated University or Specify Type */}
//         {form.instituteType?.value === 'Autonomous Institutions' && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Affiliated University Name</label>
//             <input
//               type="text"
//               name="affiliatedUniversity"
//               placeholder="Enter affiliated university name"
//               value={form.affiliatedUniversity}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         )}
//         {form.instituteType?.value === 'Affiliated Colleges' && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Affiliated University Name</label>
//             <input
//               type="text"
//               name="aAffiliated Colleges"
//               placeholder="Enter affiliated university name"
//               value={form.affiliatedUniversity}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         )}
//         {form.instituteType?.value === 'Any Other' && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Specify Type</label>
//             <input
//               type="text"
//               name="otherInstituteType"
//               placeholder="Specify type of institute"
//               value={form.otherInstituteType}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         )}
//          {/* Accreditation */}
//       <section className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Accreditations</h3>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//           {accreditationOptions.map((acc, index) => (
//             <label key={index} className="flex items-center">
//               <input
//                 type="checkbox"
//                 name={acc}
//                 onChange={() => handleCheckboxChange(acc)}
//                 checked={form.accreditation.includes(acc)}
//                 className="mr-2"
//               />
//               {acc}
//             </label>
//           ))}
//         </div>
//       </section>

//         {/* Country */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Country</label>
//           <Select
//             options={countryOptions}
//             name="country"
//             placeholder="Select country"
//             value={form.country}
//             onChange={handleCountryChange}
//             className="w-full"
//           />
//         </div>

//         {/* State */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">State</label>
//           <Select
//             options={stateOptions}
//             name="state"
//             placeholder="Select state"
//             value={form.state}
//             onChange={handleStateChange}
//             className="w-full"
//             isDisabled={!form.country}
//           />
//         </div>

//         {/* City */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">City</label>
//           <Select
//             options={cityOptions}
//             name="city"
//             placeholder="Select city"
//             value={form.city}
//             onChange={(value) => handleDropdownChange(value, { name: 'city' })}
//             className="w-full"
//             isDisabled={!form.state}
//           />
//         </div>

//         {/* Location */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Location</label>
//           <input
//             type="text"
//             name="location"
//             placeholder="Enter location"
//             value={form.location}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//         </>
//     )}
//      {step === 2 && (
//           <>
//         {/* Primary Contact */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Primary Contact Person</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.primaryContact.name}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="designation"
//             placeholder="designation"
//             value={form.primaryContact.designation}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={form.primaryContact.phone}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.primaryContact.email}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Secondary Contact */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Secondary Contact Person</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.secondaryContact.name}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="designation"
//             placeholder="designation"
//             value={form.secondaryContact.designation}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.secondaryContact.email}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={form.secondaryContact.phone}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Website Link */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Website Link</label>
//           <input
//             type="url"
//             name="website"
//             placeholder="https://example.com"
//             value={form.website}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//          {/* Social Media Links */}
//       <section className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Social Media Links</h3>
//         <input
//           type="url"
//           name="linkedin"
//           value={form.socialMediaLinks.linkedin}
//           onChange={handleSocialMediaChange}
//           placeholder="LinkedIn URL"
//           className="p-2 border rounded-md w-full mb-4"
//         />
//         <input
//           type="url"
//           name="youtube"
//           value={form.socialMediaLinks.youtube}
//           onChange={handleSocialMediaChange}
//           placeholder="YouTube URL"
//           className="p-2 border rounded-md w-full mb-4"
//         />
//         <input
//           type="url"
//           name="instagram"
//           value={form.socialMediaLinks.instagram}
//           onChange={handleSocialMediaChange}
//           placeholder="Instagram URL"
//           className="p-2 border rounded-md w-full mb-4"
//         />
//       </section>

//         {/* Goals on Platform */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Goals on Platform</label>
//           <Select
//             isMulti
//             options={platformGoalsOptions}
//             name="goals"
//             placeholder="Select platform goals"
//             value={form.goals}
//             onChange={(value) => handleDropdownChange(value, { name: 'goals' })}
//             className="w-full"
//           />
//         </div>

//         {/* International and National Rankings */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">International Rankings</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Ranking Name"
//             value={form.internationalRanking.name}
//             onChange={(e) => handleNestedInputChange(e, 'internationalRanking')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="rank"
//             placeholder="Ranking Position"
//             value={form.internationalRanking.rank}
//             onChange={(e) => handleNestedInputChange(e, 'internationalRanking')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">National Rankings</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Ranking Name"
//             value={form.nationalRanking.name}
//             onChange={(e) => handleNestedInputChange(e, 'nationalRanking')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="rank"
//             placeholder="Ranking Position"
//             value={form.nationalRanking.rank}
//             onChange={(e) => handleNestedInputChange(e, 'nationalRanking')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Message */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Mission and Vission</label>
//           <textarea
//             name="visionMission"
//             placeholder="vision and Mission"
//             value={form.visionMission}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//          {/* Document Upload Section */}
//       <section className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Documents Required for Onboarding</h3>

//         {/* University Registration Certificate */}
//         <label className="block mb-4">
//           <span className="text-gray-700">University Registration Certificate</span>
//           <input
//             type="file"
//             name="registrationCertificate"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.registrationCertificate && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.registrationCertificate.name}</p>
//           )}
//         </label>

//         {/* Accreditation Documents */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Accreditation Documents (e.g., UGC, NBA)</span>
//           <input
//             type="file"
//             name="accreditationDocuments"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.accreditationDocuments && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.accreditationDocuments.name}</p>
//           )}
//         </label>

//         {/* Brochure/Prospectus */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Brochure/Prospectus</span>
//           <input
//             type="file"
//             name="brochure"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.brochure && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.brochure.name}</p>
//           )}
//         </label>

//         {/* Recent Placement Report (Optional) */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Recent Placement Report (Optional)</span>
//           <input
//             type="file"
//             name="placementReport"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.placementReport && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.placementReport.name}</p>
//           )}
//         </label>

//         {/* Photographs of Campus (Optional) */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Photographs of Campus (Optional)</span>
//           <input
//             type="file"
//             name="campusPhotos"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.campusPhotos && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.campusPhotos.name}</p>
//           )}
//         </label>
//       </section>

//       {/* Username */}
//       <div>
//           <label className="block text-sm font-medium text-gray-700">Username</label>
//           <input
//             type="text"
//             name="username"
//             placeholder="Enter username"
//             value={form.username}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter password"
//             value={form.password}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button
//             type="submit"
//             className="w-full px-4 py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             Submit
//           </button>
//         </div>
//         </>
//      )}
//       <div className="flex justify-between">
//           {step > 1 && (
//             <button
//               type="button"
//               onClick={() => setStep(step - 1)}
//               className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300"
//             >
//               Previous
//             </button>
//           )}
//           {step < 2 ? (
//             <button
//               type="button"
//               onClick={handleNextStep}
//               className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               type="submit"
//               className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UniversityOnboarding;

// import React, { useState } from 'react';
// import Select from 'react-select';
// import { Country, State, City } from 'country-state-city';
// import axios from 'axios';

// const UniversityOnboarding = () => {
//   const [form, setForm] = useState({
//     instituteName: '',
//     establishmentYear: '',
//     visionMission: '',
//     instituteType: '',
//     affiliatedUniversity: '',
//     otherInstituteType: '',
//     country: null,
//     state: null,
//     city: null,
//     accreditation: [],
//     primaryContact: { name: '', designation: '', phone: '', email: '' },
//     secondaryContact: { name: '', designation: '', phone: '', email: '' },
//     location: '',
//     website: '',
//     goals: [],
//     internationalRanking: { name: '', rank: '' },
//     nationalRanking: { name: '', rank: '' },
//     documents: {
//       registrationCertificate: null,
//       accreditationDocuments: null,
//       brochure: null,
//       placementReport: null,
//       campusPhotos: null,
//     },
//     socialMediaLinks: {
//       linkedin: '',
//       youtube: '',
//       instagram: '',
//     },
//     username: '',
//     password: '',
//   });

//   const [step, setStep] = useState(1);
//   const [errors, setErrors] = useState({});

//   const instituteTypeOptions = [
//     { value: 'Central University', label: 'Central University' },
//     { value: 'State University', label: 'State University' },
//     { value: 'Deemed to be University', label: 'Deemed to be University' },
//     { value: 'Private Universities', label: 'Private Universities' },
//     { value: 'Autonomous Institutions', label: 'Autonomous Institutions' },
//     { value: 'Affiliated Colleges', label: 'Affiliated Colleges' },
//     { value: 'Institutes of National Importance', label: 'Institutes of National Importance' },
//     { value: 'Open Universities', label: 'Open Universities' },
//     { value: 'Polytechnic and Vocational Institutions', label: 'Polytechnic and Vocational Institutions' },
//     { value: 'Research Institutes', label: 'Research Institutes' },
//     { value: 'Coaching Institutions', label: 'Coaching Institutions' },
//     { value: 'Teacher Training Institutes', label: 'Teacher Training Institutes' },
//     { value: 'Any Other', label: 'Any Other' },
//   ];

//   const accreditationOptions = [
//     'UGC',
//     'NAAC',
//     'AICTE',
//     'NBA',
//     'MCI',
//     'ICMR',
//     'CCIM',
//     'DCI',
//     'PCI',
//     'COA',
//     'NCTE',
//     'ICAI',
//     'NCHMCT',
//     'AIU',
//     'IAI',
//     'IIL',
//     'QCI',
//     'BCI',
//     'NIOS',
//     'Others',
//   ];

//   const platformGoalsOptions = [
//     { value: 'Education Enhancement', label: 'Education Enhancement' },
//     { value: 'Placement & Recruitment', label: 'Placement & Recruitment' },
//     { value: 'Industry Collaboration', label: 'Industry Collaboration' },
//     { value: 'Skill Development', label: 'Skill Development' },
//   ];

//   const countryOptions = Country.getAllCountries().map((country) => ({
//     value: country.isoCode,
//     label: country.name,
//   }));

//   const stateOptions = form.country
//     ? State.getStatesOfCountry(form.country.value).map((state) => ({
//         value: state.isoCode,
//         label: state.name,
//       }))
//     : [];

//   const cityOptions = form.state
//     ? City.getCitiesOfState(form.country.value, form.state.value).map((city) => ({
//         value: city.name,
//         label: city.name,
//       }))
//     : [];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prevForm) => ({ ...prevForm, [name]: value }));
//   };

//   const handleNestedInputChange = (e, contactType) => {
//     const { name, value } = e.target;
//     setForm((prevForm) => ({
//       ...prevForm,
//       [contactType]: { ...prevForm[contactType], [name]: value },
//     }));
//   };

//   const handleDropdownChange = (selectedOption, action) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       [action.name]: selectedOption,
//     }));
//   };

//   const handleCountryChange = (selectedOption) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       country: selectedOption,
//       state: null,
//       city: null,
//     }));
//   };

//   const handleStateChange = (selectedOption) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       state: selectedOption,
//       city: null,
//     }));
//   };

//   const handleCheckboxChange = (name) => {
//     const updatedAccreditations = form.accreditation.includes(name)
//       ? form.accreditation.filter((acc) => acc !== name)
//       : [...form.accreditation, name];

//     setForm((prevForm) => ({ ...prevForm, accreditation: updatedAccreditations }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setForm((prevForm) => ({
//       ...prevForm,
//       documents: {
//         ...prevForm.documents,
//         [name]: files[0],
//       },
//     }));
//   };

//   const handleNextStep = () => {
//     let validationErrors = {};
//     if (step === 1) {
//       if (!form.instituteName) validationErrors.instituteName = 'Institute name is required';
//       if (!form.instituteType) validationErrors.instituteType = 'Institute type is required';
//       if (!form.country) validationErrors.country = 'Country is required';
//     }

//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length === 0) setStep(step + 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let validationErrors = {};
//     if (!form.username) validationErrors.username = 'Username is required';
//     if (!form.password) validationErrors.password = 'Password is required';

//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;

//     try {
//       const response = await axios.post('https://dummyapi.com/university-onboarding', form);
//       console.log('Form submitted successfully:', response.data);
//     } catch (error) {
//       console.error('Form submission error:', error);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 sm:px-8 md:px-12">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">University Onboarding</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//       {step === 1 && (
//         <>
//         {/* Name of the Educational Institute */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Name of the Educational Institute</label>
//           <input
//             type="text"
//             name="instituteName"
//             placeholder="Enter institute name"
//             value={form.instituteName}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           {errors.instituteName && <p className="text-sm text-red-500">{errors.instituteName}</p>}
//         </div>

//         {/* Type of Institute */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Type of Institute</label>
//           <Select
//             options={instituteTypeOptions}
//             name="instituteType"
//             placeholder="Select institute type"
//             value={form.instituteType}
//             onChange={(value) => handleDropdownChange(value, { name: 'instituteType' })}
//             className="w-full"
//           />
//           {errors.instituteType && <p className="text-sm text-red-500">{errors.instituteType}</p>}
//         </div>

//         {/* Conditional Fields for Affiliated University or Specify Type */}
//         {form.instituteType?.value === 'Autonomous Institutions' && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Affiliated University Name</label>
//             <input
//               type="text"
//               name="affiliatedUniversity"
//               placeholder="Enter affiliated university name"
//               value={form.affiliatedUniversity}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         )}
//         {form.instituteType?.value === 'Affiliated Colleges' && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Affiliated University Name</label>
//             <input
//               type="text"
//               name="aAffiliated Colleges"
//               placeholder="Enter affiliated university name"
//               value={form.affiliatedUniversity}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         )}
//         {form.instituteType?.value === 'Any Other' && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Specify Type</label>
//             <input
//               type="text"
//               name="otherInstituteType"
//               placeholder="Specify type of institute"
//               value={form.otherInstituteType}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         )}
//          {/* Accreditation */}
//       <section className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Accreditations</h3>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//           {accreditationOptions.map((acc, index) => (
//             <label key={index} className="flex items-center">
//               <input
//                 type="checkbox"
//                 name={acc}
//                 onChange={() => handleCheckboxChange(acc)}
//                 checked={form.accreditation.includes(acc)}
//                 className="mr-2"
//               />
//               {acc}
//             </label>
//           ))}
//         </div>
//       </section>

//         {/* Country */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Country</label>
//           <Select
//             options={countryOptions}
//             name="country"
//             placeholder="Select country"
//             value={form.country}
//             onChange={handleCountryChange}
//             className="w-full"
//           />
//         </div>

//         {/* State */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">State</label>
//           <Select
//             options={stateOptions}
//             name="state"
//             placeholder="Select state"
//             value={form.state}
//             onChange={handleStateChange}
//             className="w-full"
//             isDisabled={!form.country}
//           />
//         </div>

//         {/* City */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">City</label>
//           <Select
//             options={cityOptions}
//             name="city"
//             placeholder="Select city"
//             value={form.city}
//             onChange={(value) => handleDropdownChange(value, { name: 'city' })}
//             className="w-full"
//             isDisabled={!form.state}
//           />
//         </div>

//         {/* Location */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Location</label>
//           <input
//             type="text"
//             name="location"
//             placeholder="Enter location"
//             value={form.location}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//         </>
//     )}
//         {step === 2 && (
//           <>
//         {/* Primary Contact */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Primary Contact Person</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.primaryContact.name}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="designation"
//             placeholder="designation"
//             value={form.primaryContact.designation}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={form.primaryContact.phone}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.primaryContact.email}
//             onChange={(e) => handleNestedInputChange(e, 'primaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Secondary Contact */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Secondary Contact Person</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.secondaryContact.name}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="designation"
//             placeholder="designation"
//             value={form.secondaryContact.designation}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.secondaryContact.email}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={form.secondaryContact.phone}
//             onChange={(e) => handleNestedInputChange(e, 'secondaryContact')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Website Link */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Website Link</label>
//           <input
//             type="url"
//             name="website"
//             placeholder="https://example.com"
//             value={form.website}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//          {/* Social Media Links */}
//       <section className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Social Media Links</h3>
//         <input
//           type="url"
//           name="linkedin"
//           value={form.socialMediaLinks.linkedin}
//           onChange={handleSocialMediaChange}
//           placeholder="LinkedIn URL"
//           className="p-2 border rounded-md w-full mb-4"
//         />
//         <input
//           type="url"
//           name="youtube"
//           value={form.socialMediaLinks.youtube}
//           onChange={handleSocialMediaChange}
//           placeholder="YouTube URL"
//           className="p-2 border rounded-md w-full mb-4"
//         />
//         <input
//           type="url"
//           name="instagram"
//           value={form.socialMediaLinks.instagram}
//           onChange={handleSocialMediaChange}
//           placeholder="Instagram URL"
//           className="p-2 border rounded-md w-full mb-4"
//         />
//       </section>

//         {/* Goals on Platform */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Goals on Platform</label>
//           <Select
//             isMulti
//             options={platformGoalsOptions}
//             name="goals"
//             placeholder="Select platform goals"
//             value={form.goals}
//             onChange={(value) => handleDropdownChange(value, { name: 'goals' })}
//             className="w-full"
//           />
//         </div>

//         {/* International and National Rankings */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">International Rankings</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Ranking Name"
//             value={form.internationalRanking.name}
//             onChange={(e) => handleNestedInputChange(e, 'internationalRanking')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="rank"
//             placeholder="Ranking Position"
//             value={form.internationalRanking.rank}
//             onChange={(e) => handleNestedInputChange(e, 'internationalRanking')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">National Rankings</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Ranking Name"
//             value={form.nationalRanking.name}
//             onChange={(e) => handleNestedInputChange(e, 'nationalRanking')}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <input
//             type="text"
//             name="rank"
//             placeholder="Ranking Position"
//             value={form.nationalRanking.rank}
//             onChange={(e) => handleNestedInputChange(e, 'nationalRanking')}
//             className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Message */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Mission and Vission</label>
//           <textarea
//             name="visionMission"
//             placeholder="vision and Mission"
//             value={form.visionMission}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//          {/* Document Upload Section */}
//       <section className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Documents Required for Onboarding</h3>

//         {/* University Registration Certificate */}
//         <label className="block mb-4">
//           <span className="text-gray-700">University Registration Certificate</span>
//           <input
//             type="file"
//             name="registrationCertificate"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.registrationCertificate && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.registrationCertificate.name}</p>
//           )}
//         </label>

//         {/* Accreditation Documents */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Accreditation Documents (e.g., UGC, NBA)</span>
//           <input
//             type="file"
//             name="accreditationDocuments"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.accreditationDocuments && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.accreditationDocuments.name}</p>
//           )}
//         </label>

//         {/* Brochure/Prospectus */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Brochure/Prospectus</span>
//           <input
//             type="file"
//             name="brochure"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.brochure && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.brochure.name}</p>
//           )}
//         </label>

//         {/* Recent Placement Report (Optional) */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Recent Placement Report (Optional)</span>
//           <input
//             type="file"
//             name="placementReport"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.placementReport && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.placementReport.name}</p>
//           )}
//         </label>

//         {/* Photographs of Campus (Optional) */}
//         <label className="block mb-4">
//           <span className="text-gray-700">Photographs of Campus (Optional)</span>
//           <input
//             type="file"
//             name="campusPhotos"
//             onChange={handleFileChange}
//             className="mt-1 block w-full"
//           />
//           {form.documents.campusPhotos && (
//             <p className="text-sm text-green-600 mt-1">File selected: {form.documents.campusPhotos.name}</p>
//           )}
//         </label>
//       </section>

//       {/* Username */}
//       <div>
//           <label className="block text-sm font-medium text-gray-700">Username</label>
//           <input
//             type="text"
//             name="username"
//             placeholder="Enter username"
//             value={form.username}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter password"
//             value={form.password}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button
//             type="submit"
//             className="w-full px-4 py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             Submit
//           </button>
//         </div>
//         </>
//      )}
//         <div className="flex justify-between">
//           {step > 1 && (
//             <button
//               type="button"
//               onClick={() => setStep(step - 1)}
//               className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300"
//             >
//               Previous
//             </button>
//           )}
//           {step < 2 ? (
//             <button
//               type="button"
//               onClick={handleNextStep}
//               className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
//             >
//               Next
//             </button>
//           ) : (
//             <button
//               type="submit"
//               className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UniversityOnboarding;

// import React, { useState } from "react";
// import Select from "react-select";
// import { Country, State, City } from "country-state-city";
// import axios from "axios";

// const RegisterUniversity = () => {
//   const [formData, setFormData] = useState({
//     basicInformation: {
//       instituteName: "",
//       instituteType: "",
//       affiliatedUniversity: "",
//       otherInstituteType: "",
//       visionMission: "",
//     },
//     accreditation: [],
//     location: {
//       country: "",
//       state: "",
//       city: "",
//       fullAddress: "",
//     },
//     contactInformation: {
//       primaryContact: {
//         name: "",
//         designation: "",
//         phone: "",
//         email: "",
//       },
//       secondaryContact: {
//         name: "",
//         designation: "",
//         phone: "",
//         email: "",
//       },
//     },
//     socialMediaLinks: {
//       linkedin: "",
//       youtube: "",
//       instagram: "",
//     },
//     website: "",
//     goalsOnPlatform: [],
//     rankings: {
//       internationalRankings: [],
//       nationalRankings: [],
//     },
//     documents: {
//       registrationCertificate: null,
//       accreditationDocuments: [],
//       brochure: null,
//       placementReport: null,
//       campusPhotos: [],
//     },
//     authentication: {
//       email: "",
//       password: "",
//     },
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");

//   // options
//   const instituteTypeOptions = [
//     { value: "Central University", label: "Central University" },
//     { value: "State University", label: "State University" },
//     { value: "Deemed to be University", label: "Deemed to be University" },
//     { value: "Private Universities", label: "Private Universities" },
//     { value: "Autonomous Institutions", label: "Autonomous Institutions" },
//     { value: "Affiliated Colleges", label: "Affiliated Colleges" },
//     {
//       value: "Institutes of National Importance",
//       label: "Institutes of National Importance",
//     },
//     { value: "Open Universities", label: "Open Universities" },
//     {
//       value: "Polytechnic and Vocational Institutions",
//       label: "Polytechnic and Vocational Institutions",
//     },
//     { value: "Research Institutes", label: "Research Institutes" },
//     { value: "Coaching Institutions", label: "Coaching Institutions" },
//     {
//       value: "Teacher Training Institutes",
//       label: "Teacher Training Institutes",
//     },
//     { value: "Any Other", label: "Any Other" },
//   ];

//   const accreditationOptions = [
//     "UGC",
//     "NAAC",
//     "AICTE",
//     "NBA",
//     "MCI",
//     "ICMR",
//     "CCIM",
//     "DCI",
//     "PCI",
//     "COA",
//     "NCTE",
//     "ICAI",
//     "NCHMCT",
//     "AIU",
//     "IAI",
//     "IIL",
//     "QCI",
//     "BCI",
//     "NIOS",
//     "Others",
//   ];

//   const platformGoalsOptions = [
//     { value: "Education Enhancement", label: "Education Enhancement" },
//     { value: "Placement & Recruitment", label: "Placement & Recruitment" },
//     { value: "Industry Collaboration", label: "Industry Collaboration" },
//     { value: "Skill Development", label: "Skill Development" },
//   ];

//   const countryOptions = Country.getAllCountries().map((country) => ({
//     value: country.isoCode,
//     label: country.name,
//   }));

//   const stateOptions = formData.country
//     ? State.getStatesOfCountry(form.country.value).map((state) => ({
//         value: state.isoCode,
//         label: state.name,
//       }))
//     : [];
//   const cityOptions = formData.state
//     ? City.getCitiesOfState(form.country.value, form.state.value).map((city) => ({
//         value: city.name,
//         label: city.name,
//       }))
//     : [];

//   // handle dropdown change

//     const handleDropdownChange = (selectedOption, action) => {
//     setFormData((prevForm) => ({
//       ...prevForm,
//       [action.name]: selectedOption,
//     }));
//   };

//   // Handle input changes
//   const handleInputChange = (e, section, key) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [key || name]: value,
//       },
//     }));
//   };

//   // Handle file inputs
//   const handleFileChange = (e, key) => {
//     const { files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       documents: {
//         ...prev.documents,
//         [key]: files.length > 1 ? [...files] : files[0],
//       },
//     }));
//   };

//   // Handle array additions (e.g., accreditation or rankings)
//   const addArrayItem = (section, item) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: [...prev[section], item],
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({}); // Reset errors
//     setSuccessMessage(""); // Reset success message

//     // Validate required fields
//     if (!formData.basicInformation.instituteName) {
//       setErrors((prev) => ({
//         ...prev,
//         instituteName: "Institute name is required",
//       }));
//       return;
//     }

//     // Prepare form data for submission
//     const payload = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (key === "documents") {
//         // Handle documents separately for file uploads
//         Object.keys(formData.documents).forEach((docKey) => {
//           const value = formData.documents[docKey];
//           if (value) {
//             if (Array.isArray(value)) {
//               value.forEach((file, index) =>
//                 payload.append(`${docKey}[${index}]`, file)
//               );
//             } else {
//               payload.append(docKey, value);
//             }
//           }
//         });
//       } else {
//         payload.append(key, JSON.stringify(formData[key]));
//       }
//     });

//     try {
//       const response = await axios.post(
//         "http://192.168.84.59:8080/api/admin/register",
//         payload,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       setSuccessMessage(response.data.message);
//     } catch (error) {
//       console.error("Error registering university:", error.response || error);
//       setErrors((prev) => ({
//         ...prev,
//         submitError:
//           error.response?.data?.error || "Failed to register university.",
//       }));
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-4">Register University</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information */}
//         <div>
//           <h3 className="text-lg font-semibold">Basic Information</h3>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Name of Institute
//             </label>
//             <input
//               type="text"
//               placeholder="Institute Name"
//               name="instituteName"
//               value={formData.basicInformation.instituteName}
//               onChange={(e) =>
//                 handleInputChange(e, "basicInformation", "instituteName")
//               }
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//           {/* Type of Institute */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Type of Institute
//             </label>
//             <Select
//               options={instituteTypeOptions}
//               name="instituteType"
//               placeholder="Select institute type"
//               value={formData.basicInformation.instituteType}
//               onChange={(e) =>
//                 handleDropdownChange(e, "basicInformation", "instituteType")
//               }
//               className="w-full"
//             />
//             {errors.instituteType && (
//               <p className="text-sm text-red-500">{errors.instituteType}</p>
//             )}
//           </div>


//           {/* vission and mission */}


//           {/* Conditional Fields for Affiliated University or Specify Type */}
//           {formData.instituteType?.value === "Autonomous Institutions" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Affiliated University Name
//               </label>
//               <input
//                 type="text"
//                 name="affiliatedUniversity"
//                 placeholder="Enter affiliated university name"
//                 value={formData.basicInformation.affiliatedUniversity}
//                 onChange={(e) =>
//                   handleInputChange(e, "basicInformation", "affiliatedUniversity")
//                 }
//                 className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           )}
//           {formData.instituteType?.value === "Affiliated Colleges" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Affiliated University Name
//               </label>
//               <input
//                 type="text"
//                 name="aAffiliated Colleges"
//                 placeholder="Enter affiliated university name"
//                 value={formData.basicInformation.affiliatedUniversity}
//                 onChange={(e) =>
//                   handleInputChange(e, "basicInformation", "aAffiliated Colleges")
//                 }
//                 className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           )}
//           {formData.instituteType?.value === "Any Other" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Specify Type
//               </label>
//               <input
//                 type="text"
//                 name="otherInstituteType"
//                 placeholder="Specify type of institute"
//                 value={formData.basicInformation.otherInstituteType}
//                 onChange={(e) =>
//                   handleInputChange(e, "basicInformation", "otherInstituteType")
//                 }
//                 className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           )}

//           {/* Add other fields for vision, affiliated university, etc. */}
//           {/* vision and mission */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Vision and Mission
//             </label>
//             <input
//               type="text"
//               placeholder="Vision and Mission"
//               name="visionandmission"
//               value={formData.basicInformation.visionMission}
//               onChange={(e) =>
//                 handleInputChange(e, "basicInformation", "visionMission")
//               }
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>
//         </div>

//         {/* Accreditation */}
//         <div>
//           <h3 className="text-lg font-semibold">Accreditation</h3>
//           {/* Add dynamic inputs for accreditation */}
//         </div>

//         {/* Location */}
//         <div>
//           <h3 className="text-lg font-semibold">Location</h3>
//           <input
//             type="text"
//             placeholder="Country"
//             name="country"
//             value={formData.location.country}
//             onChange={(e) => handleInputChange(e, "location", "country")}
//             className="w-full border p-2 rounded"
//           />
//           {/* Add other fields for state, city, fullAddress */}
//         </div>

//         {/* Contact Information */}
//         <div>
//           <h3 className="text-lg font-semibold">Contact Information</h3>
//           <input
//             type="text"
//             placeholder="Primary Contact Name"
//             name="name"
//             value={formData.contactInformation.primaryContact.name}
//             onChange={(e) =>
//               handleInputChange(e, "contactInformation.primaryContact", "name")
//             }
//             className="w-full border p-2 rounded"
//           />
//           {/* Add other fields for designation, phone, email */}
//         </div>

//         {/* Documents */}
//         <div>
//           <h3 className="text-lg font-semibold">Documents</h3>
//           <input
//             type="file"
//             name="registrationCertificate"
//             onChange={(e) => handleFileChange(e, "registrationCertificate")}
//             className="w-full border p-2 rounded"
//           />
//           {/* Add other file upload inputs */}
//         </div>

//         {/* Authentication */}
//         <div>
//           <h3 className="text-lg font-semibold">Authentication</h3>
//           <input
//             type="email"
//             placeholder="Email"
//             name="email"
//             value={formData.authentication.email}
//             onChange={(e) => handleInputChange(e, "authentication", "email")}
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             name="password"
//             value={formData.authentication.password}
//             onChange={(e) => handleInputChange(e, "authentication", "password")}
//             className="w-full border p-2 rounded mt-2"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Submit
//         </button>
//       </form>

//       {/* Display Success or Errors */}
//       {successMessage && (
//         <p className="text-green-500 mt-4">{successMessage}</p>
//       )}
//       {errors.submitError && (
//         <p className="text-red-500 mt-4">{errors.submitError}</p>
//       )}
//     </div>
//   );
// };

// export default RegisterUniversity;



import React, { useState } from 'react';

import axios from 'axios';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';

// import base url
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const UniversityRegistrationForm = () => {
  // All the code above (state, handlers, etc.)
  const [formData, setFormData] = useState({
    basicInformation: {
      instituteName: '',
      instituteType: '',
      affiliatedUniversity: '',
      otherInstituteType: '',
      visionMission: '',
    },
    accreditation: [], // Array of { name, details }
    location: {
      country: null,
      state: null,
      city: null,
      fullAddress: '',
    },
    contactInformation: {
      primaryContact: {
        name: '',
        designation: '',
        phone: '',
        email: '',
      },
      secondaryContact: {
        name: '',
        designation: '',
        phone: '',
        email: '',
      },
    },
    socialMediaLinks: {
      linkedin: '',
      youtube: '',
      instagram: '',
    },
    website: '',
    goalsOnPlatform: [], // Array of strings
    rankings: {
      internationalRankings: [], // Array of { name, rank }
      nationalRankings: [], // Array of { name, rank }
    },
    documents: {
      registrationCertificate: null, // File
      accreditationDocuments: [], // Array of files
      brochure: null, // File
      placementReport: null, // File
      campusPhotos: [], // Array of files
    },
    authentication: {
      email: '',
      password: '',
    },
  });

  const debug = (message, data) => console.log(message, JSON.stringify(data, null, 2));

  const handleTextInputChange = (e, section, field) => {
    const { value } = e.target;
    debug(`Text input changed: section=${section}, field=${field}, value=${value}`);
    if (section) {
      setFormData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleNestedTextInputChange = (e, section, subSection, field) => {
    const { value } = e.target;
    debug(`Nested text input changed: section=${section}, subSection=${subSection}, field=${field}, value=${value}`);
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [subSection]: {
          ...prevState[section][subSection],
          [field]: value,
        },
      },
    }));
  };

  const handleSelectChange = (value, section, field) => {
    debug(`Select changed: section=${section}, field=${field}, value=${JSON.stringify(value)}`);
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e, section, field, multiple = false) => {
    const files = e.target.files;
    debug(`File input changed: section=${section}, field=${field}, multiple=${multiple}, files=${files.length}`);
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: multiple ? [...files] : files[0],
      },
    }));
  };


  const handleArrayInputChange = (section, arrayName, index, field, value) => {
    const updatedArray = [...formData[section][arrayName]];
    updatedArray[index][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [arrayName]: updatedArray,
      },
    }));
  };


  const addItemToArray = (section, arrayName, newItem) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [arrayName]: [...prevState[section][arrayName], newItem],
      },
    }));
  };

  const removeItemFromArray = (section, arrayName, index) => {
    const updatedArray = formData[section][arrayName].filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [arrayName]: updatedArray,
      },
    }));
  };

  const instituteTypeOptions = [
    { value: 'Central University', label: 'Central University' },
    { value: 'State University', label: 'State University' },
    { value: 'Deemed to be University', label: 'Deemed to be University' },
    { value: 'Private Universities', label: 'Private Universities' },
    { value: 'Autonomous Institutions', label: 'Autonomous Institutions' },
    { value: 'Affiliated Colleges', label: 'Affiliated Colleges' },
    { value: 'Institutes of National Importance', label: 'Institutes of National Importance' },
    { value: 'Open Universities', label: 'Open Universities' },
    { value: 'Polytechnic and Vocational Institutions', label: 'Polytechnic and Vocational Institutions' },
    { value: 'Research Institutes', label: 'Research Institutes' },
    { value: 'Coaching Institutions', label: 'Coaching Institutions' },
    { value: 'Teacher Training Institutes', label: 'Teacher Training Institutes' },
    { value: 'Any Other', label: 'Any Other' },
  ];


  const accreditationOptions = [
    'UGC',
    'NAAC',
    'AICTE',
    'NBA',
    'MCI',
    'ICMR',
    'CCIM',
    'DCI',
    'PCI',
    'COA',
    'NCTE',
    'ICAI',
    'NCHMCT',
    'AIU',
    'IAI',
    'IIL',
    'QCI',
    'BCI',
    'NIOS',
    'Others',
  ];

  const goalsOnPlatformOptions = [
    { value: 'Education Enhancement', label: 'Education Enhancement' },
    { value: 'Placement & Recruitment', label: 'Placement & Recruitment' },
    { value: 'Industry Collaboration', label: 'Industry Collaboration' },
    { value: 'Skill Development', label: 'Skill Development' },
  ];
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));
  const stateOptions = formData.location.country
    ? State.getStatesOfCountry(formData.location.country.value).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }))
    : [];
  const cityOptions = formData.location.state
    ? City.getCitiesOfState(formData.location.country.value, formData.location.state.value).map((city) => ({
      value: city.name,
      label: city.name,
    }))
    : [];

  const handleCheckboxChange = (name) => {
    setFormData((prevState) => {
      const updatedAccreditation = prevState.accreditation.includes(name)
        ? prevState.accreditation.filter((acc) => acc !== name) // Remove if already selected
        : [...prevState.accreditation, name]; // Add if not selected
      return { ...prevState, accreditation: updatedAccreditation };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debug('Submitting form data:', formData);
    const formPayload = new FormData();

    formPayload.append('basicInformation', JSON.stringify(formData.basicInformation));
    console.log("basicInformation", formPayload)

    formPayload.append('accreditation', JSON.stringify(formData.accreditation));
    formPayload.append('location', JSON.stringify({
      country: formData.location.country?.label || '',
      state: formData.location.state?.label || '',
      city: formData.location.city?.label || '',
      fullAddress: formData.location.fullAddress,
    }));
    formPayload.append('contactInformation', JSON.stringify(formData.contactInformation));
    formPayload.append('socialMediaLinks', JSON.stringify(formData.socialMediaLinks));
    formPayload.append('website', formData.website);
    formPayload.append('goalsOnPlatform', JSON.stringify(formData.goalsOnPlatform.map((goal) => goal.value)));
    formPayload.append('rankings', JSON.stringify(formData.rankings));
    if (formData.documents.registrationCertificate) {
      formPayload.append('registrationCertificate', formData.documents.registrationCertificate);
    }
    formData.documents.accreditationDocuments.forEach((file) => {
      formPayload.append('accreditationDocuments', file);
    });
    if (formData.documents.brochure) {
      formPayload.append('brochure', formData.documents.brochure);
    }
    if (formData.documents.placementReport) {
      formPayload.append('placementReport', formData.documents.placementReport);
    }
    formData.documents.campusPhotos.forEach((file) => {
      formPayload.append('campusPhotos', file);
    });
    formPayload.append('authentication', JSON.stringify(formData.authentication));

    console.log("form payload ", formPayload)
    try {
      const response = await axios.post(`${BASE_URL}/admin/register`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('University registered successfully:', response.data);
      alert("University Registered successfully")
    } catch (error) {
      // Check if the error has a response and data
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred. Please try again.';

      // Show the error message in an alert
      alert(`Error: ${errorMessage}`);

      // Log the error to the console for debugging
      console.error('Error registering university:', errorMessage);
    }
  };

  return (
    <div className=" md:mx-16 p-6 bg-white rounded-lg shadow-lg my-10">
      <h2 className="text-2xl font-bold mb-4">University Registration Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Include all the form sections here */}
        {/* Basic Information */}
        
        <div>
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Institute Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name of Institute</label>
            <input
              type="text"
              name="instituteName"
              value={formData.basicInformation.instituteName}
              onChange={(e) => handleTextInputChange(e, 'basicInformation', 'instituteName')}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          {/* Institute Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Type of Institute</label>
            <Select
              options={instituteTypeOptions}
              name="instituteType"
              value={formData.basicInformation.instituteType}
              onChange={(value) => handleSelectChange(value, 'basicInformation', 'instituteType')}
              className="w-full"
            />
          </div>
          {/* Conditional Fields */}
          {['Autonomous Institutions', 'Affiliated Colleges'].includes(formData.basicInformation.instituteType?.value) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Affiliated University Name</label>
              <input
                type="text"
                name="affiliatedUniversity"
                value={formData.basicInformation.affiliatedUniversity || ''}
                onChange={(e) => handleTextInputChange(e, 'basicInformation', 'affiliatedUniversity')}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
          {formData.basicInformation.instituteType?.value === 'Any Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Specify Type</label>
              <input
                type="text"
                name="otherInstituteType"
                value={formData.basicInformation.otherInstituteType}
                onChange={(e) => handleTextInputChange(e, 'basicInformation', 'otherInstituteType')}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
          {/* Vision and Mission */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vision and Mission</label>
            <textarea
              name="visionMission"
              value={formData.basicInformation.visionMission}
              onChange={(e) => handleTextInputChange(e, 'basicInformation', 'visionMission')}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        </div>
        {/* Accreditation */}
        <div>
          <h3 className="text-lg font-semibold">Accreditation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {accreditationOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={option}
                  checked={formData.accreditation.includes(option)} // Check if the option is selected
                  onChange={() => handleCheckboxChange(option)} // Handle toggle
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <Select
              options={countryOptions}
              name="country"
              value={formData.location.country}
              onChange={(value) => {
                handleSelectChange(value, 'location', 'country');
                handleSelectChange(null, 'location', 'state');
                handleSelectChange(null, 'location', 'city');
              }}
              className="w-full"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <Select
              options={stateOptions}
              name="state"
              value={formData.location.state}
              onChange={(value) => {
                handleSelectChange(value, 'location', 'state');
                handleSelectChange(null, 'location', 'city');
              }}
              className="w-full"
              isDisabled={!formData.location.country}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <Select
              options={cityOptions}
              name="city"
              value={formData.location.city}
              onChange={(value) => handleSelectChange(value, 'location', 'city')}
              className="w-full"
              isDisabled={!formData.location.state}
            />
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Address</label>
            <textarea
              name="fullAddress"
              value={formData.location.fullAddress}
              onChange={(e) => handleTextInputChange(e, 'location', 'fullAddress')}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        </div>
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold">Contact Information</h3>

          {/* Primary Contact */}
          <div className="border p-2 rounded mb-4">
          <h4 className="font-semibold">Primary Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.contactInformation.primaryContact.name}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'primaryContact', 'name')}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.contactInformation.primaryContact.designation}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'primaryContact', 'designation')}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.contactInformation.primaryContact.phone}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'primaryContact', 'phone')}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.contactInformation.primaryContact.email}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'primaryContact', 'email')}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>
          </div>
          {/* Secondary Contact */}
          <div className="border p-2 rounded">
            <h4 className="font-semibold">Secondary Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.contactInformation.secondaryContact.name}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'secondaryContact', 'name')}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.contactInformation.secondaryContact.designation}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'secondaryContact', 'designation')}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.contactInformation.secondaryContact.phone}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'secondaryContact', 'phone')}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.contactInformation.secondaryContact.email}
                onChange={(e) => handleNestedTextInputChange(e, 'contactInformation', 'secondaryContact', 'email')}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
          </div>
        </div>
        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold">Social Media Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.socialMediaLinks.linkedin}
              onChange={(e) => handleTextInputChange(e, 'socialMediaLinks', 'linkedin')}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube</label>
            <input
              type="url"
              name="youtube"
              value={formData.socialMediaLinks.youtube}
              onChange={(e) => handleTextInputChange(e, 'socialMediaLinks', 'youtube')}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="url"
              name="instagram"
              value={formData.socialMediaLinks.instagram}
              onChange={(e) => handleTextInputChange(e, 'socialMediaLinks', 'instagram')}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
          <h3 className="block text-sm font-medium text-gray-700">Website</h3>
          <input
            type="url"
            name="website"
            value={formData.website || ''}
            onChange={(e) => handleTextInputChange(e, null, 'website')}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        </div>
        </div>
        {/* Goals on Platform */}
        <div>
          <h3 className="text-lg font-semibold">Goals on Platform</h3>
          <Select
            options={goalsOnPlatformOptions}
            isMulti
            name="goalsOnPlatform"
            value={formData.goalsOnPlatform}
            onChange={(value) => setFormData({ ...formData, goalsOnPlatform: value })}
            className="w-full"
          />
        </div>
        {/* Rankings */}
        <div>
          <h3 className="text-lg font-semibold">Rankings</h3>

          {/* International Rankings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold">International Rankings</h4>
            {formData.rankings.internationalRankings.map((rank, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={rank.name}
                    onChange={(e) => handleArrayInputChange('rankings', 'internationalRankings', index, 'name', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rank</label>
                  <input
                    type="number"
                    value={rank.rank}
                    onChange={(e) => handleArrayInputChange('rankings', 'internationalRankings', index, 'rank', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItemFromArray('rankings', 'internationalRankings', index)}
                  className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItemToArray('rankings', 'internationalRankings', { name: '', rank: '' })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add International Ranking
            </button>
          </div>

          {/* National Rankings */}
          <div>
            <h4 className="font-semibold">National Rankings</h4>
            {formData.rankings.nationalRankings.map((rank, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={rank.name}
                    onChange={(e) => handleArrayInputChange('rankings', 'nationalRankings', index, 'name', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rank</label>
                  <input
                    type="number"
                    value={rank.rank}
                    onChange={(e) => handleArrayInputChange('rankings', 'nationalRankings', index, 'rank', e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItemFromArray('rankings', 'nationalRankings', index)}
                  className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItemToArray('rankings', 'nationalRankings', { name: '', rank: '' })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add National Ranking
            </button>
          </div>
        </div></div>
        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold">Documents</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Registration Certificate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Certificate</label>
            <input
              type="file"
              name="registrationCertificate"
              onChange={(e) => handleFileChange(e, 'documents', 'registrationCertificate')}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Accreditation Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Accreditation Documents</label>
            <input
              type="file"
              name="accreditationDocuments"
              multiple
              onChange={(e) => handleFileChange(e, 'documents', 'accreditationDocuments', true)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Brochure */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Brochure</label>
            <input
              type="file"
              name="brochure"
              onChange={(e) => handleFileChange(e, 'documents', 'brochure')}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Placement Report */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Placement Report</label>
            <input
              type="file"
              name="placementReport"
              onChange={(e) => handleFileChange(e, 'documents', 'placementReport')}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Campus Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Campus Photos</label>
            <input
              type="file"
              name="campusPhotos"
              multiple
              onChange={(e) => handleFileChange(e, 'documents', 'campusPhotos', true)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        {/* Authentication */}
        <div>
          <h3 className="text-lg font-semibold">Authentication</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.authentication.email}
              onChange={(e) => handleTextInputChange(e, 'authentication', 'email')}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.authentication.password}
              onChange={(e) => handleTextInputChange(e, 'authentication', 'password')}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        </div>
        </div>
        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Register University
        </button>

      </form>
      </div>
   
  );
};


export default UniversityRegistrationForm;