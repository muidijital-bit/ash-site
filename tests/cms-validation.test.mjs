import test from 'node:test';
import assert from 'node:assert/strict';
import { postInputSchema, validMediaPath } from '../src/lib/cms/validation.ts';

const complete = { version: 0, locale: 'tr', translation_key: 'cms-test', status: 'published', content: { slug: 'yeni-yazi', title: 'Yeni yazı', seoTitle: '', metaDescription: 'Bu yazı kurumsal yapay zekâ süreçlerini anlatır.', category: 'Yapay Zekâ', summary: 'Kurumsal AI hakkında bir yazı.', readingMinutes: 3, date: '2026-01-01', author: { name: 'ASH', role: 'Editör' }, intro: [], sections: [], takeaways: [], faq: [], cover: '/images/ash-blog-crm.svg', bodyMarkdown: '## Başlangıç\n\nYazı içeriği.' } };
test('complete post can be published and incomplete content stays a draft', () => {
  assert.equal(postInputSchema.safeParse(complete).success, true);
  const draft = structuredClone(complete); draft.content.bodyMarkdown = ''; draft.content.metaDescription = ''; draft.content.cover = ''; draft.status = 'draft';
  assert.equal(postInputSchema.safeParse(draft).success, true);
  draft.status = 'published'; assert.equal(postInputSchema.safeParse(draft).success, false);
});
test('invalid dates and dangerous slugs cannot be saved', () => {
  for (const date of ['2026-02-30', 'not-a-date', '2999-01-01']) { const p = structuredClone(complete); p.content.date = date; assert.equal(postInputSchema.safeParse(p).success, false); }
  for (const slug of ['../admin', 'A Title', 'javascript:alert(1)', 'bad--slug']) { const p = structuredClone(complete); p.content.slug = slug; assert.equal(postInputSchema.safeParse(p).success, false); }
});
test('media stays within approved local assets or this project public bucket', () => {
  const host = 'https://kczoltttbjxdodoaanez.supabase.co';
  for (const value of ['/images/cover.webp', `${host}/storage/v1/object/public/ash-media/user/image.webp`]) assert.equal(validMediaPath(value, host), true);
  for (const value of ['javascript:alert(1)', '//evil.test/x.png', '/images/../secret', `${host}.evil.test/storage/v1/object/public/ash-media/x`, `${host}/storage/v1/object/public/another/x`, 'https://user:password@kczoltttbjxdodoaanez.supabase.co/storage/v1/object/public/ash-media/x']) assert.equal(validMediaPath(value, host), false);
});
