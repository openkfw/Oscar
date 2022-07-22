export const casesAttrToDb = [
  {
    date: '2021-02-09T00:00:00.000Z',
    dataDate: 'January 2021',
    featureId: 'Province1',
    attributeId: 'covid19Cases',
    valueNumber: 272718,
  },
  {
    date: '2021-02-10T00:00:00.000Z',
    dataDate: 'February 2021',
    featureId: 'Province1',
    attributeId: 'covid19Cases',
    valueNumber: 272718,
  },
  {
    date: '2021-02-11T00:00:00.000Z',
    dataDate: 'March 2021',
    featureId: 'Province1',
    attributeId: 'covid19Cases',
    valueNumber: 272718,
  },
  {
    date: '2021-02-12T00:00:00.000Z',
    dataDate: 'April 2021',
    featureId: 'Province1',
    attributeId: 'covid19Cases',
    valueNumber: 272718,
  },
  {
    date: '2021-02-13T00:00:00.000Z',
    dataDate: 'May 2021',
    featureId: 'Province1',
    attributeId: 'covid19Cases',
    valueNumber: 272718,
  },
];

export const deathsAttrToDb = [
  {
    date: '2021-02-04T00:00:00.000Z',
    dataDate: 'June 2021',
    featureId: 'Province1',
    attributeId: 'covid19Deaths',
    valueNumber: 272718,
  },
  {
    date: '2021-02-05T00:00:00.000Z',
    dataDate: 'July 2021',
    featureId: 'Province1',
    attributeId: 'covid19Deaths',
    valueNumber: 272718,
  },
  {
    date: '2021-02-06T00:00:00.000Z',
    dataDate: 'August 2021',
    featureId: 'Province1',
    attributeId: 'covid19Deaths',
    valueNumber: 272718,
  },
  {
    date: '2021-02-07T00:00:00.000Z',
    dataDate: 'September 2021',
    featureId: 'Province1',
    attributeId: 'covid19Deaths',
    valueNumber: 272718,
  },
  {
    date: '2021-02-08T00:00:00.000Z',
    dataDate: 'October 2021',
    featureId: 'Province1',
    attributeId: 'covid19Deaths',
    valueNumber: 272718,
  },
];

export const categoryStringAttr = [
  {
    date: '2021-02-13T00:00:00.000Z',
    featureId: 'Province1',
    attributeId: 'categorisedCases',
    valueNumber: 12345,
  },
  {
    date: '2021-02-13T00:00:00.000Z',
    featureId: 'Province2',
    attributeId: 'casedNcategorised',
    valueNumber: 2345,
  },
];

export const bedOccupancyAttrToDb = [
  {
    date: '2021-03-28T00:00:0.000Z',
    dataDate: 'January 2021 to February 2021',
    featureId: 'District1',
    attributeId: 'Bed occupancy rate',
    valueNumber: 130,
  },
  {
    date: '2021-03-29T00:00:0.000Z',
    dataDate: 'January 2021 to February 2021',
    featureId: 'District1',
    attributeId: 'Bed occupancy rate',
    valueNumber: 140,
  },
  {
    date: '2021-03-28T00:00:0.000Z',
    dataDate: 'January 2021 to February 2021',
    featureId: 'District2',
    attributeId: 'Bed occupancy rate',
    valueNumber: 110,
  },
  {
    date: '2021-03-29T00:00:0.000Z',
    dataDate: 'January 2021 to February 2021',
    featureId: 'District2',
    attributeId: 'Bed occupancy rate',
    valueNumber: 102,
  },
];

export const hospitalStayAttrToDb = [
  {
    date: '2021-03-30T00:00:0.000Z',
    dataDate: 'January 2021 to February 2021',
    featureId: 'District1',
    attributeId: 'Hospital stay',
    valueNumber: 200,
  },
];

export const bedOccupancyWithoutDataDateAttrToDb = [
  {
    date: '2021-03-28T00:00:0.000Z',
    featureId: 'District1',
    attributeId: 'Bed occupancy rate',
    valueNumber: 130,
  },
  {
    date: '2021-03-29T00:00:0.000Z',
    featureId: 'District1',
    attributeId: 'Bed occupancy rate',
    valueNumber: 140,
  },
];

export default {
  casesAttrToDb,
  deathsAttrToDb,
  categoryStringAttr,
  bedOccupancyAttrToDb,
  hospitalStayAttrToDb,
  bedOccupancyWithoutDataDateAttrToDb,
};
