export interface Attribute {
  type: string;
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
  properties: {
    KOBO_uuid: string;
    updatedDate: string;
    attributeId: string;
  };
}

export interface ItemFromUrl {
  _uuid: string;
  end: string;
}

export interface Survey {
  name: string;
  url: string;
  assetId: string;
  keyWithCoordinates: string;
  selectedKeys: Array<{
    KOBO_question: string;
    key: string;
  }>;
}
