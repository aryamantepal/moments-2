
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';

// Fix for default Leaflet icon missing in production
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Moment {
    id: string;
    image_url: string;
    caption: string | null;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
}

interface MomentMapProps {
    moments: Moment[];
}

export default function MomentMap({ moments }: MomentMapProps) {
    // Filter moments that have coordinates
    const mappedMoments = moments.filter(m => m.latitude !== null && m.longitude !== null);

    // Initial center (defaults to middle of the world if no pins)
    const center: [number, number] = mappedMoments.length > 0
        ? [mappedMoments[0].latitude!, mappedMoments[0].longitude!]
        : [20, 0];

    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white relative z-10">
            <MapContainer
                center={center}
                zoom={3}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mappedMoments.map((moment) => (
                    <Marker
                        key={moment.id}
                        position={[moment.latitude!, moment.longitude!]}
                    >
                        <Popup className="moment-popup">
                            <div className="w-48 overflow-hidden rounded-lg">
                                <Link href={`/moments/${moment.id}`}>
                                    <div className="relative aspect-square w-full mb-2">
                                        <Image
                                            src={moment.image_url}
                                            alt={moment.caption || 'Moment'}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <h3 className="font-bold text-black text-sm truncate">
                                        {moment.caption || 'Moment'}
                                    </h3>
                                    {moment.location && (
                                        <p className="text-xs text-gray-500 truncate">
                                            {moment.location}
                                        </p>
                                    )}
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
