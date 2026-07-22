import type { MasteryLevel, ReviewStatus } from "@/types/database";

export interface MasteryState {
  masteryScore: number;
  reviewStatus: ReviewStatus;
}

export interface AttemptSignal {
  isCorrect: boolean;
  responseTimeMs: number | null;
  expectedTimeMs: number;
  confidence: number | null;
}

const REVIEW_INTERVAL_DAYS: Record<ReviewStatus, number> = {
  new: 0,
  learning: 1,
  developing: 3,
  familiar: 7,
  strong: 14,
  mastered: 30,
  due_for_review: 1,
};

const STATUS_ORDER: ReviewStatus[] = ["new", "learning", "developing", "familiar", "strong", "mastered"];

function levelForScore(score: number): MasteryLevel {
  if (score >= 90) return "mastered";
  if (score >= 75) return "strong";
  if (score >= 55) return "familiar";
  if (score >= 30) return "developing";
  if (score > 0) return "beginning";
  return "not_started";
}

/**
 * A simplified SM-2-inspired scheduler. Questions answered correctly,
 * quickly, and with high confidence advance further and return less often;
 * incorrect answers, slow answers, or low confidence pull the question
 * back toward frequent review.
 */
export function computeMasteryUpdate(
  current: MasteryState | null,
  attempt: AttemptSignal
): { masteryScore: number; masteryLevel: MasteryLevel; reviewStatus: ReviewStatus; nextReviewAt: Date } {
  const currentScore = current?.masteryScore ?? 0;
  const currentStatusIndex = current
    ? Math.max(STATUS_ORDER.indexOf(current.reviewStatus === "due_for_review" ? "learning" : current.reviewStatus), 0)
    : 0;

  const wasSlow = attempt.responseTimeMs !== null && attempt.responseTimeMs > attempt.expectedTimeMs * 1.5;
  const lowConfidence = attempt.confidence !== null && attempt.confidence <= 2;
  const strongSignal = attempt.isCorrect && !wasSlow && !lowConfidence;

  let nextStatusIndex = currentStatusIndex;
  let scoreDelta: number;

  if (!attempt.isCorrect) {
    nextStatusIndex = Math.max(currentStatusIndex - 1, 0);
    scoreDelta = -15;
  } else if (wasSlow || lowConfidence) {
    scoreDelta = 5;
  } else if (strongSignal) {
    nextStatusIndex = Math.min(currentStatusIndex + 1, STATUS_ORDER.length - 1);
    scoreDelta = 12;
  } else {
    scoreDelta = 8;
  }

  const masteryScore = Math.max(0, Math.min(100, currentScore + scoreDelta));
  const reviewStatus = STATUS_ORDER[nextStatusIndex];
  const masteryLevel = levelForScore(masteryScore);

  const intervalDays = attempt.isCorrect ? REVIEW_INTERVAL_DAYS[reviewStatus] : 0.5;
  const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

  return { masteryScore, masteryLevel, reviewStatus, nextReviewAt };
}
