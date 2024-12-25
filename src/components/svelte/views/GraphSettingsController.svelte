<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Sigma } from "sigma";
  import { drawHover, drawLabel } from "../canvas-utils";
  import type { Attributes } from "graphology-types";

  const NODE_FADE_COLOR = "#bbb";
  const EDGE_FADE_COLOR = "#eee";

  let {
    sigma,
    debouncedHoveredNode,
    children,
  }: {
    sigma: Sigma;
    debouncedHoveredNode: string | null;
    children?: Snippet;
  } = $props();

  const graph = $derived(sigma.getGraph());

  $effect(() => {
    const hoveredColor =
      (debouncedHoveredNode &&
        sigma.getNodeDisplayData(debouncedHoveredNode)?.color) ||
      "";

    sigma.setSettings({
      defaultDrawNodeLabel: drawLabel,
      defaultDrawNodeHover: drawHover,
      nodeReducer: (node: string, data: Attributes) => {
        if (debouncedHoveredNode) {
          return node === debouncedHoveredNode ||
            graph.hasEdge(node, debouncedHoveredNode) ||
            graph.hasEdge(debouncedHoveredNode, node)
            ? { ...data, zIndex: 1 }
            : {
                ...data,
                zIndex: 0,
                label: "",
                color: NODE_FADE_COLOR,
                image: null,
                highlighted: false,
              };
        }
        return data;
      },
      edgeReducer: (edge: string, data: Attributes) => {
        if (debouncedHoveredNode) {
          return graph.hasExtremity(edge, debouncedHoveredNode)
            ? { ...data, color: hoveredColor, size: 4 }
            : { ...data, color: EDGE_FADE_COLOR, hidden: true };
        }
        return data;
      },
    });
  });

  $effect(() => {
    const hoveredColor: string =
      (debouncedHoveredNode &&
        sigma.getNodeDisplayData(debouncedHoveredNode)?.color) ||
      "";

    sigma.setSetting(
      "nodeReducer",
      debouncedHoveredNode
        ? (node, data) =>
            node === debouncedHoveredNode ||
            graph.hasEdge(node, debouncedHoveredNode) ||
            graph.hasEdge(debouncedHoveredNode, node)
              ? { ...data, zIndex: 1 }
              : {
                  ...data,
                  zIndex: 0,
                  label: "",
                  color: NODE_FADE_COLOR,
                  image: null,
                  highlighted: false,
                }
        : null
    );
    sigma.setSetting(
      "edgeReducer",
      debouncedHoveredNode
        ? (edge, data) =>
            graph.hasExtremity(edge, debouncedHoveredNode)
              ? { ...data, color: hoveredColor, size: 4 }
              : { ...data, color: EDGE_FADE_COLOR, hidden: true }
        : null
    );
  });
</script>

{@render children?.()}
