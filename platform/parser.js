const CommandParser = function(command) {
  if (Array.isArray(command)) {
    return command.map(StepParser).reduce((a, b) => a.concat(b), []);
  } else {
    return StepParser(command);
  }
};

const StepParser = function(command) {
  if (typeof command === "string") {
    return LiteralParser(command);
  }

  if (typeof command === "object" && command !== null) {
    if (Array.isArray(command.keys)) {
      const steps = command.keys
        .map(LiteralParser)
        .reduce((a, b) => a.concat(b), []);

      steps.forEach(step => (step.delay = command.delay));
      return steps;
    }

    if (typeof command.keys === "string") {
      const steps = LiteralParser(command.keys);
      steps.forEach(step => (step.delay = command.delay));

      return steps;
    }
  }

  throw new Error(`Unable to parse command: ${command}`);
};

const LiteralParser = function(literal) {
  const splitLiteral = literal.split("*").map(el => el.trim());
  switch (splitLiteral.length) {
    case 1:
      return [{ key: splitLiteral[0] }];
    case 2:
      const multiplier = parseInt(splitLiteral[0]);
      if (multiplier === NaN && multiplier < 1) {
        throw new Error(`Unable to parse literal: ${literal}`);
      }
      return Array(multiplier).fill({ key: splitLiteral[1] });
    default:
      throw new Error(`Unable to parse literal: ${literal}`);
  }
};

module.exports = { CommandParser };
