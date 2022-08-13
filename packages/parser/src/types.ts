export type Element = {
  id: string;
  lineNumber: number;
  label: string;
};

export type Node = Element & {
  data: Record<string, string>;
};

export type Edge = Element & {
  source: string;
  target: string;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};
