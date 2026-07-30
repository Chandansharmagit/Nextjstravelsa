import HeroSlider from '@/components/HeroSlider';
import CategoryExplorer from '@/components/CategoryExplorer';
import BespokeTripPlanner from '@/components/BespokeTripPlanner';
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
import { CONFIG } from '@/lib/config';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import DestinationSlider from '@/components/DestinationSlider';
import { FaCompass, FaMapMarkedAlt, FaGlobeAmericas, FaArrowRight, FaCalendarCheck } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

const API_URL = CONFIG.API_BASE_URL;

// Fetch Featured Destinations
async function getFeaturedDestinations() {
  try {
    let destinations: any[] = [];

    try {
      const res = await fetch(`${API_URL}/destinations?featured=true`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        destinations = Array.isArray(data) ? data : data.data || data.destinations || [];
      }
    } catch (e) {
      console.warn("Featured fetch failed, continuing to fallback", e);
    }

    if (destinations.length < 6) {
      try {
        const fallbackRes = await fetch(`${API_URL}/destinations`, { cache: 'no-store' });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const allDestinations = Array.isArray(fallbackData) ? fallbackData : fallbackData.data || fallbackData.destinations || [];

          const existingIds = new Set(destinations.map((d: any) => d._id));
          const extras = allDestinations.filter((d: any) => !existingIds.has(d._id));
          destinations = [...destinations, ...extras];
        }
      } catch (e) {
        console.warn("Fallback fetch failed", e);
      }
    }

    return destinations.slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

// Fetch Popular Tours
async function getPopularTours() {
  try {
    const res = await fetch(`${API_URL}/tours`, { cache: 'no-store' });
    if (!res.ok) return [];

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
    const res = await fetch(`${API_URL}/services`, { cache: 'no-store' });
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
    <main className="bg-slate-950 text-white selection:bg-amber-400 selection:text-slate-950">
      {/* Hero Section */}
      <HeroSlider />

      {/* Trusted Partners */}
      <TrustedPartners />

      {/* Category Explorer (Travel Styles) */}
      <CategoryExplorer />

      {/* Connoisseur Services */}
      <FeaturedServices services={services} />

      {/* Featured Destinations Section */}
      <section className="py-24 bg-white text-slate-900 relative overflow-hidden border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-teal-700 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4">
              <FaGlobeAmericas /> World-Renowned Sanctuaries
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-slate-900 mb-4">
              Featured <span className="font-playfair italic font-normal text-teal-600">Destinations</span>
            </h2>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-medium">
              Discover breathtaking Himalayan landscapes, ancient UNESCO heritage sites, and untouched nature.
            </p>
          </div>

          <div className="mt-8">
            {destinations && destinations.length > 0 ? (
              <DestinationSlider destinations={destinations} />
            ) : (
              <div className="text-center text-slate-500 py-16 bg-slate-50 rounded-3xl border border-slate-200">
                <p className="font-bold text-lg text-slate-900 mb-1">Connecting to Destination Database...</p>
                <p className="text-sm text-slate-500">Explore our destinations catalog or ensure backend service is running.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-14">
            <Link href="/destinations">
              <button className="px-10 py-4 rounded-2xl bg-slate-900 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-[0.2em] font-outfit transition duration-300 shadow-xl flex items-center gap-3 mx-auto group">
                Explore All Destinations
                <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tailor-Made Bespoke Trip Planner */}
      <BespokeTripPlanner />

      {/* How It Works */}
      <HowItWorks />

      {/* Popular Tours Section */}
      <section className="py-24 px-4 xl:px-20 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-teal-300 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4">
              <FaCalendarCheck /> Bestselling Packages
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-white mb-4">
              Popular <span className="font-playfair italic font-normal text-amber-400">Expeditions</span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
              Handcrafted itineraries curated for safety, comfort, and unforgettable mountain achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours && tours.length > 0 ? (
              tours.map((tour: any) => (
                <TourCard key={tour._id} tour={tour} />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400 py-16 bg-white/5 rounded-3xl border border-white/10">
                <p className="font-bold text-lg text-white mb-1">Loading Bestselling Tours...</p>
              </div>
            )}
          </div>

          <div className="text-center mt-14">
            <Link href="/tours">
              <button className="px-10 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-[0.2em] font-outfit transition duration-300 shadow-xl shadow-amber-400/20 hover:scale-105 active:scale-95">
                View All Signature Tours
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Stats & Accreditation */}
      <StatsSection />

      {/* Team Section */}
      <TeamSection />

      {/* Traveler Reviews */}
      <ReviewsSection />

      {/* Featured Travel Guides & Articles */}
      <FeaturedGuides />

      {/* Lead Capture Form Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4">
              ✨ Free Custom Consultation
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white font-outfit tracking-tight mb-4">
              Ready to <span className="font-playfair italic font-normal text-amber-400">Explore?</span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
              Connect with our master travel specialists. Share your vision and receive a personalized itinerary proposal within 24 hours.
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
