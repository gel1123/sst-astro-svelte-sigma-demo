<script lang="ts">
  import type { Sigma } from "sigma";
  import { type Snippet } from "svelte";
  import type { FiltersState } from "../types";

  let {
    sigma,
    filters,
    children,
  }: {
    sigma: Sigma;
    filters: FiltersState;
    children?: Snippet;
  } = $props();

  const graph = $derived(sigma.getGraph());

  $effect(() => {
    const { clusters, tags } = filters;
    graph.forEachNode((node, { cluster, tag }) =>
      graph.setNodeAttribute(node, "hidden", !clusters[cluster] || !tags[tag])
    );
  });
</script>

{@render children?.()}
