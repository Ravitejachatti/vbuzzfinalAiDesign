// src/modules/admission/components/steps/PersonalDetailsForm.jsx

import React from 'react';
import { useForm } from 'react-hook-form';
// import { savePersonalDetails } from '../../services/admission.api';

const PersonalDetailsForm = ({ onNext, draftId, setDraftId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await savePersonalDetails({ ...data, draftId });
      if (response.data.draftId) setDraftId(response.data.draftId);
      onNext();
    } catch (err) {
      console.error("Failed to save personal details", err);
    }
  };

  return (
    <div className="space-y-6">
     
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> 
    <h3 className="text-lg font-semibold">Personal Details</h3>
        <p className="text-gray-600">
          Please fill in your personal details as per the documents you are submitting.
          Ensure that all fields are filled correctly.
        </p>
      <div className="grid grid-cols-3 gap-8"> 
       
<div>
  <label className="block mb-1 font-medium">First Name</label>
        <input {...register('firstName', { required: true })} placeholder="First Name" className="input border border-gray-800 w-full p-2" />
        </div>
        
<div>
          <label className="block mb-1 font-medium">Last Name</label>
        <input {...register('lastName', { required: true })} placeholder="Last Name" className="input" />
</div>

<div>
    <label className="block mb-1 font-medium">Date of Birth</label>
        <input type="date" {...register('dob', { required: true })} className="input" />

</div>
      <div>
         <label className="block mb-1 font-medium">Gender</label>
        <select {...register('gender', { required: true })} className="input">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
       

        <input {...register('phone', { required: true })} placeholder="Phone Number" className="input" />
        <input {...register('email', { required: true })} placeholder="Email Address" className="input" />
        <input {...register('nationality')} placeholder="Nationality" className="input" />
        <input {...register('aadhaar')} placeholder="Aadhaar Number" className="input" />

        <select {...register('category', { required: true })} className="input">
          <option value="">Select Category</option>
          <option value="GEN">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>

        <input {...register('caste')} placeholder="Caste" className="input" />

        <select {...register('disability')} className="input">
          <option value="">Any Disability?</option>
          <option value="None">None</option>
          <option value="Visual">Visual</option>
          <option value="Hearing">Hearing</option>
          <option value="Orthopedic">Orthopedic</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <hr />

      <h3 className="text-lg font-semibold">Parent/Guardian Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <input {...register('fatherName', { required: true })} placeholder="Father's Name" className="input" />
        <input {...register('fatherOccupation')} placeholder="Father's Occupation" className="input" />

        <input {...register('motherName', { required: true })} placeholder="Mother's Name" className="input" />
        <input {...register('motherOccupation')} placeholder="Mother's Occupation" className="input" />

        <input {...register('parentPhone')} placeholder="Parent's Contact Number" className="input" />
        <input {...register('annualIncome')} placeholder="Family Annual Income" className="input" type="number" />
      </div>

      <textarea {...register('address')} placeholder="Residential Address" className="input w-full mt-4" rows="3"></textarea>

      <button type="submit" className="btn btn-primary mt-4">Save & Continue</button>
    </form>
</div>
  );
};

export default PersonalDetailsForm;
