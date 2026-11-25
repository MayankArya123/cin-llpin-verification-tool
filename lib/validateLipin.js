export function validateLlpin(value) {
  const regex = /^[A-Z]{3}-[0-9]{4}$/;

  if (!regex.test(value)) {
    return {
      input: value,
      valid: false,
      type: "LLP",
      error: "Expected LLPIN format AAA-1234",
    };
  }

  return {
    input: value,
    valid: true,
    type: "LLP",
  };
}
