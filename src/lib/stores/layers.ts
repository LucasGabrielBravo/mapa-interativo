import { writable } from 'svelte/store'

export interface ILayer {
	url: string
	enable: boolean
	label: string
	color: number[]
	type: "point" | "polygon"
	titleKey: string
	props: {
		key: string
		label: string
	}[]
}

export const layers = writable<ILayer[]>([
	{
		url: '/geojsons/edificacoes_de_saude_-_base_1_25.000_0.geojson',
		enable: true,
		label: 'Edificações de saúde',
    color: [0, 255, 0, 1],
		type: "point",
		titleKey: "{nome}",
		props: [
			{
				key: 'tipoclasse',
				label: 'Classe'
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
	{
		url: '/geojsons/edificacoes_religiosas_-_base_1_25.000_0.geojson',
		enable: true,
		label: 'Edificações religiosas',
    color: [255, 0, 0, 1],
		type: "point",
		titleKey: "{nome}",
		props: [
			{
				key: 'tipoedifre',
				label: 'Tipo de estrutura'
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
	{
		url: '/geojsons/escolas_2021_-_CEPERJ_0.geojson',
		enable: true,
		label: 'Escolas - CEPERJ (2021)',
    color: [0, 128, 255, 1],
		type: "point",
		titleKey: "{entidade}",
		props: [
			{ key: "municipio", label: "Município" },			
			{ key: "mesorregiao", label: "Mesorregião" },
			{ key: "microrregiao", label: "Microregião" },
			{ key: "tipo_dependencia", label: "Tipo de dependência" },
			{ key: "localizacao", label: "Localização" },
			{ key: "endereco", label: "endereço" },
			{ key: "numero", label: "Número" },
			{ key: "complemento", label: "Complemento" },
			{ key: "bairro", label: "Bairro" },
			{ key: "cod_cep", label: "CEP" },
			{ key: "num_ddd", label: "DDD" },
			{ key: "num_telefone", label: "Telefone" },			
		]
	},
	{
		url: '/geojsons/uso_mancha_urbana_2020.geojson',
		enable: true,
		label: 'Mancha urbana (2020)',
    color: [128, 64, 255, 0.25],
		type: "polygon",
		titleKey: "Mancha urbana",
		props: []
	}
])
