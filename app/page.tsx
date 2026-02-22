import HeroSlider from '@/components/HeroSlider';
import DestinationCard from '@/components/DestinationCard';
import TourCard from '@/components/TourCard';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import StatsSection from '@/components/StatsSection';
import TeamSection from '@/components/TeamSection';
import ReviewsSection from '@/components/ReviewsSection';
import FAQ from '@/components/FAQ';
import Link from 'next/link';
import TrustedPartners from '@/components/TrustedPartners';
import FeaturedGuides from '@/components/FeaturedGuides';
import FeaturedServices from '@/components/FeaturedServices';
import { TiltCard } from '@/components/TiltCard';
import { CONFIG } from '@/lib/config';
import LeadCaptureForm from '@/components/LeadCaptureForm';
export const dynamic = 'force-dynamic';

// Use environment variable for API URL
const API_URL = CONFIG.API_BASE_URL;

// Fetch Featured Destinations
// Fetch Featured Destinations
async function getFeaturedDestinations() {
  try {
    let destinations: any[] = [];

    // 1. Try to get featured destinations
    try {
      const res = await fetch(`${API_URL}/destinations?featured=true`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        destinations = Array.isArray(data) ? data : data.data || data.destinations || [];
      }
    } catch (e) {
      console.warn("Featured fetch failed, continuing to fallback", e);
    }

    // 2. If we don't have enough (less than 6), fetch generic ones to fill the grid
    if (destinations.length < 6) {
      try {
        const fallbackRes = await fetch(`${API_URL}/destinations`, { cache: 'no-store' });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const allDestinations = Array.isArray(fallbackData) ? fallbackData : fallbackData.data || fallbackData.destinations || [];

          // Filter out existing ones to avoid duplicates
          const existingIds = new Set(destinations.map((d: any) => d._id));
          const extras = allDestinations.filter((d: any) => !existingIds.has(d._id));

          // Fill up to 6 items
          destinations = [...destinations, ...extras];
        }
      } catch (e) {
        console.warn("Fallback fetch failed", e);
      }
    }

    // Return up to 6 items
    return destinations.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

// Fetch Popular Tours (Just random tours for now)
async function getPopularTours() {
  try {
    const res = await fetch(`${API_URL}/tours`, {
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

// Fetch Services
async function getServices() {
  try {
    const res = await fetch(`${API_URL}/services`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 4) : [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export default async function Home() {
  const destinations = await getFeaturedDestinations();
  const tours = await getPopularTours();
  const services = await getServices();

  return (
    <main>
      <HeroSlider />

      {/* Trusted Partners */}
      <TrustedPartners />

      {/* Services Section */}
      <FeaturedServices services={services} />

      {/* Featured Destinations */}
      <section className="py-20 px-4 xl:px-20 bg-light">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-2">Featured Destinations</h2>
          <p className="text-gray-600">Discover places that everyone is talking about</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[minmax(400px,auto)]">
          {destinations && destinations.length > 0 ? (
            destinations.map((dest: any, index: number) => {
              // First item is featured (large) if we have enough items to make a grid
              const isFirst = index === 0;
              const cardClass = isFirst ? "md:col-span-2 md:row-span-2 h-full" : "h-full";

              return (
                <TiltCard key={dest._id} className={cardClass}>
                  <div className="h-full">
                    <DestinationCard destination={dest} featured={isFirst} className="h-full" />
                  </div>
                </TiltCard>
              );
            })
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

      {/* Featured Guides */}
      <FeaturedGuides />

      {/* Lead Capture System */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Ready to Explore?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our travel specialists are ready to design your perfect getaway. Share your details and let's start planning.
            </p>
          </div>
          <LeadCaptureForm />
        </div>
      </section>

      {/* FAQ */}
      <FAQ />
    </main>
  );
}
