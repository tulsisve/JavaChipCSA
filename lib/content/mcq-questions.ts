import type { DifficultyLevel } from "@/types/database";

export interface McqChoice {
  label: "A" | "B" | "C" | "D";
  text: string;
  correct: boolean;
  explanation: string;
}

export interface McqQuestion {
  id: string;
  unitSlug: string;
  topic: string;
  prompt: string;
  code?: string;
  choices: McqChoice[];
  difficulty: DifficultyLevel;
  estimatedSeconds: number;
  skillsTested: string[];
  commonMisconception?: string;
  hint?: string;
}

export const mcqQuestions: McqQuestion[] = [
  {
    id: "mcq-precedence-1",
    unitSlug: "primitive-types",
    topic: "Operator precedence",
    prompt: "What is printed?",
    code: "int result = 5 + 3 * 2;\nSystem.out.println(result);",
    choices: [
      { label: "A", text: "16", correct: false, explanation: "This would be the result only if + were evaluated before *, which is not Java's precedence." },
      { label: "B", text: "11", correct: true, explanation: "* has higher precedence than +, so 3 * 2 evaluates first (6), then 5 + 6 = 11." },
      { label: "C", text: "13", correct: false, explanation: "This doesn't correspond to any valid evaluation order of this expression." },
      { label: "D", text: "10", correct: false, explanation: "This would require dropping a term entirely." },
    ],
    difficulty: "easy",
    estimatedSeconds: 45,
    skillsTested: ["operator precedence"],
    commonMisconception: "Evaluating strictly left to right instead of respecting operator precedence.",
  },
  {
    id: "mcq-int-division-modulus",
    unitSlug: "primitive-types",
    topic: "Integer division and modulus",
    prompt: "What is printed?",
    code: "int x = 7;\nint y = 2;\nSystem.out.println(x / y + x % y);",
    choices: [
      { label: "A", text: "3", correct: false, explanation: "This is only x / y; the expression also adds x % y." },
      { label: "B", text: "4", correct: true, explanation: "x / y truncates to 3, and x % y is 1, so 3 + 1 = 4." },
      { label: "C", text: "3.5", correct: false, explanation: "int / int never produces a fractional result in Java." },
      { label: "D", text: "1", correct: false, explanation: "This is only x % y, ignoring the quotient term." },
    ],
    difficulty: "easy",
    estimatedSeconds: 50,
    skillsTested: ["integer division", "modulus"],
  },
  {
    id: "mcq-cast-placement",
    unitSlug: "primitive-types",
    topic: "Casting",
    prompt: "What is printed?",
    code: "double d = (double) 9 / 4;\nSystem.out.println(d);",
    choices: [
      { label: "A", text: "2.25", correct: true, explanation: "Casting 9 to double before dividing forces floating-point division: 9.0 / 4 = 2.25." },
      { label: "B", text: "2.0", correct: false, explanation: "This would be the result of (double) (9 / 4) — casting AFTER integer division already truncated the value." },
      { label: "C", text: "2", correct: false, explanation: "A double variable always prints with a decimal point in Java, so a bare 2 is not valid output for this type." },
      { label: "D", text: "2.5", correct: false, explanation: "9 / 4 is not 2.5; that would be the result of 10 / 4." },
    ],
    difficulty: "medium",
    estimatedSeconds: 60,
    skillsTested: ["casting", "integer division"],
    commonMisconception: "Believing (double) (9 / 4) and (double) 9 / 4 are equivalent because both involve a cast and a division.",
  },
  {
    id: "mcq-string-reference-equality",
    unitSlug: "using-objects",
    topic: "Object references",
    prompt: "What is printed?",
    code: 'String s1 = "cat";\nString s2 = new String("cat");\nSystem.out.println(s1 == s2);',
    choices: [
      { label: "A", text: "true", correct: false, explanation: "== compares references, and new String(\"cat\") deliberately creates a distinct object from the interned literal \"cat\"." },
      { label: "B", text: "false", correct: true, explanation: "s1 and s2 refer to two different String objects in memory, even though their contents are identical, so == (reference comparison) is false." },
      { label: "C", text: "It does not compile.", correct: false, explanation: "This is valid Java; == is legal (if often misleading) on any two reference types." },
      { label: "D", text: "It throws a runtime exception.", correct: false, explanation: "Comparing references with == never throws; it simply returns true or false." },
    ],
    difficulty: "medium",
    estimatedSeconds: 60,
    skillsTested: ["object references", "string comparison"],
    commonMisconception: "Assuming == compares String content the way .equals() does.",
    hint: "Ask what == actually compares for object types, not primitive types.",
  },
  {
    id: "mcq-this-keyword",
    unitSlug: "writing-classes",
    topic: "this keyword",
    prompt:
      "In the method below, the parameter is named x, the same as the instance field. What would happen if this.x = x; were replaced with x = x;?",
    code: "public void setX(int x) {\n    this.x = x;\n}",
    choices: [
      { label: "A", text: "The instance field x would be updated correctly, exactly as before.", correct: false, explanation: "Without this, x on the left refers to the local parameter, not the field." },
      { label: "B", text: "The parameter would be assigned to itself, and the instance field would remain unchanged.", correct: true, explanation: "Inside the method body, an unqualified x refers to the parameter (it shadows the field), so x = x; is a no-op on the field." },
      { label: "C", text: "The code would fail to compile.", correct: false, explanation: "x = x; is legal Java, just logically useless here — it compiles without error." },
      { label: "D", text: "A NullPointerException would be thrown at runtime.", correct: false, explanation: "No object is being dereferenced in a way that could throw NPE here." },
    ],
    difficulty: "medium",
    estimatedSeconds: 60,
    skillsTested: ["this keyword", "scope"],
    commonMisconception: "Assuming Java always knows you mean the field when a parameter shares its name.",
  },
  {
    id: "mcq-short-circuit",
    unitSlug: "boolean-expressions-and-if-statements",
    topic: "Short-circuit evaluation",
    prompt: "What is the value of result when x is 0, and why doesn't this code throw an exception?",
    code: "int x = 0;\nboolean result = (x != 0) && (10 / x > 1);",
    choices: [
      { label: "A", text: "result is false; && short-circuits after (x != 0) is false, so 10 / x is never evaluated.", correct: true, explanation: "Because the left operand of && is false, Java skips evaluating the right operand entirely, avoiding the division by zero." },
      { label: "B", text: "result is true; Java evaluates both sides regardless.", correct: false, explanation: "&& in Java is short-circuiting; it does not always evaluate both operands." },
      { label: "C", text: "The code throws an ArithmeticException.", correct: false, explanation: "The division 10 / x is never reached because of short-circuit evaluation." },
      { label: "D", text: "result is false, but only because 10 / x evaluates to a value less than 1.", correct: false, explanation: "10 / x is never evaluated at all in this trace — the short-circuit happens first." },
    ],
    difficulty: "medium",
    estimatedSeconds: 75,
    skillsTested: ["short-circuit evaluation", "boolean expressions"],
    commonMisconception: "Believing Java always evaluates every operand of a Boolean expression.",
  },
  {
    id: "mcq-de-morgans",
    unitSlug: "boolean-expressions-and-if-statements",
    topic: "De Morgan's laws",
    prompt: "Which expression is logically equivalent to !(a || b)?",
    choices: [
      { label: "A", text: "!a || !b", correct: false, explanation: "This is the equivalent of !(a && b), not !(a || b)." },
      { label: "B", text: "!a && !b", correct: true, explanation: "De Morgan's law: negating an || distributes the negation and flips it to &&." },
      { label: "C", text: "a && b", correct: false, explanation: "This has no negations at all and is not equivalent." },
      { label: "D", text: "!(a && b)", correct: false, explanation: "This is a different expression, equivalent to !a || !b, not to !(a || b)." },
    ],
    difficulty: "medium",
    estimatedSeconds: 50,
    skillsTested: ["De Morgan's laws", "boolean simplification"],
  },
  {
    id: "mcq-loop-trace-sum",
    unitSlug: "iteration",
    topic: "Loop tracing",
    prompt: "What is printed?",
    code: "int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum);",
    choices: [
      { label: "A", text: "10", correct: false, explanation: "This would be the sum of 1 through 4, missing the final iteration where i is 5." },
      { label: "B", text: "15", correct: true, explanation: "The loop adds 1 + 2 + 3 + 4 + 5, which totals 15." },
      { label: "C", text: "20", correct: false, explanation: "This overcounts — it's not the sum produced by this loop's bounds." },
      { label: "D", text: "5", correct: false, explanation: "This is only the final value of i, not the accumulated sum." },
    ],
    difficulty: "easy",
    estimatedSeconds: 50,
    skillsTested: ["loop tracing", "accumulators"],
  },
  {
    id: "mcq-off-by-one",
    unitSlug: "iteration",
    topic: "Off-by-one errors",
    prompt: "What happens when this loop runs on an array arr of length 5?",
    code: "for (int i = 0; i <= arr.length; i++) {\n    System.out.println(arr[i]);\n}",
    choices: [
      { label: "A", text: "It prints all 5 elements and stops normally.", correct: false, explanation: "The loop attempts one iteration too many, at i == arr.length." },
      { label: "B", text: "It throws ArrayIndexOutOfBoundsException on the final iteration.", correct: true, explanation: "When i equals arr.length (5), arr[5] is out of bounds for a length-5 array (valid indices are 0–4)." },
      { label: "C", text: "It silently skips the invalid index and continues.", correct: false, explanation: "Java does not silently skip invalid array accesses — it throws an exception immediately." },
      { label: "D", text: "It fails to compile.", correct: false, explanation: "This code is syntactically valid; the error occurs at runtime, not compile time." },
    ],
    difficulty: "easy",
    estimatedSeconds: 55,
    skillsTested: ["array indexing", "off-by-one errors"],
    commonMisconception: "Using <= instead of < when the bound is a length rather than a maximum valid index.",
  },
  {
    id: "mcq-static-vs-instance",
    unitSlug: "writing-classes",
    topic: "Static vs instance",
    prompt: "Which method can be called without first creating an instance of its class?",
    code: "public class MathHelper {\n    public static int square(int n) { return n * n; }\n    public int cube(int n) { return n * n * n; }\n}",
    choices: [
      { label: "A", text: "square, via MathHelper.square(4)", correct: true, explanation: "static methods belong to the class itself and can be invoked without an object." },
      { label: "B", text: "cube, via MathHelper.cube(4)", correct: false, explanation: "cube is an instance method; calling it this way without an object reference does not compile." },
      { label: "C", text: "Both methods work identically either way.", correct: false, explanation: "Instance methods require an object; only static methods can be called through the class name alone." },
      { label: "D", text: "Neither method can be called without an object.", correct: false, explanation: "square explicitly can, because it is declared static." },
    ],
    difficulty: "medium",
    estimatedSeconds: 55,
    skillsTested: ["static methods", "instance methods"],
  },
  {
    id: "mcq-array-max-trace",
    unitSlug: "arrays",
    topic: "Array algorithms",
    prompt: "What is the value of max after this code runs?",
    code: "int[] arr = {3, 1, 4, 1, 5};\nint max = arr[0];\nfor (int i = 1; i < arr.length; i++) {\n    if (arr[i] > max) {\n        max = arr[i];\n    }\n}",
    choices: [
      { label: "A", text: "3", correct: false, explanation: "This is only the initial value of max, before the loop finds a larger element." },
      { label: "B", text: "4", correct: false, explanation: "4 is replaced once the loop reaches the element 5 later in the array." },
      { label: "C", text: "5", correct: true, explanation: "The loop updates max each time it finds a larger element; 5 is the largest value in the array." },
      { label: "D", text: "1", correct: false, explanation: "1 is never greater than the running max at any point in the trace." },
    ],
    difficulty: "easy",
    estimatedSeconds: 60,
    skillsTested: ["array traversal", "finding maximum"],
  },
  {
    id: "mcq-arraylist-remove-overload",
    unitSlug: "arraylist",
    topic: "ArrayList removal",
    prompt: "What does list.remove(1) do here?",
    code: "ArrayList<Integer> list = new ArrayList<>();\nlist.add(10);\nlist.add(20);\nlist.add(30);\nlist.remove(1);",
    choices: [
      { label: "A", text: "It removes the value 20, because remove(int) removes by index and index 1 holds 20.", correct: true, explanation: "remove(int index) is the index-based overload; index 1 in [10, 20, 30] holds the value 20." },
      { label: "B", text: "It removes the value 1, searching the list for that value.", correct: false, explanation: "That behavior belongs to remove(Object o), not remove(int), and 1 isn't even in this list." },
      { label: "C", text: "It throws an exception because 1 is ambiguous.", correct: false, explanation: "Java resolves remove(1) to the int overload unambiguously, since 1 is a primitive int literal." },
      { label: "D", text: "It removes the last element regardless of the argument.", correct: false, explanation: "The argument specifically determines which index is removed." },
    ],
    difficulty: "hard",
    estimatedSeconds: 75,
    skillsTested: ["ArrayList removal", "method overloading"],
    commonMisconception: "Assuming remove(1) always means \"remove the value 1\" rather than \"remove index 1\".",
  },
  {
    id: "mcq-concurrent-modification",
    unitSlug: "arraylist",
    topic: "Removing during traversal",
    prompt: "What happens when this code runs?",
    code: 'ArrayList<String> names = new ArrayList<>(List.of("Ada", "Al", "Bo"));\nfor (String name : names) {\n    if (name.startsWith("A")) {\n        names.remove(name);\n    }\n}',
    choices: [
      { label: "A", text: "It removes both \"Ada\" and \"Al\" successfully.", correct: false, explanation: "The loop throws before it can finish; a for-each loop cannot safely mutate the list it's iterating over." },
      { label: "B", text: "It throws a ConcurrentModificationException.", correct: true, explanation: "Modifying an ArrayList's structure during a for-each loop invalidates the iterator's internal state, which Java detects and reports as this exception." },
      { label: "C", text: "It compiles but silently does nothing.", correct: false, explanation: "The removal attempt actively throws at runtime rather than silently no-op-ing." },
      { label: "D", text: "It fails to compile.", correct: false, explanation: "This code is syntactically valid Java; the failure happens at runtime." },
    ],
    difficulty: "hard",
    estimatedSeconds: 70,
    skillsTested: ["ArrayList removal", "iteration"],
  },
  {
    id: "mcq-2d-array-sum",
    unitSlug: "2d-arrays",
    topic: "2D array traversal",
    prompt: "What is printed?",
    code: "int[][] grid = {{1, 2}, {3, 4}};\nint total = 0;\nfor (int row = 0; row < grid.length; row++) {\n    for (int col = 0; col < grid[row].length; col++) {\n        total += grid[row][col];\n    }\n}\nSystem.out.println(total);",
    choices: [
      { label: "A", text: "7", correct: false, explanation: "This omits one of the four elements from the sum." },
      { label: "B", text: "10", correct: true, explanation: "1 + 2 + 3 + 4 = 10, summed across both rows." },
      { label: "C", text: "4", correct: false, explanation: "This is only the count of elements, not their sum." },
      { label: "D", text: "24", correct: false, explanation: "This would result from multiplying rather than summing the elements." },
    ],
    difficulty: "medium",
    estimatedSeconds: 65,
    skillsTested: ["2D array traversal", "nested loops"],
  },
  {
    id: "mcq-2d-boundary-check",
    unitSlug: "2d-arrays",
    topic: "Boundary checks",
    prompt: "Why does this code risk an ArrayIndexOutOfBoundsException when row is 0?",
    code: "int above = grid[row - 1][col];",
    choices: [
      { label: "A", text: "row - 1 becomes -1, which is not a valid array index.", correct: true, explanation: "When row is 0, row - 1 is -1; negative indices are always invalid in Java arrays." },
      { label: "B", text: "grid itself is null in this case.", correct: false, explanation: "Nothing in this snippet suggests grid is null — the issue is purely the computed index." },
      { label: "C", text: "col could be out of range instead.", correct: false, explanation: "The question specifically concerns the case where row is 0; col isn't implicated by that condition." },
      { label: "D", text: "This code cannot throw an exception.", correct: false, explanation: "It absolutely can, and will, when row is 0 and no bounds check guards the access." },
    ],
    difficulty: "medium",
    estimatedSeconds: 55,
    skillsTested: ["2D arrays", "boundary conditions"],
  },
  {
    id: "mcq-polymorphism-dispatch",
    unitSlug: "inheritance",
    topic: "Polymorphism",
    prompt: "What is printed?",
    code:
      'class Animal {\n    public String speak() { return "..."; }\n}\nclass Dog extends Animal {\n    public String speak() { return "Woof"; }\n}\n\nAnimal a = new Dog();\nSystem.out.println(a.speak());',
    choices: [
      { label: "A", text: "...", correct: false, explanation: "This would only print if Java resolved speak() based on the declared type (Animal), which it does not." },
      { label: "B", text: "Woof", correct: true, explanation: "Dynamic method dispatch resolves speak() based on the object's actual runtime type (Dog), not the reference's declared type (Animal)." },
      { label: "C", text: "It does not compile.", correct: false, explanation: "Assigning a Dog to an Animal reference is legal, since Dog is a subclass of Animal." },
      { label: "D", text: "It throws a ClassCastException.", correct: false, explanation: "No cast is happening here at all — this is a plain upcast assignment, which is always safe." },
    ],
    difficulty: "medium",
    estimatedSeconds: 65,
    skillsTested: ["polymorphism", "dynamic method dispatch"],
    commonMisconception: "Believing the compile-time (declared) type determines which overridden method runs.",
  },
  {
    id: "mcq-overload-vs-override",
    unitSlug: "inheritance",
    topic: "Overriding vs overloading",
    prompt: "A subclass defines public String speak(String tone) while the superclass defines public String speak(). What is this an example of?",
    choices: [
      { label: "A", text: "Overriding, since the method name matches.", correct: false, explanation: "Overriding requires an identical parameter list; a different parameter list makes this a distinct method instead." },
      { label: "B", text: "Overloading, since the parameter list differs from the superclass version.", correct: true, explanation: "Same name, different parameters, in the same or a related class — that's overloading, not overriding." },
      { label: "C", text: "A compiler error, since the superclass already defines speak.", correct: false, explanation: "This is legal; the subclass simply gains an additional speak method alongside the inherited one." },
      { label: "D", text: "Constructor chaining.", correct: false, explanation: "Constructor chaining refers to constructors calling other constructors via this() or super(), unrelated to this scenario." },
    ],
    difficulty: "medium",
    estimatedSeconds: 60,
    skillsTested: ["overriding vs overloading"],
  },
  {
    id: "mcq-recursion-trace",
    unitSlug: "recursion",
    topic: "Recursion tracing",
    prompt: "What is the value of mystery(4)?",
    code: "public static int mystery(int n) {\n    if (n <= 0) {\n        return 0;\n    }\n    return n + mystery(n - 1);\n}",
    choices: [
      { label: "A", text: "4", correct: false, explanation: "This is only the first term added; the recursion continues accumulating further terms." },
      { label: "B", text: "10", correct: true, explanation: "mystery(4) = 4 + mystery(3) = 4 + 3 + mystery(2) = ... = 4 + 3 + 2 + 1 + 0 = 10." },
      { label: "C", text: "24", correct: false, explanation: "24 would result from multiplying 4 × 3 × 2 × 1, which is a factorial pattern, not this summing pattern." },
      { label: "D", text: "0", correct: false, explanation: "0 is only the base case's return value, reached at the bottom of the recursion, not the final accumulated result." },
    ],
    difficulty: "hard",
    estimatedSeconds: 80,
    skillsTested: ["recursion tracing", "base case", "call stack"],
  },
  {
    id: "mcq-missing-base-case",
    unitSlug: "recursion",
    topic: "Missing base cases",
    prompt: "What happens when countDown(5) is called?",
    code: "public static void countDown(int n) {\n    System.out.println(n);\n    countDown(n - 1);\n}",
    choices: [
      { label: "A", text: "It prints 5, 4, 3, 2, 1 and stops.", correct: false, explanation: "There is no base case to stop the recursion at 1 or 0 — it keeps calling itself indefinitely." },
      { label: "B", text: "It prints decreasing numbers forever (in principle) and eventually throws a StackOverflowError.", correct: true, explanation: "Without a base case, each call adds another frame to the call stack until the stack's limited memory is exhausted." },
      { label: "C", text: "It fails to compile because there is no return statement.", correct: false, explanation: "The method is void, so it needs no return statement — this compiles fine." },
      { label: "D", text: "It runs once and returns silently.", correct: false, explanation: "The method calls itself unconditionally at the end, so it does not simply run once." },
    ],
    difficulty: "medium",
    estimatedSeconds: 60,
    skillsTested: ["recursion", "base case", "StackOverflowError"],
    commonMisconception: "Assuming recursive calls stop on their own once numbers 'look done', without an explicit base case.",
  },
  {
    id: "mcq-array-reverse",
    unitSlug: "arrays",
    topic: "Array algorithms",
    prompt: "After this code runs, what is arr[0]?",
    code: "int[] arr = {2, 4, 6, 8};\nfor (int i = 0; i < arr.length / 2; i++) {\n    int temp = arr[i];\n    arr[i] = arr[arr.length - 1 - i];\n    arr[arr.length - 1 - i] = temp;\n}",
    choices: [
      { label: "A", text: "2", correct: false, explanation: "That was the original value at index 0, before the swap loop ran." },
      { label: "B", text: "8", correct: true, explanation: "This is the standard in-place reversal pattern; index 0 ends up swapped with the original last element, 8." },
      { label: "C", text: "6", correct: false, explanation: "6 ends up at index 1 after reversal, not index 0." },
      { label: "D", text: "4", correct: false, explanation: "4 ends up at index 2 after reversal, not index 0." },
    ],
    difficulty: "medium",
    estimatedSeconds: 70,
    skillsTested: ["array algorithms", "reversing"],
  },
];

export function mcqsForUnit(unitSlug: string) {
  return mcqQuestions.filter((q) => q.unitSlug === unitSlug);
}
