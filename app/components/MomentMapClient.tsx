
'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./MomentMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
            Loading Map...
        </div>
    )
});

export default function MomentMapClient({ moments }: { moments: any[] }) {
    return <Map moments={moments} />;
}
