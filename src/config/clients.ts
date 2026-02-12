import { ClientConfig } from '@/types';

export const clients: Record<string, ClientConfig> = {
  'yokoyama-tax-office': {
    id: 'yokoyama-tax-office',
    name: '横山千夏税理士事務所',
    googleMapLink: 'https://www.google.com/maps/search/?api=1&query=%E6%A8%AA%E5%B1%B1%E5%8D%83%E5%A4%8F%E7%A8%8E%E7%90%86%E5%A3%AB%E4%BA%8B%E5%8B%99%E6%89%80',
    webhookUrl: 'https://script.google.com/macros/s/example-webhook-a/exec',
    themeColor: 'emerald',
    questions: [
      {
        id: 'rating',
        type: 'rating',
        label: '今回のサービスの満足度を教えてください',
        aiUse: false,
      },
      {
        id: 'atmosphere',
        type: 'tags',
        label: '事務所の雰囲気はいかがでしたか？',
        options: ['清潔', '落ち着いている', '活気がある', '入りやすい'],
        aiUse: true,
      },
      {
        id: 'staff',
        type: 'tags',
        label: '担当者の対応はいかがでしたか？',
        options: ['丁寧', 'スピーディー', '親身', '専門的'],
        aiUse: true,
      },
      {
        id: 'comments',
        type: 'text',
        label: 'その他、ご意見・ご感想があればお聞かせください',
        aiUse: true,
      },
    ],
  },
  'dental-clinic-b': {
    id: 'dental-clinic-b',
    name: 'B歯科クリニック',
    googleMapLink: 'https://maps.app.goo.gl/example2',
    webhookUrl: 'https://script.google.com/macros/s/example-webhook-b/exec',
    themeColor: 'blue',
    questions: [
      {
        id: 'rating',
        type: 'rating',
        label: '診察・治療の満足度を教えてください',
        aiUse: false,
      },
      {
        id: 'pain',
        type: 'boolean',
        label: '痛みへの配慮は感じられましたか？',
        aiUse: true,
      },
      {
        id: 'explanation',
        type: 'tags',
        label: '説明のわかりやすさはいかがでしたか？',
        options: ['非常にわかりやすい', 'わかりやすい', '普通', '不十分'],
        aiUse: true,
      },
      {
        id: 'comments',
        type: 'text',
        label: 'その他、気になった点があれば教えてください',
        aiUse: true,
      },
    ],
  },
};
