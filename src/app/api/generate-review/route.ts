import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { clientName, answers } = await req.json();

        if (!clientName || !answers) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // AIが使用する回答のみをフィルタリング
        const answerSummary = Object.entries(answers)
            .map(([label, value]) => `${label}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');

        const prompt = `あなたは ${clientName} の利用者です。
以下の利用者の感想を元に、Googleマップに投稿するための自然で、丁寧で、好意的な口コミ文章を作成してください。
文章は150文字程度で、読んだ人がその場所へ行きたくなるような内容にしてください。

【利用者の感想】
${answerSummary}

【制約】
- 「私は〜」という表現は控えめにし、自然な感想として書く
- 敬体（です・ます調）で書く
- 嘘は書かない（提供された情報のみを使用する）`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'あなたは親切で正直な口コミ投稿者です。',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        const reviewText = response.choices[0].message.content || '';

        return NextResponse.json({ reviewText });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
