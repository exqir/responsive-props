# responsiveProps

Support responsive props with ease.

responsiveProps allows you to support objects defining values for multiple breakpoints for any prop in a `React` application using a CSS-in-JS solution.

# Installation

```bash
yarn add @exqir/responsive-props
# or
npm install @exqir/responsive-props
```

# Usage

Define the supported breakpoints by providing an object with the names as key and the affiliated `min-width` as value to the `createResponsiveProps` function.

A breakpoint with the name `default` with the value `0` will be added automatically.

```js
import { createResponsiveProps } from '@exqir/responsive-props';

const { responsiveProp } = createResponsiveProps({
  small: 320,
  medium: 760,
  large: 1024,
});
```

The returned `responsiveProp` function can be used inside a CSS-in-JS solution to generate min-width based media queries.

```js
const cssWithMq = responsiveProp(
  {
    small: 'red',
    medium: 'blue',
    large: 'green',
  },
  'black',
  color => `color: ${color};`
);

console.log(cssWithMq);
// Output:
// color: black, @media (min-width: 320px) { color: red; } @media (min-width: 760px) { color: blue; } @media (min-width: 1024px) { color: green; }
```

#

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
