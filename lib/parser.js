import { validateCin } from "./validateCipin";
import { validateLlpin } from "./validateLipin";

export function parseInput(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim().toUpperCase())
    .filter(Boolean);

  return lines.map((line) => {
    // Recognized LLPIN pattern
    if (/^[A-Z]{3}-[0-9]{4}$/.test(line)) {
      return validateLlpin(line);
    }

    // Recognized CIN candidate
    if (/^[LU]/.test(line)) {
      return validateCin(line);
    }

    // Unknown identifier
    return {
      input: line,
      valid: false,
      type: "Unknown",
      error:
        "Invalid identifier: Does not match the expected CIN or LLPIN format.",
    };
  });
}
