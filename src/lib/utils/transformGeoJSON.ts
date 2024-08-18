import proj4 from 'proj4'

proj4.defs([
	[
		'EPSG:32723', // UTM Zona 23S
		'+proj=utm +zone=23 +south +datum=WGS84 +units=m +no_defs'
	],
	[
		'EPSG:4326', // WGS84
		'+proj=longlat +datum=WGS84 +no_defs'
	]
])

export async function transformGeoJSON(url: string) {
	const response = await fetch(url)
	const data = await response.json()
	
	const geojson = {
		type: "FeatureCollection",
		features: []
	}

	data.features.forEach((feature: any) => {		
		feature.geometry.type = feature.geometry.rings ? "Polygon" : "Point"

		if (feature.geometry.rings) {			
			feature.geometry.coordinates = feature.geometry.rings.map((ring: any[]) => {
				return ring.map((coord: any[]) => {
					const [x, y] = coord
					const [longitude, latitude] = proj4('EPSG:32723', 'EPSG:4326', [x, y])
					return [longitude, latitude]
				})
			})
			
		} else if (feature.geometry.coordinates) {
			const [x, y] = feature.geometry.coordinates
			const [longitude, latitude] = proj4('EPSG:32723', 'EPSG:4326', [x, y])
			feature.geometry.coordinates = [longitude, latitude]
		}

		(geojson.features as any[]).push(feature)
	})

	const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' })
	const jsonUrl = URL.createObjectURL(blob)

	return jsonUrl
}
