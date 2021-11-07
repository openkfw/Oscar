const layerGeoDataInDb = {
  name: 'Sample Geo Json',
  referenceId: 'sampleGeoJSON',
  geoJSONUrl: '/api/uploads/geojsons/1600424721066.geojson',
  updateDate: '1600424721492',
};

const mapLayersInDb = [
  {
    referenceId: 'sampleMapLayer',
    geoReferenceId: 'sampleGeoJSON',
    layerType: 'regions',
    category: 'Baseline data',
    title: 'Sample map layer title',
    attribute: 'attributeName',
    attributeDescription: {
      descriptionText: 'Attribute description.',
    },
    style: {
      fillColor: {
        type: 'colormap',
        value: 'green',
      },
      min: 0,
      max: 10,
    },
    legend: [
      {
        type: 'colormap',
        color: {
          type: 'colormap',
          value: 'green',
        },
        min: 0,
        max: 10,
        description: 'Colormap description in legend',
      },
    ],
  },
  {
    referenceId: 'sampleMapLayer2',
    geoReferenceId: 'sampleGeoJSON',
    layerType: 'regions',
    category: 'Baseline data',
    title: 'Sample map layer title2',
    attribute: 'attributeName2',
    attributeDescription: {
      descriptionText: 'Attribute description2.',
    },
    style: {
      fillColor: {
        type: 'colormap',
        value: 'green',
      },
      min: 0,
      max: 10,
    },
    legend: [
      {
        type: 'colormap',
        color: {
          type: 'colormap',
          value: 'green',
        },
        min: 0,
        max: 10,
        description: 'Colormap description in legend2',
      },
    ],
  },
  {
    layers: [
      {
        geoReferenceId: 'sampleGeoJSON',
        layerType: 'geometry',
        title: 'IsochroneRed',
        attributeDescription: {
          descriptionText: 'first attribute description',
        },
        style: {
          strokeDecorations: ['lineDash'],
          fillColor: {
            type: 'color',
            value: 'rgba(200, 0, 0, 0.1)',
          },
          strokeColor: {
            type: 'color',
            value: 'red',
          },
        },
        legend: [
          {
            type: 'color',
            color: 'red',
            description: 'first attribute legend',
          },
        ],
      },
      {
        geoReferenceId: 'sampleGeoJSON',
        layerType: 'geometry',
        title: 'Second sublayer',
        attributeDescription: {
          descriptionText: 'second attribute description',
        },
        style: {
          strokeDecorations: ['lineDash'],
          fillColor: {
            type: 'color',
            value: 'rgba(255, 204, 0, 0.3)',
          },
          strokeColor: {
            type: 'color',
            value: 'yellow',
          },
        },
        legend: [
          {
            type: 'color',
            color: 'yellow',
          },
        ],
      },
      {
        geoReferenceId: 'sampleGeoJSON',
        layerType: 'geometry',
        title: 'Third sublayer',
        attributeDescription: {
          descriptionText: 'third attribute description',
        },
        style: {
          strokeDecorations: ['lineDash'],
          fillColor: {
            type: 'color',
            value: 'rgba(0, 102, 0, 0.5)',
          },
          strokeColor: {
            type: 'color',
            value: 'green',
          },
        },
        legend: [
          {
            type: 'color',
            color: 'green',
            description: 'third attribute legend',
          },
        ],
      },
    ],
    referenceId: 'groupSampleLayer',
    layerType: 'group',
    category: 'Health facilities',
    title: 'Sample layer of group type',
  },
];

const newMapLayers = [
  {
    referenceId: 'refId1',
    geoReferenceId: 'sampleGeoJSON',
    layerType: 'regions',
    title: 'Layer title',
    attribute: 'COVID-19',
    descriptionText: 'Attribute description',
    colorType: 'colormap',
    color: 'green',
    min: 1,
    max: 5,
    legend: {
      green: 'legend description',
    },
    timeseries: true,
  },
  {
    referenceId: 'refId1',
    geoReferenceId: 'sampleGeoJSON',
    layerType: 'regions',
    title: 'Layer title',
    attribute: 'COVID-19',
    descriptionText: 'Attribute description',
    colorType: 'color',
    color: {
      high: 'red',
      low: 'green',
    },
    legend: {
      red: 'red legend description',
      green: 'green legend description',
    },
  },
];

const mapLayerWithoutGeodata = {
  referenceId: 'sampleMapLayer',
  layerType: 'regions',
  category: 'Baseline data',
  title: 'Sample map layer title',
  attribute: 'attributeName',
  attributeDescription: {
    descriptionText: 'Attribute description.',
  },
  style: {
    fillColor: {
      type: 'colormap',
      value: 'green',
    },
    min: 0,
    max: 10,
  },
  legend: [
    {
      type: 'color',
      color: 'red',
      min: 0,
      max: 10,
      description: 'Colormap description in legend',
    },
  ],
};

module.exports = { mapLayersInDb, layerGeoDataInDb, newMapLayers, mapLayerWithoutGeodata };
