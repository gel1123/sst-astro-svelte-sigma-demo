<script lang="ts">
  import type { Sigma } from "sigma";
  import type { FiltersState } from "../types";
  import MagnifyingGlass from "../icons/MagnifyingGlass.svelte";
  import type { Attributes } from "graphology-types";

  let {
    sigma,
    filters,
  }: {
    sigma: Sigma;
    filters: FiltersState;
  } = $props();

  let search = $state("");
  let values = $state<Array<{ id: string; label: string }>>([]);
  let selected = $state<string | null>(null);

  const refreshValues = () => {
    const newValues: Array<{ id: string; label: string }> = [];
    const lcSearch = search.toLowerCase();
    if (!selected && search.length > 1) {
      sigma
        .getGraph()
        .forEachNode((key: string, attributes: Attributes): void => {
          if (
            !attributes.hidden &&
            attributes.label &&
            attributes.label.toLowerCase().indexOf(lcSearch) === 0
          )
            newValues.push({ id: key, label: attributes.label });
        });
    }
    values = newValues;
  };

  $effect(() => {
    search;
    refreshValues();
  });

  $effect(() => {
    filters;
    requestAnimationFrame(refreshValues);
  });

  $effect(() => {
    if (!selected) return;

    sigma.getGraph().setNodeAttribute(selected, "highlighted", true);
    const nodeDisplayData = sigma.getNodeDisplayData(selected);

    if (nodeDisplayData)
      sigma.getCamera().animate(
        { ...nodeDisplayData, ratio: 0.05 },
        {
          duration: 600,
        }
      );

    return () => {
      sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
    };
  });

  const onInputChange = (e: Event) => {
    const searchString = (e.target as HTMLInputElement).value;
    const valueItem = values.find((value) => value.label === searchString);
    if (valueItem) {
      search = valueItem.label;
      values = [];
      selected = valueItem.id;
    } else {
      selected = null;
      search = searchString;
    }
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && values.length) {
      search = values[0].label;
      selected = values[0].id;
    }
  };
</script>

<div class="search-wrapper">
  <input
    type="search"
    placeholder="Search in nodes..."
    list="nodes"
    value={search}
    oninput={onInputChange}
    onkeypress={onKeyPress}
  />
  <MagnifyingGlass class="icon" />
  <datalist id="nodes">
    {#each values as value (value.id)}
      <option value={value.label}>{value.label}</option>
    {/each}
  </datalist>
</div>
