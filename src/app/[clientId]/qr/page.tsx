'use client';

import { useParams } from 'next/navigation';
import { clients } from '@/config/clients';
import { QRCodeSVG } from 'qrcode.react';
import { Sparkles, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function QRPage() {
    const params = useParams();
    const clientId = params.clientId as string;
    const client = clients[clientId];

    if (!client) {
        notFound();
    }

    const surveyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${clientId}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 print:p-0 print:bg-white">
            <div className="max-w-xl w-full space-y-8">
                {/* Back Link - Screen Only */}
                <div className="print:hidden">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        ホームへ戻る
                    </Link>
                </div>

                {/* QR Display Card */}
                <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center space-y-8 border border-gray-100 relative overflow-hidden print:shadow-none print:border-none print:p-8">
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-light)] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-30 print:hidden" />

                    <div className="space-y-4">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            お客様用QRコード
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                            {client.name}
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center p-8 bg-gray-50 rounded-3xl inline-block print:p-0 print:bg-white">
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                            <QRCodeSVG
                                value={surveyUrl}
                                size={220}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[var(--primary-light)] rounded-2xl p-6 text-left space-y-3">
                            <div className="flex items-center gap-2 text-[var(--primary)] font-black">
                                <Sparkles className="w-5 h-5" />
                                <span>ご利用フロー</span>
                            </div>
                            <ol className="text-sm text-[var(--primary)] font-bold space-y-2 list-decimal list-inside opacity-80 decoration-none">
                                <li>QRコードをスマホで読み取る</li>
                                <li>簡単なアンケートに回答する</li>
                                <li>AIが作成した口コミをコピー</li>
                                <li>Googleマップに投稿！</li>
                            </ol>
                        </div>

                        <p className="text-xs text-gray-300 font-medium">
                            URL: {surveyUrl}
                        </p>
                    </div>
                </div>

                {/* Actions - Screen Only */}
                <div className="flex gap-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                    >
                        <Printer className="w-5 h-5" />
                        この画面を印刷する
                    </button>
                </div>
            </div>
        </main>
    );
}
