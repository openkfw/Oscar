export interface Attribute {
  date: string;
  featureId: string;
  attributeId: string;
  valueNumber: number;
}

export interface AttributesFilter {
  date: string;
  attributeId: string;
}

export interface AttributesFromDB {
  _id: { featureId: string };
  features: Array<Attribute>;
}
