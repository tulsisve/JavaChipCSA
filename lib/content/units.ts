export interface UnitContent {
  unitNumber: number;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  objectives: string[];
  vocabulary: { term: string; definition: string }[];
  commonMisconceptions: string[];
  commonCompilerErrors: { error: string; cause: string }[];
  commonLogicErrors: { error: string; cause: string }[];
  lessons: { slug: string; title: string; estimatedMinutes: number; built: boolean }[];
}

export const units: UnitContent[] = [
  {
    unitNumber: 1,
    slug: "primitive-types",
    title: "Primitive Types",
    description:
      "The arithmetic foundation of every Java program: how int, double, and boolean values are declared, stored, combined, and occasionally miscalculated.",
    estimatedMinutes: 240,
    objectives: [
      "Declare and initialize variables of type int, double, and boolean",
      "Evaluate arithmetic expressions using precedence and associativity rules",
      "Predict the result of integer division and the modulus operator",
      "Explain when and why Java performs implicit and explicit casting",
      "Identify numeric overflow and other common arithmetic errors",
    ],
    vocabulary: [
      { term: "variable", definition: "A named storage location holding a value of a declared type." },
      { term: "constant", definition: "A variable declared final; its value cannot be reassigned after initialization." },
      { term: "cast", definition: "An explicit conversion of a value from one type to another, e.g. (int) 4.7." },
      { term: "operator precedence", definition: "The order in which operators are evaluated within an expression." },
      { term: "overflow", definition: "What happens when a computed value exceeds the range its type can represent." },
    ],
    commonMisconceptions: [
      "\"7 / 2 gives 3.5\" — int division truncates toward zero and gives 3, not 3.5.",
      "\"Casting a double to int rounds it\" — casting truncates; it does not round.",
      "\"Math.random() can return 1.0\" — it returns a value in [0.0, 1.0), never including 1.0.",
    ],
    commonCompilerErrors: [
      { error: "incompatible types: possible lossy conversion from double to int", cause: "Assigning a double to an int variable without an explicit cast." },
      { error: "cannot find symbol", cause: "Using a variable before it has been declared, or a typo in its name." },
    ],
    commonLogicErrors: [
      { error: "Off-by-one totals", cause: "Forgetting that integer division discards the remainder in an average calculation." },
      { error: "Unexpected negative modulus", cause: "Forgetting that in Java, the sign of a % b follows the sign of a." },
    ],
    lessons: [
      { slug: "integer-division-and-modulus", title: "Integer Division and Modulus", estimatedMinutes: 25, built: true },
      { slug: "variables-and-casting", title: "Variables, Assignment, and Casting", estimatedMinutes: 20, built: false },
      { slug: "the-math-class", title: "The Math Class and Random Numbers", estimatedMinutes: 20, built: false },
    ],
  },
  {
    unitNumber: 2,
    slug: "using-objects",
    title: "Using Objects",
    description:
      "Working with existing classes: constructing objects, calling methods, and reasoning about String and Math behavior without writing a class from scratch yet.",
    estimatedMinutes: 210,
    objectives: [
      "Construct objects using the new keyword and a constructor call",
      "Distinguish between a reference and the object it refers to",
      "Call instance and static methods with correct syntax",
      "Use core String methods: length(), substring(), indexOf(), equals()",
      "Explain why == compares references while .equals() compares content",
    ],
    vocabulary: [
      { term: "object", definition: "A runtime instance of a class, allocated in memory and accessed via a reference." },
      { term: "constructor", definition: "A special method that initializes a newly created object." },
      { term: "reference", definition: "A variable that stores the memory location of an object, not the object itself." },
      { term: "alias", definition: "Two references pointing to the same object; changes through one are visible through the other." },
      { term: "null", definition: "A reference that points to no object." },
    ],
    commonMisconceptions: [
      "\"== always works for comparing values\" — for objects, == compares references, not content.",
      "\"Two String literals with the same text are never equal with ==\" — they usually are, due to string interning, but relying on this is a bug.",
    ],
    commonCompilerErrors: [
      { error: "cannot find symbol: method", cause: "Calling a method that doesn't exist on that type, or a typo in the method name." },
    ],
    commonLogicErrors: [
      { error: "NullPointerException", cause: "Calling a method on a reference that was never assigned an object." },
    ],
    lessons: [
      { slug: "constructing-objects", title: "Constructing and Using Objects", estimatedMinutes: 20, built: false },
      { slug: "comparing-strings-with-equals", title: "Comparing Strings with .equals()", estimatedMinutes: 20, built: false },
    ],
  },
  {
    unitNumber: 3,
    slug: "boolean-expressions-and-if-statements",
    title: "Boolean Expressions and If Statements",
    description:
      "Making decisions in code: relational and logical operators, De Morgan's laws, and how to structure conditionals that are correct and readable.",
    estimatedMinutes: 200,
    objectives: [
      "Evaluate compound Boolean expressions using &&, ||, and !",
      "Apply short-circuit evaluation to predict which operands execute",
      "Write if, if-else, and else-if chains for multi-way decisions",
      "Apply De Morgan's laws to simplify negated Boolean expressions",
    ],
    vocabulary: [
      { term: "short-circuit evaluation", definition: "Stopping evaluation of a Boolean expression as soon as the result is determined." },
      { term: "De Morgan's laws", definition: "Rules for distributing a negation over && and ||: !(a && b) == !a || !b." },
    ],
    commonMisconceptions: [
      "\"if (x = 5)\" is a common typo that compiles for boolean-incompatible types would fail, but for boolean variables assignment vs equality mistakes cause silent bugs in other languages — in Java this specific case is a compiler error, which the lesson uses as a teaching contrast.",
    ],
    commonCompilerErrors: [
      { error: "incompatible types: int cannot be converted to boolean", cause: "Using = instead of == inside an if condition." },
    ],
    commonLogicErrors: [
      { error: "Wrong branch taken", cause: "Reversing the condition of an if-else, or mishandling boundary values in a range check." },
    ],
    lessons: [
      { slug: "compound-boolean-expressions", title: "Compound Boolean Expressions", estimatedMinutes: 20, built: false },
      { slug: "if-else-chains", title: "If-Else Chains and Nested Conditionals", estimatedMinutes: 20, built: false },
    ],
  },
  {
    unitNumber: 4,
    slug: "iteration",
    title: "Iteration",
    description:
      "Repetition with while and for loops: tracing loop state, avoiding off-by-one and infinite loops, and building accumulator patterns.",
    estimatedMinutes: 230,
    objectives: [
      "Write and trace for loops and while loops",
      "Identify and fix off-by-one errors in loop bounds",
      "Build accumulator and counter patterns over a range or a String",
      "Recognize and avoid infinite loops",
    ],
    vocabulary: [
      { term: "accumulator", definition: "A variable that collects a running result (sum, count, product) across loop iterations." },
      { term: "sentinel value", definition: "A special input value that signals a loop to stop." },
    ],
    commonMisconceptions: [
      "\"for (int i = 0; i <= n; i++) is always safe\" — using <= instead of < is one of the most common sources of off-by-one/array-index errors.",
    ],
    commonCompilerErrors: [
      { error: "cannot find symbol (loop variable out of scope)", cause: "Referencing a for-loop's counter variable outside the loop body." },
    ],
    commonLogicErrors: [
      { error: "Infinite loop", cause: "Forgetting to update the loop's control variable inside the loop body." },
      { error: "Off-by-one total", cause: "Looping i <= n against a zero-indexed structure of length n." },
    ],
    lessons: [
      { slug: "writing-and-tracing-for-loops", title: "Writing and Tracing For Loops", estimatedMinutes: 25, built: false },
      { slug: "while-loops-and-sentinels", title: "While Loops and Sentinel Values", estimatedMinutes: 20, built: false },
    ],
  },
  {
    unitNumber: 5,
    slug: "writing-classes",
    title: "Writing Classes",
    description:
      "Designing your own classes: instance variables, constructors, accessors and mutators, encapsulation, and the static keyword.",
    estimatedMinutes: 240,
    objectives: [
      "Design a class with private instance variables and public accessor/mutator methods",
      "Write constructors that establish a valid initial object state",
      "Explain encapsulation and why fields are typically kept private",
      "Distinguish static members from instance members",
    ],
    vocabulary: [
      { term: "encapsulation", definition: "Bundling data with the methods that operate on it, and restricting direct access to that data." },
      { term: "this", definition: "A reference to the current object, used to disambiguate fields from parameters of the same name." },
    ],
    commonMisconceptions: [
      "\"Static methods can freely access instance fields\" — a static method has no implicit this, so it cannot reference instance fields directly.",
    ],
    commonCompilerErrors: [
      { error: "non-static variable this cannot be referenced from a static context", cause: "Accessing an instance field or calling an instance method from inside a static method." },
    ],
    commonLogicErrors: [
      { error: "Broken invariants", cause: "A mutator method that sets a field without validating it, leaving the object in an inconsistent state." },
    ],
    lessons: [
      { slug: "writing-complete-classes", title: "Writing Complete Java Classes", estimatedMinutes: 30, built: false },
      { slug: "encapsulation-and-static", title: "Encapsulation, this, and static", estimatedMinutes: 20, built: false },
    ],
  },
  {
    unitNumber: 6,
    slug: "arrays",
    title: "Array",
    description:
      "Fixed-size collections: declaring, constructing, traversing, and running classic array algorithms like search, min/max, and reversal.",
    estimatedMinutes: 210,
    objectives: [
      "Declare, construct, and initialize one-dimensional arrays",
      "Traverse arrays with both indexed and enhanced for loops",
      "Implement search, sum, min/max, and reversal algorithms",
      "Identify ArrayIndexOutOfBoundsException causes",
    ],
    vocabulary: [
      { term: "index", definition: "The zero-based position of an element within an array." },
      { term: "parallel arrays", definition: "Two or more arrays whose elements at the same index describe the same real-world entity." },
    ],
    commonMisconceptions: [
      "\"arr.length() gives the array size\" — length is a field on arrays, not a method; ArrayList uses .size() instead, and this mismatch is a leading source of syntax errors.",
    ],
    commonCompilerErrors: [
      { error: "cannot find symbol: method length()", cause: "Calling arr.length() instead of using the arr.length field." },
    ],
    commonLogicErrors: [
      { error: "ArrayIndexOutOfBoundsException", cause: "Looping with i <= arr.length instead of i < arr.length." },
    ],
    lessons: [
      { slug: "traversing-arrays", title: "Traversing Arrays", estimatedMinutes: 25, built: false },
      { slug: "array-algorithms", title: "Search, Min/Max, and Reversal", estimatedMinutes: 25, built: false },
    ],
  },
  {
    unitNumber: 7,
    slug: "arraylist",
    title: "ArrayList",
    description:
      "A resizable, generic alternative to arrays: adding, removing, and safely traversing an ArrayList, plus autoboxing between int and Integer.",
    estimatedMinutes: 200,
    objectives: [
      "Create and populate an ArrayList<E> using generics",
      "Add, remove, get, and set elements correctly",
      "Explain autoboxing and unboxing between primitives and wrapper classes",
      "Safely remove elements while traversing without skipping items",
    ],
    vocabulary: [
      { term: "generic type", definition: "A type parameter, like <Integer>, that specifies what an ArrayList holds." },
      { term: "autoboxing", definition: "Java's automatic conversion of a primitive (int) into its wrapper object (Integer)." },
    ],
    commonMisconceptions: [
      "\"You can removeIf while iterating with a for-each loop safely\" — removing during a for-each traversal throws ConcurrentModificationException; you must iterate backward with an indexed loop or use an Iterator.",
    ],
    commonCompilerErrors: [
      { error: "incompatible types: int cannot be converted to Integer (in some generic contexts)", cause: "Mixing raw primitive expectations with generic wrapper types incorrectly." },
    ],
    commonLogicErrors: [
      { error: "Skipped elements", cause: "Removing an element at index i inside a forward loop without decrementing i afterward." },
    ],
    lessons: [
      { slug: "arraylist-basics", title: "Creating and Traversing an ArrayList", estimatedMinutes: 20, built: false },
      { slug: "removing-during-traversal", title: "Removing Elements Safely", estimatedMinutes: 20, built: false },
    ],
  },
  {
    unitNumber: 8,
    slug: "2d-arrays",
    title: "2D Array",
    description:
      "Grids and matrices: row-major and column-major traversal, nested loops, and boundary-aware neighbor algorithms.",
    estimatedMinutes: 210,
    objectives: [
      "Declare, construct, and initialize a 2D array",
      "Traverse a 2D array in row-major and column-major order",
      "Sum rows, sum columns, and locate values within a grid",
      "Perform boundary checks in neighbor-based algorithms",
    ],
    vocabulary: [
      { term: "row-major order", definition: "Traversing a 2D array one full row at a time before moving to the next row." },
      { term: "ragged array", definition: "A 2D array whose rows are not all the same length." },
    ],
    commonMisconceptions: [
      "\"grid[row][col] and grid[col][row] are interchangeable\" — swapping the indices silently transposes the access pattern, a frequent source of logic errors.",
    ],
    commonCompilerErrors: [
      { error: "array required, but int found", cause: "Indexing a 1D array as if it were 2D, e.g. arr[i][j] on an int[]." },
    ],
    commonLogicErrors: [
      { error: "ArrayIndexOutOfBoundsException at a grid edge", cause: "A neighbor-checking algorithm that doesn't test row/column bounds before accessing grid[row][col]." },
    ],
    lessons: [
      { slug: "2d-array-traversal", title: "Row-Major and Column-Major Traversal", estimatedMinutes: 25, built: false },
      { slug: "grid-neighbor-algorithms", title: "Grid and Neighbor Algorithms", estimatedMinutes: 25, built: false },
    ],
  },
  {
    unitNumber: 9,
    slug: "inheritance",
    title: "Inheritance",
    description:
      "Building class hierarchies with extends, overriding methods, and understanding polymorphism through dynamic method dispatch.",
    estimatedMinutes: 220,
    objectives: [
      "Create subclasses using extends and call superclass constructors with super",
      "Override inherited methods and understand dynamic method dispatch",
      "Explain is-a relationships and when to use polymorphism",
      "Cast between reference types safely",
    ],
    vocabulary: [
      { term: "polymorphism", definition: "The ability of a reference of a superclass type to invoke overridden behavior defined in a subclass." },
      { term: "dynamic method dispatch", definition: "Java's rule that an overridden method call resolves to the object's actual runtime type, not its declared reference type." },
    ],
    commonMisconceptions: [
      "\"Overloading and overriding are the same thing\" — overriding replaces inherited behavior with an identical signature; overloading defines a new method with a different parameter list.",
    ],
    commonCompilerErrors: [
      { error: "method does not override or implement a method from a supertype", cause: "An @Override method whose signature doesn't actually match the superclass method." },
    ],
    commonLogicErrors: [
      { error: "Wrong method called", cause: "Assuming a field (not a method) is polymorphic — fields are not dynamically dispatched in Java, only methods are." },
    ],
    lessons: [
      { slug: "understanding-polymorphism", title: "Understanding Polymorphism", estimatedMinutes: 25, built: false },
      { slug: "extends-and-super", title: "extends, super, and Constructor Chaining", estimatedMinutes: 20, built: false },
    ],
  },
  {
    unitNumber: 10,
    slug: "recursion",
    title: "Recursion",
    description:
      "Methods that call themselves: base cases, recursive cases, tracing the call stack, and comparing recursion to iteration.",
    estimatedMinutes: 210,
    objectives: [
      "Identify the base case and recursive case of a recursive method",
      "Trace a recursive method's call stack by hand",
      "Write recursive methods over numbers, Strings, and arrays",
      "Recognize missing or incorrect base cases as a source of infinite recursion",
    ],
    vocabulary: [
      { term: "base case", definition: "The condition under which a recursive method returns directly without calling itself again." },
      { term: "call stack", definition: "The stack of in-progress method calls, each waiting on the recursive call beneath it to return." },
    ],
    commonMisconceptions: [
      "\"Recursion is always less efficient than iteration\" — it depends on the problem; some recursive definitions (like tree traversal) are dramatically clearer and comparably efficient.",
    ],
    commonCompilerErrors: [
      { error: "missing return statement", cause: "A recursive method with a non-void return type that doesn't return along every path." },
    ],
    commonLogicErrors: [
      { error: "StackOverflowError", cause: "A missing base case, or a recursive call that doesn't make progress toward the base case." },
    ],
    lessons: [
      { slug: "tracing-recursive-methods", title: "Tracing Recursive Methods", estimatedMinutes: 25, built: false },
      { slug: "recursion-on-arrays-and-strings", title: "Recursion on Arrays and Strings", estimatedMinutes: 25, built: false },
    ],
  },
];

export function getUnitBySlug(slug: string) {
  return units.find((u) => u.slug === slug);
}
