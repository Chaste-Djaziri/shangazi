import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover | SEC Portal",
  description: "Welcome to your personalized discovery feed on the SEC Portal.",
};

export default function DiscoverPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-serif mb-2">Welcome to SEC Portal</h1>
        <p className="text-xl text-gray-600 font-marcellus">
          Explore exclusive content, manage your guidance sessions, and stay connected with the community.
        </p>
      </header>

      <section className="bg-gray-50 p-12 rounded-2xl border border-gray-100 text-center">
        <h2 className="text-2xl font-serif mb-4">You&apos;re logged in!</h2>
        <p className="text-gray-600 mb-8">
          This is your personal dashboard where you can discover new articles, upcoming events, and personalized recommendations from Shangazi Emma Claudine.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-2">Latest Content</h3>
            <p className="text-sm text-gray-500">Access premium articles and videos.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-2">My Bookings</h3>
            <p className="text-sm text-gray-500">View and manage your appointments.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-2">Member Perks</h3>
            <p className="text-sm text-gray-500">Exclusive discounts and early access.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
