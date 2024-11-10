export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-8 text-gray-600 leading-relaxed">
              At Flash, we take your privacy seriously. This privacy policy outlines our practices regarding the collection, use, and protection of your personal information when you use our services. By using Flash, you agree to the terms described in this policy.
            </p>

            {/* Information Collection Section */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center">
                <span className="text-blue-500 mr-3">1.</span>
                Information We Collect
              </h2>
              <ul className="list-disc pl-8 space-y-3 text-gray-600">
                <li className="mb-2">Personal identification information (name, email, phone number)</li>
                <li className="mb-2">Booking details and service preferences</li>
                <li className="mb-2">Payment and billing information</li>
                <li className="mb-2">Device information and usage analytics</li>
                <li className="mb-2">Communication records and feedback</li>
              </ul>
            </div>

            {/* Data Usage Section */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center">
                <span className="text-blue-500 mr-3">2.</span>
                How We Use Your Data
              </h2>
              <ul className="list-disc pl-8 space-y-3 text-gray-600">
                <li className="mb-2">Process and manage your bookings</li>
                <li className="mb-2">Improve our services and user experience</li>
                <li className="mb-2">Send relevant notifications and updates</li>
                <li className="mb-2">Analyze usage patterns and optimize performance</li>
                <li className="mb-2">Comply with legal obligations</li>
              </ul>
            </div>

            {/* Data Protection Section */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center">
                <span className="text-blue-500 mr-3">3.</span>
                Data Protection
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We employ industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. We restrict access to personal information to authorized personnel only.
              </p>
            </div>

            {/* Your Rights Section */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center">
                <span className="text-blue-500 mr-3">4.</span>
                Your Rights
              </h2>
              <ul className="list-disc pl-8 space-y-3 text-gray-600">
                <li className="mb-2">Access your personal data</li>
                <li className="mb-2">Request corrections or updates</li>
                <li className="mb-2">Delete your account and associated data</li>
                <li className="mb-2">Opt-out of marketing communications</li>
              </ul>
            </div>

            {/* Cookies Section */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center">
                <span className="text-blue-500 mr-3">5.</span>
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, remember preferences, and analyze platform usage. You can manage cookie preferences through your browser settings.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center">
                <span className="text-blue-500 mr-3">6.</span>
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this privacy policy or your personal data, please contact our privacy team at privacy@flash.com.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}