import "server-only";

export interface TestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean | "unknown";
  detail: string;
}

export interface ExecutionResult {
  mode: "simulated" | "sandboxed";
  compiled: boolean;
  results: TestCaseResult[];
  note: string;
}

/**
 * JavaChip never compiles or executes untrusted Java inside this app
 * server — that would let any student run arbitrary code on infrastructure
 * shared with everyone else's data.
 *
 * In production, point JAVA_EXECUTION_SERVICE_URL at a sandboxed judge
 * service: an isolated container per run, strict CPU/memory/wall-clock
 * limits, no network access, and input validation on both the submitted
 * source and the test-case payloads. This module is that integration
 * point — swap runSimulatedCheck() below for a call to that service.
 *
 * Until a service is configured, structural checks are all this module
 * performs, and every result is clearly labeled "simulated" rather than
 * presented as a real compile/run outcome.
 */
export async function runStructuralCheck(code: string, methodName: string, testCases: TestCase[]): Promise<ExecutionResult> {
  const serviceUrl = process.env.JAVA_EXECUTION_SERVICE_URL;

  if (serviceUrl) {
    // Integration point for a real sandboxed execution service.
    // Expected contract: POST { code, testCases } -> ExecutionResult (mode: "sandboxed").
    // Left unimplemented here — wire up your judge service's client below.
    throw new Error("JAVA_EXECUTION_SERVICE_URL is set, but no client is implemented yet. See lib/code-execution/index.ts.");
  }

  return runSimulatedCheck(code, methodName, testCases);
}

function runSimulatedCheck(code: string, methodName: string, testCases: TestCase[]): ExecutionResult {
  const hasMethod = code.includes(methodName);
  const hasReturn = /\breturn\b/.test(code);
  const hasBraces = (code.match(/\{/g)?.length ?? 0) === (code.match(/\}/g)?.length ?? 0) && code.includes("{");

  const compiled = hasMethod && hasBraces;

  const results: TestCaseResult[] = testCases.map((tc) => ({
    testCaseId: tc.id,
    passed: "unknown",
    detail: compiled
      ? "Structural check only — no sandboxed execution service is configured, so this test case was not actually run."
      : `Method "${methodName}" or matching braces were not found — check your syntax before running test cases.`,
  }));

  return {
    mode: "simulated",
    compiled,
    results,
    note:
      hasReturn && compiled
        ? "This is a simulated structural check, not a real compile or run. Configure JAVA_EXECUTION_SERVICE_URL for genuine execution."
        : "This is a simulated structural check. It looks for the method name, a return statement, and balanced braces — it cannot catch logic errors.",
  };
}
