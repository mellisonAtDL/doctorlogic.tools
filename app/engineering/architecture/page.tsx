"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";

// =============================================================================
// STRUCTURIZR DSL DATA MODEL
// =============================================================================

type ElementType =
  | "person"
  | "softwareSystem"
  | "container"
  | "component"
  | "database"
  | "queue"
  | "external";

interface Element {
  id: string;
  name: string;
  description: string;
  type: ElementType;
  technology?: string;
  tags?: string[];
  children?: Element[];
}

interface Relationship {
  sourceId: string;
  targetId: string;
  description: string;
  technology?: string;
}

interface Architecture {
  workspace: {
    name: string;
    description: string;
  };
  model: {
    people: Element[];
    softwareSystems: Element[];
    relationships: Relationship[];
  };
}

// =============================================================================
// ARCHITECTURE DEFINITION (Structurizr DSL-style)
// =============================================================================

const architecture: Architecture = {
  workspace: {
    name: "DoctorLogic Platform",
    description:
      "Architecture diagram for the DoctorLogic healthcare marketing platform",
  },
  model: {
    people: [
      {
        id: "patient",
        name: "Patient",
        description: "Healthcare practice patient looking for services",
        type: "person",
        tags: ["external"],
      },
      {
        id: "practiceStaff",
        name: "Practice Staff",
        description: "Healthcare practice administrators and staff",
        type: "person",
      },
      {
        id: "dlAdmin",
        name: "DL Admin",
        description: "DoctorLogic internal administrators",
        type: "person",
      },
    ],
    softwareSystems: [
      {
        id: "webApp",
        name: "Web App / Admin App",
        description:
          "Main web application and admin dashboard for practice management",
        type: "softwareSystem",
        technology: "Next.js, React",
        tags: ["primary"],
        children: [
          {
            id: "webAppFrontend",
            name: "Frontend",
            description: "React-based user interface",
            type: "container",
            technology: "Next.js, React, TypeScript",
          },
          {
            id: "webAppApi",
            name: "API Layer",
            description: "Backend API services",
            type: "container",
            technology: "Next.js API Routes",
          },
        ],
      },
      {
        id: "azureFunctions",
        name: "Azure Functions",
        description:
          "Serverless compute for background processing and scheduled tasks",
        type: "softwareSystem",
        technology: "Azure Functions, C#/.NET",
        tags: ["compute"],
        children: [
          {
            id: "scheduledJobs",
            name: "Scheduled Jobs",
            description: "Cron-based background tasks",
            type: "container",
            technology: "Timer Triggers",
          },
          {
            id: "eventProcessors",
            name: "Event Processors",
            description: "Queue and event-driven processors",
            type: "container",
            technology: "Queue Triggers",
          },
          {
            id: "httpTriggers",
            name: "HTTP Triggers",
            description: "REST API endpoints",
            type: "container",
            technology: "HTTP Triggers",
          },
        ],
      },
      {
        id: "cloudflareWorkers",
        name: "Cloudflare Workers",
        description: "Edge computing for low-latency operations and routing",
        type: "softwareSystem",
        technology: "Cloudflare Workers, JavaScript",
        tags: ["edge"],
        children: [
          {
            id: "edgeRouting",
            name: "Edge Routing",
            description: "Request routing and load balancing at the edge",
            type: "container",
            technology: "Workers",
          },
          {
            id: "cacheLayer",
            name: "Cache Layer",
            description: "Edge caching for static and dynamic content",
            type: "container",
            technology: "Workers KV",
          },
        ],
      },
      {
        id: "sqlDatabase",
        name: "SQL Database",
        description: "Primary relational database for structured data",
        type: "database",
        technology: "Azure SQL",
        tags: ["storage"],
      },
      {
        id: "blobStorage",
        name: "Blob Storage",
        description: "Object storage for images, documents, and media files",
        type: "database",
        technology: "Azure Blob Storage",
        tags: ["storage"],
      },
      {
        id: "cdn",
        name: "CDN",
        description: "Content delivery network for static assets",
        type: "external",
        technology: "Cloudflare CDN",
        tags: ["external"],
      },
    ],
    relationships: [
      // Patient interactions
      {
        sourceId: "patient",
        targetId: "cdn",
        description: "Accesses website via",
        technology: "HTTPS",
      },
      {
        sourceId: "cdn",
        targetId: "cloudflareWorkers",
        description: "Routes requests to",
        technology: "HTTPS",
      },
      {
        sourceId: "cloudflareWorkers",
        targetId: "webApp",
        description: "Proxies requests to",
        technology: "HTTPS",
      },

      // Staff interactions
      {
        sourceId: "practiceStaff",
        targetId: "webApp",
        description: "Manages practice via",
        technology: "HTTPS",
      },
      {
        sourceId: "dlAdmin",
        targetId: "webApp",
        description: "Administers platform via",
        technology: "HTTPS",
      },

      // Web App connections
      {
        sourceId: "webApp",
        targetId: "sqlDatabase",
        description: "Reads/writes data",
        technology: "SQL/TDS",
      },
      {
        sourceId: "webApp",
        targetId: "blobStorage",
        description: "Stores/retrieves files",
        technology: "Azure Blob API",
      },
      {
        sourceId: "webApp",
        targetId: "azureFunctions",
        description: "Triggers background jobs",
        technology: "HTTP/Queue",
      },

      // Azure Functions connections
      {
        sourceId: "azureFunctions",
        targetId: "sqlDatabase",
        description: "Processes data",
        technology: "SQL/TDS",
      },
      {
        sourceId: "azureFunctions",
        targetId: "blobStorage",
        description: "Processes files",
        technology: "Azure Blob API",
      },

      // Cloudflare Workers connections
      {
        sourceId: "cloudflareWorkers",
        targetId: "azureFunctions",
        description: "Calls edge functions",
        technology: "HTTPS",
      },
    ],
  },
};

// =============================================================================
// VISUALIZATION COMPONENTS
// =============================================================================

const typeStyles: Record<
  ElementType,
  { bg: string; border: string; text: string; icon: string }
> = {
  person: {
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-800",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  softwareSystem: {
    bg: "bg-indigo-100",
    border: "border-indigo-400",
    text: "text-indigo-800",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  container: {
    bg: "bg-cyan-100",
    border: "border-cyan-400",
    text: "text-cyan-800",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  component: {
    bg: "bg-teal-100",
    border: "border-teal-400",
    text: "text-teal-800",
    icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
  },
  database: {
    bg: "bg-amber-100",
    border: "border-amber-400",
    text: "text-amber-800",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
  },
  queue: {
    bg: "bg-purple-100",
    border: "border-purple-400",
    text: "text-purple-800",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  external: {
    bg: "bg-gray-100",
    border: "border-gray-400",
    text: "text-gray-700",
    icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  },
};

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

function ElementCard({
  element,
  position,
  isSelected,
  onClick,
  scale,
}: {
  element: Element;
  position: NodePosition;
  isSelected: boolean;
  onClick: () => void;
  scale: number;
}) {
  const style = typeStyles[element.type];

  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      <rect
        width={position.width}
        height={position.height}
        rx={8}
        className={`${style.bg} ${isSelected ? "stroke-2" : "stroke-1"} ${style.border}`}
        fill="currentColor"
        stroke="currentColor"
        style={{
          fill:
            element.type === "person"
              ? "#dbeafe"
              : element.type === "softwareSystem"
                ? "#e0e7ff"
                : element.type === "database"
                  ? "#fef3c7"
                  : element.type === "external"
                    ? "#f3f4f6"
                    : "#cffafe",
          stroke: isSelected
            ? "#3b82f6"
            : element.type === "person"
              ? "#60a5fa"
              : element.type === "softwareSystem"
                ? "#818cf8"
                : element.type === "database"
                  ? "#fbbf24"
                  : element.type === "external"
                    ? "#9ca3af"
                    : "#22d3ee",
          strokeWidth: isSelected ? 3 : 1.5,
        }}
      />
      {/* Icon */}
      <svg
        x={position.width / 2 - 12}
        y={12}
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke={
          element.type === "person"
            ? "#1e40af"
            : element.type === "softwareSystem"
              ? "#3730a3"
              : element.type === "database"
                ? "#92400e"
                : element.type === "external"
                  ? "#374151"
                  : "#0e7490"
        }
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={style.icon} />
      </svg>
      {/* Name */}
      <text
        x={position.width / 2}
        y={48}
        textAnchor="middle"
        className="font-semibold text-sm"
        fill={
          element.type === "person"
            ? "#1e40af"
            : element.type === "softwareSystem"
              ? "#3730a3"
              : element.type === "database"
                ? "#92400e"
                : element.type === "external"
                  ? "#374151"
                  : "#0e7490"
        }
        style={{ fontSize: 14 / scale }}
      >
        {element.name}
      </text>
      {/* Technology badge */}
      {element.technology && (
        <text
          x={position.width / 2}
          y={66}
          textAnchor="middle"
          className="text-xs"
          fill="#6b7280"
          style={{ fontSize: 10 / scale }}
        >
          [{element.technology}]
        </text>
      )}
      {/* Description */}
      <foreignObject x={8} y={72} width={position.width - 16} height={40}>
        <div
          className="text-center text-gray-600 overflow-hidden"
          style={{ fontSize: `${9 / scale}px`, lineHeight: 1.3 }}
        >
          {element.description.length > 60
            ? element.description.substring(0, 60) + "..."
            : element.description}
        </div>
      </foreignObject>
    </g>
  );
}

function Arrow({
  startX,
  startY,
  endX,
  endY,
  label,
  isHighlighted,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label: string;
  isHighlighted: boolean;
}) {
  // Calculate control points for a curved line
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.2;

  // Create path for curved arrow
  const path = `M ${startX} ${startY} Q ${midX + offset} ${midY - offset} ${endX} ${endY}`;

  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${isHighlighted ? "highlighted" : "normal"}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={isHighlighted ? "#3b82f6" : "#9ca3af"}
          />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={isHighlighted ? "#3b82f6" : "#d1d5db"}
        strokeWidth={isHighlighted ? 2 : 1.5}
        markerEnd={`url(#arrowhead-${isHighlighted ? "highlighted" : "normal"})`}
        strokeDasharray={isHighlighted ? "none" : "none"}
      />
      {/* Label background */}
      <rect
        x={midX - label.length * 3}
        y={midY - 18}
        width={label.length * 6 + 8}
        height={16}
        rx={4}
        fill="white"
        stroke={isHighlighted ? "#3b82f6" : "#e5e7eb"}
        strokeWidth={1}
      />
      {/* Label text */}
      <text
        x={midX + 4}
        y={midY - 6}
        textAnchor="middle"
        fontSize={10}
        fill={isHighlighted ? "#3b82f6" : "#6b7280"}
      >
        {label}
      </text>
    </g>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ArchitecturePage() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [viewLevel, setViewLevel] = useState<"context" | "container">(
    "context"
  );
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate positions for elements
  const getPositions = useCallback(() => {
    const positions: Record<string, NodePosition> = {};
    const nodeWidth = 180;
    const nodeHeight = 120;
    const spacing = 40;

    // People row (top)
    const people = architecture.model.people;
    const peopleStartX = 400 - (people.length * (nodeWidth + spacing)) / 2;
    people.forEach((person, i) => {
      positions[person.id] = {
        x: peopleStartX + i * (nodeWidth + spacing),
        y: 20,
        width: nodeWidth,
        height: nodeHeight,
      };
    });

    // Systems rows
    const systems = architecture.model.softwareSystems;
    const row1Systems = systems.slice(0, 3);
    const row2Systems = systems.slice(3);

    // Row 1 - main systems
    const row1StartX = 400 - (row1Systems.length * (nodeWidth + spacing)) / 2;
    row1Systems.forEach((system, i) => {
      positions[system.id] = {
        x: row1StartX + i * (nodeWidth + spacing),
        y: 200,
        width: nodeWidth,
        height: nodeHeight,
      };
    });

    // Row 2 - storage & external
    const row2StartX = 400 - (row2Systems.length * (nodeWidth + spacing)) / 2;
    row2Systems.forEach((system, i) => {
      positions[system.id] = {
        x: row2StartX + i * (nodeWidth + spacing),
        y: 380,
        width: nodeWidth,
        height: nodeHeight,
      };
    });

    return positions;
  }, []);

  const positions = getPositions();

  // Get relationships for selected element
  const getRelationshipsForElement = (elementId: string) => {
    return architecture.model.relationships.filter(
      (r) => r.sourceId === elementId || r.targetId === elementId
    );
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom handlers
  const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s / 1.2, 0.3));
  const handleResetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Get all elements
  const allElements = [
    ...architecture.model.people,
    ...architecture.model.softwareSystems,
  ];

  // Export DSL
  const exportDSL = () => {
    const dsl = generateStructurizrDSL();
    const blob = new Blob([dsl], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "architecture.dsl";
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateStructurizrDSL = () => {
    let dsl = `workspace "${architecture.workspace.name}" "${architecture.workspace.description}" {\n\n`;
    dsl += `  model {\n`;

    // People
    architecture.model.people.forEach((p) => {
      dsl += `    ${p.id} = person "${p.name}" "${p.description}"\n`;
    });
    dsl += "\n";

    // Systems
    architecture.model.softwareSystems.forEach((s) => {
      dsl += `    ${s.id} = softwareSystem "${s.name}" "${s.description}"`;
      if (s.children && s.children.length > 0) {
        dsl += ` {\n`;
        s.children.forEach((c) => {
          dsl += `      ${c.id} = container "${c.name}" "${c.description}" "${c.technology || ""}"\n`;
        });
        dsl += `    }\n`;
      } else {
        dsl += "\n";
      }
    });
    dsl += "\n";

    // Relationships
    architecture.model.relationships.forEach((r) => {
      dsl += `    ${r.sourceId} -> ${r.targetId} "${r.description}"`;
      if (r.technology) {
        dsl += ` "${r.technology}"`;
      }
      dsl += "\n";
    });

    dsl += `  }\n\n`;
    dsl += `  views {\n`;
    dsl += `    systemContext webApp "Context" {\n`;
    dsl += `      include *\n`;
    dsl += `      autoLayout\n`;
    dsl += `    }\n`;
    dsl += `  }\n`;
    dsl += `}\n`;

    return dsl;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/engineering"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-cyan-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              System Architecture
            </h1>
            <p className="text-sm text-gray-500">
              {architecture.workspace.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Diagram Area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom out"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                    />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 w-16 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom in"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleResetView}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors ml-2"
                  title="Reset view"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportDSL}
                  className="px-3 py-1.5 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export DSL
                </button>
              </div>
            </div>

            {/* Diagram Canvas */}
            <div
              className="relative h-[600px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
              style={{ cursor: isPanning ? "grabbing" : "grab" }}
            >
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 800 550"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <g
                  transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
                  style={{ transformOrigin: "400px 275px" }}
                >
                  {/* Grid pattern */}
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="550" fill="url(#grid)" />

                  {/* Relationships (draw first, behind nodes) */}
                  {architecture.model.relationships.map((rel, idx) => {
                    const sourcePos = positions[rel.sourceId];
                    const targetPos = positions[rel.targetId];
                    if (!sourcePos || !targetPos) return null;

                    const isHighlighted =
                      selectedElement &&
                      (rel.sourceId === selectedElement.id ||
                        rel.targetId === selectedElement.id);

                    return (
                      <Arrow
                        key={idx}
                        startX={sourcePos.x + sourcePos.width / 2}
                        startY={sourcePos.y + sourcePos.height}
                        endX={targetPos.x + targetPos.width / 2}
                        endY={targetPos.y}
                        label={rel.description}
                        isHighlighted={!!isHighlighted}
                      />
                    );
                  })}

                  {/* Elements */}
                  {allElements.map((element) => {
                    const pos = positions[element.id];
                    if (!pos) return null;

                    return (
                      <ElementCard
                        key={element.id}
                        element={element}
                        position={pos}
                        isSelected={selectedElement?.id === element.id}
                        onClick={() =>
                          setSelectedElement(
                            selectedElement?.id === element.id ? null : element
                          )
                        }
                        scale={scale}
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  Legend
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-blue-100 border border-blue-400"></div>
                    <span className="text-gray-600">Person</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-400"></div>
                    <span className="text-gray-600">System</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-amber-100 border border-amber-400"></div>
                    <span className="text-gray-600">Database</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-100 border border-gray-400"></div>
                    <span className="text-gray-600">External</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected Element Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {selectedElement ? "Element Details" : "Select an Element"}
              </h3>
              {selectedElement ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Name
                    </div>
                    <div className="font-medium text-gray-900">
                      {selectedElement.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Type
                    </div>
                    <div className="text-gray-700 capitalize">
                      {selectedElement.type.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </div>
                  {selectedElement.technology && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Technology
                      </div>
                      <div className="text-gray-700">
                        {selectedElement.technology}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Description
                    </div>
                    <div className="text-gray-700 text-sm">
                      {selectedElement.description}
                    </div>
                  </div>

                  {/* Relationships */}
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Relationships
                    </div>
                    <div className="space-y-2">
                      {getRelationshipsForElement(selectedElement.id).map(
                        (rel, idx) => {
                          const isSource = rel.sourceId === selectedElement.id;
                          const otherId = isSource
                            ? rel.targetId
                            : rel.sourceId;
                          const other = allElements.find(
                            (e) => e.id === otherId
                          );
                          return (
                            <div
                              key={idx}
                              className="text-xs bg-gray-50 rounded p-2"
                            >
                              <div className="flex items-center gap-1 text-gray-600">
                                {isSource ? (
                                  <>
                                    <span className="text-cyan-600">→</span>
                                    <span>{other?.name}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-cyan-600">←</span>
                                    <span>{other?.name}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-gray-500 mt-0.5">
                                {rel.description}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Children (containers) */}
                  {selectedElement.children &&
                    selectedElement.children.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          Containers
                        </div>
                        <div className="space-y-2">
                          {selectedElement.children.map((child) => (
                            <div
                              key={child.id}
                              className="text-xs bg-cyan-50 rounded p-2 border border-cyan-100"
                            >
                              <div className="font-medium text-cyan-800">
                                {child.name}
                              </div>
                              <div className="text-cyan-600">
                                {child.technology}
                              </div>
                              <div className="text-gray-600 mt-1">
                                {child.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Click on any element in the diagram to view its details and
                  relationships.
                </p>
              )}
            </div>

            {/* DSL Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Structurizr DSL
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                The architecture is defined using Structurizr DSL format. Click
                Export to download the full DSL file.
              </p>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto max-h-48 overflow-y-auto">
                {`workspace "DoctorLogic" {
  model {
    patient = person "Patient"
    staff = person "Practice Staff"

    webApp = softwareSystem "Web App" {
      frontend = container "Frontend"
      api = container "API Layer"
    }

    azureFunctions = softwareSystem "Azure Functions"
    cloudflareWorkers = softwareSystem "CF Workers"
    sqlDb = softwareSystem "SQL Database"

    patient -> webApp "Uses"
    webApp -> sqlDb "Reads/writes"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
