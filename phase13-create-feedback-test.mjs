import fs from 'fs';
const content = `import { describe, it, expect } from 'vitest';
import { buildFeedbackMailto } from './feedback';

describe('buildFeedbackMailto', () => {
  it('builds a mailto URL targeting feedback@cargoscale.net', () => {
    const url = buildFeedbackMailto({
      type: 'General feedback',
      message: 'Great tool!',
      email: '',
      pageUrl: 'https://cargoscale.net/',
    });
    expect(url.startsWith('mailto:feedback@cargoscale.net?')).toBe(true);
  });

  it('includes the feedback type in the subject', () => {
    const url = buildFeedbackMailto({
      type: 'Report a problem',
      message: 'Something is broken',
      email: '',
      pageUrl: 'https://cargoscale.net/tools/shipment-analyzer',
    });
    expect(url).toContain(encodeURIComponent('CargoScale Feedback — Report a problem').replace(/%20/g, '+'));
  });

  it('falls back to a placeholder when the message is empty', () => {
    const url = buildFeedbackMailto({
      type: 'General feedback',
      message: '   ',
      email: '',
      pageUrl: 'https://cargoscale.net/',
    });
    const decodedBody = decodeURIComponent(url.split('body=')[1].replace(/\\+/g, ' '));
    expect(decodedBody).toContain('(no message provided)');
  });

  it('falls back to a placeholder when the email is empty', () => {
    const url = buildFeedbackMailto({
      type: 'General feedback',
      message: 'Hello',
      email: '   ',
      pageUrl: 'https://cargoscale.net/',
    });
    const decodedBody = decodeURIComponent(url.split('body=')[1].replace(/\\+/g, ' '));
    expect(decodedBody).toContain('Email: (not provided)');
  });

  it('includes the trimmed email when provided', () => {
    const url = buildFeedbackMailto({
      type: 'Suggest an improvement',
      message: 'Add dark mode',
      email: '  user@example.com  ',
      pageUrl: 'https://cargoscale.net/guides',
    });
    const decodedBody = decodeURIComponent(url.split('body=')[1].replace(/\\+/g, ' '));
    expect(decodedBody).toContain('Email: user@example.com');
  });

  it('includes the exact page URL passed in', () => {
    const url = buildFeedbackMailto({
      type: 'General feedback',
      message: 'Nice',
      email: '',
      pageUrl: 'https://cargoscale.net/tools/cbm-calculator',
    });
    const decodedBody = decodeURIComponent(url.split('body=')[1].replace(/\\+/g, ' '));
    expect(decodedBody).toContain('Page: https://cargoscale.net/tools/cbm-calculator');
  });

  it('safely encodes special characters in the message (no raw ampersands or quotes)', () => {
    const url = buildFeedbackMailto({
      type: 'Report a problem',
      message: 'It broke & showed "undefined"',
      email: '',
      pageUrl: 'https://cargoscale.net/',
    });
    expect(url).not.toContain('& showed');
    expect(url).not.toContain('"undefined"');
  });
});
`;
const filePath = 'lib/utils/feedback.test.ts';
if (fs.existsSync(filePath)) { console.log('FAIL:file_already_exists:' + filePath); process.exit(1); }
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
