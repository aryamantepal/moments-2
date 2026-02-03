'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface StackViewProps {
    images: string[];
    onComplete?: () => void;
}

export default function StackView({ images }: StackViewProps) {
    // We keep track of the cards in local state so we can remove them
    const [cards, setCards] = useState(images);

    const removeCard = (url: string) => {
        setCards((prev) => prev.filter((item) => item !== url));
        // Reset if empty? Or just show the last one? 
        // For a loop effect:
        // setCards((prev) => {
        //   const newCards = prev.filter((item) => item !== url);
        //   return [...newCards, url];
        // });

        // For now, let's loop it back to the bottom so it never ends
        setCards(prev => {
            const remaining = prev.filter(img => img !== url);
            return [...remaining, url];
        });
    };

    return (
        <div className="relative w-full aspect-square flex items-center justify-center">
            {cards.map((url, index) => {
                // Return cards in reverse order so the first in array is on top (dom order matters for z-index naturally? No, last is on top)
                // Actually, we want the first item in 'cards' to be the top one.
                // So let's reverse the map or use z-index.
                const isTop = index === 0;
                return (
                    <Card
                        key={url}
                        url={url}
                        isTop={isTop}
                        index={index}
                        total={cards.length}
                        onRemove={() => removeCard(url)}
                    />
                );
            }).reverse()}
        </div>
    );
}

function Card({ url, isTop, index, total, onRemove }: { url: string, isTop: boolean, index: number, total: number, onRemove: () => void }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Random rotation for the stack messy look (stable based on url or index)
    // We use a small random rotation for cards behind
    const randomRotate = isTop ? 0 : (index % 2 === 0 ? 3 : -3) + (index * 2);
    const scale = 1 - index * 0.05;

    return (
        <motion.div
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : randomRotate,
                zIndex: total - index,
                opacity: isTop ? opacity : 1 - (index * 0.2),
                scale: isTop ? 1 : scale,
            }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6} // bounce back feeling
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 100) {
                    onRemove();
                }
            }}
            whileTap={{ cursor: 'grabbing' }}
            className={`absolute top-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-white border-4 border-white ${isTop ? 'cursor-grab' : ''}`}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="relative w-full h-full">
                <Image
                    src={url}
                    alt="Moment"
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                />
            </div>
        </motion.div>
    );
}
