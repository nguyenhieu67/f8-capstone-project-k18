import crypto from "crypto";

function randomString(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

export default randomString;
