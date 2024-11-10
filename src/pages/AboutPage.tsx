export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#111827] mb-8">About Flash</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Flash is revolutionizing the sports industry by creating a comprehensive digital ecosystem that connects athletes, venues, and communities.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="text-lg mb-6">
            We're dedicated to making sports more accessible and enjoyable for everyone. Our platform simplifies venue booking, team formation, and community engagement, breaking down barriers to sports participation.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
          <p className="text-lg mb-6">
            To become the world's leading sports community platform, fostering connections and promoting active lifestyles across the globe.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
          <ul className="list-disc pl-6 mb-6 text-lg">
            <li className="mb-2">Seamless venue booking and management</li>
            <li className="mb-2">Team creation and organization tools</li>
            <li className="mb-2">Community engagement features</li>
            <li className="mb-2">Secure payment processing</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-lg">Constantly improving our platform to better serve our users.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-lg">Building meaningful connections through sports.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p className="text-lg">Making sports available to everyone, everywhere.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-lg">Operating with transparency and reliability.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}