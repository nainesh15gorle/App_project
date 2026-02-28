import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#003366] mb-3">
            Contact Us
          </h2>
          <p className="text-gray-600">
            Get in touch with the Spatial Computing Lab team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left Panel */}
          <div className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-2xl shadow-xl p-10 text-white">
            <h3 className="text-2xl font-bold mb-8">
              Lab Information
            </h3>

            <div className="space-y-8">

              {/* Address */}
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-gray-100 leading-relaxed">
                    Tech Park – 15th Floor, SRM University<br />
                    Kattankulathur, Chennai – 603203<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a
                    href="mailto:eyantractechsrmist@gmail.com"
                    className="text-[#FFD700] hover:underline"
                  >
                    eyantractechsrmist@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-gray-100">
                    +91 98848 23354
                  </p>
                </div>
              </div>

              {/* Lab Hours */}
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Clock size={22} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Lab Hours</h4>
                  <p className="text-gray-100 leading-relaxed">
                    Monday – Friday: 9:00 AM – 5:00 PM<br />
                    Saturday: 9:00 AM – 5:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-gray-50 rounded-2xl shadow-xl p-10">
            <h3 className="text-2xl font-bold text-[#003366] mb-6">
              About Spatial Computing Lab
            </h3>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Spatial Computing Lab is a state-of-the-art robotics and embedded systems
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

              <div className="mt-6 p-4 bg-[#FFD700]/20 border-l-4 border-[#FFD700] rounded-lg">
                <p className="text-sm font-medium text-gray-800">
                  NOTE: For component checkout requests or lab access,
                  please contact us during lab hours or send an email
                  with your requirements.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}