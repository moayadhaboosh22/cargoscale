import fs from 'fs';

const content = `export type FeedbackType = 'Suggest an improvement' | 'Report a problem' | 'General feedback';

export interface FeedbackInput {
  type: FeedbackType;
  message: string;
  email: string;
  pageUrl: string;
}

export function buildFeedbackMailto(input: FeedbackInput): string {
  const subject = \`CargoScale Feedback — \${input.type}\`;

  const bodyLines = [
    \`Feedback Type: \${input.type}\`,
    '',
    'Message:',
    input.message.trim() || '(no message provided)',
    '',
    \`Email: \${input.email.trim() || '(not provided)'}\`,
    \`Page: \${input.pageUrl}\`,
  ];

  const body = bodyLines.join('\\n');

  const params = new URLSearchParams({ subject, body });
  return \`mailto:feedback@cargoscale.net?\${params.toString()}\`;
}
`;

const dir = 'lib/utils';
const filePath = dir + '/feedback.ts';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
