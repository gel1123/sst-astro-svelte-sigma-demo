<script lang="ts">
  import type { Sigma } from "sigma";
  import type { Cluster, FiltersState } from "../types";
  import { keyBy, mapValues, sortBy, values } from "../../common-utils";
  import Panel from "./Panel.svelte";
  import RectangleGroup from "../icons/RectangleGroup.svelte";
  import CheckCircle from "../icons/CheckCircle.svelte";
  import XCircle from "../icons/XCircle.svelte";

  const {
    sigma,
    clusters,
    filters,
    toggleCluster,
    setClusters,
  }: {
    sigma: Sigma;
    clusters: Cluster[];
    filters: FiltersState;
    toggleCluster: (cluster: string) => void;
    setClusters: (clusters: Record<string, boolean>) => void;
  } = $props();

  const graph = sigma.getGraph();
  let nodesPerCluster = $derived.by(() => {
    const index: Record<string, number> = {};
    graph.forEachNode(
      (_, { cluster }) => (index[cluster] = (index[cluster] || 0) + 1)
    );
    return index;
  });
  let maxNodesPerCluster = $derived(Math.max(...values(nodesPerCluster)));
  let visibleClustersCount = $derived(Object.keys(filters.clusters).length);

  // svelte-ignore state_referenced_locally
  let visibleNodesPerCluster = $state(nodesPerCluster);

  $effect(() => {
    filters;

    requestAnimationFrame(() => {
      const index: Record<string, number> = {};
      graph.forEachNode(
        (_, { cluster, hidden }) =>
          !hidden && (index[cluster] = (index[cluster] || 0) + 1)
      );
      visibleNodesPerCluster = index;
    });
  });

  let sortedClusters = $derived(
    sortBy(clusters, (cluster) => -nodesPerCluster[cluster.key])
  );
</script>

{#snippet title()}
  <RectangleGroup class="text-muted" /> Clusters
  {#if visibleClustersCount < clusters.length}
    <span class="text-muted text-small">
      {" "}
      ({visibleClustersCount} / {clusters.length})
    </span>
  {/if}
{/snippet}

<Panel {title} initiallyDeployed={false}>
  <p>
    <i class="text-muted"
      >Click a cluster to show/hide related pages from the network.</i
    >
  </p>
  <p class="buttons">
    <button
      class="btn"
      onclick={() => setClusters(mapValues(keyBy(clusters, "key"), () => true))}
    >
      <CheckCircle /> Check all
    </button>{" "}
    <button class="btn" onclick={() => setClusters({})}>
      <XCircle /> Uncheck all
    </button>
  </p>
  <ul>
    {#each sortedClusters as cluster}
      {@const nodesCount = nodesPerCluster[cluster.key]}
      {@const visibleNodesCount = visibleNodesPerCluster[cluster.key] || 0}
      <li
        class="caption-row"
        title="{nodesCount} page{nodesCount > 1
          ? 's'
          : ''}{visibleNodesCount !== nodesCount
          ? visibleNodesCount > 0
            ? ` (only ${visibleNodesCount > 1 ? `${visibleNodesCount} are` : 'one is'} visible)`
            : ' (all hidden)'
          : ''}"
      >
        <input
          type="checkbox"
          checked={filters.clusters[cluster.key] || false}
          onchange={() => toggleCluster(cluster.key)}
          id="cluster-{cluster.key}"
        />
        <label for="cluster-{cluster.key}">
          <span
            class="circle"
            style="background: {cluster.color}; border-color: {cluster.color}"
          ></span>{" "}
          <div class="node-label">
            <span>{cluster.clusterLabel}</span>
            <div
              class="bar"
              style={`width: ${(100 * nodesCount) / maxNodesPerCluster + "%"} `}
            >
              <div
                class="inside-bar"
                style={`width: ${(100 * visibleNodesCount) / nodesCount + "%"}}`}
              ></div>
            </div>
          </div>
        </label>
      </li>
    {/each}
  </ul>
</Panel>
