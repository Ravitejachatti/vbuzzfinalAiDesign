import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react'; // Import icons from Lucide
import 'tailwindcss/tailwind.css';

const ContactUs = () => {
  return (
    <div className="flex flex-col items-center px-6 py-12 md:px-16 lg:px-24 bg-gray-50">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Get in Touch with V-Buzz</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          We'd love to hear from you! Whether you have questions, feedback, or need more information about our services, we're here to help.
        </p>
      </header>

      {/* Contact Information */}
      <section className="flex flex-col md:flex-row md:justify-around w-full max-w-4xl mb-12">
        <div className="flex items-center mb-4 md:mb-0">
          <Mail className="text-blue-600 w-6 h-6 mr-3" />
          <p className="text-gray-700">info@vbuzz.com</p>
        </div>
        <div className="flex items-center mb-4 md:mb-0">
          <Phone className="text-blue-600 w-6 h-6 mr-3" />
          <p className="text-gray-700">+1 234 567 890</p>
        </div>
        <div className="flex items-center">
          <MapPin className="text-blue-600 w-6 h-6 mr-3" />
          <p className="text-gray-700">123 V-Buzz Street, City, Country</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full max-w-lg mb-12">
        <form className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the subject"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="message">Message</label>
            <textarea
              id="message"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message"
              rows="5"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </section>

      {/* Map Section */}
      <section className="w-full max-w-4xl mb-12">
        <iframe
          title="V-Buzz Office Location"
          src="https://www.google.com/maps/embed?..." // Replace with actual map link
          className="w-full h-64 border rounded-md"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>

      {/* Social Media Links */}
      <section className="flex space-x-6 text-gray-600">
        <a href="#" className="hover:text-blue-600 transition duration-200">
          <Linkedin className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-blue-600 transition duration-200">
          <Twitter className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-blue-600 transition duration-200">
          <Facebook className="w-6 h-6" />
        </a>
      </section>
    </div>
  );
};

export default ContactUs;
