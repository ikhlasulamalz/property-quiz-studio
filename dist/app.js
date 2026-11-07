import { SYSTEM, prompt, parseQuiz, shuffle, score, generate } from './quiz.js';
import { samples } from './samples.js';

const $ = id => document.getElementById(id);
const workspace = $('workspace');
const home = workspace.firstElementChild.cloneNode(true);
const status = $('status');

function setStatus(message = '', error = false) {
  status.textContent = message;
  status.classList.toggle('error', error);
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(text, action, style = 'secondary') {
  const node = element('button', text, style);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}

function heading(text) {
  const node = element('h2', text);
  node.id = 'stage-title';
  node.tabIndex = -1;
  return node;
}

function exportQuiz(quiz) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(quiz, null, 2) + '\n'], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'property-quiz.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function showSamples() {
  workspace.replaceChildren(home.cloneNode(true));
  $('badge').textContent = 'READY';
  $('stage-title').tabIndex = -1;
  $('stage-title').focus();
}

function renderQuiz(quiz, origin, answers = null) {
  const title = heading(quiz.title);
  const graded = answers !== null;
  $('badge').textContent = origin;
  const form = document.createElement('form');
  const sub = element('p', graded ? 'Review your answers below.' : 'Choose one answer per question, then check your score.', 'mt-[7px] text-muted');
  workspace.replaceChildren(title, sub, form);
  if (graded) {
    const correct = score(quiz, answers);
    sub.after(element('p', `Score: ${correct} / ${quiz.questions.length} · ${Math.round(correct / quiz.questions.length * 100)}%`, 'my-[13px] rounded-[10px] bg-correct p-3 font-semibold'));
  }
  quiz.questions.forEach((question, index) => {
    const field = element('fieldset', '', 'border-t border-line py-3.5 first:mt-[18px]');
    field.append(element('legend', `${index + 1}. ${question.prompt}`, 'pr-[5px] font-semibold'));
    question.choices.forEach((choice, choiceIndex) => {
      const label = element('label', '', 'my-1.5 flex items-baseline gap-[9px] rounded-lg bg-panel p-[9px] font-medium');
      const input = document.createElement('input');
      input.type = 'radio';
      input.className = 'accent-brand';
      input.name = `question-${index}`;
      input.value = choiceIndex;
      input.required = !graded;
      input.disabled = graded;
      input.checked = answers?.[index] === choiceIndex;
      label.append(input, document.createTextNode(choice));
      field.append(label);
    });
    if (graded) {
      const correct = answers[index] === question.answerIndex;
      field.append(element('p', `${correct ? 'Correct' : 'Best answer'} · ${question.choices[question.answerIndex]}. ${question.explanation}`, `mt-2 rounded-lg px-[11px] py-[9px] text-sm ${correct ? 'bg-correct' : 'bg-missed'}`));
    }
    form.append(field);
  });
  const actions = element('div', '', 'mt-[13px] flex flex-wrap gap-2');
  if (graded) {
    actions.append(button('Retake quiz', () => renderQuiz(shuffle(quiz), origin), 'primary'));
  } else {
    const submit = element('button', 'Check my score', 'primary');
    submit.type = 'submit';
    actions.append(submit);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const picks = quiz.questions.map((_, index) => Number(data.get(`question-${index}`)));
      renderQuiz(quiz, origin, picks);
    });
  }
  actions.append(button('Download quiz + key', () => exportQuiz(quiz)), button('Sample quizzes', showSamples));
  form.append(actions);
  title.focus();
}

workspace.addEventListener('click', event => {
  const sample = event.target.closest('[data-sample]');
  if (!sample) return;
  setStatus();
  renderQuiz(shuffle(samples[Number(sample.dataset.sample)]), 'SAMPLE');
});

function readInput() {
  const topic = $('topic');
  if (!topic.value.trim()) {
    topic.focus();
    throw new Error('Enter a property topic first.');
  }
  return {
    topic: topic.value.trim(),
    count: Number($('count').value),
    difficulty: $('difficulty').value,
    language: $('language').value,
    sourceNotes: $('notes').value.trim(),
  };
}

$('copy').addEventListener('click', async () => {
  try {
    const text = SYSTEM + '\n\n' + prompt(readInput());
    const box = $('prompt-text');
    box.value = text;
    box.hidden = false;
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Prompt copied. Paste it into your AI chat.');
    } catch {
      box.focus();
      box.select();
      setStatus('The prompt is selected. Copy it and paste it into your AI chat.');
    }
  } catch (error) { setStatus(error.message, true); }
});

$('import').addEventListener('click', () => {
  try {
    renderQuiz(shuffle(parseQuiz($('json').value, Number($('count').value))), 'IMPORTED');
    setStatus('Quiz loaded. Review the answer key before using it in training.');
  } catch (error) { setStatus(error.message, true); }
});

$('setup').addEventListener('submit', async event => {
  event.preventDefault();
  if ($('settings').disabled) return;
  let input;
  try { input = readInput(); }
  catch (error) { setStatus(error.message, true); return; }
  const key = $('key').value.trim();
  if (!key) {
    $('connection').open = true;
    $('key').focus();
    setStatus('Enter an AI Gateway key, or expand “Use your own AI chat” to copy the prompt.', true);
    return;
  }
  $('key').value = '';
  $('settings').disabled = true;
  setStatus('Generating questions and checking the answer format…');
  try {
    const quiz = await generate(input, key);
    renderQuiz(shuffle(quiz), 'AI GENERATED');
    setStatus('Quiz ready. Review the answer key before using it in training.');
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    $('settings').disabled = false;
  }
});
