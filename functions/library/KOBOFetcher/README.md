# KOBO Fetcher function

Function for connecting to KOBO API and fetching responses from surveys.

## How to use

Move folder with this function from library directly in `functions` folder. Now move `KOBOFetcher_config.yml` from the folder with function into `functions/data` folder.

In order to reach KOBO API, you need some values directly from the instance you try to reach.
First is API Token. It can be found in your account settings, when you log into KOBO. Store this value in environment variable `KOBO_CONNECTION_STRING` in root folder.

Path to config file is also different environment variable, `KOBO_CONFIG_FILE_PATH`, by default directed to `KOBOFetcher_config.yml`. If you just modify this file, the environment variable can be omitted.

Multiple surveys from the same instance of KOBO (with the same API Token) can be loaded with this function. For each of them, please fill one item in config file in following structure:

```
- name: "attribute name" # used as attributeId
  url: "https://kobo.url.info" # url address to KOBO api
  assetId: awefgvcrty # id identifying one survey
  keyWithCoordinates: "location key" # key or question in survey with coordinates
  selectedKeys: # array with keys, which should be stored in our database
    - KOBO_question: "Question formulation" # formulation of the question in KOBO
      key: "replacement key" # key to rename the question, if not defined, KOBO_question will be used
```
