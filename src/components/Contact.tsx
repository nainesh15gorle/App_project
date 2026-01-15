import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#003366] mb-3">Contact Us</h2>
          <p className="text-gray-600">Get in touch with the SRM E-Yantra Lab team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Lab Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-gray-100">
                    SRM Institute of Science and Technology<br />
                    Kattankulathur, Chennai - 603203<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a
                    href="mailto:eyantractechsrmist.gmail.com"
                    className="text-[#FFD700] hover:underline"
                  >
                    eyantractechsrmist.gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-gray-100">+91 98848 23354 </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Lab Hours</h4>
                  <p className="text-gray-100">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-[#003366] mb-6">About E-Yantra Lab</h3>

            <div className="space-y-4 text-gray-700">
              <p>
                The SRM E-Yantra Lab is a state-of-the-art robotics and embedded systems
                laboratory designed to foster innovation and hands-on learning.
              </p>

              <p>
                Our lab is equipped with a wide range of components, tools, and equipment
                to support research and development in:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Robotics and Automation</li>
                <li>Embedded Systems Development</li>
                <li>IoT Applications</li>
                <li>Sensor Integration</li>
                <li>Control Systems</li>
              </ul>

              <p>
                Students and researchers can check out components for their projects and
                experiments. Our inventory management system ensures efficient tracking
                and availability of resources.
              </p>

              <div className="mt-6 p-4 bg-[#FFD700] bg-opacity-20 border-l-4 border-[#FFD700] rounded">
                <p className="text-sm font-medium text-gray-800">
                  For component checkout requests or lab access, please contact us during
                  lab hours or send an email with your requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
