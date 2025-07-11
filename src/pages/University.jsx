import React, { useState } from 'react';
import ExploreUniversities from '../ConstatPages/University/ExploreUniversity';
import CampusRecruitment from '../ConstatPages/University/CampusRecruitment';
import WorkshopsTraining from '../ConstatPages/University/WorkshopTraining';
import CorporateCollaboration from '../ConstatPages/University/CorporateCollaboration';
import SuccessAnalytics from '../ConstatPages/University/SuccessAnalytics';
import CurriculumTraining from '../ConstatPages/University/CurriculumTraining';
import AlumniEngagement from '../ConstatPages/University/AlumniEngagement';
import CareerFairs from '../ConstatPages/University/CareerFairs';
import CommunicationChannels from '../ConstatPages/University/CommunicationChannels';
import FeedbackImprovement from '../ConstatPages/University/FeedbackImprovement';
import PlacementDashboard from '../ConstatPages/University/PlacementDashboard';

function University() {
  const [activeSection, setActiveSection] = useState('CampusRecruitment');

  const renderSection = () => {
    switch (activeSection) {
      case 'CampusRecruitment':
        return <CampusRecruitment />;
      case 'WorkshopsTraining':
        return <WorkshopsTraining />;
      case 'CorporateCollaboration':
        return <CorporateCollaboration />;
      case 'SuccessAnalytics':
        return <SuccessAnalytics />;
      case 'CurriculumTraining':
        return <CurriculumTraining />;
      case 'AlumniEngagement':
        return <AlumniEngagement />;
      case 'CareerFairs':
        return <CareerFairs />;
      case 'CommunicationChannels':
        return <CommunicationChannels />;
      case 'FeedbackImprovement':
        return <FeedbackImprovement />;
      case 'PlacementDashboard':
        return <PlacementDashboard />;
      default:
        return <ExploreUniversities />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Section: Explore Universities */}
      <section className="w-full bg-gray-100 p-6">
        <ExploreUniversities />
      </section>

      {/* Sidebar and Main Content Layout */}
      <div className='text-center mt-20 py-5'>
       <h2 className='text-5xl font-semibold mb-4'> Why the University Should Collaborate with V_Buzz?</h2> 
      </div>
      <div className="flex flex-grow flex-col lg:flex-row">
        
        {/* Sidebar */}
        <aside className="lg:w-1/4 w-full bg-gray-800 text-white p-4 lg:p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">What we Bring to you?</h2>
          <button
            onClick={() => setActiveSection('CampusRecruitment')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'CampusRecruitment' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Campus Recruitment
          </button>
          <button
            onClick={() => setActiveSection('WorkshopsTraining')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'WorkshopsTraining' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Workshops & Training
          </button>
          <button
            onClick={() => setActiveSection('CorporateCollaboration')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'CorporateCollaboration' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Corporate Collaboration
          </button>
          <button
            onClick={() => setActiveSection('SuccessAnalytics')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'SuccessAnalytics' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Success Analytics
          </button>
          <button
            onClick={() => setActiveSection('CurriculumTraining')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'CurriculumTraining' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Curriculum Training
          </button>
          <button
            onClick={() => setActiveSection('AlumniEngagement')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'AlumniEngagement' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Alumni Engagement
          </button>
          <button
            onClick={() => setActiveSection('CareerFairs')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'CareerFairs' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Career Fairs
          </button>
          <button
            onClick={() => setActiveSection('CommunicationChannels')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'CommunicationChannels' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Communication Channels
          </button>
          <button
            onClick={() => setActiveSection('FeedbackImprovement')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'FeedbackImprovement' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Feedback & Improvement
          </button>
          <button
            onClick={() => setActiveSection('PlacementDashboard')}
            className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${activeSection === 'PlacementDashboard' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Placement Dashboard
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="lg:w-3/4 w-full p-6 bg-white overflow-y-auto mb-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default University;
