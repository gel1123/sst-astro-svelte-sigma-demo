<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  const {
    enterFullScreenLabel,
    exitFullScreenLabel,
  }: {
    enterFullScreenLabel: Snippet;
    exitFullScreenLabel: Snippet;
  } = $props();

  let isFullscreen = $state(false);

  onMount(() => {
    isFullscreen = document.fullscreenElement !== null;
  });

  const handleOnClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      isFullscreen = false;
      return;
    }
    document.body.requestFullscreen();
    isFullscreen = true;
  };
</script>

<button
  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
  onclick={handleOnClick}
>
  {#if isFullscreen}
    {@render exitFullScreenLabel()}
  {:else}
    {@render enterFullScreenLabel()}
  {/if}
</button>
