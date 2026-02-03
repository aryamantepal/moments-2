import Image from 'next/image';

interface GridViewProps {
    images: string[];
}

export default function GridView({ images }: GridViewProps) {
    if (images.length === 1) {
        return (
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
                <Image
                    src={images[0]}
                    alt="Moment"
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    // A simple beautiful masonry-like grid for varying numbers of images
    return (
        <div className="grid grid-cols-2 gap-2 aspect-square w-full">
            {images.map((url, i) => {
                // Formatting logic for specific counts:
                // 3 images: 1 big left, 2 small right
                const isThreeLayout = images.length === 3;

                let className = "relative rounded-xl overflow-hidden bg-gray-100 min-h-[100px]";

                if (isThreeLayout && i === 0) {
                    className += " row-span-2 h-full";
                }

                return (
                    <div key={url} className={className}>
                        <Image
                            src={url}
                            alt={`Moment ${i + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                )
            })}
        </div>
    );
}
