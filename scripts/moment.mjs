import fs from "fs/promises";

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
  const url =
    "https://github.com/moment/moment-timezone/raw/develop/data/meta/latest.json";

  const response = await fetch(url);
  const data = await response.json();

  // Overwrite the existing data/download.json file with the latest data.
  await fs.writeFile("../data/tz-download.json", JSON.stringify(data, null, 2));
};

/**
 * Sorts a map by the name of the values.
 * @param {Record<string, string>} map
 * @returns {Record<string, string>}
 */
const sortMap = (map) => {
  const sorted = Object.fromEntries(
    Object.entries(map).sort((a, b) => {
      if (a[1].name < b[1].name) return -1;
      if (a[1].name > b[1].name) return 1;
      return 0;
    })
  );

  return sorted;
};

/**
 * Adds missing timezones to the list of supported timezones.
 * @param {TimezoneMap} tzMap
 * @returns {Promise<void>}
 */
const checkMissing = async (tzMap) => {
  // Get the list of supported timezones and find any timezones that do not exist in moment-timezone db.
  // This is typically because the timezone has been deprecated or browser implementations differ.
  // This TC39 proposal describes the problem: https://github.com/tc39/proposal-canonical-tz
  const supported = Intl.supportedValuesOf("timeZone");
  const tzMapKeys = Object.keys(tzMap);
  const missing = supported.filter((zone) => !tzMapKeys.includes(zone));

  // If there are missing timezones, print them to the console and fail
  // the build.
  if (missing.length > 0) {
    console.log("Missing timezones:", missing);
    throw new Error("Missing timezones");
  }
};

/**
 * Parses the moment timezone data and returns an array of countries.
 * @returns {Promise<TimezoneMap>}
 */
const parseTimezones = async () => {
  const { countries, zones } = JSON.parse(
    await fs.readFile("../data/tz-download.json")
  );

  /** @type {TimezoneMap} */
  const timezones = {};

  for (const zone of Object.keys(zones)) {
    const country = countries[zones[zone].countries[0]];
    timezones[zone] = country.abbr;
  }

  // Sort the timezones by name.
  const timezonesSorted = sortMap(timezones);

  // Add missing deprecated timezones.
  const missingTimezones = JSON.parse(
    await fs.readFile("../data/missing.json")
  );
  for (const [zone, country] of Object.entries(missingTimezones)) {
    timezonesSorted[zone] = country;
  }

  // Check for missing timezones.
  await checkMissing(timezonesSorted);

  // Create a map of country codes.
  /** @type {CountryCodeMap} */
  const countryCodes = {};
  const nameFormatter = new Intl.DisplayNames("en", { type: "region" });

  for (const code of Object.values(timezonesSorted)) {
    const name = nameFormatter.of(code);
    countryCodes[code] = name;
  }

  const countryCodesSorted = sortMap(countryCodes);

  // Write the parsed data to files.
  await fs.writeFile(
    "../data/tzcode.json",
    JSON.stringify(timezonesSorted, null, 2)
  );
  await fs.writeFile(
    "../data/codecountry.json",
    JSON.stringify(countryCodesSorted, null, 2)
  );
};

await downloadMoment();
await parseTimezones();
