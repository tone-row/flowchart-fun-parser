import { encode, parse } from "./parse";

describe("parse", () => {
  test("creates default node ID", () => {
    const result = parse("a");
    expect(result.nodes[0].id).toBe("N14e");
  });

  test("creates one node per line with label", () => {
    const result = parse("a\nb\nc");
    expect(result.nodes.length).toEqual(3);
  });

  test("should not create a node if no nodeLabel is present", () => {
    const { nodes } = parse("a\n  (a)");
    expect(nodes.length).toEqual(1);
  });

  test("should create an edge between indented nodes", () => {
    const { edges } = parse("a\n  b");
    expect(edges.length).toEqual(1);
    expect(edges[0]).toEqual({
      id: "N14e_N14f:0",
      label: "",
      lineNumber: 2,
      source: "N14e",
      target: "N14f",
    });
  });

  test("should trim node labels", () => {
    const fakeLabel = `test label`;
    const { nodes } = parse(`${fakeLabel}     `);
    const node = nodes[0];
    expect(node.label).toEqual(fakeLabel);
  });

  test("should parse edge labels", () => {
    const fakeLabel = `test label`;
    const { edges } = parse(`a\n  ${fakeLabel}: [a]`);
    const edge = edges[0];
    expect(edge.label).toEqual(fakeLabel);
  });

  test("should trim edge labels", () => {
    const fakeLabel = `test label`;
    const { edges } = parse(`a\n  ${fakeLabel}    : [a]`);
    const edge = edges[0];
    expect(edge.label).toEqual(fakeLabel);
  });

  test("should allow custom ids", () => {
    const fakeId = `test-id`;
    let result = parse(`[${fakeId}] a`);
    let node = result.nodes[0];
    expect(node.id).toEqual(fakeId);

    result = parse(`[${fakeId}.djklksj] a`);
    node = result.nodes[0];
    expect(node.id).toEqual(fakeId);
  });

  test.todo("Things should be removed from label, customId, etc.");
  test.todo("Throws on multiple id blocks");

  test("should allow for more than one edge to between nodes", () => {
    let result = parse("a\n  b");
    const edge = result.edges[0];
    expect(edge.id).toEqual("N14e_N14f:0");
    result = parse("a\n  b\n  (2)");
    expect(result.edges.length).toEqual(2);
    expect(result.edges).toContainEqual({
      id: "N14e_2:1",
      lineNumber: 3,
      label: "",
      source: "N14e",
      target: "N14f",
    });
  });

  /* Pointers */

  test("should create edge with line number", () => {
    const result = parse("a\nb\n  (1)");
    expect(result.edges).toContainEqual({
      id: "N14f_1:0",
      lineNumber: 3,
      label: "",
      source: "N14f",
      target: "N14e",
    });
  });

  test("should create edge with id", () => {
    const fakeId = `fake id`;
    const result = parse(`[${fakeId}] a\nb\n  (${fakeId})`);
    expect(result.edges).toContainEqual({
      id: `N14f_${fakeId}:0`,
      lineNumber: 3,
      label: "",
      source: "N14f",
      target: `${fakeId}`,
    });
  });

  test("should create edge with exact label", () => {
    const label = `exact label`;
    const result = parse(`${label}\nb\n  (${label})`);
    expect(result.edges).toContainEqual({
      id: `N14f_${label}:0`,
      lineNumber: 3,
      label: "",
      source: "N14f",
      target: "N14e",
    });
  });

  test("should ignore empty lines", () => {
    const result = parse("a\n\n\n\n\nb");
    expect(result.nodes.length).toEqual(2);
  });

  test("should add an edge to labels that need to be decoded", () => {
    const originalLabel = `my
    fun
    multiline
    label!(*)$(@*#$)`;
    const nodeLabel = encode(originalLabel);
    const text = `${nodeLabel}\n  good times: (${nodeLabel})`;
    const result = parse(text);
    // This used to use unencoded labels and I don't know why.
    expect(result.edges[0].id).toEqual(`N14e_${nodeLabel}:0`);
  });

  test("should only link-by-label to nodes, not edges", () => {
    const label = `A
    test: B
      (test)
    test`;
    const result = parse(label);
    const targets = result.edges.map((e) => e.target);
    // Including an underscore means that it points to an edge
    expect(targets.some((target) => target.includes("_"))).toBe(false);
  });

  test("pointers should grab explicit ID first, then label, then line number", () => {
    // and the first line has a label 1, second line has id 1
    let testText = `1\n[1] b\nc\n\t(1)`;
    let result = parse(testText);
    const firstEdge = result.edges[0];
    expect(firstEdge.source).toEqual("N150");
    expect(firstEdge.target).toEqual("1");
    expect(result.nodes.length).toEqual(3);
    // make sure all nodes have unique ids
    const ids = result.nodes.map((n) => n.id);
    expect(ids.every((id) => ids.filter((_id) => _id === id).length === 1)).toBe(true);
    // C should link to B even though it's the second line
    expect(result.edges).toContainEqual({
      id: "N150_1:0",
      lineNumber: 4,
      label: "",
      source: "N150",
      target: "1",
    });

    // prefer label over line number
    // works even with explict id on target node
    testText = `line 1\n[test] 1\nc\n\t(1)`;
    result = parse(testText);
    expect(result.edges).toContainEqual({
      id: "N150_1:0",
      lineNumber: 4,
      label: "",
      source: "N150",
      target: "test",
    });

    // uses line number if nothing else
    testText = `line 1\n[to] x\n[from] c\n\t(2)`;
    result = parse(testText);
    expect(result.edges).toContainEqual({
      id: "from_2:0",
      lineNumber: 4,
      label: "",
      source: "from",
      target: "to",
    });
  });

  test("should error labeled edges with no indent", () => {
    const label = `A\ntest: B`;
    expect(() => parse(label)).toThrow('Edge Label without Parent: "test"');
  });

  test("should parse classes for nodes", () => {
    const label = `[.one.two.three] a`;
    const result = parse(label);
    expect(result.nodes).toEqual([
      { id: "N14e", lineNumber: 1, label: "a", data: { classes: "one two three" } },
    ]);
  });

  test("id or class only should create node", () => {
    const label = `[someId]`;
    const result = parse(label);
    expect(result.nodes).toContainEqual({
      id: "someId",
      lineNumber: 1,
      label: "",
      data: { classes: "" },
    });
  });

  test("Should throw if ID used more than once", () => {
    const getResult = () => parse(`[hello] hi\n[hello] hi`);
    expect(getResult).toThrow();
  });

  test("Should throw an error if edge label with no parent", () => {
    const getResult = () => parse(`  [test] hi: (uh oh, this is the right higlighting but)`);
    expect(getResult).toThrow();
  });

  test("Should throw an error for pointer with no indent", () => {
    const getResult = () => parse(`(fun)`);
    expect(getResult).toThrow();
  });

  test.skip("Should throw an error on line with linked id", () => {
    const getResult = () => parse(`a\n\tb\n\t[bye] for each: (b)`);
    expect(getResult).toThrow();
  });

  test("Should work with multiple pointers", () => {
    const result = parse(`a\nb\n goes to: (a) (b)`);
    expect(result.edges).toContainEqual({
      id: "N14f_a:0",
      lineNumber: 3,
      label: "goes to",
      source: "N14f",
      target: "N14e",
    });
    expect(result.edges).toContainEqual({
      id: "N14f_b:1",
      lineNumber: 3,
      label: "goes to",
      source: "N14f",
      target: "N14f",
    });
  });

  test("should throw an error if pointer with no leadingSpace", () => {
    const getResult = () => parse(`fun\n(fun)`);
    expect(getResult).toThrow();
  });

  test("should work with chinese colon and parentheses", () => {
    const result = parse(`中文\n to：（中文）`);
    expect(result.nodes).toEqual([
      { id: "N14e", lineNumber: 1, label: "中文", data: { classes: "" } },
    ]);
    expect(result.edges).toContainEqual({
      id: "N14e_中文:0",
      lineNumber: 2,
      label: "to",
      source: "N14e",
      target: "N14e",
    });
  });

  test("can augment individual nodes while parsing", () => {
    const result = parse(`a\nb`, {
      processNode: (node) => ({
        ...node,
        label: node.label + " hello world",
      }),
    });
    expect(result.nodes[0].label).toEqual("a hello world");
    expect(result.nodes[1].label).toEqual("b hello world");
  });
});
