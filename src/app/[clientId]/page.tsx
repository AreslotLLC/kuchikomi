'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { clients } from '@/config/clients';
import { SurveyForm } from '@/components/SurveyForm';
import { ReviewResult } from '@/components/ReviewResult';
import { Heart, Sparkles, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientPage() {
    const params = useParams();
    const clientId = params.clientId as string;
    const client = clients[clientId];

    const [step, setStep] = useState<'survey' | 'loading' | 'thanks' | 'review'>('survey');
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!client) {
        notFound();
    }

    const handleSubmit = async (answers: Record<string, any>) => {
        setIsSubmitting(true);

        try {
            const rating = answers.rating || 0;

            if (rating <= 3) {
                setStep('thanks');
            } else {
                setStep('loading');

                // AI生成用回答の抽出
                const aiAnswers: Record<string, any> = {};
                client.questions.forEach(q => {
                    if (q.aiUse && answers[q.id]) {
                        aiAnswers[q.label] = answers[q.id];
                    }
                });

                const res = await fetch('/api/generate-review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clientName: client.name,
                        answers: aiAnswers,
                        age: answers.age,
                        gender: answers.gender,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.details || 'AI generation failed');
                }

                const data = await res.json();
                setReviewText(data.reviewText);

                // 少し余韻を残してから表示
                setTimeout(() => {
                    setStep('review');
                }, 1500);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('送信中にエラーが発生しました。もう一度お試しください。');
            setStep('survey');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={cn(
            "min-h-screen bg-[var(--background)] flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 relative overflow-hidden",
            `theme-${client.themeColor}`
        )}>
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary-light)] blur-[120px] rounded-full opacity-60" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-[var(--primary-light)] blur-[100px] rounded-full opacity-40" />
            </div>

            {/* Header Container */}
            <motion.div
                className="w-full max-w-2xl mb-8 sm:mb-12 relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-4 drop-shadow-sm">
                        {client.name}
                    </h1>
                    <div className="h-1 w-10 sm:h-1.5 sm:w-12 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-full mb-4 shadow-sm" />
                </div>
            </motion.div>

            {/* Main Content Card - Simplified for mobile */}
            <div className="w-full max-w-2xl bg-transparent sm:bg-white/90 sm:backdrop-blur-xl rounded-[2rem] sm:rounded-[3.5rem] sm:shadow-[0_20px_50px_rgba(0,0,0,0.05),0_10px_30px_rgba(0,0,0,0.03)] p-0 sm:p-14 relative overflow-visible sm:overflow-hidden sm:border border-white sm:ring-1 ring-gray-100">
                <AnimatePresence mode="wait">
                    {step === 'survey' && (
                        <motion.div
                            key="survey"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-3">
                                    ご感想をお聞かせください
                                </h2>
                            </div>
                            <SurveyForm
                                client={client}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />
                        </motion.div>
                    )}

                    {step === 'loading' && (
                        <motion.div
                            key="loading"
                            className="py-20 flex flex-col items-center justify-center text-center space-y-8"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                        >
                            <div className="relative">
                                <motion.div
                                    className="w-24 h-24 rounded-full border-4 border-gray-100 border-t-[var(--primary)]"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[var(--primary)] animate-pulse" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-gray-800">口コミ文章を作成中...</h3>
                                <p className="text-gray-400 font-medium">回答内容から最適な文章を構成しています。</p>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-[var(--primary)]"
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 'thanks' && (
                        <motion.div
                            key="thanks"
                            className="py-24 text-center space-y-10"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="relative inline-block">
                                <motion.div 
                                    className="absolute inset-0 bg-green-400/20 blur-3xl rounded-full scale-150"
                                    animate={{ scale: [1.5, 2, 1.5], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-20 h-20 text-green-500" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="w-16 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full shadow-sm" />
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-gray-800 tracking-tight">ご協力ありがとうございました。</h3>
                                    <p className="text-lg font-bold text-gray-500 leading-relaxed max-w-md mx-auto">
                                        いただいたご意見は、今後のサービス向上に大切に活用させていただきます。
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'review' && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="mb-10 flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">
                                        ご感想ありがとうございます。
                                    </h2>
                                </div>
                            </div>
                            <ReviewResult
                                reviewText={reviewText}
                                googleMapLink={client.googleMapLink}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}

