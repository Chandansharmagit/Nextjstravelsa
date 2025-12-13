import Hero from '@/components/Hero';
import DestinationCard from '@/components/DestinationCard';
import TourCard from '@/components/TourCard';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import StatsSection from '@/components/StatsSection';
import TeamSection from '@/components/TeamSection';
import ReviewsSection from '@/components/ReviewsSection';
import FAQ from '@/components/FAQ';
import Link from 'next/link';

// Fetch Featured Destinations
async function getFeaturedDestinations() {
  try {
    const res = await fetch('https://backendtsa.travelsansr.com/api/destinations?featured=true', {
      cache: 'no-store',
    });
    if (!res.ok) {
      // Try fetching all if featured call fails or returns 404
      const fallbackRes = await fetch('https://backendtsa.travelsansr.com/api/destinations', { cache: 'no-store' });
      if (!fallbackRes.ok) return [];
      const fallbackData = await fallbackRes.json();
      return Array.isArray(fallbackData) ? fallbackData : fallbackData.data || fallbackData.destinations || [];
    }
    const data = await res.json();
    const destinations = Array.isArray(data) ? data : data.data || data.destinations || [];

    // If no featured destinations found, fallback to showing some random ones
    if (destinations.length === 0) {
      const fallbackRes = await fetch('https://backendtsa.travelsansr.com/api/destinations', { cache: 'no-store' });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return Array.isArray(fallbackData) ? fallbackData : fallbackData.data || fallbackData.destinations || [];
      }
    }
    return destinations;
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

// Fetch Popular Tours (Just random tours for now)
async function getPopularTours() {
  try {
    const res = await fetch('https://backendtsa.travelsansr.com/api/tours', {
      cache: 'no-store',
    });
    if (!res.ok) return [];

    // Simulate "popular" by taking first 3
    const data = await res.json();
    const tours = Array.isArray(data) ? data : data.data || data.tours || [];
    return tours.slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch tours:", error);
    return [];
  }
}

export default async function Home() {
  const destinations = await getFeaturedDestinations();
  const tours = await getPopularTours();

  return (
    <main>
      <Hero />

      {/* Featured Destinations */}
      <section className="py-20 px-4 xl:px-20 bg-light">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-2">Featured Destinations</h2>
          <p className="text-gray-600">Discover places that everyone is talking about</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations && destinations.length > 0 ? (
            destinations.slice(0, 3).map((dest: any) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>No featured destinations available at the moment.</p>
              <p className="text-sm">Please make sure backend is running.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/destinations">
            <button className="px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition duration-300">
              View All Destinations
            </button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Popular Tours */}
      <section className="py-20 px-4 xl:px-20 bg-light">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-2">Popular Tours</h2>
          <p className="text-gray-600">Best selling packages selected for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours && tours.length > 0 ? (
            tours.map((tour: any) => (
              <TourCard key={tour._id} tour={tour} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No tours available at the moment.
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/tours">
            <button suppressHydrationWarning className="px-8 py-3 rounded-full bg-secondary text-white hover:bg-orange-600 transition duration-300 shadow-xl">
              View All Tours
            </button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Stats Section */}
      <StatsSection />

      {/* Team Section */}
      <TeamSection />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* FAQ */}
      <FAQ />
    </main>
  );
}
