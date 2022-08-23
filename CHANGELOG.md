# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- 'metadata.attributions' key in ./initial-data-load/data/{dataset}/GeoData.yml configuration file as a substite for 'tileAttributions' key on the top level that is now deprecated. You can find out more about these settings in [docs](./doc/data-structures/config-files.md#geoData.yml). [#146](https://github.com/openkfw/Oscar/pull/146/files)
- 'metadata.attributions' key in ./initial-data-load/data/{dataset}/MapLayers.yml configuration file

### Changed

### Fixed

### Deprecated
- 'tileDataUrl' and 'tileAttributions' keys on the top level in ./initial-data-load/data/{country}/GeoData.yml configuration file. Use 'apiUrl' key instead of 'tileDataUrl' key and 'metadata.attributions' key instead of 'tileAttributions' key. You can find out more about these settings in [docs](./doc/data-structures/config-files.md#geoData.yml). [#146](https://github.com/openkfw/Oscar/pull/146/files)

### Removed

## [1.5.0] - 2022-08-15

Introducing option to use postgresql as database, with the exception of functions

### Added

- dateStart and dateEnd filter options for /pointAttributes [#126](https://github.com/openkfw/Oscar/pull/126)
- postgresql database structure on service start [#129](https://github.com/openkfw/Oscar/issues/129) [#130](https://github.com/openkfw/Oscar/pull/130)
- initial-data-load with postgresql database [#113](https://github.com/openkfw/Oscar/issues/113)
- url-loader with postgresql database [#114](https://github.com/openkfw/Oscar/issues/114)
- api with postgresql database [#116](https://github.com/openkfw/Oscar/issues/116)
- /geodata route for collections as sources for geodata [#140](https://github.com/openkfw/Oscar/issues/140)
- /isochrones route for specifically isochrones in one collection [#151](https://github.com/openkfw/Oscar/pull/151)

### Changed

- url loader returns error code, if one load fails [#128](https://github.com/openkfw/Oscar/pull/128)

### Fixed

- in GeoData.yml, layer can be defined with just 'apiUrl' and not automatically storing data to database [#142](https://github.com/openkfw/Oscar/pull/142)

### Deprecated

- route '/api/staticLayers', use '/api/dataLayers' [#111](https://github.com/openkfw/Oscar/issues/111)
- 'COUNTRY' environment variable for initial-data-load, use 'DATASET' instead

### Removed

## [1.4.0] - 2022-04-29

### Added

- added option to run app with Postgis container based on Postgres, default DB is still MongoDB as backend is not reworked yet [#119]  (https://github.com/openkfw/Oscar/pull/119/files)
- refactored MongoDB functionalities [#111] (https://github.com/openkfw/Oscar/pull/118/files)
- styling of region layers [#117] (https://github.com/openkfw/Oscar/pull/120/files)
- filtering pointAttributes by date (https://github.com/openkfw/Oscar/pull/126/files)

### Changed

### Deprecated

### Removed

### Fixed

- security updates


## [1.3.2] - 2022-02-21

### Added

- option to store geographical data in database collection [#85](https://github.com/openkfw/Oscar/issues/85) [#94](https://github.com/openkfw/Oscar/pull/94)
- new route for unique featureIds for one attributeId [#86](https://github.com/openkfw/Oscar/pull/86/files)
- added option for displaying multiple regions layers [#97](https://github.com/openkfw/Oscar/pull/97)
- configurable dashboard tabs [#102](https://github.com/openkfw/Oscar/pull/102)
- added option to use tile layers in map with data provided by external url [#103](https://github.com/openkfw/Oscar/pull/103/files)
- scripts for starting application in minikube [#104](https://github.com/openkfw/Oscar/pull/104)
- enabled creating geoData with empty database with geoIndex [#105](https://github.com/openkfw/Oscar/pull/105)
- added new layerOption for sending correct request to api in case of specified bounding box [#109](https://github.com/openkfw/Oscar/pull/109)
- pdf button for exporting dashboard tab as pdf document

### Changed

- dashboard config specifying tabs and graphs, not selecting from existing

### Deprecated

- 'timeseries' key on the top level is now deprecated and moved to 'layerOptions' key. New 'layerOptions' key should be defined in ./initial-data-load/data/{country}/MapLayers.yml configuration file on the top level and 'timeseries' key with its value should be moved there. 'layerOptions' present different options that can be set on layers and change their behavior on the map. You can find out more about these settings in [docs](./doc/data-structures/config-files.md#Attributes-explained).

### Removed

### Fixed

- security updates
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
