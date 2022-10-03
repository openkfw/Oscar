const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

module.exports = [
  {
    referenceId: 'Cases increase from yesterday',
    date: `${new Date(now - 1 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'Cases_increase_from_yesterday.csv',
    featureType: 'admin0',
  },
  {
    referenceId: 'Total cases',
    date: `${new Date(now - 1 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'Total_cases.csv',
    featureType: 'admin0',
  },
  {
    referenceId: 'DailyCovid19CasesPerRegion',
    date: `${new Date(now - 1 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'daily_cases/Daily_Covid19_cases_per_region_1.csv',
    featureType: 'admin1',
  },
  {
    referenceId: 'DailyCovid19CasesPerRegion',
    date: `${new Date(now - 2 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'daily_cases/Daily_Covid19_cases_per_region_2.csv',
    featureType: 'admin1',
  },
  {
    referenceId: 'DailyCovid19CasesPerRegion',
    date: `${new Date(now - 3 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'daily_cases/Daily_Covid19_cases_per_region_3.csv',
    featureType: 'admin1',
  },
  {
    referenceId: 'DailyCovid19CasesPerRegion',
    date: `${new Date(now - 4 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'daily_cases/Daily_Covid19_cases_per_region_4.csv',
    featureType: 'admin1',
  },
  {
    referenceId: 'DailyCovid19CasesPerRegion',
    date: `${new Date(now - 5 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'daily_cases/Daily_Covid19_cases_per_region_5.csv',
    featureType: 'admin1',
  },
  {
    referenceId: 'DailyCovid19CasesPerRegion',
    date: `${new Date(now - 6 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'daily_cases/Daily_Covid19_cases_per_region_1.csv',
    featureType: 'admin1',
  },
  {
    referenceId: 'DailyCovid19CasesPerRegion',
    date: `${new Date(now - 7 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'daily_cases/Daily_Covid19_cases_per_region_2.csv',
    featureType: 'admin1',
  },
  {
    referenceId: '7DaysIncidenceRatePerRegion',
    date: `${new Date(now - 1 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: '7_days_incidence_rate/7_days_incidence_rate_per_region_1.csv',
    featureType: 'admin1',
  },
  {
    referenceId: '7DaysIncidenceRatePerRegion',
    date: `${new Date(now - 2 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: '7_days_incidence_rate/7_days_incidence_rate_per_region_2.csv',
    featureType: 'admin1',
  },
  {
    referenceId: '7DaysIncidenceRatePerRegion',
    date: `${new Date(now - 3 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: '7_days_incidence_rate/7_days_incidence_rate_per_region_3.csv',
    featureType: 'admin1',
  },
  {
    referenceId: '7DaysIncidenceRatePerRegion',
    date: `${new Date(now - 4 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: '7_days_incidence_rate/7_days_incidence_rate_per_region_4.csv',
    featureType: 'admin1',
  },
  {
    referenceId: '7DaysIncidenceRatePerRegion',
    date: `${new Date(now - 5 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: '7_days_incidence_rate/7_days_incidence_rate_per_region_5.csv',
    featureType: 'admin1',
  },
  {
    referenceId: '7DaysIncidenceRatePerRegion',
    date: `${new Date(now - 6 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: '7_days_incidence_rate/7_days_incidence_rate_per_region_6.csv',
    featureType: 'admin1',
  },
  {
    referenceId: '7DaysIncidenceRatePerRegion',
    date: `${new Date(now - 7 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: '7_days_incidence_rate/7_days_incidence_rate_per_region_7.csv',
    featureType: 'admin1',
  },
  {
    referenceId: 'TotalCovidCasesPerCountry',
    date: `${new Date(now - 1 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'Total_Covid19_cases_per_country.csv',
    featureType: 'admin0',
  },
  {
    referenceId: 'TotalCovidCasesPerRegion',
    date: `${new Date(now - 1 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'Total_Covid19_cases_per_region.csv',
    featureType: 'admin1',
  },
  {
    date: `${new Date(now - 10 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'population_per_country.csv',
    featureType: 'admin0',
  },
  {
    date: `${new Date(now - 10 * oneDay).toISOString().split('T')[0]}T00:00:00.000Z`,
    csvFileName: 'population_per_region.csv',
    featureType: 'admin1',
  },
];
