export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-5xl font-bold text-[#111827] mb-8 text-center">Terms of Service</h1>
        
        {/* Table of Contents */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            {['User Agreement', 'Service Usage', 'User Responsibilities', 'Payment Terms', 'Liability', 'Privacy Policy'].map((item, index) => (
              <a href={`#section-${index + 1}`} key={index} 
                 className="block text-blue-600 hover:text-blue-800 transition-colors">
                {index + 1}. {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="prose max-w-none space-y-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Flash. By accessing or using our platform, you agree to be bound by these Terms of Service.
            </p>
          </div>

          {/* Sections */}
          <div id="section-1" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-[#111827] mb-6 border-b pb-4">1. User Agreement</h2>
            <p className="text-lg mb-6">
              By using Flash, you agree to comply with and be bound by these terms and conditions. If you disagree with any part of these terms, you may not access our services.
            </p>
          </div>

          <div id="section-2" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-[#111827] mb-6 border-b pb-4">2. Service Usage</h2>
            <p className="text-lg mb-6">
              Our platform provides sports facility booking and community features. Users must be at least 18 years old or have parental consent to use our services.
            </p>
          </div>

          <div id="section-3" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-[#111827] mb-6 border-b pb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 text-lg">
              <li className="mb-2">Provide accurate and complete information</li>
              <li className="mb-2">Maintain the security of your account</li>
              <li className="mb-2">Respect other users and venue policies</li>
              <li className="mb-2">Honor bookings and commitments</li>
            </ul>
          </div>

          <div id="section-4" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-[#111827] mb-6 border-b pb-4">4. Payment Terms</h2>
            <p className="text-lg mb-6">
              All payments are processed securely through our platform. Cancellation and refund policies vary by venue and are clearly stated during the booking process.
            </p>
          </div>

          <div id="section-5" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-[#111827] mb-6 border-b pb-4">5. Liability</h2>
            <p className="text-lg mb-6">
              Flash is not liable for any injuries, damages, or losses incurred while using venues or participating in activities booked through our platform.
            </p>
          </div>

          <div id="section-6" className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-[#111827] mb-6 border-b pb-4">6. Privacy Policy</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Data Collection</h3>
                <p className="text-lg mb-6">
                  We collect information including your name, email, phone number, location data, and device information when you use our platform.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Data Usage</h3>
                <ul className="list-disc pl-6 mb-6 text-lg">
                  <li className="mb-2">Provide and improve our services</li>
                  <li className="mb-2">Process bookings and payments</li>
                  <li className="mb-2">Send service-related communications</li>
                  <li className="mb-2">Prevent fraud and enhance security</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Data Sharing</h3>
                <p className="text-lg mb-6">
                  We may share your information with sports facilities, payment processors, and other service providers necessary for platform operation. We do not sell your personal data to third parties.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Security</h3>
                <p className="text-lg mb-6">
                  We implement appropriate security measures to protect your information. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}