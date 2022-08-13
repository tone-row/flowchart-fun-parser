import "highlight.js/styles/purebasic.css";

import * as Tabs from "@radix-ui/react-tabs";

import { Graph, parse } from "flowchart-fun-parser";
import { Link, Router, useMatch } from "@tanstack/react-location";
import { useEffect, useState } from "react";

import { CytoscapeExample } from "./renderers/Cytoscape";
import Editor from "@monaco-editor/react";
import { MermaidExample } from "./renderers/Mermaid";
import { ReactFlowExample } from "./renderers/ReactFlowExample";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

const DEFAULT_RENDERER = "cytoscape";

function App() {
  const [value, setValue] = useState(`a\n  goes to: b\n    then to: c`);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<null | Graph>(null);
  const { params } = useMatch();
  const tab = (params["renderer"] || DEFAULT_RENDERER) as string;

  useEffect(() => {
    try {
      setParsed(parse(value));
    } catch (e) {
      setParsed(null);
      if (isError(e)) setError(e.message);
    }
  }, [value]);

  return (
    <div className="app">
      <header>
        <h1>flowchart-fun-parser demos</h1>
        <p>
          This is a demo site showing how the parser can be used to connect the
          <br />
          flowchart fun syntax to any graph renderer.
        </p>
      </header>
      <div className="columns">
        <section className="two-part-section">
          <h2>Input</h2>
          <Editor
            value={value}
            className="editor"
            onChange={(value) => value && setValue(value)}
            options={{
              fontSize: 16,
              lineNumbersMinChars: 2,
              minimap: {
                enabled: false,
              },
            }}
          />
        </section>
        <section className="two-part-section">
          <h2>Parsed</h2>
          {parsed ? (
            <pre className="parse-wrapper">
              <code
                className="language-json"
                dangerouslySetInnerHTML={{
                  __html: hljs.highlight(JSON.stringify(parsed, null, 2), {
                    language: "json",
                  }).value,
                }}
              />
            </pre>
          ) : (
            <p style={{ color: "red" }}>{error}</p>
          )}
        </section>
        <Tabs.Root value={tab} asChild>
          <section className="two-part-section">
            <header>
              <h2>Renderer</h2>
              <Tabs.List className="tabs">
                <Tabs.Trigger value="cytoscape" asChild>
                  <Link to="/cytoscape">Cytoscape</Link>
                </Tabs.Trigger>
                <Tabs.Trigger value="mermaid" asChild>
                  <Link to="/mermaid">Mermaid</Link>
                </Tabs.Trigger>
                <Tabs.Trigger value="react-flow" asChild>
                  <Link to="/react-flow">React Flow</Link>
                </Tabs.Trigger>
              </Tabs.List>
            </header>
            <Tabs.Content value="cytoscape">
              <CytoscapeExample graph={parsed} />
            </Tabs.Content>
            <Tabs.Content value="react-flow">
              <ReactFlowExample graph={parsed} />
            </Tabs.Content>
            <Tabs.Content value="mermaid">
              <MermaidExample graph={parsed} />
            </Tabs.Content>
          </section>
        </Tabs.Root>
      </div>
    </div>
  );
}

export default App;

function isError(value: unknown): value is Error {
  return value instanceof Error;
}
