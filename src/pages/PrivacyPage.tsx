
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#111827] mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your data.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Data Collection</h2>
          <p className="text-lg mb-6">
            Privacy policy content goes here...
          </p>
          {/* Add more sections as needed */}
        </div>
      </main>
      <Footer />
    </div>
  );
}