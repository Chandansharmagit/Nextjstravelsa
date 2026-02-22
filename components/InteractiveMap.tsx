"use client";

import { getImageUrl } from '@/lib/utils/image';
import { useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTimes, FaMap, FaGlobe } from 'react-icons/fa';
import Link from 'next/link';
import L from 'leaflet';

// Icons need to be handled carefully in Leaflet + React
const destIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const planIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

interface Pin {
    id: string;
    lat: number;
    lng: number;
    name: string;
    isCustom?: boolean;
}

interface Destination {
    _id: string;
    title: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    image?: string;
}

interface InnerMapProps {
    destinations: Destination[];
    plannedPins: Pin[];
    onAddPin: (pin: Pin) => void;
    onRemovePin: (id: string) => void;
}

const LocationMarker = ({ onAddPin, pinCount }: { onAddPin: (pin: Pin) => void, pinCount: number }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            let placeName = `Stop ${pinCount + 1}`;

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
                    headers: {
                        'Accept-Language': 'en',
                        'User-Agent': 'TravelSansar/1.0'
                    }
                });
                const data = await res.json();
                if (data && data.address) {
                    const addr = data.address;
                    placeName = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state || `Stop ${pinCount + 1}`;
                    if (addr.country && !placeName.includes(addr.country)) {
                        placeName += `, ${addr.country}`;
                    }
                } else if (data && data.display_name) {
                    const parts = data.display_name.split(',');
                    placeName = parts[0] + (parts[1] ? `, ${parts[1]}` : '');
                }
            } catch (error) {
                console.error("Reverse geocoding failed", error);
            }

            onAddPin({
                id: `custom-${Date.now()}`,
                lat,
                lng,
                name: placeName,
                isCustom: true
            });
        },
    });
    return null;
};

// Custom component to handle map movement
const ChangeView = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 12, {
                duration: 1.5
            });
        }
    }, [center, map]);
    return null;
};

const InteractiveMap = ({ destinations, plannedPins, onAddPin, onRemovePin, searchResult }: InnerMapProps & { searchResult: { lat: number, lng: number } | null }) => {
    const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const mapConfig = {
        standard: {
            url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        },
        satellite: {
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
        }
    };

    if (!mounted) return <div className="h-full w-full bg-slate-50" />;

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Custom Layer Toggle - Premium Floating UI */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <button
                    onClick={() => setMapMode('standard')}
                    className={`p-3 rounded-2xl shadow-2xl transition-all border-2 ${mapMode === 'standard' ? 'bg-slate-900 text-white border-white' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'}`}
                    title="Standard Map"
                >
                    <FaMap size={20} />
                </button>
                <button
                    onClick={() => setMapMode('satellite')}
                    className={`p-3 rounded-2xl shadow-2xl transition-all border-2 ${mapMode === 'satellite' ? 'bg-slate-900 text-white border-white' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'}`}
                    title="Satellite View"
                >
                    <FaGlobe size={20} />
                </button>
            </div>

            <MapContainer
                center={[28.3949, 84.1240]}
                zoom={7}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
                style={{ height: '100%', width: '100%' }}
            // Removed the dynamic key to keep the MapContainer instance persistent and stable
            >
                {/* 
                   ULTIMATE STABILITY FIX:
                   We keep a SINGLE TileLayer but swap the URL. 
                   Leaflet's TileLayer component handles setUrl() internally when the 'url' prop changes.
                   This prevents the 'appendChild' error by avoiding adding/removing components from the DOM.
                */}
                <TileLayer
                    url={mapMode === 'standard' ? mapConfig.standard.url : mapConfig.satellite.url}
                    attribution={mapMode === 'standard' ? mapConfig.standard.attribution : mapConfig.satellite.attribution}
                />

                <ChangeView center={searchResult ? [searchResult.lat, searchResult.lng] : null} />

                {searchResult && (
                    <Marker
                        position={[searchResult.lat, searchResult.lng]}
                        icon={new L.Icon({
                            iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854866.png',
                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -40]
                        })}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold">Search Result</h3>
                                <button
                                    onClick={() => onAddPin({
                                        id: `search-${Date.now()}`,
                                        lat: searchResult.lat,
                                        lng: searchResult.lng,
                                        name: "Searched Location",
                                        isCustom: true
                                    })}
                                    className="mt-2 w-full bg-blue-100 text-blue-600 py-1 rounded-md text-xs font-bold hover:bg-blue-200 transition-colors"
                                >
                                    Add to Trip
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}

                <LocationMarker onAddPin={onAddPin} pinCount={plannedPins.length} />

                {destinations.map((dest) => (
                    dest.coordinates?.lat && dest.coordinates?.lng ? (
                        <Marker
                            key={dest._id}
                            position={[dest.coordinates.lat, dest.coordinates.lng]}
                            icon={destIcon}
                        >
                            <Popup>
                                <div className="p-1 max-w-[200px]">
                                    {dest.image && (
                                        <img
                                            src={getImageUrl(dest.image)}
                                            alt={dest.title}
                                            className="w-full h-24 object-cover rounded-lg mb-2"
                                        />
                                    )}
                                    <h3 className="font-bold text-lg mb-1">{dest.title}</h3>
                                    <Link href={`/destination/${dest._id}`} className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline">
                                        View Details →
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddPin({
                                                id: dest._id,
                                                lat: dest.coordinates!.lat,
                                                lng: dest.coordinates!.lng,
                                                name: dest.title
                                            });
                                        }}
                                        className="mt-2 w-full bg-orange-100 text-secondary py-1 rounded-md text-xs font-bold hover:bg-orange-200 transition-colors"
                                    >
                                        Add to Trip
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}

                {plannedPins.map((pin) => (
                    <Marker
                        key={pin.id}
                        position={[pin.lat, pin.lng]}
                        icon={planIcon}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold">{pin.name}</h3>
                                <button
                                    onClick={() => onRemovePin(pin.id)}
                                    className="text-red-500 font-bold text-xs mt-1 hover:underline"
                                >
                                    Remove from Trip
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
