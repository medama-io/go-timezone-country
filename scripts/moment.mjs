import fs from "fs/promises"

/**
 * @typedef {Object} Country
 * @property {string} name
 * @property {string} code
 */

/**
 * @typedef {Record<string, Country>} TimezoneMap
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
 * Parses the moment timezone data and returns an array of countries.
 * @returns {Promise<TimezoneMap>}
 */
const parseTimezones = async () => {
	const { countries, zones } = JSON.parse(await fs.readFile("../data/download.json"))

	/** @type {TimezoneMap} */
	const timezones = {}

	for (const zone of Object.keys(zones)) {
		const country = countries[ zones[ zone ].countries[ 0 ] ]
		timezones[ zone ] = {
			name: toTitleCase(country.name),
			code: country.abbr,
		}
	}
	
	// Sort the timezones by name.
	const sorted = Object.fromEntries(Object.entries(timezones).sort((a, b) => {
		if (a[1].name < b[1].name) return -1
		if (a[1].name > b[1].name) return 1
		return 0
	}))

	// Write the parsed data to the data/final.json file.
	await fs.writeFile("../data/final.json", JSON.stringify(sorted, null, 2))
}

await downloadMoment()
await parseTimezones()
