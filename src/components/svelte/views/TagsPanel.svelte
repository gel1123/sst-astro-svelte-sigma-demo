<script lang="ts">
  import type { Sigma } from "sigma";
  import type { FiltersState, Tag } from "../types";
  import { keyBy, mapValues, sortBy, values } from "../../common-utils";
  import TagOutline from "../icons/TagOutline.svelte";
  import Panel from "./Panel.svelte";
  import CheckCircle from "../icons/CheckCircle.svelte";
  import XCircle from "../icons/XCircle.svelte";

  const {
    sigma,
    tags,
    filters,
    toggleTag,
    setTags,
  }: {
    sigma: Sigma;
    tags: Tag[];
    filters: FiltersState;
    toggleTag: (tag: string) => void;
    setTags: (tags: Record<string, boolean>) => void;
  } = $props();

  const graph = sigma.getGraph();

  let nodesPerTag = $derived.by(() => {
    const index: Record<string, number> = {};
    graph.forEachNode((_, { tag }) => (index[tag] = (index[tag] || 0) + 1));
    return index;
  });
  let maxNodesPerTag = $derived(Math.max(...values(nodesPerTag)));
  let visibleTagsCount = $derived(Object.keys(filters.tags).length);

  // svelte-ignore state_referenced_locally
  let visibleNodesPerTag = $state(nodesPerTag);

  $effect(() => {
    filters;

    requestAnimationFrame(() => {
      const index: Record<string, number> = {};
      graph.forEachNode(
        (_, { tag, hidden }) => !hidden && (index[tag] = (index[tag] || 0) + 1)
      );
      visibleNodesPerTag = index;
    });
  });

  const sortedTags = $derived(
    sortBy(tags, (tag) =>
      tag.key === "unknown" ? Infinity : -nodesPerTag[tag.key]
    )
  );
</script>

{#snippet title()}
  <TagOutline class="text-muted" /> Categories
  {#if visibleTagsCount < tags.length}
    <span class="text-muted text-small">
      {" "}
      ({visibleTagsCount} / {tags.length})
    </span>
  {/if}
{/snippet}

<Panel {title} initiallyDeployed={false}>
  <p>
    <i class="text-muted"
      >Click a category to show/hide related pages from the network.</i
    >
  </p>
  <p class="buttons">
    <button
      class="btn"
      onclick={() => setTags(mapValues(keyBy(tags, "key"), () => true))}
    >
      <CheckCircle /> Check all
    </button>{" "}
    <button class="btn" onclick={() => setTags({})}>
      <XCircle /> Uncheck all
    </button>
  </p>
  <ul>
    {#each sortedTags as tag (tag.key)}
      {@const nodesCount = nodesPerTag[tag.key]}
      {@const visibleNodesCount = visibleNodesPerTag[tag.key] || 0}
      <li
        class="caption-row"
        title={`${nodesCount} page${nodesCount > 1 ? "s" : ""}${
          visibleNodesCount !== nodesCount
            ? visibleNodesCount > 0
              ? ` (only ${visibleNodesCount > 1 ? `${visibleNodesCount} are` : "one is"} visible)`
              : " (all hidden)"
            : ""
        }`}
      >
        <input
          type="checkbox"
          checked={filters.tags[tag.key] || false}
          onchange={() => toggleTag(tag.key)}
          id={`tag-${tag.key}`}
        />
        <label for={`tag-${tag.key}`}>
          <span
            class="circle"
            style={`background-image: url(./images/${tag.image})`}
          ></span>{" "}
          <div class="node-label">
            <span>{tag.key}</span>
            <div
              class="bar"
              style={`width: ${(100 * nodesCount) / maxNodesPerTag + "%"}`}
            >
              <div
                class="inside-bar"
                style={`width: ${(100 * visibleNodesCount) / nodesCount + "%"}`}
              ></div>
            </div>
          </div>
        </label>
      </li>
    {/each}
  </ul>
</Panel>
