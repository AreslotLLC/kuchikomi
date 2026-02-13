'use client';

import { useState } from 'react';
import { ClientConfig, Question } from '@/types';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';
import { Loader2, ChevronRight, Check, Circle, Square } from 'lucide-react';
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

    const handleTagToggle = (questionId: string, tag: string, maxSelections?: number, isMultiple?: boolean) => {
        setAnswers((prev) => {
            if (!isMultiple) {
                return { ...prev, [questionId]: tag };
            }

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
            required: true,
            multiple: false,
        },
        {
            id: 'age',
            label: '年齢層を教えてください',
            type: 'tags',
            options: ['20代未満', '20〜30代', '40〜50代', '60代以上'],
            aiUse: false,
            required: true,
            multiple: false,
        },
    ];

    const allQuestions = [...commonQuestions, ...client.questions];

    // 進捗状況の計算
    const requiredQuestions = allQuestions.filter(q => q.required !== false);
    const totalRequiredCount = requiredQuestions.length;
    
    const filledRequiredCount = requiredQuestions.filter(q => {
        const val = answers[q.id];
        if (Array.isArray(val)) return val.length > 0;
        if (q.type === 'rating') return (val || 0) > 0;
        return val !== undefined && val !== '';
    }).length;

    const isAllFilled = filledRequiredCount === totalRequiredCount;
    
    return (
        <div className="space-y-8 sm:space-y-12">
            <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-16 px-4 sm:px-0 pb-12 sm:pb-0">
                {allQuestions.map((q, idx) => {
                    const isMultiple = q.multiple ?? (q.maxSelections ? q.maxSelections > 1 : true);

                    return (
                        <motion.div
                            key={q.id}
                            className="space-y-5 sm:space-y-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="flex items-center gap-3 sm:gap-5">
                                <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-[var(--primary)] flex items-center justify-center font-black text-xl sm:text-2xl">
                                    {idx + 1}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <label className="block text-lg sm:text-2xl font-black text-gray-800 tracking-tight leading-tight">
                                        {q.label}
                                        {q.required === false && (
                                            <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg uppercase tracking-wider">任意</span>
                                        )}
                                    </label>
                                    {(q.type === 'tags' || q.type === 'boolean') && (
                                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-widest pl-0.5">
                                            {isMultiple ? (
                                                <><Square className="w-3 h-3" /> 複数選択可</>
                                            ) : (
                                                <><Circle className="w-3 h-3" /> 1つ選択</>
                                            )}
                                            {q.maxSelections && `（最大${q.maxSelections}つ）`}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pl-0 sm:pl-[3.75rem]">
                                {q.type === 'rating' && (
                                    <div className="flex justify-start">
                                        <StarRating
                                            value={answers[q.id] || 0}
                                            onChange={(val) => handleRatingChange(val)}
                                        />
                                    </div>
                                )}

                                {q.type === 'tags' && q.options && (
                                    <div className="flex flex-wrap gap-2 sm:gap-4">
                                                {q.options.map((option: string) => {
                                                    const val = answers[q.id];
                                                    const isSelected = isMultiple
                                                        ? (val || []).includes(option)
                                                        : val === option;

                                                    const isLimitReached = isMultiple && !isSelected && q.maxSelections && (val || []).length >= q.maxSelections;

                                                    return (
                                                        <motion.button
                                                            key={option}
                                                            type="button"
                                                            whileTap={isLimitReached ? {} : { scale: 0.96 }}
                                                            onClick={() => handleTagToggle(q.id, option, q.maxSelections, isMultiple)}
                                                            className={cn(
                                                                "px-4 py-2.5 sm:px-7 sm:py-4 rounded-[1rem] sm:rounded-[1.25rem] border-2 transition-all text-sm sm:text-base font-bold flex items-center gap-2 sm:gap-3 relative overflow-hidden",
                                                                isSelected
                                                                    ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20"
                                                                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50/50",
                                                                isLimitReached && "opacity-30 cursor-not-allowed grayscale-[0.8]",
                                                                !isMultiple && "rounded-full"
                                                            )}
                                                        >
                                                            {isMultiple ? (
                                                                <div className={cn(
                                                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                                                                    isSelected ? "bg-white border-white" : "border-gray-200"
                                                                )}>
                                                                    {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary)] stroke-[3]" />}
                                                                </div>
                                                            ) : (
                                                                <div className={cn(
                                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                                    isSelected ? "bg-white border-white" : "border-gray-200"
                                                                )}>
                                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
                                                                </div>
                                                            )}
                                                            {option}
                                                        </motion.button>
                                                    );
                                                })}
                                    </div>
                                )}

                                {q.type === 'boolean' && (
                                    <div className="flex gap-3 sm:gap-4 max-w-sm">
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
                                                        "flex-1 py-3 sm:py-4 rounded-[1rem] sm:rounded-[1.25rem] border-2 transition-all font-bold text-sm sm:text-base flex items-center justify-center gap-3",
                                                        isSelected
                                                            ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20"
                                                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50/50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                        isSelected ? "bg-white border-white" : "border-gray-200"
                                                    )}>
                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
                                                    </div>
                                                    {opt.label}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}

                                {q.type === 'text' && (
                                    <textarea
                                        className="w-full p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[var(--primary)] focus:ring-0 min-h-[140px] sm:min-h-[160px] transition-all resize-none text-gray-700 text-sm sm:text-lg leading-relaxed outline-none"
                                        placeholder="こちらにご入力ください（任意）"
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}


                <motion.button
                    type="submit"
                    disabled={isSubmitting || !isAllFilled}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "w-full py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] text-white font-black text-lg sm:text-xl shadow-2xl transition-all flex items-center justify-center gap-3",
                        "bg-[var(--primary)] hover:brightness-95 shadow-[var(--primary)]/30",
                        (isSubmitting || !isAllFilled) && "opacity-50 grayscale cursor-not-allowed shadow-none"
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                            作成中...
                        </>
                    ) : (
                        <>
                            回答を送信する
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
}
