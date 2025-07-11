import React from 'react';
import { FaChartPie, FaChartBar, FaChartArea } from 'react-icons/fa';

const SuccessAnalytics = () => {
  return (
    <section className="py-16" id="success-analytics">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Student Success Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaChartPie className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Performance Tracking</h3>
            <p className="text-gray-600">
              Track students' performance and progress throughout the training sessions and
              recruitment process to identify areas of improvement.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaChartBar className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Placement Metrics</h3>
            <p className="text-gray-600">
              Provide universities with data insights and metrics on student placements, employer
              satisfaction, and success rates of recruitment efforts.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FaChartArea className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Feedback Mechanism</h3>
            <p className="text-gray-600">
              Gather feedback from both students and employers to continuously improve the
              recruitment and training processes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessAnalytics;
