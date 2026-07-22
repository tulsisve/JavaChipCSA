export interface LessonContent {
  unitSlug: string;
  slug: string;
  title: string;
  hook: string;
  objectives: string[];
  prerequisites: string[];
  vocabulary: { term: string; definition: string }[];
  explanation: string[];
  syntaxTemplate: { title: string; code: string }[];
  annotatedExample: { title: string; code: string };
  lineByLineBreakdown: { line: string; explanation: string }[];
  executionTrace: string[];
  variableStateTable: { step: string; variables: Record<string, string> }[];
  memoryNote: string;
  commonMistakes: string[];
  compilerErrorExamples: { code: string; error: string; fix: string }[];
  logicErrorExamples: { code: string; issue: string; fix: string }[];
  predictOutputQuestions: { code: string; answer: string; explanation: string }[];
  fillInCodeQuestions: { prompt: string; code: string; answer: string }[];
  codeOrderingActivity: { instructions: string; lines: string[]; correctOrder: number[] };
  errorCorrectionActivity: { brokenCode: string; bug: string; fixedCode: string };
  shortCodingChallenge: { prompt: string; starterCode: string; sampleSolution: string };
  mcqMiniSet: {
    prompt: string;
    code?: string;
    choices: { label: string; text: string; correct: boolean; explanation: string }[];
  }[];
  reflectionPrompts: string[];
  masteryCheck: string[];
  summary: string;
  relatedReferenceLinks: { label: string; href: string }[];
  suggestedNextLesson: { label: string; href: string };
}

export const integerDivisionAndModulusLesson: LessonContent = {
  unitSlug: "primitive-types",
  slug: "integer-division-and-modulus",
  title: "Integer Division and Modulus",
  hook:
    "Splitting a restaurant bill among friends, converting total minutes into hours and leftover minutes, or checking whether a number is even — all of these are integer division and modulus problems in disguise. AP CSA loves to test this exact idea, because it's where a lot of Java's behavior quietly differs from ordinary arithmetic.",
  objectives: [
    "Predict the result of integer division between two int values",
    "Predict the result of the % (modulus) operator, including with negative operands",
    "Explain why 7 / 2 evaluates to 3, not 3.5, in Java",
    "Use integer division and modulus together to decompose a quantity (e.g. minutes into hours and minutes)",
    "Recognize integer-division bugs in AP-style code and MCQs",
  ],
  prerequisites: [
    "Declaring and initializing int variables",
    "Basic arithmetic operators: +, -, *, /",
  ],
  vocabulary: [
    { term: "integer division", definition: "Division between two int (or other integral) operands, which truncates any fractional part." },
    { term: "modulus (%)", definition: "The remainder operator; a % b gives the remainder after dividing a by b." },
    { term: "truncation", definition: "Discarding the fractional part of a number without rounding, always toward zero." },
    { term: "operand", definition: "A value that an operator acts on — in a / b, a and b are the operands." },
  ],
  explanation: [
    "In Java, the / operator behaves differently depending on the types of its operands. When both operands are integers (int, long, short, byte), / performs integer division: it computes how many whole times the divisor fits into the dividend and discards — truncates — anything left over. 7 / 2 is not 3.5; it is 3.",
    "Truncation in Java always rounds toward zero, not toward negative infinity. This matters for negative numbers: -7 / 2 evaluates to -3 (not -4), because Java truncates the true mathematical result of -3.5 toward zero.",
    "The % operator returns the remainder of that division. 7 % 2 is 1, because 2 fits into 7 three times with 1 left over. Java guarantees that (a / b) * b + (a % b) always equals a, which is a useful way to sanity-check your understanding.",
    "The sign of the result of % follows the sign of the left operand (the dividend) in Java. So -7 % 2 is -1, and 7 % -2 is 1. This trips up many students who expect the result to always be positive, or to follow the sign of the divisor as in some other languages.",
    "If either operand is a double (or float), / performs ordinary floating-point division and does not truncate: 7.0 / 2 evaluates to 3.5. This is why casting matters — (double) 7 / 2 gives you 3.5, while (double) (7 / 2) gives you 3.0, because in the second expression the integer division happens before the cast is applied.",
  ],
  syntaxTemplate: [
    { title: "Integer division", code: "int quotient = a / b;   // truncates toward zero" },
    { title: "Modulus", code: "int remainder = a % b;  // sign follows the dividend a" },
    { title: "Forcing floating-point division", code: "double result = (double) a / b;  // cast BEFORE dividing" },
  ],
  annotatedExample: {
    title: "Converting total minutes into hours and minutes",
    code:
`public class TimeConverter {
    public static void main(String[] args) {
        int totalMinutes = 155;

        int hours = totalMinutes / 60;
        int minutesLeft = totalMinutes % 60;

        System.out.println(hours + " hours and " + minutesLeft + " minutes");
    }
}`,
  },
  lineByLineBreakdown: [
    { line: "int totalMinutes = 155;", explanation: "Declares and initializes an int holding the total number of minutes to convert." },
    { line: "int hours = totalMinutes / 60;", explanation: "Integer division: 155 / 60 truncates to 2 — there are 2 full hours in 155 minutes." },
    { line: "int minutesLeft = totalMinutes % 60;", explanation: "Modulus: 155 % 60 is 35 — the remainder after removing those 2 full hours (120 minutes)." },
    { line: "System.out.println(hours + \" hours and \" + minutesLeft + \" minutes\");", explanation: "String concatenation with + builds and prints \"2 hours and 35 minutes\"." },
  ],
  executionTrace: [
    "totalMinutes is initialized to 155.",
    "155 / 60 is evaluated: 60 fits into 155 exactly 2 times (120), so hours becomes 2.",
    "155 % 60 is evaluated: 155 − 120 = 35, so minutesLeft becomes 35.",
    "The println statement concatenates and prints: 2 hours and 35 minutes.",
  ],
  variableStateTable: [
    { step: "After line 1", variables: { totalMinutes: "155", hours: "—", minutesLeft: "—" } },
    { step: "After line 2", variables: { totalMinutes: "155", hours: "2", minutesLeft: "—" } },
    { step: "After line 3", variables: { totalMinutes: "155", hours: "2", minutesLeft: "35" } },
  ],
  memoryNote:
    "int and double are primitive types, so hours, minutesLeft, and totalMinutes each store their value directly in a stack variable slot — there is no separate object on the heap and no reference to trace here. (Reference-diagram tracing becomes relevant starting in Unit 2, once we're storing objects like String.)",
  commonMistakes: [
    "Expecting 7 / 2 to produce 3.5 when both operands are int — it produces 3.",
    "Assuming % always returns a non-negative result — in Java its sign follows the dividend.",
    "Casting after dividing, e.g. (double) (7 / 2), which still performs integer division first and only converts the already-truncated 3 to 3.0.",
    "Dividing by zero with integer operands, which throws ArithmeticException at runtime rather than producing infinity (unlike floating-point division by zero, which produces Infinity or NaN).",
  ],
  compilerErrorExamples: [
    {
      code: "int average = totalScore / count",
      error: "';' expected",
      fix: "Add the missing semicolon: int average = totalScore / count;",
    },
  ],
  logicErrorExamples: [
    {
      code:
`int total = 10;
int count = 4;
double average = total / count;
System.out.println(average);`,
      issue: "Prints 2.0 instead of 2.5 — total / count performs integer division (10 / 4 truncates to 2) before that int result of 2 is widened to the double 2.0.",
      fix: "Cast at least one operand to double before dividing: double average = (double) total / count;",
    },
  ],
  predictOutputQuestions: [
    { code: "System.out.println(17 / 5);", answer: "3", explanation: "Integer division truncates 3.4 down to 3." },
    { code: "System.out.println(17 % 5);", answer: "2", explanation: "17 minus (3 × 5) leaves a remainder of 2." },
    { code: "System.out.println(-9 / 4);", answer: "-2", explanation: "-2.25 truncates toward zero, to -2, not -3." },
    { code: "System.out.println(-9 % 4);", answer: "-1", explanation: "(-9 / 4) * 4 + (-9 % 4) must equal -9: (-2 * 4) + r = -9, so r = -1." },
  ],
  fillInCodeQuestions: [
    {
      prompt: "Complete the code so it prints how many full dozens are in `eggCount`, and how many eggs are left over.",
      code:
`int eggCount = 50;
int dozens = eggCount ____ 12;
int leftover = eggCount ____ 12;`,
      answer: "dozens = eggCount / 12;  leftover = eggCount % 12;",
    },
  ],
  codeOrderingActivity: {
    instructions: "Arrange these lines so the program correctly prints the number of whole $10 bills and the leftover change for a purchase of totalCents cents converted to dollars.",
    lines: [
      "System.out.println(bills + \" bills, \" + remainder + \" left over\");",
      "int totalDollars = totalCents / 100;",
      "int bills = totalDollars / 10;",
      "int remainder = totalDollars % 10;",
    ],
    correctOrder: [1, 2, 3, 0],
  },
  errorCorrectionActivity: {
    brokenCode:
`int secondsPerDay = 86400;
int hours = secondsPerDay / 60 / 60;
double averageHourFraction = hours / 24;
System.out.println(averageHourFraction);`,
    bug: "hours / 24 is int / int, so it truncates to 0 before ever becoming a double — averageHourFraction always prints 0.0 no matter the input.",
    fixedCode:
`int secondsPerDay = 86400;
int hours = secondsPerDay / 60 / 60;
double averageHourFraction = (double) hours / 24;
System.out.println(averageHourFraction);`,
  },
  shortCodingChallenge: {
    prompt:
      "Write a method secondsToClock(int totalSeconds) that returns a String formatted as \"H:MM:SS\" (minutes and seconds always show as two digits) representing totalSeconds converted into hours, minutes, and seconds.",
    starterCode:
`public static String secondsToClock(int totalSeconds) {
    // your code here
}`,
    sampleSolution:
`public static String secondsToClock(int totalSeconds) {
    int hours = totalSeconds / 3600;
    int minutes = (totalSeconds % 3600) / 60;
    int seconds = totalSeconds % 60;
    return hours + ":" + String.format("%02d", minutes) + ":" + String.format("%02d", seconds);
}`,
  },
  mcqMiniSet: [
    {
      prompt: "What is the value of expr after the following code runs?",
      code: "int expr = (13 / 4) + (13 % 4);",
      choices: [
        { label: "A", text: "3", correct: false, explanation: "That's just 13 / 4 alone (the quotient); the expression also adds the remainder." },
        { label: "B", text: "4", correct: true, explanation: "13 / 4 truncates to 3, and 13 % 4 is 1 (13 − 12). 3 + 1 = 4." },
        { label: "C", text: "13", correct: false, explanation: "(a / b) + (a % b) does not reconstruct a in general — that identity requires multiplying the quotient by b first: (a / b) * b + (a % b) == a." },
        { label: "D", text: "16", correct: false, explanation: "This would result from adding 13 and something, not from combining the quotient and remainder correctly." },
      ],
    },
  ],
  reflectionPrompts: [
    "Where did your prediction differ from Java's actual output, and why?",
    "Which rule — truncation direction, or the sign of %— would you have gotten wrong before this lesson?",
    "What real-world conversion (time, money, units) could you model with / and % together?",
  ],
  masteryCheck: [
    "I can predict the output of int / int division without running the code.",
    "I can predict the sign of a % b for negative a or negative b.",
    "I know where to place a cast to force floating-point division.",
    "I can combine / and % to decompose a total into units and a remainder.",
  ],
  summary:
    "Integer division truncates toward zero and discards the remainder; modulus recovers that remainder, with a sign that follows the dividend. Casting to double before dividing — not after — is what forces true floating-point division. This pairing shows up constantly in AP CSA problems that decompose a quantity into larger units and leftover amounts.",
  relatedReferenceLinks: [
    { label: "Reference: Arithmetic Operators", href: "/student/reference?entry=arithmetic-operators" },
    { label: "Reference: Casting", href: "/student/reference?entry=casting" },
  ],
  suggestedNextLesson: { label: "Variables, Assignment, and Casting", href: "/student/units/primitive-types/lessons/variables-and-casting" },
};
