'use client';

import { useState } from 'react';
import { ClientConfig, Question } from '@/types';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';
import { Loader2, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SurveyFormProps {
    client: ClientConfig;
    onSubmit: (answers: Record<string, any>) => void;
    isSubmitting: boolean;
}

export function SurveyForm({ client, onSubmit, isSubmitting }: SurveyFormProps) {
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const handleRatingChange = (value: number) => {
        setAnswers((prev) => ({ ...prev, rating: value }));
    };

    const handleTagToggle = (questionId: string, tag: string, maxSelections?: number) => {
        setAnswers((prev) => {
            const currentTags = prev[questionId] || [];
            const isSelected = currentTags.includes(tag);

            if (!isSelected && maxSelections && currentTags.length >= maxSelections) {
                return prev;
            }

            const nextTags = isSelected
                ? currentTags.filter((t: string) => t !== tag)
                : [...currentTags, tag];
            return { ...prev, [questionId]: nextTags };
        });
    };

    const handleBooleanChange = (questionId: string, value: boolean) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleTextChange = (questionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answers.rating) {
            alert('評価を選択してください。');
            return;
        }
        onSubmit(answers);
    };

    // 共通の質問を定義
    const commonQuestions: Question[] = [
        {
            id: 'gender',
            label: '性別を教えてください',
            type: 'tags',
            options: ['男性', '女性', 'その他・回答を控える'],
            aiUse: false,
        },
        {
            id: 'age',
            label: '年齢層を教えてください',
            type: 'tags',
            options: ['20代未満', '20〜30代', '40〜50代', '60代以上'],
            aiUse: false,
        },
    ];

    const allQuestions = [...commonQuestions, ...client.questions];

    // 進捗状況の計算
    const totalQuestions = allQuestions.length;
    const filledQuestions = allQuestions.filter(q => {
        const val = answers[q.id];
        if (Array.isArray(val)) return val.length > 0;
        // ratingは0より大きい場合に回答済みとする
        if (q.type === 'rating') return (val || 0) > 0;
        return val !== undefined && val !== '';
    }).length;
    const progress = (filledQuestions / totalQuestions) * 100;
    const isAllFilled = filledQuestions === totalQuestions;

    return (
        <div className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>回答状況</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--primary)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {allQuestions.map((q, idx) => (
                    <motion.div
                        key={q.id}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-start gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-black text-sm">
                                {idx + 1}
                            </span>
                            <label className="block text-xl font-bold text-gray-800 leading-tight">
                                {q.label}
                            </label>
                        </div>

                        <div className="pl-12">
                            {q.type === 'rating' && (
                                <div className="flex justify-start">
                                    <StarRating
                                        value={answers[q.id] || 0}
                                        onChange={(val) => handleRatingChange(val)}
                                    />
                                </div>
                            )}

                            {q.type === 'tags' && q.options && (
                                <div className="flex flex-wrap gap-3">
                                            {q.options.map((option: string) => {
                                                const val = answers[q.id];
                                                const isSelected = q.id === 'gender' || q.id === 'age'
                                                    ? val === option
                                                    : (val || []).includes(option);

                                                const isLimitReached = !isSelected && q.maxSelections && (val || []).length >= q.maxSelections;

                                                return (
                                                    <motion.button
                                                        key={option}
                                                        type="button"
                                                        whileTap={isLimitReached ? {} : { scale: 0.95 }}
                                                        onClick={() => {
                                                            if (q.id === 'gender' || q.id === 'age') {
                                                                setAnswers(prev => ({ ...prev, [q.id]: option }));
                                                            } else {
                                                                handleTagToggle(q.id, option, q.maxSelections);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "px-6 py-3 rounded-2xl border-2 transition-all text-sm font-bold flex items-center gap-2",
                                                            isSelected
                                                                ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                                                : "bg-white border-gray-100 text-gray-500 hover:border-gray-200",
                                                            isLimitReached && "opacity-40 cursor-not-allowed grayscale-[0.5]"
                                                        )}
                                                    >
                                                        {isSelected && <Check className="w-4 h-4" />}
                                                        {option}
                                                    </motion.button>
                                                );
                                            })}
                                </div>
                            )}

                            {q.type === 'boolean' && (
                                <div className="flex gap-4 max-w-sm">
                                    {[
                                        { label: 'はい', value: true },
                                        { label: 'いいえ', value: false },
                                    ].map((opt) => {
                                        const isSelected = answers[q.id] === opt.value;
                                        return (
                                            <motion.button
                                                key={opt.label}
                                                type="button"
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleBooleanChange(q.id, opt.value)}
                                                className={cn(
                                                    "flex-1 py-4 rounded-2xl border-2 transition-all font-bold text-base",
                                                    isSelected
                                                        ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                                        : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                                )}
                                            >
                                                {opt.label}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}

                            {q.type === 'text' && (
                                <textarea
                                    className="w-full p-5 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[var(--primary)] focus:ring-0 min-h-[160px] transition-all resize-none text-gray-700 leading-relaxed outline-none"
                                    placeholder="こちらにご入力ください（任意）"
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                />
                            )}
                        </div>
                    </motion.div>
                ))}


                <motion.button
                    type="submit"
                    disabled={isSubmitting || !isAllFilled}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "w-full py-5 rounded-3xl text-white font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 border-b-4 active:border-b-0",
                        "bg-[var(--primary)] border-[var(--primary-hover)] shadow-[var(--primary)]/30",
                        (isSubmitting || !isAllFilled) && "opacity-50 grayscale cursor-not-allowed border-gray-400 shadow-none"
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            データを送信中...
                        </>
                    ) : (
                        <>
                            回答を送信して結果を見る
                            <ChevronRight className="w-6 h-6" />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
