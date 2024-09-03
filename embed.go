package timezonecountry

import (
	_ "embed"
)

//go:embed data/tzcountry.min.json
var TimezoneToCountry string
