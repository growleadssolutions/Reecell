import { createHash } from 'node:crypto';

// Baseline files are UTF-8 text. Ignore only Git's CRLF/LF conversion;
// preserve all other whitespace and content so actual edits still fail.
export function contentHash(content) {
  return createHash('sha256').update(content.toString('utf8').replace(/\r\n/g, '\n')).digest('hex');
}
