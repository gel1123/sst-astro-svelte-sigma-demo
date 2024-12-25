<script lang="ts">
  // 実装の背景: 簡易的なReact AnimateHeightコンポーネントの再現として実装した

  const {
    isOpen = false,
    duration = 300,
    easing = "ease",
    children,
  } = $props();

  let container = $state<HTMLDivElement | null>(null);
  let contentHeight = $state(0);

  function measureHeight() {
    if (!container || !isOpen) return;
    contentHeight = container.scrollHeight;
  }

  $effect(measureHeight);

  let containerStyle = $derived(`
    overflow: hidden;
    transition: height ${duration}ms ${easing};
    height: ${isOpen ? contentHeight + "px" : "0"};
  `);
</script>

<div bind:this={container} style={containerStyle}>
  {@render children()}
</div>
