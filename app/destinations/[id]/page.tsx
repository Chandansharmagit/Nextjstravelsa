import Image from 'next/image';
import Link from 'next/link';

async function getDestination(id: string) {
    try {
        // Fetch all destinations and find by ID because specific endpoint might not be reliable or needs id lookup
        // Assuming API might not have single item endpoint working perfectly or id is different.
        // Let's try the direct endpoint first if standard REST
        // Let's try the direct endpoint first
        const res = await fetch(`https://backendtravelnew.vercel.app/api/destinations/${id}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            // Handle { destination: {} } or {}
            return data.destination || data;
        }

        // Fallback: fetch all and find
        const allRes = await fetch('https://backendtravelnew.vercel.app/api/destinations', { cache: 'no-store' });
        const data = await allRes.json();
        const list = Array.isArray(data) ? data : data.destinations || [];
        return list.find((d: any) => d._id === id);

    } catch (error) {
        return null;
    }
}

export default async function DestinationDetails({ params }: { params: { id: string } }) {
    const destination = await getDestination(params.id);

    if (!destination) {
        return <div className="min-h-screen flex justify-center items-center">Destination not found</div>;
    }

    const imageSrc = destination.images?.[0]?.path || destination.images?.[0]?.url || destination.image || '/placeholder.jpg';

    return (
        <section className="min-h-screen pt-32 pb-20 px-4 xl:px-20 bg-white">
            <Link href="/destinations" className="text-primary hover:underline mb-8 inline-block">&larr; Back to Destinations</Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-card">
                    <Image
                        src={imageSrc}
                        alt={destination.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">{destination.title}</h1>
                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                        <p className="text-lg whitespace-pre-line">{destination.description}</p>

                        {/* Additional dummy content as API details might be sparse */}
                        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Highlights</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Experience the local culture and traditions.</li>
                            <li>Breathtaking scenery and natural landscapes.</li>
                            <li>Authentic culinary experiences.</li>
                        </ul>
                    </div>

                    <div className="mt-12">
                        <button className="px-8 py-3 rounded-full bg-secondary text-white font-bold text-lg hover:bg-orange-600 transition shadow-lg w-full md:w-auto">
                            Book a Trip Here
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
