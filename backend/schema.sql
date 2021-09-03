-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS status_changes;
DROP TABLE IF EXISTS pomodoro;
DROP TABLE IF EXISTS pomodoro_changes;

CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE statuses (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES user(id);
  status_name VARCHAR(510),
  time_last_updated TIMESTAMP
);

CREATE TABLE pomodoro (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES user(id),
  time_started TIMESTAMP,
  session_type VARCHAR,
  running BOOLEAN,
  clean BOOLEAN,
  time_last_paused TIMESTAMP
);

CREATE TABLE status_changes (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES user(id),
  time TIMESTAMP,
  state JSON
);

CREATE TABLE pomodoro_changes (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES user(id),
  time TIMESTAMP,
  state JSON
);