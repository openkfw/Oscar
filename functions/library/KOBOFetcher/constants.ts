export const ATTRIBUTES_COLLECTION = 'pointAttributes';

// keys in KOBO response data to be omitted from saving into db
export const EXCEPT_KEYS = [
  '__version__',
  '_attachments',
  '_geolocation',
  '_id',
  '_notes',
  '_uuid',
  '_status',
  '_submission_time',
  '_submitted_by',
  '_validation_status',
  '_tags',
  '_xform_id_string',
  'deviceid',
  'end',
  'formhub/uuid',
  'meta/deprecatedID',
  'meta/instanceID',
  'phonenumber',
  'simserial',
  'start',
  'subscriberid',
  'today',
  'username',
];
