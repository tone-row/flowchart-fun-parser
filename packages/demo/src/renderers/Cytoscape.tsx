import { useEffect, useRef } from "react";

import { Graph } from "flowchart-fun-parser";
import cytoscape from "cytoscape";

export function CytoscapeExample({ graph }: { graph: null | Graph }) {
  const cy = useRef<cytoscape.Core>();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!graph || !container.current) return;

    let nodes = graph.nodes.map((node) => ({ data: node }));
    let edges = graph.edges.map((edge) => ({ data: edge }));
    cy.current = cytoscape({
      container: container.current,
      elements: [...nodes, ...edges],
      layout: {
        name: "grid",
      },
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            label: "data(label)",
          },
        },
        {
          selector: "edge",
          style: {
            label: "data(label)",
            "curve-style": "bezier",
            "text-rotation": "autorotate",
          },
        },
      ],
    });
    let current = cy.current;
    return () => {
      current.destroy();
    };
  }, [graph]);
  if (!graph) return null;
  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
}
