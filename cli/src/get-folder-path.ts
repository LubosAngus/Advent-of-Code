import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const __ROOT_DIR = path.join(__dirname, "../..");

export default () => {
  return path.join(__ROOT_DIR, "solutions", global.year, global.day);
};
