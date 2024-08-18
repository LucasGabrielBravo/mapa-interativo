<script lang="ts">
	import Icon from '$lib/components/Icon.svelte'
	import LayerSelector from '$lib/components/LayerSelector.svelte'
	import Map from '$lib/components/Map.svelte'
	import { layers } from '$lib/stores/layers'
	import { mapView } from '$lib/stores/mapView'
	import { getDrawerStore } from "@skeletonlabs/skeleton"
	import { onMount } from 'svelte'

	const drawer = getDrawerStore()
		
	function handleClickOpenDrawerLayerSelector() {
		drawer.open({
			id: "DrawerLayerSelector",
			width: "w-96 max-w-[80%]",
			position: "right",
			bgDrawer: "bg-white"
		})
	}

	onMount(() => {
		$layers.forEach((item) => {
			if(item.enable){
				mapView.addLayer(item)
			}
		})
	})
</script>

<div class="relative h-full w-full">
	{#key new Date().getTime()}
		<Map />
	{/key}

	<div class="absolute flex items-center gap-4 w-max top-4 right-4 sm:left-1/2 sm:-translate-x-1/2 ">
		<span class="bg-white shadow-sm rounded-container-token p-4 text-sm lg:text-base">
			Mapa interativo - Rio de Janeiro
		</span>
		<button on:click={handleClickOpenDrawerLayerSelector} class="sm:hidden btn rounded-full p-2 bg-white aspect-square text-xl text-surface-700">
			<Icon icon="mdi:filter" />
		</button>
	</div>

	<div class="hidden sm:flex absolute shadow-md rounded-container-token bottom-8 right-4 w-96">
		<LayerSelector />
	</div>
</div>
