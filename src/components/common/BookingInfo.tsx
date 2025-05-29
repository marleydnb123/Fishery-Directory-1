import React from 'react';
import { Info, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

interface BookingInfoProps {
  name: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
}

const BookingInfo: React.FC<BookingInfoProps> = ({
  name,
  contact_phone,
  contact_email,
  website
}) => {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-0">
      <div
        className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl"
        style={{
          background: "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
        }}
      >
        <Info className="h-7 w-7 text-white mr-3 animate-bounce" />
        <h3 className="text-3xl font-bebas font-bold tracking-wide text-white mb-0">
          Booking Information
        </h3>
      </div>
      
      <div className="p-6">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary-700">Day tickets:</span>
              <span>Available On-Site</span>
            </div>
            <span className="text-sm text-primary-600 font-semibold">£8 - £25</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold text-primary-700 mr-2">Group bookings:</span>
            <span>Please enquire for special rates</span>
          </div>

          {contact_phone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-primary-600 mr-2" />
              <a
                href={`tel:${contact_phone}`}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                {contact_phone}
              </a>
            </div>
          )}

          {contact_email && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-primary-600 mr-2" />
              <a
                href={`mailto:${contact_email}`}
                className="text-primary-600 hover:text-primary-800 transition-colors"
              >
                {contact_email}
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <a
            href={`mailto:${contact_email}`}
            className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-lg font-semibold shadow transition-colors"
          >
            Contact for Booking
          </a>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
            <a
              href={`https://facebook.com/${name.toLowerCase().replace(/\s+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={`https://twitter.com/${name.toLowerCase().replace(/\s+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href={`https://instagram.com/${name.toLowerCase().replace(/\s+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="mt-4 text-xs text-center text-primary-500 italic">
          Fast replies, friendly staff. We do not handle bookings directly.
        </p>
      </div>
    </div>
  );
};

export default BookingInfo;