# flowchart fun parser

Parse the flowchart syntax into a generalized graph syntax which supports nodes and edges with labels.

For those not familiar with this syntax it uses indentation to express parent-child relationships. See more: https://flowchart.fun

## Installation

```bash
npm install flowchart-fun-parser
```

## Usage

```js
import { parse } from "flowchart-fun-parser";

parse(`parent
  child
    grandchild`);

/* Returns
...
*/
```

## Repository Goals

Giving the parser its own package has the following goals:

- support the flowchart.fun webapp
- allow for other tools to be built on top of the same syntax
- get community input on developing and enhancing the features of the syntax
- focus on parsing speed with benchmarking

## Language Goals

Parse indentation syntax into nodes and edges with their respective labels and data attributes, create ID's for each node and edge.

## Demos

The demos folder shows examples of using different renderers.

## Areas of Exploration

- Creating ID's which use some portion of the label text with a number for order of appearance, so that there is more referential integrity when associating meta information with graph information.
