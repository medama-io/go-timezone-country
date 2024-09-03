package timezonecountry

import (
	"encoding/json"
	"fmt"
)

// TimezoneCountryMap is a map of all timezones to a country.
type TimezoneCountryMap map[string]string

// NewTimezoneCountryMap creates a new TimezoneCountryMap using the embedded JSON.
func NewTimezoneCountryMap() (TimezoneCountryMap, error) {
	var m TimezoneCountryMap
	err := json.Unmarshal([]byte(TimezoneToCountry), &m)
	return m, err
}

// GetCountry returns the country name for a given timezone.
func (m TimezoneCountryMap) GetCountry(tz string) (string, error) {
	if country, ok := m[tz]; ok {
		return country, nil
	}
	return "", fmt.Errorf("no country found for timezone %s", tz)
}
