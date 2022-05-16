#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE attributes (
    attribute_id          VARCHAR         NOT NULL, 
    attribute_type        VARCHAR         NOT NULL, 
    attribute_key         VARCHAR         NOT NULL, 
    name                  VARCHAR         NOT NULL, 
    geo_data              JSONB           NOT NULL,
    detail                JSONB           NOT NULL,
    metadata              JSONB           NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    
    CONSTRAINT "attributes_PK" PRIMARY KEY (attribute_id)
  );

	CREATE TABLE region_attributes (
    id                    UUID            NOT NULL DEFAULT uuid_generate_v4(),
    attribute_id          VARCHAR         NOT NULL references attributes(attribute_id), 
    feature_id            VARCHAR         NOT NULL, 
    feature_id_lvl        VARCHAR         NOT NULL,
    value                 VARCHAR         NOT NULL,
    value_type            VARCHAR         NOT NULL,
    date_ISO              VARCHAR         NOT NULL,
    date_data             VARCHAR         NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),

    CONSTRAINT "attribute_UQ" UNIQUE (attribute_id, feature_id, feature_id_lvl, date_ISO)
  );

	CREATE TABLE point_attributes (
    id                    UUID            NOT NULL DEFAULT uuid_generate_v4(),
    attribute_id          VARCHAR         NOT NULL references attributes(attribute_id), 
    geometry              GEOMETRY        NOT NULL,
    properties            JSONB           NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),

    CONSTRAINT "pointAttribbute_PK" PRIMARY KEY (id)
  );
EOSQL
