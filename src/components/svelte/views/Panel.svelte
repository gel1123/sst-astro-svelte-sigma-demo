<script lang="ts">
  import type { Snippet } from "svelte";
  import ChevronUp from "../icons/ChevronUp.svelte";
  import ChevronDown from "../icons/ChevronDown.svelte";
  import AnimateHeight from "./AnimateHeight.svelte";

  const DURATION = 300;

  const {
    title,
    initiallyDeployed,
    children,
  }: {
    title: Snippet;
    initiallyDeployed?: boolean;
    children: Snippet;
  } = $props();

  let isDeployed = $state(initiallyDeployed || false);
  let dom = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (isDeployed)
      setTimeout(() => {
        if (dom)
          dom.parentElement?.scrollTo({
            top: dom.offsetTop - 5,
            behavior: "smooth",
          });
      }, DURATION);
  });
</script>

<div class="panel" bind:this={dom}>
  <h2>
    {@render title()}{" "}
    <button type="button" onclick={() => (isDeployed = !isDeployed)}>
      {#if isDeployed}
        <ChevronUp />
      {:else}
        <ChevronDown />
      {/if}
    </button>
  </h2>
  <AnimateHeight duration={DURATION} isOpen={isDeployed}>
    {#if isDeployed}
      {@render children()}
    {/if}
  </AnimateHeight>
</div>
