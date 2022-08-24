export interface KnexConfig {
  [key: string]: object;
}

export interface GeoJsonFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: Array<any>;
  };
  properties: object;
  id?: string;
}

export interface GeoJson {
  type: string;
  name: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: Array<GeoJsonFeature>;
}

export interface Metadata {
  description?: string;
  attributions?: string;
  sourceWebsite?: string;
  sourceOrganisation?: string;
  updateDate: string;
  updateFrequency?: string;
  unit?: string;
  reliabilityScore?: string;
  dataRetrievalDescription?: string;
  dataCalculationDescription?: string;
}

// API DATA FORMATS //
export interface APIRegionAttribute {
  attributeId: string;
  featureId: string;
  value: any;
  valueType?: string;
  date: string;
  dataDate?: string;
}

// CONFIG FILES FORMAT //
export interface AttributesFileConfigItem {
  referenceId?: string;
  date: string;
  csvFileName: string;
}

export interface GeoDataConfigItem {
  name: string;
  referenceId: string;
  format: string;
  geometryDataTypes: string;
  featureIds: Array<{
    property: string;
    values: Array<string>;
  }>;
  attributeIds: Array<string>;
  apiUrl?: string;
  geoDataUrl?: string;
  geoDataFilename?: string;
  createTable: string;
  storeToTable: string;
  storeToDb: boolean;
  collectionName: string;
  metadata: Metadata;
}

export interface MapLayerConfigItem {
  referenceId: string;
  geoReferenceId?: string;
  layerType: string;
  category: string;
  title: string;
  attribute?: string;
  attributeData?: {
    attributeId: string;
    availableDatesSource?: string;
  };
  attributeDescription: {
    descriptionText?: string;
    featureText?: string;
    dateText?: string;
    noDataMessage?: string;
  };
  attributeTemplateName: string;
  featureId?: string;
  style?: any;
  legend?: Array<{
    type: string;
    color: string;
    min?: number;
    max?: number;
    description?: string;
  }>;
  layerOptions?: {
    singleDisplay?: boolean;
    timeseries?: boolean;
    maxResolution?: number;
  };
  timeseries?: boolean;
  layers: Array<{
    geoReferenceId: string;
    layerType: string;
    title: string;
    attribute: string;
    attributeDescription: {
      descriptionText?: string;
      featureText?: string;
      dateText?: string;
      noDataMessage?: string;
    };
  }>;
  metadata: object;
  tileDataUrl: string;
  tileAttributions: string;
}

// MONGODB //
export interface MongoDbMapLayer {
  referenceId: string;
  geoReferenceId?: string;
  category: string;
  title: string;
  attributeData: {
    attributeId: string;
    availableDatesSource?: string;
  };
  attributeDescription: {
    descriptionText?: string;
    featureText?: string;
    dateText?: string;
    noDataMessage?: string;
  };
  attributeTemplateName: string;
  featureId?: string;
  style?: any;
  legend?: Array<{
    type: string;
    color: string;
    min?: number;
    max?: number;
    description?: string;
  }>;
  layerOptions?: {
    singleDisplay?: boolean;
    timeseries?: boolean;
    maxResolution?: number;
  };
  timeseries?: boolean;
  layers: Array<{
    geoReferenceId: string;
    layerType: string;
    title: string;
    attribute: string;
    attributeDescription: {
      descriptionText?: string;
      featureText?: string;
      dateText?: string;
      noDataMessage?: string;
    };
  }>;
  metadata: object;
  tileDataUrl: string;
  tileAttributions: string;
}

export interface MongoDbRegionAttribute {
  attributeId: string;
  featureId: string;
  valueNumber?: number;
  valueString?: string;
  date: string;
  dataDate?: string;
}

// POSTGRES - POSTGIS //
export interface PostgresAttribute {
  attribute_id: string;
  attribute_type: string;
  attribute_key: string;
  name: string;
  geo_data: {};
  detail: any;
  metadata: Metadata;
  created_date?: number;
  uprated_date?: number;
}

export interface PostgresRegionAttribute {
  id?: string;
  attribute_id: string;
  feature_id: string;
  feature_id_lvl?: string;
  value: string;
  value_type: string;
  date_iso: string;
  date_data?: string;
  created_date?: number;
  uprated_date?: number;
}

export interface PostgresLayerGeoData {
  reference_id: string;
  name: string;
  format: string;
  geo_data_url: string;
  data: {
    featureIds: Array<{
      property: string;
      values: Array<string>;
    }>;
    attributeIds: Array<string>;
    geometryDataTypes: string;
  };
  metadata: Metadata;
  created_date?: number;
  uprated_date?: number;
}
