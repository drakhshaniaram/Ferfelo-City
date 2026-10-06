import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearFellowChatHistory,
  loadFellowChatHistory,
  pruneFellowChatHistories,
  saveFellowChatHistory,
} from '../src/client/features/fellows/chat-history.js';

test('save and load restores you/fellow turns across close', () => {
  clearFellowChatHistory('w1');
  saveFellowChatHistory('w1', [
    { role: 'note', text: 'Lena · guide' },
    { role: 'fellow', text: '((winkt))\n„Hallo!“' },
    { role: 'you', text: 'Hallo Lena' },
    { role: 'fellow', text: 'partial', live: true },
  ]);
  assert.deepEqual(loadFellowChatHistory('w1'), [
    { role: 'note', text: 'Lena · guide' },
    { role: 'fellow', text: '((winkt))\n„Hallo!“' },
    { role: 'you', text: 'Hallo Lena' },
    { role: 'fellow', text: 'partial' },
  ]);
  clearFellowChatHistory('w1');
  assert.equal(loadFellowChatHistory('w1'), undefined);
});

test('empty live stubs are dropped; prune removes gone workers', () => {
  clearFellowChatHistory('gone');
  clearFellowChatHistory('stay');
  saveFellowChatHistory('gone', [{ role: 'you', text: 'hi' }]);
  saveFellowChatHistory('stay', [{ role: 'you', text: 'yo' }, { role: 'fellow', text: '', live: true }]);
  assert.deepEqual(loadFellowChatHistory('stay'), [{ role: 'you', text: 'yo' }]);
  pruneFellowChatHistories(['stay']);
  assert.equal(loadFellowChatHistory('gone'), undefined);
  assert.deepEqual(loadFellowChatHistory('stay'), [{ role: 'you', text: 'yo' }]);
  clearFellowChatHistory('stay');
});
