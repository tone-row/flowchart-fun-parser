import ReactFlow, { Controls } from "react-flow-renderer";

import { Graph } from "flowchart-fun-parser";

export function ReactFlowExample({ graph }: { graph: null | Graph }) {
  if (!graph) return null;
  return (
    <ReactFlow
      nodes={graph.nodes.map((node, i) => ({
        id: node.id,
        position: {
          x: i * 100,
          y: i * 100,
        },
        data: { label: node.label },
      }))}
      edges={graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      }))}
      fitView
      attributionPosition="bottom-left"
    >
      <Controls />
    </ReactFlow>
  );
}
