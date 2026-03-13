"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeProps,
  OnInit,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./page.module.css";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface NodeCategory {
  color: string;
  label: string;
}

interface NodeCategories {
  framework: NodeCategory;
  language: NodeCategory;
  library: NodeCategory;
  concept: NodeCategory;
  tooling: NodeCategory;
}

type CategoryKey = keyof NodeCategories;

interface NodeData extends Record<string, unknown> {
  label: string;
  note: string;
  category: CategoryKey;
}

type CustomNode = Node<NodeData>;
type CustomEdge = Edge;

// ============================================
// CONSTANTS
// ============================================

const nodeCategories: NodeCategories = {
  framework: { color: "#3b82f6", label: "Framework" },
  language: { color: "#f97316", label: "Language" },
  library: { color: "#06b6d4", label: "Library" },
  concept: { color: "#10b981", label: "Concept" },
  tooling: { color: "#ec4899", label: "Tooling" },
};

// ============================================
// CUSTOM NODE COMPONENT
// ============================================

function CustomNode({ data }: NodeProps<NodeData>) {
  const categoryColor = nodeCategories[data.category]?.color || "#64748b";
  const notePreview =
    data.note && data.note.length > 60
      ? data.note.substring(0, 60) + "..."
      : data.note;

  return (
    <div
      style={{
        position: "relative",
        minWidth: "240px",
        maxWidth: "280px",
        minHeight: "90px",
        display: "flex",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* CONNECTION HANDLES */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: categoryColor,
          width: "12px",
          height: "12px",
          border: "2px solid #0f172a",
          position: "fixed",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: categoryColor,
          width: "12px",
          height: "12px",
          border: "2px solid #0f172a",
          position: "fixed",
        }}
      />

      {/* Left colored border */}
      <div
        style={{
          width: "6px",
          background: categoryColor,
          flexShrink: 0,
          borderRadius: "12px 0 0 12px",
        }}
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Title with diamond icon */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#f1f5f9",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: categoryColor, fontSize: "14px" }}>◆</span>
          {data.label}
        </div>

        {/* Note preview */}
        {notePreview && (
          <div
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#94a3b8",
              lineHeight: 1.5,
              opacity: 0.85,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {notePreview}
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

// ============================================
// INITIAL DATA
// ============================================

const initialNodes: CustomNode[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 400, y: 0 },
    data: {
      label: "React",
      note: "A JavaScript library for building user interfaces using components.",
      category: "library",
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 100, y: 150 },
    data: {
      label: "Next.js",
      note: "React framework with SSR, routing, and API support built in.",
      category: "framework",
    },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 700, y: 150 },
    data: {
      label: "TypeScript",
      note: "Typed superset of JavaScript that compiles to plain JS.",
      category: "language",
    },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 0, y: 350 },
    data: {
      label: "State Management",
      note: "Patterns for managing shared application state (Context, Zustand, Redux).",
      category: "concept",
    },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 350, y: 350 },
    data: {
      label: "Component Design",
      note: "Principles for building reusable, composable UI components.",
      category: "concept",
    },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 700, y: 350 },
    data: {
      label: "Performance",
      note: "Techniques like memoization, lazy loading, and virtualization.",
      category: "concept",
    },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 200, y: 550 },
    data: {
      label: "Testing",
      note: "Unit, integration, and e2e testing strategies for frontend apps.",
      category: "tooling",
    },
  },
  {
    id: "8",
    type: "custom",
    position: { x: 550, y: 550 },
    data: {
      label: "CSS & Styling",
      note: "Styling approaches including Tailwind, CSS Modules, and styled-components.",
      category: "tooling",
    },
  },
];

const initialEdges: CustomEdge[] = [
  { id: "e2-1", source: "2", target: "1", label: "built on", animated: false },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    label: "pairs well with",
    animated: false,
  },
  { id: "e1-4", source: "1", target: "4", label: "uses", animated: false },
  { id: "e1-5", source: "1", target: "5", label: "guides", animated: false },
  { id: "e2-6", source: "2", target: "6", label: "improves", animated: false },
  { id: "e1-7", source: "1", target: "7", label: "requires", animated: false },
  {
    id: "e1-8",
    source: "1",
    target: "8",
    label: "styled with",
    animated: false,
  },
  { id: "e4-6", source: "4", target: "6", label: "impacts", animated: false },
  { id: "e5-6", source: "5", target: "6", label: "impacts", animated: false },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function Home() {
  const [nodes, setNodes] = useState<CustomNode[]>(() => {
    if (typeof window === "undefined") return initialNodes;
    const saved = localStorage.getItem("knowledgeGraphData");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.nodes.map((node: CustomNode) => ({
        ...node,
        type: node.type || "custom",
      }));
    }
    return initialNodes;
  });

  const [edges, setEdges] = useState<CustomEdge[]>(() => {
    if (typeof window === "undefined") return initialEdges;
    const saved = localStorage.getItem("knowledgeGraphData");
    return saved ? JSON.parse(saved).edges : initialEdges;
  });

  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddingNode, setIsAddingNode] = useState<boolean>(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>("library");

  const titleRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ============================================
  // HANDLERS
  // ============================================

  const getConnectedNodes = useCallback(
    (nodeId: string): Set<string> => {
      const connected = new Set<string>([nodeId]);
      edges.forEach((edge) => {
        if (edge.source === nodeId) connected.add(edge.target);
        if (edge.target === nodeId) connected.add(edge.source);
      });
      return connected;
    },
    [edges],
  );

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    const query = searchQuery.toLowerCase();
    return nodes.filter(
      (node) =>
        node.data.label.toLowerCase().includes(query) ||
        (node.data.note && node.data.note.toLowerCase().includes(query)),
    );
  }, [nodes, searchQuery]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as CustomNode[]),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback((params: Connection) => {
    const newEdge: CustomEdge = {
      ...params,
      id: `${params.source}-${params.target}`,
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 2 },
    };
    setEdges((eds) => addEdge(newEdge, eds));
    setTimeout(() => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === newEdge.id
            ? { ...edge, animated: false, style: undefined }
            : edge,
        ),
      );
    }, 2000);
  }, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: CustomNode) => {
      setIsEditing(false);
      setSelectedNode(node);
      const connected = getConnectedNodes(node.id);
      setHighlightedNodes(connected);
    },
    [getConnectedNodes],
  );

  const onInit: OnInit = useCallback((reactFlowInstance) => {
    reactFlowInstance.fitView({ duration: 0, padding: 0.2 });
    setIsReady(true);
  }, []);

  const addNodeHandler = useCallback(
    (title: string, note: string, category: CategoryKey) => {
      if (!title.trim()) {
        alert("Title cannot be empty!");
        return;
      }

      const maxId =
        nodes.length > 0
          ? Math.max(...nodes.map((n) => parseInt(n.id) || 0))
          : 0;
      const newId = String(maxId + 1);

      const newNode: CustomNode = {
        id: newId,
        type: "custom",
        position: {
          x: Math.random() * 600 + 100,
          y: Math.random() * 400 + 100,
        },
        data: { label: title, note: note || "No note provided", category },
      };

      setNodes((nds) => [...nds, newNode]);
      setIsAddingNode(false);

      if (titleRef.current) titleRef.current.value = "";
      if (notesRef.current) notesRef.current.value = "";
    },
    [nodes],
  );

  const editSaveNodeHandler = useCallback(
    (id: string, title: string, note: string) => {
      if (!title.trim()) {
        alert("Title cannot be empty!");
        return;
      }
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: title, note } }
            : node,
        ),
      );

      // ✨ UPDATE selectedNode with the new data
      if (selectedNode && selectedNode.id === id) {
        setSelectedNode({
          ...selectedNode,
          data: { ...selectedNode.data, label: title, note },
        });
      }

      setIsEditing(false);
    },
    [selectedNode], // Add selectedNode to dependencies
  );

  const deleteNodeHandler = useCallback((nodeId: string) => {
    const confirmDelete = window.confirm(
      "Delete this node? All connected edges will also be removed.",
    );

    if (confirmDelete) {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
      setSelectedNode(null);
      setIsEditing(false);
      setHighlightedNodes(new Set());
    }
  }, []);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      localStorage.setItem(
        "knowledgeGraphData",
        JSON.stringify({ nodes, edges }),
      );
    }
  }, [nodes, edges]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/" && !isAddingNode && !isEditing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isAddingNode, isEditing]);

  // ============================================
  // STYLED NODES AND EDGES
  // ============================================

  const styledNodes = filteredNodes.map((node) => ({
    ...node,
    style: {
      opacity:
        highlightedNodes.size > 0
          ? highlightedNodes.has(node.id)
            ? 1
            : 0.3
          : 1,
      transition: "opacity 300ms ease",
    },
  }));

  const styledEdges = edges.map((edge) => {
    const isHighlighted =
      highlightedNodes.has(edge.source) || highlightedNodes.has(edge.target);
    return {
      ...edge,
      style: {
        ...edge.style,
        stroke: "#475569",
        strokeWidth: isHighlighted ? 2.5 : 1.5,
        opacity: highlightedNodes.size > 0 ? (isHighlighted ? 1 : 0.2) : 0.6,
        transition: "opacity 300ms ease, stroke-width 300ms ease",
      },
      labelStyle: {
        fill: "#94a3b8",
        fontWeight: 600,
        fontSize: 12,
      },
      labelBgStyle: {
        fill: "#0f172a",
        fillOpacity: 0.9,
      },
      labelBgPadding: [8, 4] as [number, number],
      labelBgBorderRadius: 4,
    };
  });

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="8" r="2" fill="currentColor" />
              <circle cx="8" cy="16" r="2" fill="currentColor" />
              <circle cx="16" cy="16" r="2" fill="currentColor" />
              <line
                x1="12"
                y1="10"
                x2="8"
                y2="14"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="10"
                x2="16"
                y2="14"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Knowledge Graph</h1>
            <span className={styles.stats}>
              {nodes.length} nodes • {edges.length} edges
            </span>
          </div>
        </div>

        <div className={styles.headerCenter}>
          <button
            onClick={() => setIsAddingNode(true)}
            className={styles.headerButton}
          >
            <span className={styles.buttonIcon}>+</span>
            Node
          </button>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <kbd className={styles.kbd}>/</kbd>
          </div>
        </div>
      </header>

      <div className={styles.graphWrapper} style={{ opacity: isReady ? 1 : 0 }}>
        <ReactFlow
          nodes={styledNodes}
          edges={styledEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={onInit}
          onPaneClick={() => {
            setHighlightedNodes(new Set());
            if (!isEditing) setSelectedNode(null);
          }}
        >
          <Background
            className={styles.background}
            gap={16}
            size={1}
            color="#1e293b"
          />
          <Controls className={styles.controls} />
          <MiniMap
            className={styles.minimap}
            maskColor="rgba(15, 23, 42, 0.8)"
            nodeColor={(node) => {
              const category = node.data?.category || "library";
              return nodeCategories[category]?.color || "#64748b";
            }}
          />
        </ReactFlow>
      </div>

      {selectedNode && (
        <aside className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Node Details</h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedNode(null);
                setHighlightedNodes(new Set());
              }}
              className={styles.closeButton}
            >
              ×
            </button>
          </header>

          <div className={styles.panelContent}>
            {isEditing ? (
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="edit-title" className={styles.label}>
                    Title
                  </label>
                  <input
                    id="edit-title"
                    ref={titleRef}
                    defaultValue={selectedNode.data.label}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="edit-note" className={styles.label}>
                    Note
                  </label>
                  <textarea
                    id="edit-note"
                    ref={notesRef}
                    defaultValue={selectedNode.data.note}
                    rows={6}
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      editSaveNodeHandler(
                        selectedNode.id,
                        titleRef.current!.value,
                        notesRef.current!.value,
                      );
                    }}
                    className={`${styles.button} ${styles.buttonPrimary}`}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.viewMode}>
                <div
                  className={styles.categoryBadge}
                  style={{
                    background: `${nodeCategories[selectedNode.data.category]?.color}22`,
                    color: nodeCategories[selectedNode.data.category]?.color,
                  }}
                >
                  {nodeCategories[selectedNode.data.category]?.label}
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.infoLabel}>Title</h3>
                  <p className={styles.infoValue}>{selectedNode.data.label}</p>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.infoLabel}>Note</h3>
                  <p className={styles.infoText}>{selectedNode.data.note}</p>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`${styles.button} ${styles.buttonEdit}`}
                  >
                    Edit Node
                  </button>
                  <button
                    onClick={() => deleteNodeHandler(selectedNode.id)}
                    className={`${styles.button} ${styles.buttonDanger}`}
                  >
                    Delete Node
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {isAddingNode && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setIsAddingNode(false)}
          />
          <dialog open className={styles.modal}>
            <header className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Node</h2>
            </header>

            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="new-title" className={styles.label}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  id="new-title"
                  ref={titleRef}
                  placeholder="Enter node title"
                  className={styles.input}
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="new-note" className={styles.label}>
                  Note <span className={styles.optional}>(optional)</span>
                </label>
                <textarea
                  id="new-note"
                  ref={notesRef}
                  placeholder="Enter node description"
                  rows={4}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <div className={styles.categoryGrid}>
                  {Object.entries(nodeCategories).map(
                    ([key, { color, label }]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedCategory(key as CategoryKey)}
                        className={`${styles.categoryButton} ${
                          selectedCategory === key
                            ? styles.categoryButtonActive
                            : ""
                        }`}
                        style={{
                          borderColor: color,
                          background:
                            selectedCategory === key
                              ? `${color}22`
                              : "transparent",
                        }}
                      >
                        <span
                          className={styles.categoryDot}
                          style={{ background: color }}
                        />
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addNodeHandler(
                      titleRef.current!.value,
                      notesRef.current!.value,
                      selectedCategory,
                    );
                  }}
                  className={`${styles.button} ${styles.buttonSuccess}`}
                >
                  Create Node
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddingNode(false);
                  }}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </dialog>
        </>
      )}
    </div>
  );
}
