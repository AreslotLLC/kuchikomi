import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log('OpenAI Key Status:', process.env.OPENAI_API_KEY ? `Present (Starts with ${process.env.OPENAI_API_KEY.substring(0, 10)}...)` : 'Missing');

export async function POST(req: NextRequest) {
    try {
        const { clientName, answers, age, gender } = await req.json();

        if (!clientName || !answers) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const answerSummary = Object.entries(answers)
            .map(([label, value]) => `${label}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');

        const prompt = `あなたは ${clientName} の利用者（性別：${gender || '未回答'}、年齢層：${age || '未回答'}）です。
以下の利用者の感想を元に、Googleマップに投稿するための自然な口コミ文章を作成してください。

【作成のガイドライン】
- 回答者の属性（${age}、${gender}）に合わせた、ごく一般的で違和感のない「ですます」調で書いてください。
- 丁寧すぎたり、事務的すぎたりせず、利用者が自分の言葉で書いたような自然なトーンにしてください。
- 文章は100〜150文字程度。
- 嘘は書かず、提供された感想（以下の【利用者の感想】）の内容のみを使用してください。

【利用者の感想】
${answerSummary}

【制約】
- 「私は〜」という表現は最小限に。
- 広告らしさを避け、誠実で具体的な感想に。`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'あなたは実在する利用者の視点で、自然な日本語の口コミを書くアシスタントです。',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 400,
        });

        const reviewText = response.choices[0].message.content || '';

        return NextResponse.json({ reviewText });
    } catch (error: any) {
        console.error('OpenAI Interface Error:', error);
        
        // APIキーが設定されていない場合の明確なメッセージ
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
            return NextResponse.json({
                error: 'Configuration Error',
                details: 'OpenAI APIキーが設定されていません。.env.localを確認してください。'
            }, { status: 500 });
        }

        return NextResponse.json({
            error: 'AI Generation Failed',
            details: error.message || '予期せぬエラーが発生しました。'
        }, { status: 500 });
    }
}
