export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirementType: string;
  requirementValue: number;
}

export const badgeDefinitions: BadgeDefinition[] = [
  { id: "loop-cartographer", name: "Loop Cartographer", description: "Traced 25 loops to completion without a tracing error.", icon: "map", requirementType: "loop_traces_correct", requirementValue: 25 },
  { id: "boolean-logician", name: "Boolean Logician", description: "Mastered compound Boolean expressions and De Morgan's laws.", icon: "toggle-left", requirementType: "unit_mastery", requirementValue: 3 },
  { id: "array-archivist", name: "Array Archivist", description: "Completed every array algorithm drill in the Syntax Café.", icon: "layout-grid", requirementType: "drills_completed_topic", requirementValue: 100 },
  { id: "class-architect", name: "Class Architect", description: "Wrote 10 complete, correctly encapsulated classes.", icon: "building-2", requirementType: "classes_written", requirementValue: 10 },
  { id: "recursion-scholar", name: "Recursion Scholar", description: "Correctly traced 15 recursive call stacks.", icon: "repeat", requirementType: "recursion_traces_correct", requirementValue: 15 },
  { id: "syntax-sommelier", name: "Syntax Sommelier", description: "Reached a 7-day Syntax Café streak.", icon: "flame", requirementType: "streak_days", requirementValue: 7 },
  { id: "frq-analyst", name: "FRQ Analyst", description: "Completed the rubric review stage on 10 FRQs.", icon: "clipboard-check", requirementType: "frq_rubric_reviews", requirementValue: 10 },
  { id: "method-master", name: "Method Master", description: "Passed 20 method-header drills without a hint.", icon: "square-code", requirementType: "method_header_drills", requirementValue: 20 },
  { id: "debugging-detective", name: "Debugging Detective", description: "Correctly identified and fixed 20 logic errors.", icon: "search", requirementType: "error_corrections", requirementValue: 20 },
  { id: "polymorphism-professional", name: "Polymorphism Professional", description: "Reached Strong mastery in the Inheritance unit.", icon: "shuffle", requirementType: "unit_mastery_level", requirementValue: 5 },
  { id: "reference-wrangler", name: "Reference Wrangler", description: "Bookmarked and reviewed 15 Java Reference Library entries.", icon: "bookmark", requirementType: "reference_bookmarks", requirementValue: 15 },
  { id: "two-dimensional-thinker", name: "Two-Dimensional Thinker", description: "Completed every 2D array drill and MCQ.", icon: "grid-3x3", requirementType: "unit_completed", requirementValue: 8 },
];
