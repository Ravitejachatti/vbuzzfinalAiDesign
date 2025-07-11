import React, { useState } from 'react';
import { 
  Video, Users, Award, BookOpen, GraduationCap, 
  Globe, Building2, ArrowRight 
} from 'lucide-react';
import { FaChalkboardTeacher } from 'react-icons/fa';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      icon: <Video className="w-12 h-12 text-blue-600" />,
      title: "Virtual Mock Interviews",
      description: "Practice with industry experts and get personalized feedback to improve your interview skills.",
      features: [
        "One-on-one sessions with corporate experts",
        "Industry-specific interview preparation",
        "Detailed feedback and improvement areas",
        "Interview recordings for self-review"
      ]
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Expert Mentoring",
      description: "Get guidance from industry leaders, bureaucrats, and embassy experts.",
      features: [
        "Personalized career roadmap",
        "Industry-specific guidance",
        "Regular mentoring sessions",
        "Network building opportunities"
      ]
    },
    {
      icon: <Award className="w-12 h-12 text-blue-600" />,
      title: "Placement Guarantee Programs",
      description: "Comprehensive training programs with assured job placement.",
      features: [
        "Skill assessment and development",
        "Industry-ready curriculum",
        "Placement assistance",
        "Post-placement support"
      ]
    },
    {
      icon: <BookOpen className="w-12 h-12 text-blue-600" />,
      title: "Industry Ready Programs",
      description: "Get trained in the latest industry skills and technologies.",
      features: [
        "Hands-on projects",
        "Industry certification",
        "Expert-led workshops",
        "Real-world case studies"
      ]
    },
    {
      icon: <FaChalkboardTeacher className="w-12 h-12 text-blue-600" />,
      title: "E-Tuitions",
      description: "Online learning sessions for academic and professional courses.",
      features: [
        "Live interactive sessions",
        "Personalized attention",
        "Flexible scheduling",
        "Expert instructors"
      ]
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      title: "Overseas Education",
      description: "Comprehensive guidance for studying abroad in top universities.",
      features: [
        "University selection assistance",
        "Scholarship guidance",
        "Visa application support",
        "Pre-departure orientation"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive career development and educational services powered by AI technology and industry expertise
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-gray-50 border-t">
                <button 
                  onClick={() => setSelectedService(service)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Connect with our experts and discover how we can help you achieve your career goals
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center mx-auto">
              Schedule a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">How do virtual mock interviews work?</h3>
              <p className="text-gray-600">Our virtual mock interviews are conducted through our secure platform with industry experts who provide real-time feedback and detailed assessments to help improve your interview skills.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">What is included in the placement guarantee program?</h3>
              <p className="text-gray-600">Our placement guarantee program includes comprehensive training, skill development, mock interviews, and assured job placement assistance with our partner companies.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">How can I connect with a mentor?</h3>
              <p className="text-gray-600">After signing up, you'll be matched with a mentor based on your career goals and industry preferences. You can schedule sessions through our platform at your convenience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Need More Information?</h2>
            <p className="text-xl mb-8">Our team is here to answer any questions you may have about our services</p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
                Contact Us
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;