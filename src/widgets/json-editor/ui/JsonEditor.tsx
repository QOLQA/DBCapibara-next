import { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useSolutionStore as useCanvasStore } from "@fsd/entities/solution";
import { Button } from "@fsd/shared/ui/button";
import { toast } from "sonner";
import { parseAndValidateCanvasJson } from "../lib/canvas-schema.lib";
import type { Node, Edge } from "@xyflow/react";

export function JsonEditor() {
  const editorRef = useRef<any>(null);
  const { nodes, edges, setNodes, setEdges } = useCanvasStore((state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
  }));

  const initialContent = JSON.stringify({ nodes, edges }, null, 2);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleApplyChanges = () => {
    if (!editorRef.current) return;

    const currentContent = editorRef.current.getValue();
    const result = parseAndValidateCanvasJson(currentContent);

    if (result.success && result.data) {
      setNodes(result.data.nodes as Node[]);
      setEdges(result.data.edges as Edge[]);
      let toastMessage = "Schema updated successfully.";
      if (result.sanitizedCount > 0) {
        toastMessage += ` ${result.sanitizedCount} dangling edges were removed.`;
      }
      toast.success(toastMessage);
    } else {
      toast.error(`Failed to apply changes: ${result.error}`);
    }
  };

  // Handle Ctrl+S / Cmd+S for applying changes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleApplyChanges();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nodes, edges]); // Re-bind if state changes to capture latest state

  return (
    <div className="flex flex-col h-full p-2">
      <p className="text-sm text-muted-foreground mb-2">
        Directly edit the schema below. Invalid JSON or dangling edges will be
        automatically handled.
      </p>
      <div className="flex-grow border rounded-md overflow-hidden">
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          defaultValue={initialContent}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
          }}
        />
      </div>
      <Button onClick={handleApplyChanges} className="mt-2">
        Apply Changes
      </Button>
    </div>
  );
}
