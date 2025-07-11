import React from 'react';
import { FaRegComments, FaSmile, FaSyncAlt } from 'react-icons/fa';

const FeedbackImprovement = () => {
  return (
    <section className="py-16 bg-gray-50" id="feedback-improvement">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Student Feedback and Continuous Improvement</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaRegComments className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Regular Surveys</h3>
            <p className="text-gray-600">
              Collect feedback from students on the quality and relevance of training sessions,
              workshops, and recruitment drives to improve services continually.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/3 px-4">
            <FaSmile className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Student Success Stories</h3>
            <p className="text-gray-600">
              Showcase stories of students who successfully found employment through V-Buzz's
              initiatives, highlighting the effectiveness of the programs.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center md:w-1/3 px-4">
            <FaSyncAlt className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Continuous Improvement</h3>
            <p className="text-gray-600">
              Use the feedback to make data-driven decisions for enhancing training programs and
              recruitment processes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackImprovement;
