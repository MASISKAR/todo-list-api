module.exports = {
  "pass": {
    "prefix": process.env.AUTH_PASS_PREFIX,
    "salt_rounds": +process.env.AUTH_PASS_SALT_ROUNDS
  },
  "jwt": {
    "secret": process.env.AUTH_JWT_SECRET,
    "exp": process.env.AUTH_JWT_EXP
  },
  "refreshToken": {
    "size": +process.env.AUTH_REFRESH_TOKEN_SIZE,
    "exp": +process.env.AUTH_REFRESH_TOKEN_EXP
  },
};
