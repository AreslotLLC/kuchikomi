import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">口コミ収集アプリ</h1>
                <p className="text-gray-600">
                    このアプリはクライアント専用のURLからアクセスしてください。
                </p>
                <div className="space-y-2">
                    <p className="text-sm text-gray-400 font-medium">デモ用リンク:</p>
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/yokoyama-tax-office"
                            className="text-emerald-600 hover:text-emerald-700 font-bold underline"
                        >
                            横山千夏税理士事務所
                        </Link>
                        <Link
                            href="/dental-clinic-b"
                            className="text-blue-600 hover:text-blue-700 font-bold underline"
                        >
                            B歯科クリニック
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
