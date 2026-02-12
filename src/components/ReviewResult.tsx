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
            className="space-y-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-light)] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

                <div className="relative space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-green-600 fill-green-600/20" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight">口コミが準備できました！</h2>
                            <p className="text-sm text-gray-400 font-medium">AIが最適な文章を作成しました</p>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-green-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
                        <textarea
                            readOnly
                            value={reviewText}
                            className="relative w-full p-6 rounded-[2rem] bg-gray-50/50 border-2 border-transparent focus:border-[var(--primary)] text-gray-800 min-h-[200px] focus:outline-none resize-none leading-relaxed text-base font-medium transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCopy}
                            className={cn(
                                "py-5 px-6 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border-2",
                                isCopied
                                    ? "bg-green-600 border-green-700 text-white shadow-lg shadow-green-200"
                                    : "bg-white border-gray-100 text-gray-800 hover:border-[var(--primary)] shadow-sm hover:shadow-md"
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
                                        <CheckCircle2 className="w-6 h-6" />
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
                                        <Copy className="w-6 h-6" />
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
                            className="py-5 px-6 rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-xl transition-all bg-[var(--primary)] border-b-4 border-[var(--primary-hover)] shadow-[var(--primary)]/30 active:border-b-0"
                        >
                            <MapPin className="w-6 h-6" />
                            投稿画面へ
                            <ChevronRight className="w-5 h-5" />
                        </motion.a>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    コピーした文章を次の画面でペーストしてください。皆様の温かい口コミが、私たちの大きな励みになります。
                </p>
            </div>
        </motion.div>

    );
}
