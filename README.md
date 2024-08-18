# Mapa Interativo do IDE.RJ com SvelteKit

## Introdução

Este projeto é uma implementação de um mapa interativo do IDE.RJ utilizando a biblioteca SvelteKit. O objetivo
deste projeto é fornecer uma experiência de visualização dos dados geográficos do IDE.RJ de forma fácil e
intuitiva.

## Requisitos

* Node.js (versão 20 ou superior)

## Instalação

Para instalar o projeto, clone o repositório e execute os seguintes comandos dentro da pasta do projeto:

```bash
npm install
#ou
pnpm install
#ou
yarn install
```

## Configuração de novos pontos de interesse

Já estão inclusos no projeto 4 arquivos .geojson configurados, mas caso haja a necessidade ou vontate de adicionar mais arquivos é necessário configurá-los. Para isso, você precisará obter um arquivo `geojson` contendo os dados.

O arquivo `geojson` pode ser obtido no site indicado pelo desafio
[https://gis-portal.westeurope.cloudapp.azure.com/iderj/](https://gis-portal.westeurope.cloudapp.azure.com/iderj/).

Depois de obter o arquivo, você pode adiciona-lo na pasta /static/geojsons ou usar uma url na qual o arquivo esteja diponível.

Para adicionar os arquivos de pontos de interesse no projeto basta incluir o mesmo no array `layers` localizado no arquivo `/src/lib/stores/layers.ts`

```javascript
[
  ...
  {
    url: '/geojsons/edificacoes_de_saude_-_base_1_25.000_0.geojson', //URL do arquivo
    enable: true, //Habilitado ou não por padrão
    label: 'Edificações de saúde', //Titulo que aparece no seletor de camadas
    color: [0, 255, 0, 1], // RGBA de cor
    type: "point" //ou "polygon" - Mapa de pontos ou mapa de área,
    titleKey: "{nome}", //property que deve ser usada como titulo ou um titulo
    //properties que deve aparecer no popup ao clicar em um ponto
    props: [
      {
        key: 'tipoclasse', //chave da property
        label: 'Classe' //Rotulo para interface
      },
      {
        key: 'operaciona',
        label: 'Operaciona'
      },
      {
        key: 'situacaofi',
        label: 'Situação'
      }
    ]
  },
  ...
]
```

## Execução

Depois de configurar o projeto, você pode executá-lo com o seguinte comando:

```bash
npm run dev --host
#ou
pnpm dev --host
#ou
yarn dev --host
```

A partir daí, você poderá acessar o mapa interativo em [http://localhost:5173](http://localhost:5173).

## Como funciona?

Usando os dados do array `layers`, ao abrir a página, o site carrega os arquivos geojson configurados
usando a função `addLayer` da *store* `mapView`
```typescript
onMount(() => {
		$layers.forEach((item) => {
			if(item.enable){
				mapView.addLayer(item)
			}
		})
	})
```
A *store* `mapView` é responsável por controlar o objeto `MapView` da biblioteca ArcGIS
contendo funções para adicionar e remover novas camadas do mapa, além de fazer a inicialização no componente `<Map>` 

```typescript
//src/lib/stores/mapView.ts
function createMapView() {
	let mapView: MapView | null = null
	const { set, subscribe } = writable<MapView | null>(mapView)

	function initmap(node: HTMLDivElement, params: IInitMapParams) {
		...
	}

	async function addLayer(layer: ILayer) {
		...
	}

	function removeLayer(label: string) {
		...
	}
	
	return { subscribe, initmap, addLayer, removeLayer }
}

export const mapView = createMapView()
```

Para adicionar uma camada com a função `addLayer` foi necessário criar uma função para converter as coordenadas dos arquivos `.geojson` uma vez que o ArcGIS trabalha com um tipo de coordenada e os arquivos vindos do site [https://gis-portal.westeurope.cloudapp.azure.com/iderj/](https://gis-portal.westeurope.cloudapp.azure.com/iderj/) estão em outro padrão de coordendas. 

```typescript
//src/lib/utils/transformGeoJSON.ts
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
```

A função `transformGeoJSON` recebe a url de um `.geojson` lê o arquivo, converte as coordenas e então criar uma url interna para o novo arquivo com as coordenadas convertidas. 

Uma vez com a url do arquivo com as coordenadas no formato correto a função `addLayer` atualiza o obejto `MapView` e isso é imadiatamente refletido no componente `<Map>` 

