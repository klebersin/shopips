CREATE DATABASE database_ips;

USE database_ips;

CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
);
ALTER TABLE users
  ADD PRIMARY KEY (id);
