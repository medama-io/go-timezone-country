import fs from "fs/promises"


/**
 * @typedef {Record<string, string>} TimezoneMap
 */

/**
 * @typedef {Record<string, string> CountryCodeMap
 */

/**
 * Converts a string to title case.
 * @param {string} str
 * @returns {string}
 */
const toTitleCase = (str) => {
	// Split the string into an array of words.
	const words = str.split(" ")

	// For each word, capitalize the first letter.
	const capitalized = words.map(word => {
		const first = word[0].toUpperCase()
		const rest = word.slice(1)
		return first + rest
	})

	// Join the words back together.
	return capitalized.join(" ")
}

/**
 * Downloads the latest moment timezone data from the Moment Timezone GitHub repository.
 */
const downloadMoment = async () => {
	const url = "https://github.com/moment/moment-timezone/raw/develop/data/meta/latest.json"

	const response = await fetch(url)
	const data = await response.json()

	// Overwrite the existing data/download.json file with the latest data.
	await fs.writeFile("../data/download.json", JSON.stringify(data, null, 2))
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
	const { countries, zones } = JSON.parse(await fs.readFile("../data/download.json"))

	/** @type {TimezoneMap} */
	const timezones = {}

	/** @type {CountryCodeMap} */
	const countryCodes = {}

	for (const zone of Object.keys(zones)) {
		const country = countries[ zones[ zone ].countries[ 0 ] ]
		const name = toTitleCase(country.name)
		const abbr = country.abbr

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
await parseTimezones()
