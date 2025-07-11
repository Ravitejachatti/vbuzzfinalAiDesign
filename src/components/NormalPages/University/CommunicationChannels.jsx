import React from 'react';
import { FaBell, FaEnvelope, FaSms } from 'react-icons/fa';

const CommunicationChannels = () => {
  return (
    <section className="py-16" id="communication-channels">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Enhanced Communication Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaBell className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Centralized Communication Hub</h3>
            <p className="text-gray-600">
              Provide a platform where students can receive notifications about upcoming events, job
              openings, workshops, and important deadlines.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaEnvelope className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Automated Emails and Updates</h3>
            <p className="text-gray-600">
              Use automated emails to remind students of scheduled interviews, tests, and training
              sessions.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaSms className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">SMS Alerts</h3>
            <p className="text-gray-600">
              Send SMS alerts for urgent notifications, ensuring students never miss important
              updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationChannels;
