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
  created_date?: number;
  uprated_date?: number;
}

export interface Filter {
  attributeId?: object;
  featureId?: object;
  date?: object;
}

export interface PostgresRegionAttribute {
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
    createdDate?: number,
    updatedDate?: number,
  }>;
}

export interface PostgresRegionAttributeReordered {
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

export interface PostgreAttributeFilter {
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
  styles?: any;
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
  created_at: number;
  updated_at: number;
  geo_data_url: string;
  format: string;
  metadata: object;
}

export interface MongoDbMapLayerWithGeoData {
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
  styles?: any;
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
  createdAt: number;
  updatedAt: number;
  geoDataUrl: string;
  format: string;
  metadata: object;
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

export interface PostgrePointAttributeFilter {
  geometry?: {
    type: string,
    coordinates: Array<Array<Array<number>>>,
  }
  attributeId?: string;
  dateStart?: string;
  dateEnd?: string;
  date?: string;
}

export interface MongoDBPointAttribute {
  attributeId: string;
  geometry: {
    type: string,
    coordinates: Array<number>,
  };
  properties: {
    [key: string]: string,
  };
  createdDate?: number;
  updatedDate?: number;
}
