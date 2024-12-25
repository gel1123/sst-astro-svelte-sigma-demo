<script lang="ts">
  import { circlepack, circular, random } from "graphology-layout";
  import forceAtlas2 from "graphology-layout-forceatlas2";
  import FA2Layout from "graphology-layout-forceatlas2/worker";
  import { DirectedGraph } from "graphology";
  import type { Dataset, FiltersState } from "../types";
  import type { Settings } from "sigma/settings";
  import { createNodeImageProgram } from "@sigma/node-image";
  import { drawHover, drawLabel } from "../canvas-utils";
  import { constant, keyBy, mapValues, omit } from "../../common-utils";
  import { Sigma } from "sigma";
  import { onMount } from "svelte";
  import GraphSettingsController from "./GraphSettingsController.svelte";
  import GraphEventsController from "./GraphEventsController.svelte";
  import GraphDataController from "./GraphDataController.svelte";
  import { useDebounce } from "../use-debounce.svelte";
  import BookContent from "../icons/BookContent.svelte";
  import FullScreenControl from "./FullScreenControl.svelte";
  import ArrowsPointingIn from "../icons/ArrowsPointingIn.svelte";
  import ArrowsPointingOut from "../icons/ArrowsPointingOut.svelte";
  import ZoomControls from "./ZoomControls.svelte";
  import XMark from "../icons/XMark.svelte";
  import GraphTitle from "./GraphTitle.svelte";
  import SearchField from "./SearchField.svelte";
  import DescriptionPanel from "./DescriptionPanel.svelte";
  import ClustersPanel from "./ClustersPanel.svelte";
  import TagsPanel from "./TagsPanel.svelte";

  const graph = new DirectedGraph();
  const sigmaSettings: Partial<Settings> = {
    nodeProgramClasses: {
      image: createNodeImageProgram({
        size: { mode: "force", value: 256 },
      }),
    },
    defaultDrawNodeLabel: drawLabel,
    defaultDrawNodeHover: drawHover,
    defaultNodeType: "image",
    defaultEdgeType: "arrow",
    labelDensity: 0.07,
    labelGridCellSize: 60,
    labelRenderedSizeThreshold: 15,
    labelFont: "Lato, sans-serif",
    zIndex: true,
    // 下記を設定しないとエラーになる。 TODO: 記事にしたい
    // 参考: https://stackoverflow.com/questions/73144438/how-do-i-set-allowinvalidcontainer-in-sigmajs
    allowInvalidContainer: true,
  };

  let sigma = $state<Sigma | null>(null);
  let showContents = $state(false);
  let dataReady = $state(false);
  let dataset: Dataset | null = $state(null);
  let filtersState: FiltersState = $state({
    clusters: {},
    tags: {},
  });
  const debouncedHoveredNode = useDebounce<null | string>(null, 40);

  const setHoveredNode = (node: string | null) => {
    debouncedHoveredNode.update(node);
  };

  $inspect("dataset", dataset);

  fetch(`./dataset-sigma-demo.json`)
    .then((res) => res.json())
    .then((_dataset: Dataset) => {
      const clusters = keyBy(_dataset.clusters, "key");
      const tags = keyBy(_dataset.tags, "key");

      _dataset.nodes.forEach((node) =>
        graph.addNode(node.key, {
          ...node,
          ...omit(clusters[node.cluster], "key"),
          image: `./images/${tags[node.tag].image}`,
        })
      );

      random.assign(graph);
      // circular.assign(graph);

      // const settings = forceAtlas2.inferSettings(graph);
      // forceAtlas2.assign(graph, { settings, iterations: 1000 });

      _dataset.edges.forEach(([source, target]) =>
        graph.addEdge(source, target, { size: 1 })
      );

      // Use degrees as node sizes:
      const scores = graph
        .nodes()
        .map((node) => graph.getNodeAttribute(node, "score"));
      const minDegree = Math.min(...scores);
      const maxDegree = Math.max(...scores);
      const MIN_NODE_SIZE = 3;
      const MAX_NODE_SIZE = 30;
      graph.forEachNode((node) =>
        graph.setNodeAttribute(
          node,
          "size",
          ((graph.getNodeAttribute(node, "score") - minDegree) /
            (maxDegree - minDegree)) *
            (MAX_NODE_SIZE - MIN_NODE_SIZE) +
            MIN_NODE_SIZE
        )
      );

      filtersState = {
        clusters: mapValues(keyBy(_dataset.clusters, "key"), constant(true)),
        tags: mapValues(keyBy(_dataset.tags, "key"), constant(true)),
      };
      dataset = _dataset;
      requestAnimationFrame(() => (dataReady = true));
    });

  onMount(() => {
    const container = document.getElementById("sigma-container") as HTMLElement;
    sigma = new Sigma(graph, container, sigmaSettings);
  });

  $effect(() => {
    if (!dataReady || !sigma) return;
    const settings = forceAtlas2.inferSettings(graph);
    const fa2Layout = new FA2Layout(graph, {
      settings,
    });
    fa2Layout.start();

    setTimeout(() => {
      fa2Layout.stop();
    }, 30000);

    return () => {
      fa2Layout.stop();
      fa2Layout.kill();
    };
  });
</script>

<div id="app-root" class={showContents ? "show-contents" : ""}>
  <div class="react-sigma">
    <div class="sigma-container" id="sigma-container"></div>
    {#if sigma}
      <GraphSettingsController
        {sigma}
        debouncedHoveredNode={debouncedHoveredNode.value}
      />
      <GraphEventsController {sigma} {setHoveredNode} />
      <GraphDataController {sigma} filters={filtersState} />

      {#if dataReady && dataset}
        <div class="controls">
          <div class="react-sigma-control ico">
            <button
              type="button"
              class="show-contents"
              onclick={() => (showContents = true)}
              title="Show caption and description"
              aria-label="Show caption and description"
            >
              <BookContent />
            </button>
          </div>
          <div class="react-sigma-control ico">
            <FullScreenControl>
              {#snippet exitFullScreenLabel()}
                <ArrowsPointingIn />
              {/snippet}
              {#snippet enterFullScreenLabel()}
                <ArrowsPointingOut />
              {/snippet}
            </FullScreenControl>
          </div>
          <ZoomControls {sigma} />
        </div>
        <div class="contents">
          <div class="ico">
            <button
              type="button"
              class="ico hide-contents"
              onclick={() => (showContents = false)}
              title="Show caption and description"
            >
              <XMark />
            </button>
          </div>
          <GraphTitle {sigma} filters={filtersState} />
          <div class="panels">
            <SearchField {sigma} filters={filtersState} />
            <DescriptionPanel />
            <ClustersPanel
              {sigma}
              clusters={dataset.clusters}
              filters={filtersState}
              setClusters={(clusters) =>
                (filtersState = {
                  ...filtersState,
                  clusters,
                })}
              toggleCluster={(cluster) => {
                filtersState = {
                  ...filtersState,
                  clusters: filtersState.clusters[cluster]
                    ? omit(filtersState.clusters, cluster)
                    : { ...filtersState.clusters, [cluster]: true },
                };
              }}
            />
            <TagsPanel
              {sigma}
              tags={dataset.tags}
              filters={filtersState}
              setTags={(tags) =>
                (filtersState = {
                  ...filtersState,
                  tags,
                })}
              toggleTag={(tag) => {
                filtersState = {
                  ...filtersState,
                  tags: filtersState.tags[tag]
                    ? omit(filtersState.tags, tag)
                    : { ...filtersState.tags, [tag]: true },
                };
              }}
            />
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
