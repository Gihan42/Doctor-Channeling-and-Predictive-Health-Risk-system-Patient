import { Link } from 'react-router-dom';
import { HeartPulseIcon, PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-50 text-gray-600 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <HeartPulseIcon className="h-8 w-8 text-teal-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                MediCare
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Providing specialized care for cancer and heart patients with
              advanced channeling services.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-500">
              <li>
                <Link to="/" className="hover:text-teal-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-teal-500 transition-colors">
                  Health Assistant
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-500 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-500 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Services
            </h3>
            <ul className="space-y-2 text-gray-500">
              <li>Doctor Channeling</li>
              <li>Risk Assessment</li>
              <li>Health Chatbot</li>
              <li>Appointment Management</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Contact Us
            </h3>
            <ul className="space-y-2 text-gray-500">
              <li className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 text-teal-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="h-4 w-4 mr-2 text-teal-500" />
                <span>support@medicare.com</span>
              </li>
              <li className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2 text-teal-500" />
                <span>123 Healthcare Ave, Medical City</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} MediCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;