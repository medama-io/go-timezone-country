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
    fmt.Println(countryName) // Britain (UK)
}
```

## License

MIT

## Acknowledgements

- The idea behind this library was inspired by a blog post from [Talha Awan](https://www.techighness.com/post/get-user-country-and-region-on-browser-with-javascript-only/)