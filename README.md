# flowchart fun parser

Parse the [flowchart-fun](https://github.com/tone-row/flowchart-fun) syntax into a graph object which contains nodes and edges with labels. 

For those not familiar with this syntax it uses indentation to express parent-child relationships. See it in action at https://flowchart.fun

<div align="center">

### [✨&nbsp; Open Interactive Demos &nbsp;✨](https://flowchart-fun-parser-demos.vercel.app/)
  
</div>

---

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

/* 
Returns...
{
  "nodes": [...],
  "edges": [...]
}
*/
```


## Repository Goals

Giving the parser its own package has the following goals:

- support the flowchart.fun webapp
- allow for other tools to be built on top of the same syntax
- get community input on developing and enhancing the features of the syntax
- focus on parsing speed with benchmarking

## Language Goals

Parse indentation syntax into nodes and edges with their respective labels and data attributes [(\*\* check here)](#areas-of-exploration), create ID's for each node and edge.

## Demos

The demos folder shows examples of using different renderers. [Open Interactive Demos](https://flowchart-fun-parser-demos.vercel.app/)

## Areas of Exploration

- \*\* Supporting generalized data attributes, probably in the syntax of css selectors (`[key="value"]`)
- Creating ID's which use some portion of the label text with a number for order of appearance, so that there is more referential integrity when associating meta information with graph information.
