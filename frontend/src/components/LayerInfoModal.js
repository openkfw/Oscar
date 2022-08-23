import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { mainTextColor, accentColor, mainBackgroundColor, greyTextColor } from '../utils/oscarMuiTheme';

const useStyles = makeStyles((theme) => ({
  paper: {
    bottom: 0,
    left: 0,
    margin: 'auto',
    maxHeight: '500px',
    maxWidth: '800px',
    minWidth: '300px',
    position: 'fixed',
    right: 0,
    top: 0,
    backgroundColor: mainBackgroundColor,
    color: mainTextColor,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflowY: 'scroll',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  modalRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid rgba(247, 247, 247, 0.11)',
    marginTop: '10px',
    paddingBottom: '10px',
  },
  modalRowLabel: {
    color: mainTextColor,
  },
  modalRowLink: {
    color: greyTextColor,
    '&:hover': {
      color: accentColor.main,
    },
  },
  modalRowDescription: {
    color: greyTextColor,
  },
}));

const LayerInfoModal = ({ isOpen, handleModalClose, modalData, title }) => {
  const classes = useStyles();

  return (
    <Modal open={isOpen} onClose={handleModalClose}>
      <div className={classes.paper}>
        <Typography variant="h2" id="simple-modal-title">
          {title}
        </Typography>
        <Grid container className={classes.modalContent}>
          {modalData.description && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Description
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.description}
              </Grid>
            </Grid>
          )}
          {modalData.attributions && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Attributions
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.attributions}
              </Grid>
            </Grid>
          )}
          {modalData.sourceWebsite && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Source Website
              </Grid>
              <Grid item xs={12} sm={8}>
                <a
                  href={modalData.sourceWebsite}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={classes.modalRowLink}>
                  {modalData.sourceWebsite}
                </a>
              </Grid>
            </Grid>
          )}
          {modalData.sourceOrganisation && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Source Organisation
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.sourceOrganisation}
              </Grid>
            </Grid>
          )}
          {modalData.updateDate && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Update Date
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {moment(modalData.updateDate).format('YYYY-MM-DD')}
              </Grid>
            </Grid>
          )}
          {modalData.updateFrequency && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Update Frequency
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.updateFrequency}
              </Grid>
            </Grid>
          )}
          {modalData.unit && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Unit
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.unit}
              </Grid>
            </Grid>
          )}
          {modalData.reliabilityScore && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Reliability Score
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.reliabilityScore}
              </Grid>
            </Grid>
          )}
          {modalData.dataRetrievalDescription && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Data Retrieval Description
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.dataRetrievalDescription}
              </Grid>
            </Grid>
          )}
          {modalData.dataCalculationDescription && (
            <Grid container item xs={12} spacing={2} className={classes.modalRow}>
              <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                Data Calculation Description
              </Grid>
              <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                {modalData.dataCalculationDescription}
              </Grid>
            </Grid>
          )}
          {modalData.geoMetadata && (
            <>
              <Typography variant="h2">Geographical data info</Typography>
              {modalData.geoMetadata.description && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Description
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.description}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.attributions && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Attributions
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.attributions}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.sourceWebsite && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Source Website
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <a
                      href={modalData.geoMetadata.sourceWebsite}
                      rel="noopener noreferrer"
                      target="_blank"
                      className={classes.modalRowLink}>
                      {modalData.geoMetadata.sourceWebsite}
                    </a>
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.sourceOrganisation && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Source Organisation
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.sourceOrganisation}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.updateDate && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Update Date
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {moment(modalData.geoMetadata.updateDate).format('YYYY-MM-DD')}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.updateFrequency && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Update Frequency
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.updateFrequency}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.unit && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Unit
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.unit}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.reliabilityScore && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Reliability Score
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.reliabilityScore}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.dataRetrievalDescription && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Data Retrieval Description
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.dataRetrievalDescription}
                  </Grid>
                </Grid>
              )}
              {modalData.geoMetadata.dataCalculationDescription && (
                <Grid container item xs={12} spacing={2} className={classes.modalRow}>
                  <Grid item xs={12} sm={4} className={classes.modalRowLabel}>
                    Data Calculation Description
                  </Grid>
                  <Grid item xs={12} sm={8} className={classes.modalRowDescription}>
                    {modalData.geoMetadata.dataCalculationDescription}
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </div>
    </Modal>
  );
};

LayerInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  modalData: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
};

export default LayerInfoModal;
