'use client';

import { useState } from 'react';
// import { LayoutGrid, RectangleStack } from '@heroicons/react/24/outline'; // Or lucide
import { Layers, LayoutGrid } from 'lucide-react';
import StackView from './StackView';
import GridView from './GridView';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoDumpViewer({ images }: { images: string[] }) {
    const [view, setView] = useState<'stack' | 'grid'>('stack');

    // If only 1 image, don't show toggle, just show the image (essentially stack view without interactions, or just simple image)
    if (!images || images.length === 0) return null;
    if (images.length === 1) return <StackView images={images} />;

    return (
        <div className="space-y-4">
            {/* View Toggle */}
            <div className="flex justify-end">
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-full">
                    <button
                        onClick={() => setView('stack')}
                        className={`p-2 rounded-full transition-all ${view === 'stack'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                        title="Stack View"
                    >
                        <Layers className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView('grid')}
                        className={`p-2 rounded-full transition-all ${view === 'grid'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    {view === 'stack' ? (
                        <motion.div
                            key="stack"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <StackView images={images} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <GridView images={images} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
