import { Graph, toMermaid } from "flowchart-fun-parser";
import { useEffect, useRef } from "react";

import mermaid from "mermaid";

export function MermaidExample({ graph }: { graph: null | Graph }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let current = container.current;
    if (!graph || !current) return;
    mermaid.mermaidAPI.render("mermaid", toMermaid(graph), (svg: string) => {
      if (!container.current) return;
      container.current.innerHTML = svg;
    });
    return () => {
      if (!current) return;
      current.innerHTML = "";
    };
  }, [graph]);
  if (!graph) return null;
  return <div ref={container} />;
}
