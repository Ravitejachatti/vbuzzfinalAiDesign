// src/modules/admission/components/steps/AcademicDetailsForm.jsx

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
// import { saveAcademicDetails } from '../../services/admission.api';

const AcademicDetailsFormm = ({ onNext, draftId }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      exams: [{ name: '', score: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exams'
  });

  const onSubmit = async (data) => {
    try {
      await saveAcademicDetails({ ...data, draftId });
      onNext();
    } catch (err) {
      console.error("Failed to save academic details", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-lg font-semibold">Previous Education</h3>
      <div className="grid grid-cols-2 gap-4">
        <input {...register('tenthBoard', { required: true })} placeholder="10th Board Name" className="input" />
        <input {...register('tenthPercentage', { required: true })} placeholder="10th Percentage/Grade" className="input" type="text" />

        <input {...register('twelfthBoard')} placeholder="12th Board Name" className="input" />
        <input {...register('twelfthPercentage')} placeholder="12th Percentage/Grade" className="input" type="text" />

        <input {...register('bachelorUniversity')} placeholder="Bachelor's University (if any)" className="input" />
        <input {...register('bachelorPercentage')} placeholder="Bachelor's Percentage/Grade" className="input" type="text" />

        <input {...register('yearOfPassing')} placeholder="Year of Last Qualification" className="input" type="text" />
      </div>

      <h3 className="text-lg font-semibold mt-6">Entrance/Qualifying Exams</h3>
      {fields.map((exam, index) => (
        <div key={exam.id} className="grid grid-cols-3 gap-4 items-center mb-2">
          <input
            {...register(`exams.${index}.name`, { required: true })}
            placeholder="Exam Name (e.g., JEE, EAMCET)"
            className="input"
          />
          <input
            {...register(`exams.${index}.score`, { required: true })}
            placeholder="Score / Rank"
            className="input"
          />
          <button type="button" className="text-red-600" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline" onClick={() => append({ name: '', score: '' })}>+ Add Exam</button>

      <button type="submit" className="btn btn-primary mt-4">Save & Continue</button>
    </form>
  );
};

export default AcademicDetailsFormm;
