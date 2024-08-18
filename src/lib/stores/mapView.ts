import { transformGeoJSON } from '$lib/utils/transformGeoJSON'
import Map from '@arcgis/core/Map'
import PopupTemplate from '@arcgis/core/PopupTemplate'
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'
import { SimpleRenderer } from '@arcgis/core/renderers'
import { SimpleFillSymbol, SimpleMarkerSymbol } from '@arcgis/core/symbols'
import MapView from '@arcgis/core/views/MapView'
import { writable } from 'svelte/store'
import type { ILayer } from './layers'

interface IInitMapParams {
	basemap?: 'streets-vector'
	zoom?: number
	center?: number[]
}

function createMapView() {
	let mapView: MapView | null = null
	const { set, subscribe } = writable<MapView | null>(mapView)

	function initmap(node: HTMLDivElement, params: IInitMapParams) {
		const { basemap = 'streets-vector', zoom = 12, center = [-43.1046, -22.864] } = params

		mapView = new MapView({
			container: node,
			map: new Map({ basemap }),
			zoom,
			center
		})

		set(mapView)

		return {
			destroy: () => {
				if (mapView) {
					mapView.destroy()
					set(null)
				}
			}
		}
	}

	async function addLayer(layer: ILayer) {
		let { url, props, label, color, type, titleKey } = layer

		if (!mapView) return

		try {
			url = await transformGeoJSON(url)

			let content = ``
			content += `<ul style="margin-bottom: 0px;">`
			props.forEach(({ key, label }) => {
				content += `
          <li class="flex flex-row gap-1">
            <strong>${label}: </strong>
            <span>{${key}}</span>
          </li>
        `
			})
			content += `</ul>`

			const popup = new PopupTemplate({
				title: `${titleKey}`,
				content: content
			})

			let symbol: SimpleMarkerSymbol | SimpleFillSymbol
			if(type === "point"){
				symbol = new SimpleMarkerSymbol({
					color: color,
					size: 8,
					outline: {
						color: [255, 255, 255, 1],
						width: 1
					}
				})
			}else{
				symbol = new SimpleFillSymbol({
					color: color,
					outline: {
						color: color,
						width: 1
					}
				})
			}

			const geojsonLayer = new GeoJSONLayer({
				geometryType: type,
				url: url,
				id: label,
				popupTemplate: popup,
				renderer: new SimpleRenderer({
					symbol: symbol,
				})
			})

			if(type === "point"){
				mapView.map.add(geojsonLayer, mapView.map.layers.length)
			}else{
				mapView.map.add(geojsonLayer, 0)
			}
		} catch (error) {
			console.log(error)
		}
	}

	function removeLayer(label: string) {
		if (!mapView) return

		const layer = mapView.map.layers.find((layer) => layer.id === label)
		if (layer) {
			mapView.map.remove(layer)
		}
	}
	
	return { subscribe, initmap, addLayer, removeLayer }
}

export const mapView = createMapView()
