import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

const headerImageUrl = 'https://www.hackett-lakes.co.uk/wp-content/uploads/Banner8.jpg'; // Example image URL

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      message?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
        ]);

      if (error) {
        console.error('Supabase insert error:', error);
        toast.error(error.message || 'Supabase insert error');
        return;
      }

      toast.success('Your message has been sent successfully!');

      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (err) {
      toast.error('There was an error sending your message. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="w-full h-64 md:h-80 overflow-hidden relative">
        <img
          src={headerImageUrl}
          alt="Contact header"
          className="w-full h-full object-cover object-center"
          style={{ display: 'block' }}
        />
        {/* Optional: Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none" />
      </div>

      {/* Main Content with extra top margin */}
      <div className="container mx-auto px-4" style={{ marginTop: '3rem' }}>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bebas font-bold text-gray-900 mb-4">
            Contact Us
          </h1> 
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our fisheries or need help with a booking? 
            We're here to help!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 mb-16 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md p-8 h-full">
              <h2 className="text-4xl font-bebas font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@tackleflow.com</p>
                    <p className="text-gray-600">support@tackleflow.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+44 1234 567890</p>
                    <p className="text-gray-600">Mon-Fri, 9am-5pm</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">123 Angler's Way</p>
                    <p className="text-gray-600">London, UK</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-4xl font-bebas font-semibold mb-3">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">How do I list my fishery on this directory?</h4>
                    <p className="text-gray-600">
                      You can submit your fishery details through our listing form or contact us directly. We’ll guide you through the process and help you get set up.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900">How do I book a peg at the fishery?</h4>
                    <p className="text-gray-600">
                      You can book directly through the fishery's Website if they offer online booking, or use the Fisheries contact details provided to arrange your session.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900">How do I use this website?</h4>
                    <p className="text-gray-600">
                      Use the search and filter tools to explore fisheries, view details, and access contact or booking options. It's designed to help anglers find their perfect spot easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-4xl font-bebas font-semibold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-800 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8 p-4 bg-primary-100 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary-900 mr-2 mt-0.5" />
                  <p className="text-primary-900 text-sm">
                    We typically respond to inquiries within 24 hours during business days.
                  </p>
                  {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter for the latest updates and fishery management tips
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue"
                required
              />
            </div>
            
            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            {subscribed ? (
              <div className="flex items-center justify-center text-green-600">
                <Check className="h-5 w-5 mr-2" />
                Thanks for subscribing!
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-customBlue hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            )}
          </form>
        </div>
      </section>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

export default Contact;
