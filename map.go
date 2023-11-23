package timezonecountry

import (
	"encoding/json"
	"fmt"
)

// TimezoneCodeMap is a map of timezone to country code
type TimezoneCodeMap map[string]string

// CodeCountryMap is a map of country code to country name
type CodeCountryMap map[string]string

// NewTimezoneCodeMap creates a new TimezoneToCodeMap using the embedded JSON
func NewTimezoneCodeMap() (TimezoneCodeMap, error) {
	var m TimezoneCodeMap
	err := json.Unmarshal([]byte(TimezoneToCode), &m)
	return m, err
}

// NewCodeCountryMap creates a new CodeToCountryMap using the embedded JSON
func NewCodeCountryMap() (CodeCountryMap, error) {
	var m CodeCountryMap
	err := json.Unmarshal([]byte(CodeToCountry), &m)
	return m, err
}

// GetCode returns the country code for a given timezone
func (m TimezoneCodeMap) GetCode(tz string) (string, error) {
	if code, ok := m[tz]; ok {
		return code, nil
	}
	return "", fmt.Errorf("no country code found for timezone %s", tz)
}

// GetCountry returns the country name for a given country code
func (m CodeCountryMap) GetCountry(code string) (string, error) {
	if country, ok := m[code]; ok {
		return country, nil
	}
	return "", fmt.Errorf("no country found for code %s", code)
}
