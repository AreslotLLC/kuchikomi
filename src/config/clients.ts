import { ClientConfig } from '@/types';

export const clients: Record<string, ClientConfig> = {
  'yokoyama-tax-office': {
    id: 'yokoyama-tax-office',
    name: '横山千夏税理士事務所',
    googleMapLink: 'https://search.google.com/local/writereview?placeid=ChIJG0JfqSk6AWARwU93HJBPuk8',
    themeColor: 'emerald',
    questions: [
      {
        id: 'rating',
        type: 'rating',
        label: 'サービスの満足度を教えてください',
        aiUse: false,
        required: true,
      },
      {
        id: 'request_type',
        type: 'tags',
        label: '相談（依頼）内容を教えてください',
        options: ['相続関連', '法人顧問', '個人顧問', '経理関連', '不動産関連'],
        multiple: true,
        aiUse: true,
        required: true,
      },
      {
        id: 'atmosphere',
        type: 'tags',
        label: '事務所の雰囲気や対応はいかがでしたか？（上位3つを選択）',
        options: [
          '清潔', '落ち着いている', '丁寧な対応', '話しやすい', '女性でも安心',
          '専門的', '説明が丁寧', '親身な対応', 'スピーディー', 'おすすめできる',
          '信頼できる', 'アットホーム', '誠実な対応', 'プライバシーへの配慮', '雰囲気が明るい'
        ],
        maxSelections: 3,
        multiple: true,
        aiUse: true,
        required: true,
      },
      {
        id: 'comments',
        type: 'text',
        label: 'その他、ご意見・ご感想があればお聞かせください',
        aiUse: true,
        required: false,
      },
    ],
  },
  'dental-clinic-b': {
    id: 'dental-clinic-b',
    name: 'B歯科クリニック',
    googleMapLink: 'https://maps.app.goo.gl/example2',
    themeColor: 'blue',
    questions: [
      {
        id: 'rating',
        type: 'rating',
        label: '診察・治療の満足度を教えてください',
        aiUse: false,
        required: true,
      },
      {
        id: 'pain',
        type: 'boolean',
        label: '痛みへの配慮は感じられましたか？',
        aiUse: true,
        required: true,
      },
      {
        id: 'explanation',
        type: 'tags',
        label: '説明のわかりやすさはいかがでしたか？',
        options: ['非常にわかりやすい', 'わかりやすい', '普通', '不十分'],
        multiple: false,
        aiUse: true,
        required: true,
      },
      {
        id: 'comments',
        type: 'text',
        label: 'その他、気になった点があれば教えてください',
        aiUse: true,
        required: false,
      },
    ],
  },
};
