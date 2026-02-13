'use client';

import { useState } from 'react';
import { Copy, MapPin, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewResultProps {
    reviewText: string;
    googleMapLink: string;
}

export function ReviewResult({ reviewText, googleMapLink }: ReviewResultProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(reviewText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <motion.div
            className="space-y-6 sm:space-y-8 px-4 sm:px-0 pb-12 sm:pb-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="relative bg-transparent sm:bg-white rounded-[2rem] sm:rounded-[3rem] p-0 sm:p-10 sm:shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:border border-white sm:ring-1 ring-gray-50 overflow-visible sm:overflow-hidden">
                <div className="relative space-y-6 sm:space-y-8">
                    <div>
                        <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">感想をもとに口コミの文章を作成しました</h2>
                        <p className="text-xs sm:text-sm text-gray-400 font-bold">Googleの口コミに投稿していただければ、励みになります。</p>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--primary)] to-blue-400 rounded-[1.5rem] sm:rounded-[2.5rem] opacity-5 group-hover:opacity-10 transition duration-500" />
                        <textarea
                            readOnly
                            value={reviewText}
                            className="relative w-full p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] bg-gray-50/50 border-2 border-transparent focus:border-[var(--primary)] text-gray-800 min-h-[180px] sm:min-h-[220px] focus:outline-none resize-none leading-relaxed text-sm sm:text-lg font-bold transition-all shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ y: -2 }}
                            onClick={handleCopy}
                            className={cn(
                                "py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 sm:gap-3 transition-all border-2 text-sm sm:text-base",
                                isCopied
                                    ? "bg-green-600 border-green-700 text-white shadow-xl shadow-green-200"
                                    : "bg-white border-gray-100 text-gray-800 hover:border-[var(--primary)] shadow-md hover:shadow-lg"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {isCopied ? (
                                    <motion.div
                                        key="copied"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                        コピー完了
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="copy"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
                                        文章をコピー
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <motion.a
                            href={googleMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ y: -2 }}
                            className="py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-white flex items-center justify-center gap-2 sm:gap-3 shadow-2xl transition-all bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] shadow-[var(--primary)]/30 border-b-4 border-black/10 active:border-b-0 text-sm sm:text-base"
                        >
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                            投稿画面へ
                            <ChevronRight className="w-4 h-4 sm:w-5 h-5 opacity-50" />
                        </motion.a>
                    </div>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-[1.5rem] p-4 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-sm"
            >
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">
                    コピーした文章を次の画面でペーストしてください。皆様の温かい口コミが、私たちの大きな励みになります。
                </p>
            </motion.div>
        </motion.div>

    );
}
