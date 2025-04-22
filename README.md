# eslint-plugin-chain-max-length

> Enforce a maximum length on chained array method calls

`eslint-plugin-chain-max-length` helps you keep your JavaScript clean and efficient by warning against long chains like `.map().filter().reduce()` that create multiple intermediate arrays.

This plugin is designed to **encourage the use of the new Iterator Helpers** (`.values()`, `.drop()`, `.take()`, `.toArray()`, etc.) introduced in ES2024, which enable lazy pipelines and avoid unnecessary array creation.

## Installation

```bash
npm install --save-dev eslint-plugin-chain-max-length
```

## Configuration

Add the plugin to your `eslint.config.js`:

```js
import chainMaxLengthPlugin from 'eslint-plugin-chain-max-length';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    plugins: {
      chainMaxLengthPlugin,
    },
    rules: {
      'chainMaxLengthPlugin/chain-max-length': 'warn',
    },
  },
]);
```

## Rule: `chain-max-length`

- **Type**: `suggestion`
- **Options**: An integer (minimum 1) representing the maximum number of standard array methods allowed in a single chain.
- **Checked methods**:
  - `map`, `filter`, `reduce`, `reduceRight`, `forEach`, `some`, `every`, `find`, `findIndex`, `flatMap`, `sort`, `slice`, `concat`
- **Exception**: Chains starting with `.values()` and ending with `.toArray()` (lazy pipelines) are ignored.

### Examples

### Long chain (warns)

```js
// Warning: 4 methods > limit of 3
[1, 2, 3]
  .map((x) => x + 1)
  .filter((x) => x > 2)
  .reduce((a, b) => a + b, 0)
  .sort()
  .slice(0, 5);
```

### Using Iterator Helpers (no warning)

```js
// Lazy pipeline: no intermediate arrays created
[1, 2, 3]
  .values() // returns an iterator
  .map((x) => x + 1)
  .filter((x) => x > 2)
  .drop(10)
  .take(10)
  .toArray(); // converts back to array
```
