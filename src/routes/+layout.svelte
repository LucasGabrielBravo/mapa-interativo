<script lang="ts">
	import '@arcgis/core/assets/esri/themes/light/main.css'
	import 'iconify-icon'
	import '../app.postcss'
// Floating UI for Popups
	import DrawerLayerSelector from '$lib/components/DrawerLayerSelector.svelte'
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
	import { Drawer, getDrawerStore, initializeStores, storePopup } from '@skeletonlabs/skeleton'
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores()

	const drawer = getDrawerStore()	
</script>

<svelte:head>
	<title>Mapa interativo - Rio de Janeiro</title>
</svelte:head>

<Drawer>
	{#if $drawer.id === "DrawerLayerSelector"}
		<DrawerLayerSelector />
	{/if}
</Drawer>

<slot />
