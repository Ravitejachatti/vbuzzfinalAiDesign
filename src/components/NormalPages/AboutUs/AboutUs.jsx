import React from 'react';
import { Target, Award, Users, Briefcase } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Our Mission",
      description: "To empower youth and professionals with cutting-edge AI technology and expert guidance for successful careers."
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Excellence",
      description: "We strive for excellence in every interaction, providing top-tier career guidance and support."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Partnership",
      description: "We build strong partnerships with industry experts, universities, and organizations worldwide."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      title: "Innovation",
      description: "Our AI-powered solutions provide personalized career guidance and insights for optimal results."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About V Corporate Buzz</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            An award-winning organization specializing in career development, virtual mentoring, and overseas education consultancy.
          </p>
        </div>
      </div>

      {/* Company Overview */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            V Corporate Buzz International Pvt. Ltd. (VCBIL) was founded with a vision to revolutionize career development and educational consulting. We provide a one-stop solution for all career needs, leveraging cutting-edge AI technology and industry expertise.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Our team of experts works tirelessly to provide virtual mock interviews, industry mentoring, and comprehensive career guidance to job seekers and competitive exam aspirants from India and abroad.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Expert Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team consists of industry leaders, academic experts, bureaucrats, and diplomats who are committed to helping you achieve your career goals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add team member components here */}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;