// src/modules/admission/components/steps/ProgramSelectionForm.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { saveProgramSelection } from '../../services/admission.api';

const ProgramSelectionForm = ({ onNext, draftId }) => {
  const { register, handleSubmit } = useForm();

  const universities = [
    { _id: 'u1', name: 'Andhra University' },
    { _id: 'u2', name: 'Osmania University' }
  ];

  const colleges = [
    { _id: 'c1', name: 'AU College of Engineering', universityId: 'u1' },
    { _id: 'c2', name: 'Osmania College of Science', universityId: 'u2' }
  ];

  const programs = [
    { _id: 'p1', name: 'B.Tech Computer Science', collegeId: 'c1' },
    { _id: 'p2', name: 'B.Sc Physics', collegeId: 'c2' }
  ];

  const onSubmit = async (data) => {
    try {
      await saveProgramSelection({ ...data, draftId });
      onNext();
    } catch (err) {
      console.error("Failed to save program selection", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-lg font-semibold">Select University, College, and Program</h3>

        <select {...register('university', { required: true })} className="input">
          <option value="">Select University</option>
          {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>

        <select {...register('college', { required: true })} className="input">
          <option value="">Select College</option>
          {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select {...register('program', { required: true })} className="input">
          <option value="">Select Program</option>
          {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <select {...register('collegeType', { required: true })} className="input">
          <option value="">Select College Type</option>
          <option value="Private">Private</option>
          <option value="Government">Government</option>
          <option value="Deemed">Deemed</option>
          <option value="Open">Open</option>
        </select>

        <select {...register('collegeMode', { required: true })} className="input">
          <option value="">Select College Mode</option>
          <option value="Regular">Regular</option>
          <option value="Distance">Distance</option>
          <option value="Online">Online</option>
          <option value="Part-Time">Part-Time</option>
        </select>

        <select {...register('collegeDuration', { required: true })} className="input">
          <option value="">Select College Duration</option>
          <option value="1 Year">1 Year</option>
          <option value="2 Years">2 Years</option>
          <option value="3 Years">3 Years</option>
          <option value="4 Years">4 Years</option>
        </select>

        <select {...register('intakeSeason', { required: true })} className="input">
          <option value="">Select Intake Season</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="Fall">Fall</option>
          <option value="Spring">Spring</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary mt-4">Save & Continue</button>
    </form>
  );
};

export default ProgramSelectionForm;
