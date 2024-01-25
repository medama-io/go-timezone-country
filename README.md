# go-timezone-country

This library converts timezones obtained from `Intl.DateTimeFormat().resolvedOptions().timeZone` to ISO 3166-1 alpha-2 country codes, which are further mapped to full country names.

## Installation

```bash
go get -u github.com/medama-io/go-timezone-country
```

## Usage

```go
package main

import (
    "fmt"
    tz "github.com/medama-io/go-timezone-country"
)

func main() {
    // Load the timezone to country code map during startup
    timezoneCodeMap, err := tz.NewTimezoneCodeMap()
    if err != nil {
        panic(err)
    }

    // Obtain the country code from the timezone
    countryCode, err := timezoneCodeMap.GetCountryCode("Europe/London")
    if err != nil {
        panic(err)
    }
    fmt.Println(countryCode) // GB

    // Load the country code to country name map during startup
    countryNameMap, err := tz.NewCountryNameMap()
    if err != nil {
        panic(err)
    }

    // Obtain the country name from the timezone
    countryName, err := countryNameMap.GetCountryName("Europe/London")
    if err != nil {
        panic(err)
    }
    fmt.Println(countryName) // United Kingdom
}
```

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

The data is updated from time to time using the `scripts/update.sh` script. In the case of timezone differences according to the IANA standard, we print the discrepancies while running the script and maintain the old timezone mappings in the `data/missing.json` file. This data can be corrobated using the [unicode-org/cldr-json](https://github.com/unicode-org/cldr-json/blob/main/cldr-json/cldr-bcp47/bcp47/timezone.json) repository.

It's also worth tracking the TC39 Canonical Timezone proposal, which is currently in Stage 3. This may be a future option to map timezones to countries natively and more accurately. The proposal can be found in the [tc39/proposal-canonical-tz](https://github.com/tc39/proposal-canonical-tz).

## License

MIT

## Acknowledgements

- The idea behind this library was inspired by a blog post from [Talha Awan](https://www.techighness.com/post/get-user-country-and-region-on-browser-with-javascript-only/)
