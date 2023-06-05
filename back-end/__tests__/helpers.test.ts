import {
  validatePassword,
  hashPassword,
  comparePassword,
} from "../helpers/helpers";

const validPassword = "Denis12345";
const invalidPassword = "denis";
let hashedPassword: string;

describe("Password validation", () => {
  it("should return true if password is valid", () => {
    const result = validatePassword(validPassword);
    expect(result).toBeTruthy();
  });
  it("should return false if password is invalid", () => {
    const result = validatePassword(invalidPassword);
    expect(result).toBeFalsy();
  });
});

describe("Password encryption", () => {
  it("should return hashed password", async () => {
    hashedPassword = await hashPassword(validPassword);
    expect(hashedPassword).toBeTruthy();
  });
  it("should return true if provided password equals encrypted one", async () => {
    const isPasswordTheSame = await comparePassword(
      validPassword,
      hashedPassword
    );
    expect(isPasswordTheSame).toBeTruthy();
  });
});
