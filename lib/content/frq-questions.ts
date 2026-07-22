import type { DifficultyLevel, FrqQuestionType } from "@/types/database";

export interface FrqRubricItem {
  id: string;
  description: string;
  points: number;
}

export interface FrqTestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface FrqGuidedStage {
  stage: number;
  title: string;
  prompt: string;
}

export interface FrqQuestion {
  id: string;
  unitSlug: string;
  title: string;
  prompt: string;
  starterCode: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  questionType: FrqQuestionType;
  rubric: FrqRubricItem[];
  testCases: FrqTestCase[];
  guidedStages?: FrqGuidedStage[];
  sampleSolution: string;
}

export const frqQuestions: FrqQuestion[] = [
  {
    id: "frq-snowfall-tracker",
    unitSlug: "arrays",
    title: "SnowfallTracker: Days Above Average",
    difficulty: "medium",
    estimatedMinutes: 25,
    questionType: "guided",
    prompt:
      "A SnowfallTracker object stores one winter's worth of daily snowfall totals, in inches, in the instance array field dailyTotals. Write the method daysAboveAverage, which returns the number of days on which the snowfall was strictly greater than the average daily snowfall for the whole array.\n\nAssume dailyTotals contains at least one element, and that a working, fully-encapsulated SnowfallTracker class already exists — you are only responsible for the body of daysAboveAverage.",
    starterCode:
`public class SnowfallTracker {
    private double[] dailyTotals;

    // constructor and other methods not shown

    /**
     * Returns the number of days in dailyTotals whose snowfall was
     * strictly greater than the average of all days in dailyTotals.
     */
    public int daysAboveAverage() {
        // your code here
    }
}`,
    rubric: [
      { id: "r1", description: "Correctly computes the sum of all elements in dailyTotals", points: 2 },
      { id: "r2", description: "Correctly computes the average as a floating-point value (sum divided using double arithmetic, not truncated integer division)", points: 2 },
      { id: "r3", description: "Traverses the array a second time, comparing each element to the average", points: 2 },
      { id: "r4", description: "Correctly counts only elements strictly greater than the average (not >=)", points: 2 },
      { id: "r5", description: "Returns the count as an int", points: 1 },
    ],
    testCases: [
      { id: "t1", inputDescription: "dailyTotals = {2.0, 4.0, 6.0}  (average = 4.0)", expectedOutput: "1  (only 6.0 is above the average)", hidden: false },
      { id: "t2", inputDescription: "dailyTotals = {5.0}  (single element)", expectedOutput: "0  (5.0 is not strictly greater than its own average)", hidden: false },
      { id: "t3", inputDescription: "dailyTotals = {0.0, 0.0, 0.0}", expectedOutput: "0  (all equal the average; none is strictly greater)", hidden: true },
      { id: "t4", inputDescription: "dailyTotals = {1.0, 2.0, 3.0, 4.0, 100.0}", expectedOutput: "1  (average is 22.0; only 100.0 exceeds it)", hidden: true },
    ],
    guidedStages: [
      {
        stage: 1,
        title: "Understand the prompt",
        prompt:
          "Highlight the required method name, its return type, and the exact comparison word (\"strictly greater than\"). What existing field can you use directly, and what edge case does a single-element array create?",
      },
      {
        stage: 2,
        title: "Plan the algorithm",
        prompt:
          "In plain English: (1) sum every element, (2) divide to get the average as a double, (3) loop again counting elements greater than that average, (4) return the count. Two traversals of the same array are expected and fine.",
      },
      {
        stage: 3,
        title: "Write the method header",
        prompt: "Verify: public, instance (no static), returns int, name daysAboveAverage, no parameters. It already matches the starter code — just confirm you understand why static is wrong here (the method needs access to this object's dailyTotals field).",
      },
      {
        stage: 4,
        title: "Build the core logic",
        prompt: "Write the summing loop first, divide to get the average (watch for integer division!), then write the counting loop.",
      },
      {
        stage: 5,
        title: "Trace the code",
        prompt: "Trace with dailyTotals = {2.0, 4.0, 6.0}: sum = 12.0, average = 4.0. Second loop: 2.0 > 4.0? no. 4.0 > 4.0? no. 6.0 > 4.0? yes → count = 1.",
      },
      {
        stage: 6,
        title: "Test edge cases",
        prompt: "What happens with a single-element array? All values equal? A very large outlier? Confirm your method returns 0, 0, and 1 respectively for the three provided edge-case tests.",
      },
      {
        stage: 7,
        title: "Rubric review",
        prompt: "Match each line of your method to a rubric row. The most common point loss is using integer division for the average, or using >= instead of > in the comparison.",
      },
      {
        stage: 8,
        title: "Reflection",
        prompt: "What made this problem tricky — the double precision, the two-pass structure, or the strict inequality? Which syntax would benefit from a quick Syntax Café review?",
      },
    ],
    sampleSolution:
`public int daysAboveAverage() {
    double sum = 0;
    for (int i = 0; i < dailyTotals.length; i++) {
        sum += dailyTotals[i];
    }
    double average = sum / dailyTotals.length;

    int count = 0;
    for (int i = 0; i < dailyTotals.length; i++) {
        if (dailyTotals[i] > average) {
            count++;
        }
    }
    return count;
}`,
  },
  {
    id: "frq-roster-trim",
    unitSlug: "arraylist",
    title: "RosterTrim: Removing Below a Threshold",
    difficulty: "medium",
    estimatedMinutes: 20,
    questionType: "standard",
    prompt:
      "Write a static method removeBelow that takes an ArrayList<Integer> scores and an int threshold, and removes every element strictly less than threshold from the list, modifying it in place. The method returns nothing.",
    starterCode:
`public static void removeBelow(ArrayList<Integer> scores, int threshold) {
    // your code here
}`,
    rubric: [
      { id: "r1", description: "Traverses the list in a way that safely allows removal (e.g., iterating backward, or using an explicit index adjustment)", points: 3 },
      { id: "r2", description: "Correctly compares each element to threshold using <", points: 2 },
      { id: "r3", description: "Calls remove with the correct index-based overload, not the object-based one, or otherwise removes correctly", points: 2 },
      { id: "r4", description: "Method has no return statement / matches the void signature", points: 1 },
    ],
    testCases: [
      { id: "t1", inputDescription: "scores = [50, 72, 65, 90, 40], threshold = 60", expectedOutput: "scores becomes [72, 65, 90]", hidden: false },
      { id: "t2", inputDescription: "scores = [10, 20, 30], threshold = 100", expectedOutput: "scores becomes [] (empty)", hidden: false },
      { id: "t3", inputDescription: "scores = [], threshold = 50", expectedOutput: "scores remains [] (no exception)", hidden: true },
    ],
    sampleSolution:
`public static void removeBelow(ArrayList<Integer> scores, int threshold) {
    for (int i = scores.size() - 1; i >= 0; i--) {
        if (scores.get(i) < threshold) {
            scores.remove(i);
        }
    }
}`,
  },
  {
    id: "frq-digit-sum-recursive",
    unitSlug: "recursion",
    title: "digitSum: Recursive Digit Sum",
    difficulty: "hard",
    estimatedMinutes: 20,
    questionType: "standard",
    prompt:
      "Write a recursive method digitSum(int n) that returns the sum of the digits of a non-negative integer n. For example, digitSum(482) returns 4 + 8 + 2 = 14. You may not use any loops — the repetition must come from recursion.",
    starterCode:
`public static int digitSum(int n) {
    // your code here
}`,
    rubric: [
      { id: "r1", description: "Correct base case (n < 10 returns n)", points: 2 },
      { id: "r2", description: "Correct recursive case combining n % 10 with a recursive call", points: 3 },
      { id: "r3", description: "Recursive call passes n / 10, making progress toward the base case", points: 2 },
      { id: "r4", description: "No loop is used; solution is genuinely recursive", points: 1 },
    ],
    testCases: [
      { id: "t1", inputDescription: "n = 482", expectedOutput: "14", hidden: false },
      { id: "t2", inputDescription: "n = 7", expectedOutput: "7", hidden: false },
      { id: "t3", inputDescription: "n = 0", expectedOutput: "0", hidden: true },
      { id: "t4", inputDescription: "n = 1000", expectedOutput: "1", hidden: true },
    ],
    sampleSolution:
`public static int digitSum(int n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + digitSum(n / 10);
}`,
  },
];

export function getFrqById(id: string) {
  return frqQuestions.find((f) => f.id === id);
}
