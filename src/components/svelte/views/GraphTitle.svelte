<script lang="ts">
  import type { Sigma } from "sigma";
  import type { FiltersState } from "../types";

  function prettyPercentage(val: number): string {
    return (val * 100).toFixed(1) + "%";
  }

  let {
    sigma,
    filters,
  }: {
    sigma: Sigma;
    filters: FiltersState;
  } = $props();

  let visibleItems = $state({ nodes: 0, edges: 0 });
  const graph = $derived(sigma.getGraph());

  $effect(() => {
    filters;

    requestAnimationFrame(() => {
      const index = { nodes: 0, edges: 0 };
      graph.forEachNode((_, { hidden }) => !hidden && index.nodes++);
      graph.forEachEdge(
        (_, _2, _3, _4, source, target) =>
          !source.hidden && !target.hidden && index.edges++
      );
      visibleItems = index;
    });
  });
</script>

<div class="graph-title">
  <h1>A cartography of Wikipedia pages around data visualization</h1>
  <h2>
    <i>
      {graph.order} node{graph.order > 1 ? "s" : ""}{" "}
      {visibleItems.nodes !== graph.order
        ? ` (only ${prettyPercentage(visibleItems.nodes / graph.order)} visible)`
        : ""}
      , {graph.size} edge{graph.size > 1 ? "s" : ""}{" "}
      {visibleItems.edges !== graph.size
        ? ` (only ${prettyPercentage(visibleItems.edges / graph.size)} visible)`
        : ""}
    </i>
  </h2>
</div>
