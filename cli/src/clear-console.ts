/**
 * Clears the console output.
 * All of it, including history.
 * Use with caution.
 */
export default (): void => {
  console.log("\x1Bc");
};
