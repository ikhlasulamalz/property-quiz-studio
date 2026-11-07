# Property Quiz Studio

Option C, Employee Quiz Builder. This assessment prototype turns property-industry topics into quizzes for 99 Group employees. The interface supports 5, 8, or 10 questions, three difficulty levels, and English or Bahasa Indonesia output.

## Try it

- **Sample:** Open either five-question quiz, answer each question, and select **Check my score**. Review the explanations, retake the quiz, or download JSON with the answer key.
- **Automatic generation:** Enter a topic, optional public source notes, and your own Vercel AI Gateway key under **AI connection**. Select **Generate quiz**. The browser sends the key directly to the Gateway and clears the input when the request starts.
- **Copy and import:** Expand **Use your own AI chat**, copy the generated prompt into an AI chat, then paste the returned JSON into the app. For a reproducible example, choose 5 questions and paste the contents of [Jakarta market literacy](examples/jakarta-market-literacy.json).

## Run locally

Requires Python 3 for serving and Node.js 22+ for tests. No package installation is needed.

```sh
python3 -m http.server 8073 --bind 127.0.0.1 --directory dist
# Open http://127.0.0.1:8073
npm test
```

## Workflow

Topic, count, difficulty, language, and optional source notes → [runtime prompts and structured output request](dist/quiz.js) → Vercel AI Gateway (`openai/gpt-5-mini`) → local validation → shuffle choices and remap answers → take quiz, score, review, and export. The copy-and-import path reuses the validation and learner flow.

The output validator checks the title, question count, distinct questions and choices, zero-based indexes, and explanations. An invalid automated response gets one repair attempt. Quiz text is rendered through DOM text nodes. The prototype keeps answers in browser memory for immediate self-assessment. Exported JSON includes the answer key.

For dated topics, paste a dated public source brief. Without figures in the notes, the prompt asks the model to use explicitly hypothetical examples or ask how the learner would verify an indicator. The example quiz tests how asking prices, listing mix, and closed transactions differ. Review generated answers and source claims before using them in training.

## Verification and follow-up

The Node tests cover malformed responses, duplicate choices and questions, wrong counts, out-of-range indexes, answer shuffling, scoring, one repair attempt, and provider auth errors. The direct model path uses a visitor-supplied key and its success case is tested with a simulated provider response. The sample and copy/import paths are available without a Gateway account.

A next version for internal use could add approved source ingestion and a trainer review step before publishing quizzes to employees.
