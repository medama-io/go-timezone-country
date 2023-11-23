package timezonecountry

import (
	_ "embed"
)

//go:embed data/tzcode.json
var TimezoneToCode string

//go:embed data/codecountry.json
var CodeToCountry string
