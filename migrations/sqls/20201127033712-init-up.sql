CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE some_services (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    creation_date timestamp with time zone DEFAULT now() NOT NULL
);