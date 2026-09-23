import test from 'node:test';
import assert from 'node:assert/strict';
import { bilingualPostInputSchema } from '../src/lib/cms/validation.ts';
import { makeEditorValues, prepareBilingualInput } from '../src/lib/cms/editor.ts';
const content = { slug: 'turkce-yazi', title: 'Türkçe yazı', seoTitle: 'Arama başlığı', metaDescription: 'Türkçe meta açıklama', category: 'Yapay zekâ', summary: 'Türkçe kısa özet', readingMinutes: 3, date: '2026-01-01', author: { name: 'ASH', role: 'Editör' }, intro: ['Türkçe giriş'], sections: [{ heading: 'Başlık', paragraphs: ['İçerik'] }], takeaways: ['İlk madde'], faq: [{ q: 'Soru?', a: 'Yanıt.' }], cover: '/images/ash-blog-crm.svg', bodyMarkdown: '## Türkçe\n\nTürkçe metin.' };
const tr = { id:'11111111-1111-4111-8111-111111111111', locale: 'tr', translation_key: 'pair-test', slug: content.slug, version: 1, status: 'published', content, updated_at: '2026-01-01' };
const en = { ...tr, id:'22222222-2222-4222-8222-222222222222', locale: 'en', slug: 'english-post', content: { ...content, slug: 'english-post', title: 'English post', seoTitle: 'Search title', metaDescription: 'English description', category: 'AI', summary: 'English summary', bodyMarkdown: '## English\n\nEnglish content.', takeaways: ['First point'], faq: [{ q:'Question?', a:'Answer.' }] } };

test('both manually entered languages and their SEO fields are kept distinct', () => {
  const values = makeEditorValues([tr, en], 'pair-test');
  const payload = prepareBilingualInput(values, 'published');
  assert.equal(bilingualPostInputSchema.safeParse(payload).success, true);
  assert.equal(payload.posts[0].content.seoTitle, 'Arama başlığı');
  assert.equal(payload.posts[1].content.seoTitle, 'Search title');
  assert.equal(payload.posts[1].content.bodyMarkdown, en.content.bodyMarkdown);
  assert.deepEqual(payload.posts[1].content.faq, en.content.faq);
});
test('a Turkish-only draft can be saved but cannot be published without English', () => {
  const values = makeEditorValues([tr], 'pair-test');
  const draft = prepareBilingualInput(values, 'draft');
  assert.equal(draft.posts.length, 1);
  assert.equal(bilingualPostInputSchema.safeParse(draft).success, true);
  const published = prepareBilingualInput(values, 'published');
  assert.equal(published.posts.length, 2);
  assert.equal(bilingualPostInputSchema.safeParse(published).success, false);
  assert.equal(bilingualPostInputSchema.safeParse({ ...draft, status:'published', posts:[{...draft.posts[0],status:'published'}] }).success, false);
});
test('publishing requires matching pairs, two unique locales, and matching statuses', () => {
  const payload = prepareBilingualInput(makeEditorValues([tr, en], 'pair-test'), 'published');
  const differentKey = structuredClone(payload); differentKey.posts[1].translation_key = 'another-post';
  const duplicateLocale = structuredClone(payload); duplicateLocale.posts[1].locale = 'tr';
  const differentStatus = structuredClone(payload); differentStatus.posts[1].status = 'draft';
  for (const bad of [differentKey, duplicateLocale, differentStatus]) assert.equal(bilingualPostInputSchema.safeParse(bad).success, false);
});
test('taking a post back to draft includes both existing language versions', () => {
  const payload = prepareBilingualInput(makeEditorValues([tr, en], 'pair-test'), 'draft');
  assert.equal(payload.posts.length, 2);
  assert.ok(payload.posts.every(post => post.status === 'draft' && post.id && post.version === 1));
});
test('legacy article structure becomes editable Markdown without losing text', () => {
  const old = structuredClone(tr); delete old.content.bodyMarkdown;
  const values = makeEditorValues([old], 'pair-test');
  assert.equal(values.tr.content.bodyMarkdown, 'Türkçe giriş\n\n## Başlık\n\nİçerik');
  assert.equal(values.en.content.cover, content.cover);
  assert.equal(values.en.content.bodyMarkdown, '');
});
