import { describe, expect, it } from 'vitest';
import { reviewTopics } from '@/content/review';
import { quizAnswers } from './quiz-answers';

describe('quiz answers', () => {
  const questions = reviewTopics.flatMap((t) => t.quiz);

  it('every question has exactly one valid correct option', () => {
    for (const question of questions) {
      const correct = quizAnswers[question.id];
      expect(correct, question.id).toBeDefined();
      expect(question.options.map((o) => o.id)).toContain(correct);
      expect(question.options).toHaveLength(4);
    }
  });

  it('has no answers for unknown questions and 3–5 questions per topic', () => {
    expect(Object.keys(quizAnswers).sort()).toEqual(questions.map((q) => q.id).sort());
    for (const topic of reviewTopics) {
      expect(topic.quiz.length).toBeGreaterThanOrEqual(3);
      expect(topic.quiz.length).toBeLessThanOrEqual(5);
    }
  });
});
