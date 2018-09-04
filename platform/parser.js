const CommandParser = function(command) {
  if (Array.isArray(command)) {
    return command
      .filter(el => typeof el === "string")
      .map(LiteralParser)
      .reduce((a, b) => a.concat(b), []);
  } else if (typeof command === "string") {
    return LiteralParser(command);
  } else {
    throw new Error(`Unable to parse command: ${command}`);
  }
};

const LiteralParser = function(literal) {
  const splitLiteral = literal.split("*").map(el => el.trim());
  switch (splitLiteral.length) {
    case 1:
      return [splitLiteral[0]];
    case 2:
      const multiplier = parseInt(splitLiteral[0]);
      if (multiplier === NaN && multiplier < 1) {
        throw new Error(`Unable to parse literal: ${literal}`);
      }
      return Array(multiplier).fill(splitLiteral[1]);
    default:
      throw new Error(`Unable to parse literal: ${literal}`);
  }
};

console.log(CommandParser("5*KEY_VOLDOWN"));

module.exports = { CommandParser };
