--stored procedures would have been nice to have

drop table if EXISTS user_funds;
drop table if EXISTS purchases;
drop table if EXISTS com_sum;
drop table if EXISTS users;
DROP TABLE IF EXISTS commoditys;
drop table if exists sold;

CREATE TABLE IF NOT EXISTS users (
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL PRIMARY KEY,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS user_funds (
    u_email VARCHAR(60) NOT NULL,
    funds REAL NOT NULL,
    FOREIGN KEY (u_email) REFERENCES users(email)
);


CREATE TABLE IF NOT EXISTS commoditys (
    com_id INT NOT NULL,
    com_name VARCHAR(60) NOT NULL,
    PRIMARY KEY(com_id)
);


CREATE table if not EXISTS purchases (
    p_email VARCHAR(60) not null,
    p_price REAL not null,
    p_amount int not null,
    p_com_id int NOT NULL,
    FOREIGN KEY (p_email) REFERENCES users(email),
    FOREIGN KEY (p_com_id) REFERENCES commoditys(com_id)
);

CREATE TABLE IF NOT EXISTS com_sum (
    u_email VARCHAR(60) not null,
    c_id INT NOT NULL,
    c_sum INT,
    FOREIGN KEY(c_id) REFERENCES commoditys(com_id),
    FOREIGN KEY(u_email) REFERENCES users(email)
);


CREATE table if not EXISTS sold (
    s_email VARCHAR(60) not null,
    s_price REAL not null,
    s_amount int not null,
    s_com_id int NOT NULL,
    FOREIGN KEY (s_email) REFERENCES users(email),
    FOREIGN KEY (s_com_id) REFERENCES commoditys(com_id)
);

insert into commoditys
    (com_id, com_name)
values
    (1, "Guld"),
    (2, "Silver"),
    (3, "Brons");
