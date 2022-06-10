#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE layer_geo_data (
    reference_id          VARCHAR         NOT NULL, 
    name                  VARCHAR         NOT NULL, 
    format                VARCHAR         NOT NULL, 
    geo_data_url          VARCHAR         NOT NULL,
    data                  JSONB           NOT NULL,
    metadata              JSONB           NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    CONSTRAINT "layergeodata_PK" PRIMARY KEY (reference_id)
  );

  CREATE TABLE map_layers (
    reference_id           VARCHAR         NOT NULL,
    geo_reference_id       VARCHAR         NOT NULL references layer_geo_data(reference_id), 
    layer_type             VARCHAR         NOT NULL, 
    category               VARCHAR         NOT NULL, 
    title                  VARCHAR         NOT NULL,
    attribute_id           VARCHAR         NOT NULL references attributes(attribute_id),
    attribute_description  JSONB           NOT NULL,
    styles                 JSONB           NOT NULL,
    legend                 JSONB           NOT NULL,
    layer_options          JSONB           NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    CONSTRAINT "maplayers_PK" PRIMARY KEY (reference_id)
  );

EOSQL