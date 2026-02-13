'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    value: number;
    onChange: (value: number) => void;
    max?: number;
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-2">
            {[...Array(max)].map((_, i) => {
                const ratingValue = i + 1;
                const isActive = (hover || value) >= ratingValue;

                return (
                    <motion.button
                        key={ratingValue}
                        type="button"
                        className="p-1 sm:p-2 relative group"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => onChange(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Star
                            className={cn(
                                "w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300",
                                isActive
                                    ? "fill-yellow-400 text-yellow-500 filter drop-shadow-[0_4px_12px_rgba(250,204,21,0.6)]"
                                    : "fill-gray-50 text-gray-200"
                            )}
                        />
                        {isActive && (
                            <motion.div
                                layoutId="star-glow"
                                className="absolute inset-0 bg-yellow-400/10 blur-2xl rounded-full -z-10"
                                initial={false}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
