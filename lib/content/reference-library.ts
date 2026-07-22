export interface ReferenceEntry {
  id: string;
  category: string;
  name: string;
  definition: string;
  syntax: string;
  example: string;
  lineByLine: string;
  commonMistake: string;
  relatedLessonHref?: string;
  relatedDrillId?: string;
}

export const referenceEntries: ReferenceEntry[] = [
  {
    id: "arithmetic-operators",
    category: "Primitive Types",
    name: "Arithmetic Operators",
    definition: "The operators +, -, *, /, and % combine numeric operands. / and % behave differently for integer vs. floating-point operands.",
    syntax: "a + b   a - b   a * b   a / b   a % b",
    example: "int quotient = 17 / 5;   // 3\nint remainder = 17 % 5;  // 2",
    lineByLine: "17 / 5 truncates toward zero to 3. 17 % 5 is the remainder after removing 3 full 5's from 17, which is 2.",
    commonMistake: "Expecting int / int to produce a decimal result.",
    relatedLessonHref: "/student/units/primitive-types/lessons/integer-division-and-modulus",
    relatedDrillId: "modulus-expression",
  },
  {
    id: "casting",
    category: "Primitive Types",
    name: "Casting",
    definition: "An explicit conversion of a value from one type to another, written as (type) value.",
    syntax: "(int) doubleValue\n(double) intValue",
    example: "double price = 4.75;\nint dollars = (int) price;  // 4, not rounded",
    lineByLine: "(int) price truncates the decimal portion of 4.75, discarding .75 entirely rather than rounding to 5.",
    commonMistake: "Assuming a cast rounds to the nearest value instead of truncating.",
    relatedLessonHref: "/student/units/primitive-types/lessons/integer-division-and-modulus",
    relatedDrillId: "cast-double-to-int",
  },
  {
    id: "string-methods",
    category: "Using Objects",
    name: "Core String Methods",
    definition: "String provides methods for inspecting and deriving new Strings: length(), substring(), indexOf(), equals(), and more. Strings are immutable — these methods never modify the original String.",
    syntax: 'str.length()\nstr.substring(start, end)\nstr.indexOf(target)\nstr.equals(other)',
    example: 'String word = "computer";\nint len = word.length();       // 8\nString sub = word.substring(0, 4); // "comp"',
    lineByLine: "length() counts characters. substring(0, 4) returns characters at indices 0 through 3 — the end index is exclusive.",
    commonMistake: "Using == instead of .equals() to compare String content.",
    relatedDrillId: "equals-vs-double-equals",
  },
  {
    id: "for-loop-template",
    category: "Iteration",
    name: "For Loop",
    definition: "A loop with an initialization, condition, and update clause, ideal when the number of iterations is known in advance.",
    syntax: "for (int i = 0; i < n; i++) {\n    // body\n}",
    example: "for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n// prints 0 1 2 3 4",
    lineByLine: "i starts at 0, the loop runs while i < 5, and i increments after each iteration — 5 total iterations, indices 0–4.",
    commonMistake: "Using <= n instead of < n, causing one extra iteration.",
    relatedDrillId: "for-loop-basic",
  },
  {
    id: "arraylist-methods",
    category: "ArrayList",
    name: "Core ArrayList Methods",
    definition: "ArrayList<E> supports add, remove, get, set, and size for managing a resizable, generically-typed collection.",
    syntax: "list.add(value)\nlist.get(index)\nlist.set(index, value)\nlist.remove(index)\nlist.size()",
    example: 'ArrayList<String> names = new ArrayList<>();\nnames.add("Ada");\nnames.add("Al");\nnames.remove(0);\n// names is now ["Al"]',
    lineByLine: "add appends to the end. remove(0) removes by index, shifting subsequent elements left by one.",
    commonMistake: "Confusing remove(int index) with remove(Object o) — remove(1) removes the element at index 1, not the value 1.",
    relatedDrillId: "arraylist-add-remove",
  },
  {
    id: "inheritance-template",
    category: "Inheritance",
    name: "extends and super",
    definition: "A subclass inherits fields and methods from its superclass using extends, and can call the superclass's constructor or methods using super.",
    syntax: "public class Dog extends Animal {\n    public Dog(String name) {\n        super(name);\n    }\n}",
    example: "class Animal {\n    protected String name;\n    public Animal(String name) { this.name = name; }\n}\nclass Dog extends Animal {\n    public Dog(String name) { super(name); }\n}",
    lineByLine: "super(name) calls Animal's constructor, initializing the inherited name field before Dog's own constructor body runs.",
    commonMistake: "Forgetting that super(...) must be the first statement in a subclass constructor.",
    relatedLessonHref: "/student/units/inheritance/lessons/understanding-polymorphism",
  },
  {
    id: "runtime-errors",
    category: "Errors",
    name: "Common Runtime Errors",
    definition: "Exceptions thrown while a program executes, as opposed to compiler errors caught before the program runs.",
    syntax: "NullPointerException\nArrayIndexOutOfBoundsException\nArithmeticException\nClassCastException",
    example: "int[] arr = new int[3];\nSystem.out.println(arr[5]); // ArrayIndexOutOfBoundsException",
    lineByLine: "arr has valid indices 0–2; index 5 is out of range, so the JVM throws an exception instead of returning a value.",
    commonMistake: "Confusing a runtime exception with a compiler error — this code compiles fine and fails only when it executes.",
  },
];

export function searchReferenceEntries(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return referenceEntries;
  return referenceEntries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.definition.toLowerCase().includes(q)
  );
}
