<script lang="ts">
  import type { Sigma } from "sigma";

  let { sigma }: { sigma: Sigma } = $props();

  const camera = sigma.getCamera();
  const zoomIn = () => camera.animatedZoom({ duration: 300 });
  const zoomOut = () => camera.animatedUnzoom({ duration: 300 });
  const resetZoomAndPosition = () => camera.animatedReset({ duration: 300 });
</script>

<div class="react-sigma-control ico">
  <button type="button" onclick={zoomIn} title="Zoom in" aria-label="Zoom in">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
      />
    </svg>
  </button>
</div>
<div class="react-sigma-control ico">
  <button
    type="button"
    onclick={zoomOut}
    title="Zoom out"
    aria-label="Zoom out"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
      />
    </svg>
  </button>
</div>
<div class="react-sigma-control ico">
  <button
    type="button"
    onclick={resetZoomAndPosition}
    title="Reset zoom and position"
    aria-label="Reset zoom and position"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  </button>
</div>
