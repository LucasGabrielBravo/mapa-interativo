<script lang="ts">
	export let icon: string
	export let loading: boolean = false

	const { icon: _, ...props } = $$props
</script>

<div class="flex items-center justify-center h-max max-h-max w-max max-w-max">
	{#if loading}
		<iconify-icon icon="svg-spinners:ring-resize" {...props}></iconify-icon>
	{:else}
		<iconify-icon {icon} {...props}></iconify-icon>
	{/if}
</div>
