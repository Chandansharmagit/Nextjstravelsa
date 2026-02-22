import { MetadataRoute } from 'next';
import { CONFIG } from '../lib/config';

const API_URL = CONFIG.API_BASE_URL;
const BASE_URL = CONFIG.SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        '',
        '/destinations',
        '/tours',
        '/experiences',
        '/contact',
        '/faq',
        '/blog',
        '/careers',
        '/services',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Dynamic routes for destinations
        const destRes = await fetch(`${API_URL}/destinations`, { cache: 'no-store' });
        const destData = await destRes.json();
        const destinations = Array.isArray(destData) ? destData : destData.destinations || [];

        const destinationRoutes = destinations.map((dest: any) => ({
            url: `${BASE_URL}/destinations/${dest._id}`,
            lastModified: new Date(dest.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        // Dynamic routes for tours
        const tourRes = await fetch(`${API_URL}/tours`, { cache: 'no-store' });
        const tourData = await tourRes.json();
        const tours = Array.isArray(tourData) ? tourData : tourData.tours || [];

        const tourRoutes = tours.map((tour: any) => ({
            url: `${BASE_URL}/tours/${tour._id}`,
            lastModified: new Date(tour.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...routes, ...destinationRoutes, ...tourRoutes];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return routes;
    }
}
