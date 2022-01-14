# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- new route for unique featureIds for one attributeId [#86](https://github.com/openkfw/Oscar/pull/86/files)
- option to store geographical data in database collection [#85](https://github.com/openkfw/Oscar/issues/85) [#94](https://github.com/openkfw/Oscar/pull/94)
- pdf button for exporting dashboard tab as pdf document

### Changed

- dashboard config specifying tabs and graphs, not selecting from existing

### Deprecated

- 'timeseries' key on the top level is now deprecated and moved to 'layerOptions' key. New 'layerOptions' key should be defined in ./initial-data-load/data/{country}/MapLayers.yml configuration file on the top level and 'timeseries' key with its value should be moved there. 'layerOptions' present different options that can be set on layers and change their behavior on the map. You can find out more about these settings in [docs](./doc/data-structures/config-files.md#Attributes-explained).

### Removed

### Fixed

- allow empty data folder in functions [#70](https://github.com/openkfw/Oscar/issues/70)
- NaN appearing in url in map view and breaking the map [#90](https://github.com/openkfw/Oscar/pull/90)

## [1.3.1] - 2021-11-26

### Updates

- updated geodata structure [#77](https://github.com/openkfw/Oscar/pull/77) [#79](https://github.com/openkfw/Oscar/pull/79) [#81](https://github.com/openkfw/Oscar/pull/81)

## [1.3.0] - 2021-10-15

### Added

- new calculation function template and tutorial [#41](https://github.com/openkfw/Oscar/issues/41)
- calculation function for 7 days incidence rate [#42](https://github.com/openkfw/Oscar/issues/42)

## [1.2.3] - 2021-09-28

### Improved

- further timeline enhancements

## [1.2.2] - 2021-09-06

### Added

- Minor addition to api so the map layer timeline works also with the dataDate property

## [1.2.0] - 2021-09-03

### Added

- KOBOFetcher for connecting to KOBO API and storing data from there [#50](https://github.com/openkfw/Oscar/issues/50)

## [1.1.0] - 2021-08-23

### Added

- Starting package [#39](https://github.com/openkfw/Oscar/pull/39).
- HERE satellite maps as another alternative map [#26](https://github.com/openkfw/Oscar/issues/26).
- url-loader service for fetching data from external API [#23](https://github.com/openkfw/Oscar/issues/23).
- Template for loader functions [#24](https://github.com/openkfw/Oscar/issues/24).
- csv-loader function [#25](https://github.com/openkfw/Oscar/issues/25).

### Changed

- Improve documentation and make changes to the structure.

### Deprecated

### Removed

### Fixed

## [1.0.0] - 2021-01-01

Initial version
