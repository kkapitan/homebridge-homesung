function LiteralParser(literal) {
  const splitLiteral = literal.split('*').map(el => el.trim());
  switch (splitLiteral.length) {
    case 1: {
      return [{ key: splitLiteral[0] }];
    }
    case 2: {
      const multiplier = parseInt(splitLiteral[0], 10);
      if (Number.isNaN(multiplier) && multiplier < 1) {
        throw new Error(`Unable to parse literal: ${literal}`);
      }
      return Array(multiplier).fill({ key: splitLiteral[1] });
    }
    default: {
      throw new Error(`Unable to parse literal: ${literal}`);
    }
  }
}

function StepParser(command) {
  if (typeof command === 'string') {
    return LiteralParser(command);
  }

  if (typeof command === 'object' && command !== null) {
    if (Array.isArray(command.keys)) {
      const steps = command.keys.map(LiteralParser).reduce((a, b) => a.concat(b), []);
      return steps.map(step => ({ ...step, delay: command.delay }));
    }

    if (typeof command.keys === 'string') {
      const steps = LiteralParser(command.keys);
      return steps.map(step => ({ ...step, delay: command.delay }));
    }
  }

  throw new Error(`Unable to parse command: ${command}`);
}

function CommandParser(command) {
  if (Array.isArray(command)) {
    return command.map(StepParser).reduce((a, b) => a.concat(b), []);
  }
  return StepParser(command);
}

module.exports = { CommandParser };
