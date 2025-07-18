// src/modules/admission/components/steps/DocumentUploadForm.jsx

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
// import { uploadDocuments } from '../../services/admission.api';

const DocumentUploadForm = ({ onNext, draftId }) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      documents: [
        { name: '10th Marksheet' },
        { name: '12th Marksheet' },
        { name: 'Aadhaar Card' },
        { name: 'Transfer Certificate' },
        { name: 'Passport Photo' }
      ]
    }
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'documents'
  });

  const [previews, setPreviews] = useState({});

  const handlePreview = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('draftId', draftId);

      data.documents.forEach((doc, idx) => {
        if (doc.file && doc.file[0]) {
          formData.append('documents', doc.file[0]);
          formData.append('names', doc.name);
        }
      });

      await uploadDocuments(formData);
      onNext();
    } catch (err) {
      console.error("Document upload failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-lg font-semibold">Upload Required Documents</h3>

      {fields.map((item, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-1 font-medium">{item.name}</label>
          <input
            type="file"
            {...register(`documents.${index}.file`)}
            accept=".pdf,.jpg,.jpeg,.png"
            className="input"
            onChange={(e) => handlePreview(e, item.name)}
          />
          {previews[item.name] && (
            <div className="mt-2">
              <iframe src={previews[item.name]} title="preview" className="w-full h-40 border rounded" />
            </div>
          )}
        </div>
      ))}

      <button type="submit" className="btn btn-primary">Upload & Continue</button>
    </form>
  );
};

export default DocumentUploadForm;
