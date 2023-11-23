import fs from "fs/promises"

/**
 * @typedef {Record<string, string>} TimezoneMap
 */

/**
 * @typedef {Record<string, string> CountryCodeMap
 */

/**
 * Downloads the latest moment timezone data from the Moment Timezone GitHub repository.
 */
const downloadMoment = async () => {
	const url = "https://github.com/moment/moment-timezone/raw/develop/data/meta/latest.json"

	const response = await fetch(url)
	const data = await response.json()

	// Overwrite the existing data/download.json file with the latest data.
	await fs.writeFile("../data/tz-download.json", JSON.stringify(data, null, 2))
}

/**
 * Downloads ISO 3166-1 country codes from the ISO 3166 GitHub repository.	 
*/
const downloadISO = async () => {
	const url = "https://raw.githubusercontent.com/biter777/countries/master/data/iso-codes/data_iso_3166-1.json"

	const response = await fetch(url)
	const data = await response.json()

	// Overwrite the existing data/iso.json file with the latest data.
	await fs.writeFile("../data/iso-download.json", JSON.stringify(data['3166-1'], null, 2))
}

/**
 * Sorts a map by the name of the values.
 * @param {Record<string, string>} map
 * @returns {Record<string, string>}
 */
const sortMap = (map) => {
	const sorted = Object.fromEntries(Object.entries(map).sort((a, b) => {
		if (a[1].name < b[1].name) return -1
		if (a[1].name > b[1].name) return 1
		return 0
	}))

	return sorted
}

/**
 * Parses the moment timezone data and returns an array of countries.
 * @returns {Promise<TimezoneMap>}
 */
const parseTimezones = async () => {
	const { countries, zones } = JSON.parse(await fs.readFile("../data/tz-download.json"))
	const iso = JSON.parse(await fs.readFile("../data/iso-download.json"))

	/** @type {TimezoneMap} */
	const timezones = {}

	/** @type {CountryCodeMap} */
	const countryCodes = {}

	for (const zone of Object.keys(zones)) {
		const country = countries[ zones[ zone ].countries[ 0 ] ]
		const abbr = country.abbr
		const iso_country = iso.find(country => country.alpha_2 === abbr)
		const name = iso_country.common_name ?? iso_country.name

		timezones[ zone ] = abbr
		countryCodes[ abbr ] = name
	}
	
	// Sort the timezones by name.
	const timezonesSorted = sortMap(timezones)
	const countryCodesSorted = sortMap(countryCodes)

	// Write the parsed data to files.
	await fs.writeFile("../data/tzcode.json", JSON.stringify(timezonesSorted, null, 2))
	await fs.writeFile("../data/codecountry.json", JSON.stringify(countryCodesSorted, null, 2))
}

await downloadMoment()
await downloadISO()
await parseTimezones()
