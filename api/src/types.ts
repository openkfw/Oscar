export interface KnexConfig {
  [key: string]: object;
}

export interface Metadata {
  description?: string;
  sourceWebsite?: string;
  sourceOrganisation?: string;
  updateDate: string;
  updateFrequency?: string;
  unit?: string;
  reliabilityScore?: string;
  dataRetrievalDescription?: string;
  dataCalculationDescription?: string;
}

export interface PostgresLayerGeoData {
  reference_id: string;
  name: string;
  format: string;
  geo_data_url: string;
  data: {
    featureIds: Array<{
      property: string,
      values: Array<string>,
    }>,
    attributeIds: Array<string>,
    geometryDataTypes: string,
  };
  metadata: Metadata;
  created_at?: number;
  updated_at?: number;
}

export interface Filter {
  attributeId?: object;
  featureId?: object;
  date?: object;
}

export interface FeatureAttribute {
  attributeId: string;
  features: Array<{
    attributeId: string,
    featureId: string,
    featureIdLvl?: string,
    value: string,
    // default valueType in db is String
    valueType: string,
    date: string,
    dataDate?: string,
    createdAt?: number,
    updatedAt?: number,
  }>;
}

export interface FeatureAttributeReordered {
  [attributeId: string]: Array<{
    attributeId: string,
    featureId: string,
    featureIdLvl?: string,
    value: string | number,
    valueType: string,
    date: string,
    dataDate?: string,
    createdDate?: number,
    updatedDate?: number,
  }>;
}

export interface AttributeFilter {
  attributeId?: Array<string>;
  attributeIdCategory?: any;
  featureId?: Array<string>;
  dateStart?: string;
  dateEnd?: string;
}

export interface AvailableDate {
  dataDate: string;
  date: string;
}

export interface PostgresMapLayerWithGeoData {
  reference_id: string;
  geo_reference_id?: string;
  layer_type: string;
  category: string;
  title: string;
  attribute_id?: string;
  attribute_description?: {
    descriptionText?: string,
    featureText?: string,
    dateText?: string,
    noDataMessage?: string,
  };
  style?: any;
  legend?: Array<{
    type: string,
    color: string,
    min?: number,
    max?: number,
    description?: string,
  }>;
  layer_options: {
    singleDisplay?: boolean,
    timeseries?: boolean,
    maxResolution?: number,
  };
  layers?: Array<{
    geoReferenceId?: string,
    layerType: string,
    title: string,
    attribute?: string,
    attributeDescription?: {
      descriptionText?: string,
      featureText?: string,
      dateText?: string,
      noDataMessage?: string,
    },
    geoDataUrl?: string,
    format?: string,
    metadata?: object,
  }>;
  created_at?: number;
  updated_at?: number;
  geo_data_url?: string;
  format?: string;
  metadata?: object;
}

export interface MapLayerWithGeoData {
  referenceId: string;
  geoReferenceId?: string;
  layerType: string;
  category: string;
  title: string;
  attributeId?: string;
  attributeDescription?: {
    descriptionText?: string,
    featureText?: string,
    dateText?: string,
    noDataMessage?: string,
  };
  style?: any;
  legend?: Array<{
    type: string,
    color: string,
    min?: number,
    max?: number,
    description?: string,
  }>;
  layerOptions: {
    singleDisplay?: boolean,
    timeseries?: boolean,
    maxResolution?: number,
  };
  layers?: Array<{
    geoReferenceId?: string,
    layerType: string,
    title: string,
    attribute?: string,
    attributeDescription?: {
      descriptionText?: string,
      featureText?: string,
      dateText?: string,
      noDataMessage?: string,
    },
    geoDataUrl?: string,
    format?: string,
    metadata?: object,
  }>;
  createdAt?: number;
  updatedAt?: number;
  geoDataUrl?: string;
  format?: string;
  metadata?: object;
}

export interface MongoDBMapLayerWithoutGeoData {
  referenceId: string;
  geoReferenceId?: string;
  layerType: string;
  category: string;
  title: string;
  attributeData: {
    attributeId: string,
    availableDatesSource?: string,
  };
  attributeDescription: {
    descriptionText?: string,
    featureText?: string,
    dateText?: string,
    noDataMessage?: string,
  };
  attributeTemplateName: string;
  featureId?: string;
  style?: any;
  legend?: Array<{
    type: string,
    color: string,
    min?: number,
    max?: number,
    description?: string,
  }>;
  layerOptions?: {
    singleDisplay?: boolean,
    timeseries?: boolean,
    maxResolution?: number,
  };
  timeseries?: boolean;
  layers: Array<{
    geoReferenceId: string,
    layerType: string,
    title: string,
    attribute: string,
    attributeDescription: {
      descriptionText?: string,
      featureText?: string,
      dateText?: string,
      noDataMessage?: string,
    },
  }>;
  metadata: object;
  tileDataUrl: string;
  tileAttributions: string;
}

export interface MongoDBMapLayerWithGeoData {
  referenceId: string;
  geoReferenceId?: string;
  layerType: string;
  category: string;
  title: string;
  attributeData: {
    attributeId: string,
    availableDatesSource?: string,
  };
  attributeDescription: {
    descriptionText?: string,
    featureText?: string,
    dateText?: string,
    noDataMessage?: string,
  };
  attributeTemplateName: string;
  featureId?: string;
  style?: any;
  legend?: Array<{
    type: string,
    color: string,
    min?: number,
    max?: number,
    description?: string,
  }>;
  layerOptions?: {
    singleDisplay?: boolean,
    timeseries?: boolean,
    maxResolution?: number,
  };
  timeseries?: boolean;
  layers: Array<{
    geoReferenceId: string,
    layerType: string,
    title: string,
    attribute: string,
    attributeDescription: {
      descriptionText?: string,
      featureText?: string,
      dateText?: string,
      noDataMessage?: string,
    },
    geoDataUrl?: string,
    format?: string,
    metadata?: object,
  }>;
  metadata: object;
  tileDataUrl: string;
  tileAttributions: string;
  geoDataUrl?: string;
  format?: string;
}

export interface MongoDBSublayerWithGeoData {
  geoReferenceId?: string;
  layerType: string;
  title: string;
  attribute: string;
  attributeDescription: {
    descriptionText?: string,
    featureText?: string,
    dateText?: string,
    noDataMessage?: string,
  };
  geoDataUrl?: string;
  format?: string;
  metadata?: object;
}

export interface MongoDBGeoData {
  name: string;
  referenceId: string;
  geoDataFilename?: string;
  geoDataUrl?: string;
  format: string;
  storeToDb: boolean;
  collectionName: string;
  apiUrl?: string;
  featureIds: Array<{
    property: string,
    values: Array<string>,
  }>;
  attributeIds: Array<string>;
  geometryDataTypes: string;
  metadata: Metadata;
}

export interface PostgresSublayerGeoData {
  reference_id: string;
  geo_data_url: string;
  format: string;
  metadata: object;
}

export interface PostgresSublayerGeoDataWithReferenceId {
  [key: string]: {
    reference_id: string,
    geo_data_url: string,
    format: string,
    metadata: object,
  };
}

export interface PointAttributeFilter {
  geometry?: {
    type: string,
    coordinates: Array<Array<Array<number>>>,
  };
  attributeId?: string;
  dateStart?: string;
  dateEnd?: string;
  date?: string;
  proj?: number;
}

export interface PointAttribute {
  attributeId: string;
  geometry: {
    type: string,
    coordinates: Array<number>,
  };
  properties: {
    [key: string]: string,
  };
  createdAt?: number;
  updatedAt?: number;
}
