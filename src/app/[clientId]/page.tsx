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
            // 1. GAS Webhookへ送信 (非同期)
            fetch(client.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: client.id,
                    timestamp: new Date().toISOString(),
                    answers,
                }),
            }).catch(err => console.error('GAS Webhook Error:', err));

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

                if (!res.ok) throw new Error('AI generation failed');

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
            "min-h-screen bg-[#fafafa] flex flex-col items-center py-8 px-4 sm:px-6",
            `theme-${client.themeColor}`
        )}>
            {/* Header Container */}
            <motion.div
                className="w-full max-w-2xl mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                        {client.name}
                    </h1>
                    <div className="h-1.5 w-12 bg-[var(--primary)] rounded-full mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">
                        Review & Survey
                    </p>
                </div>
            </motion.div>

            {/* Main Content Card */}
            <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl shadow-gray-200/60 p-8 sm:p-12 relative overflow-hidden border border-gray-50">
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
                                <p className="text-gray-400 font-medium lowercase">
                                    Please share your feedback to help us improve.
                                </p>
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
                                <p className="text-gray-400 font-medium">回答内容から最適な文章をAIが構成しています。</p>
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
                            className="py-16 text-center space-y-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-green-400/20 blur-2xl rounded-full scale-150" />
                                <div className="relative w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-gray-800 tracking-tight">Thank You!</h2>
                                <div className="w-12 h-1.5 bg-[var(--primary)] mx-auto rounded-full" />
                                <p className="text-xl font-bold text-gray-600 leading-relaxed max-w-sm mx-auto">
                                    ご回答ありがとうございました。<br />
                                    いただいたご意見は、今後のサービス向上に大切に活用させていただきます。
                                </p>
                            </div>
                            <motion.button
                                onClick={() => setStep('survey')}
                                className="text-gray-400 font-bold flex items-center gap-2 mx-auto hover:text-gray-600 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                最初に戻る
                            </motion.button>
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
                                        結果が届きました
                                    </h2>
                                    <p className="text-gray-400 font-medium lowercase">
                                        Here is the review generated by AI for you.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep('survey')}
                                    className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            </div>
                            <ReviewResult
                                reviewText={reviewText}
                                googleMapLink={client.googleMapLink}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Trust Badge / Footer */}
            <footer className="mt-12 text-center space-y-4 max-w-md">
                <div className="flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <Sparkles className="w-5 h-5" />
                    <MessageCircle className="w-5 h-5" />
                    <Heart className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Powered by Clean Feedback Engine
                </p>
            </footer>
        </main>
    );
}

