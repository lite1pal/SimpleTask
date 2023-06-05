import bcrypt from "bcrypt";

const validatePassword = (password: string) => {
  let is8length = false;
  let isDigit = false;
  let isCapital = false;

  is8length = password.length >= 8;
  isDigit = password.split("").some((pw: string) => {
    if ("0123456789".includes(pw)) return true;
  });
  isCapital = password.split("").some((pw: string) => {
    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(pw)) return true;
  });
  return is8length && isDigit && isCapital;
};

const hashPassword = async (password: string, saltRounds = 10) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    const isPasswordTheSame = await bcrypt.compare(password, hashedPassword);
    return isPasswordTheSame;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export { validatePassword, hashPassword, comparePassword };
