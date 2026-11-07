import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { generate, parseQuiz, score, shuffle } from '../dist/quiz.js';
import { samples } from '../dist/samples.js';

const fixture = readFileSync(new URL('../examples/jakarta-market-literacy.json', import.meta.url), 'utf8');

test('accepts both samples and a fenced AI response', () => {
  for (const sample of samples) assert.equal(parseQuiz(JSON.stringify(sample), 5).questions.length, 5);
  assert.equal(parseQuiz('```json\n' + fixture + '\n```', 5).questions.length, 5);
});

test('rejects invalid JSON, incorrect count, repeated questions or choices, and out-of-range answers', () => {
  assert.throws(() => parseQuiz('incomplete', 5), /JSON/);
  assert.throws(() => parseQuiz(fixture, 8), /exactly 8/);
  for (const change of [
    quiz => { quiz.questions[1].prompt = quiz.questions[0].prompt.toUpperCase(); },
    quiz => { quiz.questions[0].choices[1] = ' ' + quiz.questions[0].choices[0].toUpperCase(); },
    quiz => { quiz.questions[0].answerIndex = 4; },
  ]) {
    const quiz = JSON.parse(fixture);
    change(quiz);
    assert.throws(() => parseQuiz(JSON.stringify(quiz), 5), /Question/);
  }
});

test('shuffling preserves the correct option and scoring uses the new index', () => {
  const original = parseQuiz(fixture, 5);
  const quiz = shuffle(original, () => 0);
  assert.notDeepEqual(quiz.questions[0].choices, original.questions[0].choices);
  for (const [i, q] of quiz.questions.entries()) {
    const before = original.questions[i];
    assert.equal(q.choices[q.answerIndex], before.choices[before.answerIndex]);
  }
  assert.equal(score(quiz, quiz.questions.map(q => q.answerIndex)), 5);
  assert.equal(score(quiz, quiz.questions.map(q => (q.answerIndex + 1) % 4)), 0);
});

test('retries malformed model output once and includes the repair prompt', async () => {
  const calls = [];
  const quiz = await generate({ topic: 'Jakarta market literacy', count: 5 }, 'test-placeholder', async (_, options) => {
    calls.push(JSON.parse(options.body));
    return Response.json({ choices: [{ message: { content: calls.length === 1 ? '{}' : fixture } }] });
  });
  assert.equal(calls.length, 2);
  assert.match(calls[1].messages[1].content, /failed validation/);
  assert.equal(quiz.questions.length, 5);
});

test('does not retry provider authorization errors', async () => {
  let calls = 0;
  await assert.rejects(generate({ count: 5 }, 'test-placeholder', async () => {
    calls++;
    return new Response('', { status: 401 });
  }), /key/);
  assert.equal(calls, 1);
});
