
 
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#111827] mb-8">About Flash</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Flash is a revolutionary sports platform designed to bring together athletes, sports enthusiasts, and venue owners in one seamless ecosystem.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="text-lg mb-6">
            We aim to make sports more accessible and enjoyable for everyone by providing an easy-to-use platform for venue booking, team formation, and community building.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
          <p className="text-lg mb-6">
            To become the world's leading sports community platform, connecting millions of players and venues across the globe.
          </p>
        </div>
      </main>
     </div>
  );
}