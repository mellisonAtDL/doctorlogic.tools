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
      "Multi-tenant healthcare marketing website platform - builds and hosts websites for medical practices to generate patient leads",
  },
  model: {
    people: [
      {
        id: "websiteViewer",
        name: "Website Viewer",
        description: "Potential patient browsing a client practice website",
        type: "person",
        tags: ["external"],
      },
      {
        id: "client",
        name: "Client",
        description: "Practice staff/owner - pays for DL services, manages their site via admin",
        type: "person",
      },
      {
        id: "dlEmployee",
        name: "DL Employee",
        description: "Internal team - builds sites, manages clients, has elevated admin access",
        type: "person",
      },
      {
        id: "designer",
        name: "Designer",
        description: "Design team - works in website code/templates, non-branching workflow",
        type: "person",
      },
    ],
    softwareSystems: [
      // =========================================================================
      // EDGE LAYER
      // =========================================================================
      {
        id: "cloudflare",
        name: "Cloudflare Enterprise",
        description: "Edge network - CDN, caching (cache-everything), WAF, DNS, custom domain handling",
        type: "external",
        technology: "Cloudflare Enterprise",
        tags: ["edge"],
        children: [
          {
            id: "cloudflareCdn",
            name: "CDN + Cache",
            description: "Aggressive caching for all client websites",
            type: "container",
            technology: "Cache Everything",
          },
          {
            id: "cloudflareWorkers",
            name: "Workers",
            description: "Various edge customizations for specific client needs",
            type: "container",
            technology: "Cloudflare Workers",
          },
        ],
      },

      // =========================================================================
      // COMPUTE LAYER (Azure VMs)
      // =========================================================================
      {
        id: "webServers",
        name: "Web Servers",
        description: "4 production Windows VMs running IIS - serves client websites and admin",
        type: "softwareSystem",
        technology: "Windows Server, IIS, ASP.NET",
        tags: ["primary", "compute"],
        children: [
          {
            id: "adminProject",
            name: "Admin Project",
            description: "admin.doctorlogic.com - Client + Internal admin (role-based)",
            type: "container",
            technology: "ASP.NET MVC, React",
          },
          {
            id: "websitesProject",
            name: "Websites Project",
            description: "Serves client websites - multi-tenant with hostname→siteId mapping",
            type: "container",
            technology: "ASP.NET MVC",
          },
          {
            id: "coreProject",
            name: "Core Project",
            description: "Shared library - data access, business logic, models",
            type: "container",
            technology: "C# Class Library",
          },
        ],
      },
      {
        id: "loadBalancer",
        name: "Azure Load Balancer",
        description: "Distributes traffic across the 4 production web servers",
        type: "softwareSystem",
        technology: "Azure Load Balancer",
        tags: ["infrastructure"],
      },
      {
        id: "assetServer",
        name: "Asset Server",
        description: "assets.doctorlogic.com - serves images and media uploaded by DL team",
        type: "softwareSystem",
        technology: "Windows Server, IIS",
        tags: ["storage"],
      },
      {
        id: "devServer",
        name: "Dev/Test Server",
        description: "Development and testing environment - 1 Windows VM",
        type: "softwareSystem",
        technology: "Windows Server, IIS",
        tags: ["dev"],
      },

      // =========================================================================
      // DATA LAYER
      // =========================================================================
      {
        id: "sqlServer",
        name: "SQL Server",
        description: "Primary + backup VMs - single multi-tenant database (all clients, separated by siteId)",
        type: "database",
        technology: "SQL Server on VM",
        tags: ["storage"],
        children: [
          {
            id: "sqlPrimary",
            name: "Primary SQL",
            description: "Main database server",
            type: "database",
            technology: "SQL Server",
          },
          {
            id: "sqlBackup",
            name: "Backup SQL",
            description: "Backup/replica server",
            type: "database",
            technology: "SQL Server",
          },
          {
            id: "databaseMail",
            name: "Database Mail",
            description: "Sends emails via SendGrid relay",
            type: "component",
            technology: "SQL Server Database Mail",
          },
        ],
      },

      // =========================================================================
      // BACKGROUND PROCESSING
      // =========================================================================
      {
        id: "azureFunctions",
        name: "Azure Functions",
        description: "Multiple function apps for various background processing jobs",
        type: "softwareSystem",
        technology: "Azure Functions",
        tags: ["compute"],
      },
      {
        id: "ssis",
        name: "SSIS Jobs",
        description: "SQL Server Integration Services - ETL jobs, data fetching (BrightLocal, etc.)",
        type: "softwareSystem",
        technology: "SSIS",
        tags: ["compute"],
      },
      {
        id: "dapi",
        name: "DAPI",
        description: "Custom data job system built by data engineers - database + Azure Function hybrid",
        type: "softwareSystem",
        technology: "Custom (DB + Azure Function)",
        tags: ["compute"],
      },

      // =========================================================================
      // EXTERNAL SERVICES
      // =========================================================================
      {
        id: "sendgrid",
        name: "SendGrid",
        description: "Email delivery service - lead notifications, system emails",
        type: "external",
        technology: "SendGrid API",
        tags: ["external"],
      },
      {
        id: "googleAuth",
        name: "Google Auth",
        description: "Authentication for admin users",
        type: "external",
        technology: "Google OAuth",
        tags: ["external"],
      },
      {
        id: "googleAnalytics",
        name: "Google Analytics",
        description: "GA4 - client-configured, data pulled into admin via backend job",
        type: "external",
        technology: "GA4 API",
        tags: ["external"],
      },
      {
        id: "brightLocal",
        name: "BrightLocal",
        description: "Reviews and reputation management - data synced via SSIS",
        type: "external",
        technology: "BrightLocal API",
        tags: ["external"],
      },
      {
        id: "openai",
        name: "OpenAI",
        description: "AI features in admin (minor usage)",
        type: "external",
        technology: "OpenAI API",
        tags: ["external"],
      },
      {
        id: "ctm",
        name: "CTM",
        description: "CallTrackingMetrics - optional add-on for call tracking",
        type: "external",
        technology: "CTM",
        tags: ["external", "optional"],
      },
    ],
    relationships: [
      // =========================================================================
      // WEBSITE VIEWER FLOW (Lead Generation)
      // =========================================================================
      {
        sourceId: "websiteViewer",
        targetId: "cloudflare",
        description: "Visits client website",
        technology: "HTTPS (custom domain)",
      },
      {
        sourceId: "cloudflare",
        targetId: "loadBalancer",
        description: "Routes to origin",
        technology: "HTTPS",
      },
      {
        sourceId: "loadBalancer",
        targetId: "webServers",
        description: "Distributes traffic",
        technology: "HTTP",
      },
      {
        sourceId: "webServers",
        targetId: "sqlServer",
        description: "Loads site content, saves leads",
        technology: "SQL/TDS",
      },
      {
        sourceId: "webServers",
        targetId: "assetServer",
        description: "References images",
        technology: "HTTPS",
      },

      // =========================================================================
      // CLIENT FLOW (Practice Admin)
      // =========================================================================
      {
        sourceId: "client",
        targetId: "cloudflare",
        description: "Accesses admin.doctorlogic.com",
        technology: "HTTPS",
      },
      {
        sourceId: "client",
        targetId: "googleAuth",
        description: "Authenticates via",
        technology: "OAuth",
      },

      // =========================================================================
      // DL EMPLOYEE FLOW
      // =========================================================================
      {
        sourceId: "dlEmployee",
        targetId: "cloudflare",
        description: "Accesses admin (internal features)",
        technology: "HTTPS",
      },
      {
        sourceId: "dlEmployee",
        targetId: "assetServer",
        description: "Uploads images/media",
        technology: "HTTPS",
      },
      {
        sourceId: "dlEmployee",
        targetId: "googleAuth",
        description: "Authenticates via",
        technology: "OAuth",
      },

      // =========================================================================
      // DESIGNER FLOW
      // =========================================================================
      {
        sourceId: "designer",
        targetId: "webServers",
        description: "Edits site templates/code",
        technology: "Git/Deploy",
      },
      {
        sourceId: "designer",
        targetId: "devServer",
        description: "Tests changes",
        technology: "HTTPS",
      },

      // =========================================================================
      // EMAIL FLOW
      // =========================================================================
      {
        sourceId: "sqlServer",
        targetId: "sendgrid",
        description: "Sends emails (lead notifications)",
        technology: "SMTP via Database Mail",
      },

      // =========================================================================
      // BACKGROUND PROCESSING
      // =========================================================================
      {
        sourceId: "azureFunctions",
        targetId: "sqlServer",
        description: "Processes data",
        technology: "SQL/TDS",
      },
      {
        sourceId: "ssis",
        targetId: "sqlServer",
        description: "ETL data sync",
        technology: "SQL/TDS",
      },
      {
        sourceId: "ssis",
        targetId: "brightLocal",
        description: "Fetches review data",
        technology: "API",
      },
      {
        sourceId: "dapi",
        targetId: "sqlServer",
        description: "Custom data jobs",
        technology: "SQL/TDS",
      },
      {
        sourceId: "azureFunctions",
        targetId: "googleAnalytics",
        description: "Pulls GA4 data",
        technology: "Analytics API",
      },

      // =========================================================================
      // EXTERNAL INTEGRATIONS
      // =========================================================================
      {
        sourceId: "webServers",
        targetId: "openai",
        description: "AI features",
        technology: "API",
      },
      {
        sourceId: "webServers",
        targetId: "ctm",
        description: "Call tracking (optional)",
        technology: "API",
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
// VIEW TYPES
// =============================================================================

type ViewLevel = "context" | "container";

interface ViewState {
  level: ViewLevel;
  focusedSystemId: string | null;
  breadcrumbs: { id: string | null; name: string }[];
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ArchitecturePage() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    level: "context",
    focusedSystemId: null,
    breadcrumbs: [{ id: null, name: "System Context" }],
  });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Get focused system if in container view
  const focusedSystem = viewState.focusedSystemId
    ? architecture.model.softwareSystems.find(
        (s) => s.id === viewState.focusedSystemId
      )
    : null;

  // Drill down into a system
  const drillDown = (system: Element) => {
    if (system.children && system.children.length > 0) {
      setViewState({
        level: "container",
        focusedSystemId: system.id,
        breadcrumbs: [
          { id: null, name: "System Context" },
          { id: system.id, name: system.name },
        ],
      });
      setSelectedElement(null);
      setPan({ x: 0, y: 0 });
      setScale(1);
    }
  };

  // Navigate back via breadcrumb
  const navigateTo = (breadcrumbId: string | null) => {
    if (breadcrumbId === null) {
      setViewState({
        level: "context",
        focusedSystemId: null,
        breadcrumbs: [{ id: null, name: "System Context" }],
      });
      setSelectedElement(null);
      setPan({ x: 0, y: 0 });
      setScale(1);
    }
  };

  // Get elements to display based on view level
  const getVisibleElements = useCallback((): Element[] => {
    if (viewState.level === "context") {
      // Show all people and software systems (high level)
      return [
        ...architecture.model.people,
        ...architecture.model.softwareSystems,
      ];
    } else if (viewState.level === "container" && focusedSystem) {
      // Show the focused system's children (containers)
      // Plus any external systems that connect to this system
      const containers = focusedSystem.children || [];

      // Find related external systems
      const relatedSystemIds = new Set<string>();
      architecture.model.relationships.forEach((rel) => {
        if (rel.sourceId === focusedSystem.id) {
          relatedSystemIds.add(rel.targetId);
        }
        if (rel.targetId === focusedSystem.id) {
          relatedSystemIds.add(rel.sourceId);
        }
      });

      const relatedSystems = architecture.model.softwareSystems.filter(
        (s) => relatedSystemIds.has(s.id) && s.id !== focusedSystem.id
      );
      const relatedPeople = architecture.model.people.filter((p) =>
        relatedSystemIds.has(p.id)
      );

      return [...relatedPeople, ...containers, ...relatedSystems];
    }
    return [];
  }, [viewState.level, focusedSystem]);

  // Calculate positions for elements - organized by layer
  const getPositions = useCallback(() => {
    const positions: Record<string, NodePosition> = {};
    const nodeWidth = 160;
    const nodeHeight = 110;
    const spacingX = 30;
    const spacingY = 140;
    const canvasWidth = 1400;

    // Helper to center a row
    const centerRow = (count: number) =>
      (canvasWidth - (count * nodeWidth + (count - 1) * spacingX)) / 2;

    if (viewState.level === "context") {
      // CONTEXT VIEW - Show all systems organized by layer

      // ROW 0: People (y = 20)
      const people = architecture.model.people;
      const peopleStartX = centerRow(people.length);
      people.forEach((person, i) => {
        positions[person.id] = {
          x: peopleStartX + i * (nodeWidth + spacingX),
          y: 20,
          width: nodeWidth,
          height: nodeHeight,
        };
      });

      // ROW 1: Edge Layer - Cloudflare (y = 160)
      positions["cloudflare"] = {
        x: canvasWidth / 2 - nodeWidth / 2,
        y: 20 + spacingY,
        width: nodeWidth,
        height: nodeHeight,
      };

      // ROW 2: Compute Layer - Load Balancer, Web Servers, Asset Server, Dev (y = 300)
      const computeLayer = [
        "loadBalancer",
        "webServers",
        "assetServer",
        "devServer",
      ];
      const computeStartX = centerRow(computeLayer.length);
      computeLayer.forEach((id, i) => {
        positions[id] = {
          x: computeStartX + i * (nodeWidth + spacingX),
          y: 20 + spacingY * 2,
          width: nodeWidth,
          height: nodeHeight,
        };
      });

      // ROW 3: Data + Background Processing (y = 440)
      const dataLayer = ["sqlServer", "azureFunctions", "ssis", "dapi"];
      const dataStartX = centerRow(dataLayer.length);
      dataLayer.forEach((id, i) => {
        positions[id] = {
          x: dataStartX + i * (nodeWidth + spacingX),
          y: 20 + spacingY * 3,
          width: nodeWidth,
          height: nodeHeight,
        };
      });

      // ROW 4: External Services (y = 580)
      const externalLayer = [
        "sendgrid",
        "googleAuth",
        "googleAnalytics",
        "brightLocal",
        "openai",
        "ctm",
      ];
      const externalStartX = centerRow(externalLayer.length);
      externalLayer.forEach((id, i) => {
        positions[id] = {
          x: externalStartX + i * (nodeWidth + spacingX),
          y: 20 + spacingY * 4,
          width: nodeWidth,
          height: nodeHeight,
        };
      });
    } else if (viewState.level === "container" && focusedSystem) {
      // CONTAINER VIEW - Show focused system's internals

      const visibleElements = getVisibleElements();
      const containers =
        focusedSystem.children?.map((c) => c.id) || [];
      const relatedPeople = visibleElements
        .filter((e) => e.type === "person")
        .map((e) => e.id);
      const relatedSystems = visibleElements
        .filter(
          (e) =>
            e.type !== "person" &&
            !containers.includes(e.id) &&
            e.id !== focusedSystem.id
        )
        .map((e) => e.id);

      // ROW 0: Related people (y = 20)
      if (relatedPeople.length > 0) {
        const peopleStartX = centerRow(relatedPeople.length);
        relatedPeople.forEach((id, i) => {
          positions[id] = {
            x: peopleStartX + i * (nodeWidth + spacingX),
            y: 20,
            width: nodeWidth,
            height: nodeHeight,
          };
        });
      }

      // ROW 1: Containers (inside the focused system) (y = 180)
      if (containers.length > 0) {
        const containersStartX = centerRow(containers.length);
        containers.forEach((id, i) => {
          positions[id] = {
            x: containersStartX + i * (nodeWidth + spacingX),
            y: 180,
            width: nodeWidth,
            height: nodeHeight,
          };
        });
      }

      // ROW 2: Related external systems (y = 360)
      if (relatedSystems.length > 0) {
        const systemsStartX = centerRow(relatedSystems.length);
        relatedSystems.forEach((id, i) => {
          positions[id] = {
            x: systemsStartX + i * (nodeWidth + spacingX),
            y: 360,
            width: nodeWidth,
            height: nodeHeight,
          };
        });
      }
    }

    return positions;
  }, [viewState.level, focusedSystem, getVisibleElements]);

  const positions = getPositions();
  const visibleElements = getVisibleElements();

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

  // Get all elements for relationship lookup
  const allElements = [
    ...architecture.model.people,
    ...architecture.model.softwareSystems,
    ...architecture.model.softwareSystems.flatMap((s) => s.children || []),
  ];

  // Check if element has children (can drill down)
  const canDrillDown = (element: Element) => {
    return element.children && element.children.length > 0;
  };

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
              <div className="flex items-center gap-4">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-1 text-sm">
                  {viewState.breadcrumbs.map((crumb, idx) => (
                    <div key={idx} className="flex items-center">
                      {idx > 0 && (
                        <svg
                          className="w-4 h-4 text-gray-400 mx-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                      <button
                        onClick={() => navigateTo(crumb.id)}
                        className={`px-2 py-1 rounded ${
                          idx === viewState.breadcrumbs.length - 1
                            ? "bg-cyan-100 text-cyan-800 font-medium"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    title="Zoom out"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                  <span className="text-xs text-gray-500 w-12 text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    title="Zoom in"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    title="Reset view"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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
              className="relative h-[700px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
              style={{ cursor: isPanning ? "grabbing" : "grab" }}
            >
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 1400 750"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <g
                  transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
                  style={{ transformOrigin: "700px 375px" }}
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
                  <rect width="1400" height="750" fill="url(#grid)" />

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

                  {/* Focused System Background (when in container view) */}
                  {viewState.level === "container" && focusedSystem && (
                    <g>
                      <rect
                        x={100}
                        y={140}
                        width={1200}
                        height={200}
                        rx={12}
                        fill="#f0f9ff"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        strokeDasharray="8 4"
                      />
                      <text
                        x={120}
                        y={165}
                        fontSize={14}
                        fontWeight="bold"
                        fill="#0369a1"
                      >
                        {focusedSystem.name}
                      </text>
                      <text x={120} y={182} fontSize={11} fill="#0ea5e9">
                        [{focusedSystem.technology}]
                      </text>
                    </g>
                  )}

                  {/* Elements */}
                  {visibleElements.map((element) => {
                    const pos = positions[element.id];
                    if (!pos) return null;

                    const hasDrillDown = canDrillDown(element);

                    return (
                      <g key={element.id}>
                        <ElementCard
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
                        {/* Drill-down indicator */}
                        {hasDrillDown && viewState.level === "context" && (
                          <g
                            transform={`translate(${pos.x + pos.width - 28}, ${pos.y + 4})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              drillDown(element);
                            }}
                            className="cursor-pointer"
                          >
                            <rect
                              width={24}
                              height={24}
                              rx={4}
                              fill="#0ea5e9"
                              className="hover:fill-cyan-600"
                            />
                            <svg
                              x={4}
                              y={4}
                              width={16}
                              height={16}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth={2}
                            >
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  Legend
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-blue-100 border border-blue-400"></div>
                    <span className="text-gray-600">Person</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-400"></div>
                    <span className="text-gray-600">System</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-cyan-100 border border-cyan-400"></div>
                    <span className="text-gray-600">Container</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-amber-100 border border-amber-400"></div>
                    <span className="text-gray-600">Database</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-100 border border-gray-400"></div>
                    <span className="text-gray-600">External</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-cyan-500"></div>
                    <span className="text-gray-600">Drill Down</span>
                  </div>
                </div>
              </div>

              {/* View Level Indicator */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  View Level
                </div>
                <div className="font-medium text-gray-900">
                  {viewState.level === "context"
                    ? "System Context (C1)"
                    : "Container (C2)"}
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

                  {/* Drill Down Button */}
                  {selectedElement.children &&
                    selectedElement.children.length > 0 &&
                    viewState.level === "context" && (
                      <button
                        onClick={() => drillDown(selectedElement)}
                        className="w-full py-2 px-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                          />
                        </svg>
                        Drill Down to Containers
                      </button>
                    )}

                  {/* Children (containers) */}
                  {selectedElement.children &&
                    selectedElement.children.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          Contains {selectedElement.children.length} Container
                          {selectedElement.children.length > 1 ? "s" : ""}
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
                Architecture defined in Structurizr DSL format. Click Export for
                full file.
              </p>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto max-h-64 overflow-y-auto">
                {`workspace "DoctorLogic Platform" {
  model {
    # People
    viewer = person "Website Viewer"
    client = person "Client"
    employee = person "DL Employee"
    designer = person "Designer"

    # Edge
    cloudflare = softwareSystem "Cloudflare" {
      cdn = container "CDN + Cache"
      workers = container "Workers"
    }

    # Compute (Azure VMs)
    webServers = softwareSystem "Web Servers" {
      admin = container "Admin Project"
      websites = container "Websites Project"
      core = container "Core Project"
    }
    loadBalancer = softwareSystem "Azure LB"
    assetServer = softwareSystem "Asset Server"

    # Data
    sqlServer = softwareSystem "SQL Server"

    # Background
    azureFunctions = softwareSystem "Azure Functions"
    ssis = softwareSystem "SSIS Jobs"
    dapi = softwareSystem "DAPI"

    # External
    sendgrid = softwareSystem "SendGrid"
    googleAuth = softwareSystem "Google Auth"
    brightLocal = softwareSystem "BrightLocal"

    # Relationships
    viewer -> cloudflare "Visits site"
    cloudflare -> loadBalancer "Routes"
    loadBalancer -> webServers "Distributes"
    webServers -> sqlServer "Reads/writes"
    sqlServer -> sendgrid "Sends email"
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
