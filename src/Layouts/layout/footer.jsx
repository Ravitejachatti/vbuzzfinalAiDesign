import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Globe,
  Award,
  Users,
  Clock
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { title: 'About Us', href: '/about' },
    { title: 'Services', href: '/services' },
    { title: 'Career Assessment', href: '/assessment' },
    { title: 'Mock Interviews', href: '/mock-interviews' },
    { title: 'Expert Mentoring', href: '/mentoring' },
    { title: 'Study Abroad', href: '/study-abroad' }
  ];

  const services = [
    { title: 'Virtual Mock Interviews', href: '/services/mock-interviews' },
    { title: 'Industry Mentoring', href: '/services/mentoring' },
    { title: 'Placement Programs', href: '/services/placement' },
    { title: 'E-Tuitions', href: '/services/tuitions' },
    { title: 'Overseas Education', href: '/services/overseas' },
    { title: 'Career Counseling', href: '/services/counseling' }
  ];

  const resources = [
    { title: 'Blog', href: '/blog' },
    { title: 'Career Resources', href: '/resources' },
    { title: 'Success Stories', href: '/success-stories' },
    { title: 'Events & Workshops', href: '/events' },
    { title: 'FAQs', href: '/faqs' },
    { title: 'Support Center', href: '/support' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src="/vcbil.png" 
                alt="VCBIL Logo" 
                className="h-20"
              />
            </div>
            <p className="mb-6 text-gray-400">
              Empowering careers through AI-driven guidance and industry expertise. Your trusted partner in professional growth and development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="flex items-center hover:text-blue-500 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.href}
                    className="flex items-center hover:text-blue-500 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-blue-500" />
                <p>Andhra University South Campus Placement Cell<br />Chinna Waltair, Visakhapatnam 530003, AP</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-500" />
                <a href="tel:+911234567890" className="hover:text-blue-500 transition-colors">
                  +91 6304662487
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <a href="mailto:info@vcbil.com" className="hover:text-blue-500 transition-colors">
                  kushwahagautam24@gmail.com
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Business Hours
              </h4>
              <p className="text-gray-400">
                Monday - Saturday: 9:00 AM - 7:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Banner */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-500 mr-2" />
              <span>ISO 9001:2015 Certified</span>
            </div>
            <div className="flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-500 mr-2" />
              <span>Global Presence in 10+ Countries</span>
            </div>
            <div className="flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500 mr-2" />
              <span>50,000+ Success Stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} V Corporate Buzz International Pvt. Ltd. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy-policy" className="hover:text-blue-500 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-conditions" className="hover:text-blue-500 transition-colors">
                Terms & Conditions
              </a>
              <a href="/sitemap" className="hover:text-blue-500 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;