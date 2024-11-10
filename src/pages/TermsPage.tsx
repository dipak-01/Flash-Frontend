
 
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#111827] mb-8">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            By using Flash, you agree to these terms of service. Please read them carefully.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">1. User Agreement</h2>
          <p className="text-lg mb-6">
            Terms of service content goes here...
          </p>
          {/* Add more sections as needed */}
        </div>
      </main>
     </div>
  );
}