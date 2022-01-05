import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import CasesByProvincePieChart from './covid19Graphs/CasesByProvincePieChart';
import CasesPerDayByProvince from './covid19Graphs/CasesPerDayByProvince';
import CurrentCovid19Situation from './covid19Graphs/CurrentCovid19Situation';
import SevenDaysIncidenceRate from './covid19Graphs/SevenDaysIncidenceRate';
import TotalCasesDistribution from './covid19Graphs/TotalCasesDistribution';

import DistributionPlot from './styledGraphComponents/DistributionPlot';
import LinePlot from './styledGraphComponents/LinePlot';
import OverviewPlot from './styledGraphComponents/OverviewPlot';
import OverviewTable from './styledGraphComponents/OverviewTable';
import TablePlot from './styledGraphComponents/TablePlot';
import HalfWidthFilteredLinePlot from './styledGraphComponents/HalfWidthFilteredLinePlot';

import EmptyChartMessage from './EmptyChartMessage';

const useStyles = () => ({
  chart: {
    paddingLeft: '12px',
    paddingRight: '12px',
  },
});

const Default = () => <p>Default</p>;

const InvalidGraphMessage = (props) => (
  <EmptyChartMessage title={`Incorrect graphs settings for graph ${props.graphName}`} />
);

class OscarGraph extends Component {
  graphs = {
    covid19Graphs: {
      CasesByProvincePieChart,
      CasesPerDayByProvince,
      CurrentCovid19Situation,
      SevenDaysIncidenceRate,
      TotalCasesDistribution,
    },
    styledGraphs: {
      DistributionPlot,
      LinePlot,
      OverviewPlot,
      OverviewTable,
      TablePlot,
      HalfWidthFilteredLinePlot,
    },
    default: {
      // graphs without specific categorization
      Default,
    },
  };

  getGraphName = (category, graphName) => {
    if (this.graphs[category]) {
      if (this.graphs[category][graphName]) {
        return this.graphs[category][graphName];
      }
      return InvalidGraphMessage;
    }
    if (this.graphs.default[graphName]) {
      return this.graphs.default[graphName];
    }
    return InvalidGraphMessage;
  };

  render() {
    const GraphName = this.getGraphName(this.props.category, this.props.graphName);
    return <GraphName {...this.props} />;
  }
}
export default withStyles(useStyles)(OscarGraph);
