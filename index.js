import fs from 'fs';

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

const ARRAY_METHODS = new Set([
  'map',
  'filter',
  'slice',
  'reduce',
  'reduceRight',
  'toSorted',
  'toReversed',
  'toSpliced',
  'flat',
  'flatMap',
  'concat',
]);

const cache = new WeakMap();

/**
 * Rule definition: warn when a chain of calls on an Array object (e.g. map, filter, reduce)
 * exceeds the configured maximum length, except for lazy pipelines (.values() ... .toArray()).
 */
export const maxChainRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow chains of array methods longer than a specified maximum',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'integer',
        minimum: 1,
      },
    ],
    messages: {
      exceed: 'Chain length of {{count}} exceeds maximum of {{max}}.',
    },
  },
  create(context) {
    // const sourceCode = context.sourceCode ?? context.getSourceCode();

    const max = context.options[0] ?? 1;
    function getChainMethods(node) {
      const methods = [];
      let current = node;

      while (
        current &&
        current.type === 'CallExpression' &&
        current.callee.type === 'MemberExpression'
      ) {
        const prop = current.callee.property;
        if (prop.type === 'Identifier') {
          methods.push(prop.name);
        }
        current = current.callee.object;
      }

      return methods.reverse();
    }

    function findRootCall(node) {
      let current = node;
      while (
        current &&
        current.type === 'CallExpression' &&
        current.callee.type === 'MemberExpression'
      ) {
        current = current.callee.object;
      }
      return current;
    }

    return {
      CallExpression(node) {
        const rootCall = findRootCall(node);

        // console.log(sourceCode.getText(rootCall));

        if (cache.has(rootCall)) {
          return cache.get(rootCall);
        }

        cache.set(rootCall, true);

        const methods = getChainMethods(node);

        // console.log(methods);

        if (methods.includes('values') && methods.includes('toArray')) {
          return;
        }

        const count = methods.filter((name) => ARRAY_METHODS.has(name)).length;

        if (count > max) {
          context.report({
            node,
            messageId: 'exceed',
            data: { count, max },
          });
        }
      },
    };
  },
};

export default {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    'chain-max-length': maxChainRule,
  },
  configs: {
    recommended: {
      rules: {
        'chain-max-length': ['warn', 1],
      },
    },
  },
};
