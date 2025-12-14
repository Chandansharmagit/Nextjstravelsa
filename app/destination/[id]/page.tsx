
import Image from 'next/image';
import Link from 'next/link';
import DestinationClientWrapper from '@/components/DestinationClientWrapper';

async function getDestination(id: string) {
    try {
        const res = await fetch(`http://localhost:5000/api/destinations/${id}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            return data.destination || data;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export default async function DestinationDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const destination = await getDestination(id);

    if (!destination) {
        return <div className="min-h-screen flex justify-center items-center">Destination not found</div>;
    }

    const imageSrc = destination.images?.[0]?.path || destination.images?.[0]?.url || destination.image || '/placeholder.jpg';

    return (
        <section className="min-h-screen pb-20 bg-light">
            <div className="px-4 xl:px-20 py-10">
                <Link href="/destinations" className="text-primary hover:underline mb-6 inline-block font-medium">&larr; Back to Destinations</Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Content: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">{destination.title}</h1>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                            <span className="font-semibold text-secondary">{destination.location || "Nepal"}</span> |
                            <span>Best time: {destination.bestTimeToVisit || "All Season"}</span>
                        </div>

                        {/* Main Image */}
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-card">
                            <Image
                                src={imageSrc}
                                alt={destination.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Image Gallery */}
                        {destination.images && destination.images.length > 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {destination.images.map((img: any, idx: number) => (
                                    <div key={idx} className="relative h-24 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition shadow-sm">
                                        <Image
                                            src={img.path || img.url || '/placeholder.jpg'}
                                            alt={`Gallery ${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white p-8 rounded-2xl shadow-card space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">About the Place</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{destination.description}</p>
                            </div>

                            {destination.thingsToDo && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Things to Do</h3>
                                    <div className="prose text-gray-600 space-y-2 whitespace-pre-line bg-gray-50 p-6 rounded-xl border-l-4 border-secondary">
                                        {destination.thingsToDo}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar: Booking / Quick Info - Client Component */}
                    <DestinationClientWrapper destinationTitle={destination.title} destinationId={destination._id} />
                </div>
            </div>
        </section>
    );
}
