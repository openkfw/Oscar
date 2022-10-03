#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE attributes (
    attribute_id          VARCHAR         NOT NULL, 
    attribute_type        VARCHAR, 
    attribute_key         VARCHAR, 
    name                  VARCHAR, 
    geo_data              JSONB,
    detail                JSONB,
    data                  JSONB,
    metadata              JSONB,

    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),

    CONSTRAINT "attributes_PK" PRIMARY KEY (attribute_id)
  );

	CREATE TABLE feature_attributes (
    id                    UUID            NOT NULL DEFAULT uuid_generate_v4(),
    attribute_id          VARCHAR         NOT NULL references attributes(attribute_id), 
    feature_id            VARCHAR         NOT NULL, 
    feature_id_lvl        VARCHAR,
    value                 VARCHAR         NOT NULL,
    value_type            VARCHAR         NOT NULL,
    date_iso              VARCHAR         NOT NULL,
    date_data             VARCHAR,

    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),

    CONSTRAINT "attribute_UQ" UNIQUE (attribute_id, feature_id, date_iso)
  );

	CREATE TABLE point_attributes (
    id                    UUID            NOT NULL DEFAULT uuid_generate_v4(),
    attribute_id          VARCHAR         NOT NULL references attributes(attribute_id), 
    geometry              GEOMETRY(Point,3857)        NOT NULL,
    properties            JSONB           NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
    
    CONSTRAINT "pointAttribbute_PK" PRIMARY KEY (id)
  );

  CREATE INDEX idx_point_attributes_geometry ON point_attributes USING GIST(geometry);

EOSQL
