<script lang="ts">
  import type { Sigma } from "sigma";
  import { onMount, type Snippet } from "svelte";

  function getMouseLayer() {
    return document.querySelector(".sigma-mouse");
  }

  let {
    sigma,
    setHoveredNode,
    children,
  }: {
    sigma: Sigma;
    setHoveredNode: (args: string | null) => void;
    children?: Snippet;
  } = $props();

  const graph = $derived(sigma.getGraph());

  onMount(() => {
    sigma.on("clickNode", ({ node }) => {
      if (!graph.getNodeAttribute(node, "hidden")) {
        window.open(graph.getNodeAttribute(node, "URL"), "_blank");
      }
    });

    sigma.on("enterNode", ({ node }) => {
      setHoveredNode(node);
      const mouseLayer = getMouseLayer();
      if (mouseLayer) mouseLayer.classList.add("mouse-pointer");
    });

    sigma.on("leaveNode", () => {
      setHoveredNode(null);
      const mouseLayer = getMouseLayer();
      if (mouseLayer) mouseLayer.classList.remove("mouse-pointer");
    });
  });
</script>

{@render children?.()}
