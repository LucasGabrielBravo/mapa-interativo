<script lang="ts">
	import { layers, type ILayer } from "$lib/stores/layers"
	import { mapView } from "$lib/stores/mapView"

  let isLoadingLayer = false	

  async function handleChangeCheckboxLayer(layer: ILayer) {
		if (layer.enable) {
			isLoadingLayer = true
			await mapView.addLayer(layer)
			isLoadingLayer = false
		} else {
			mapView.removeLayer(layer.label)
		}
	}	
</script>
<div class="p-4 bg-white w-full">
  <div class="flex flex-col w-full">
    <strong class="text-surface-800">Pontos de interesse</strong>

    {#each $layers as layer}
      <label class="flex items-center space-x-2">
        <div class="h-4 w-4 rounded-full" style={`background-color: rgba(${layer.color.join(", ")});`} />
        <input
          class="checkbox"
          type="checkbox"
          bind:checked={layer.enable}
          on:change={() => handleChangeCheckboxLayer(layer)}
          disabled={isLoadingLayer}
        />
        <p>{layer.label}</p>
      </label>
    {/each}
  </div>
</div>