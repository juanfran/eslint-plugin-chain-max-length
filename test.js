import { maxChainRule } from './index.js';
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester();

ruleTester.run('chain-max-length', maxChainRule, {
  valid: [
    {
      code: `
        [1,2,3]
          .map((x) => x + 1);
      `,
    },
    {
      code: `
        [4,5,6]
          .values()
          .map((x) => x + 1)
          .filter((x) => x > 2)
          .reduce((a, b) => a + b, 0)
          .toArray();
      `,
    },
    {
      code: `
        fn()
          .get()
          .values()
          .map((x) => x + 1)
          .filter((x) => x > 2)
          .toArray();
      `,
    },
  ],
  invalid: [
    {
      code: `
        [7,8,9]
          .map((x) => x + 1)
          .filter((x) => x > 2)
          .reduce((a, b) => a + b, 0);
      `,
      errors: [{ message: 'Chain length of 3 exceeds maximum of 1.' }],
    },
  ],
});
