// src/modules/admission/pages/AdmissionStepperPage.jsx

import React, { useState } from 'react';
import PersonalDetailsForm from './step/PersonalDetailsForm';
import ProgramSelectionForm from './step/ProgramSelectionForm';
import DocumentUploadForm from './step/DocumentUploadForm';
import AcademicDetailsForm from './step/AcademicDetailsformm';
import FinalReview from './step/FinalReview';

const AdmissionStepperPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [draftId, setDraftId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    'Personal Details',
    'Academic Details',
    'Program Selection',
    'Document Upload',
    'Final Review'
  ];

  const nextStep = () => {
    setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admission Application(coming soon...)</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`text-center flex-1 cursor-pointer ${index === currentStep ? 'font-bold text-blue-600' : 'text-gray-500'}`}
              onClick={() => setCurrentStep(index)}
            >
              {label} {completedSteps.includes(index) && <span className="ml-1 text-green-500">✔</span>}
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 mt-2 relative">
          <div
            className="h-1 bg-blue-600 absolute top-0 left-0"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {currentStep === 0 && <PersonalDetailsForm onNext={nextStep} draftId={draftId} setDraftId={setDraftId} />}
      {currentStep === 1 && <AcademicDetailsForm onNext={nextStep} draftId={draftId} />}
      {currentStep === 2 && <ProgramSelectionForm onNext={nextStep} draftId={draftId} />}
      {currentStep === 3 && <DocumentUploadForm onNext={nextStep} draftId={draftId} />}
      {currentStep === 4 && <FinalReview draftId={draftId} onFinish={() => alert("Redirecting to dashboard...")} />}

      {currentStep > 0 && currentStep < 4 && (
        <button onClick={prevStep} className="btn btn-outline mt-6">Back</button>
      )}
    </div>
  );
};

export default AdmissionStepperPage;
