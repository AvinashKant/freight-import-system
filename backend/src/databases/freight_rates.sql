
CREATE TABLE freight_rates (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  origin_country VARCHAR(255),
  destination_country VARCHAR(255),
  container_type VARCHAR(255),
  carrier VARCHAR(255),
  freight_rate NUMERIC(10, 2),
  created_at timestamp DEFAULT 'now()',
);

-- Optional: Index (PostgreSQL automatically creates a PK index, but if you want extra safety)
CREATE UNIQUE INDEX freight_rates_pkey ON freight_rates(id);