import { STATES, COMPANY_TYPES } from "./mappings";

export function validateCin(cin) {
  const errors = [];

  if (cin.length !== 21) {
    errors.push(`Expected 21 characters, got ${cin.length}`);
  }

  const pattern = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

  if (!pattern.test(cin)) {
    errors.push("Structure does not match CIN format");
  }

  if (errors.length) {
    return {
      input: cin,
      valid: false,
      type: "Company",
      error: errors.join(", "),
    };
  }

  const listed = cin[0] === "L" ? "Listed" : "Unlisted";

  const stateCode = cin.substring(6, 8);

  const year = cin.substring(8, 12);

  const companyCode = cin.substring(12, 15);

  return {
    input: cin,
    valid: true,
    type: "Company",
    listed,
    state: STATES[stateCode] || "Unknown State",
    year,
    companyType: COMPANY_TYPES[companyCode] || companyCode,
  };
}
