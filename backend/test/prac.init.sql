DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
    id          UUID PRIMARY KEY,
    rating      REAL,
    director    TEXT,
    tags        TEXT[],
    image       TEXT,
    cover       TEXT,
    title       TEXT,
    about       TEXT,
    description TEXT
);

CREATE TABLE schedules (
    id       UUID PRIMARY KEY,
    film_id  UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    daytime  TIMESTAMPTZ,
    hall     INTEGER,
    rows     INTEGER,
    seats    INTEGER,
    price    INTEGER,
    taken    TEXT[]
);