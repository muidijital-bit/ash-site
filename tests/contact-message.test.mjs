import test from 'node:test';
import assert from 'node:assert/strict';
import { contactEmail, contactMessageSchema } from '../src/lib/contact-message.ts';

const valid = { name: 'Ayşe Yılmaz', email: 'ayse@example.com', phone: '', message: 'SAP projemiz için görüşmek istiyoruz.', locale: 'tr' };

test('a complete message is accepted and phone stays optional', () => {
  assert.equal(contactMessageSchema.safeParse(valid).success, true);
  assert.equal(contactMessageSchema.safeParse({ ...valid, phone: '+90 555 000 00 00' }).success, true);
});

test('missing or malformed fields are rejected', () => {
  for (const change of [{ name: 'A' }, { name: '   ' }, { email: 'not-an-email' }, { email: '' }, { message: 'kısa' }, { message: 'x'.repeat(5001) }, { phone: '1'.repeat(41) }, { locale: 'de' }]) {
    assert.equal(contactMessageSchema.safeParse({ ...valid, ...change }).success, false, JSON.stringify(change));
  }
});

test('the subject stays on one line and the body lists every field', () => {
  const message = contactMessageSchema.parse({ ...valid, name: 'Ayşe\r\nBcc: x@example.com', phone: '0555' });
  const { subject, text } = contactEmail(message);
  assert.equal(/[\r\n]/.test(subject), false);
  assert.match(text, /E-posta: ayse@example\.com/);
  assert.match(text, /Telefon: 0555/);
  assert.match(text, /SAP projemiz/);
});
