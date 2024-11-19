# designogkonstruktion

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
```
See [Configuration Reference](https://cli.vuejs.org/config/).
```

### Requered for this project:
```
https://github.com/jacobseated/designogkonstruktion-backend
```


## sql commands for local database:

### Database
```
create database vennerforlivet;
```

### Use the database
```
use vennerforlivet;
```

### Create necessary table
```
create table users (user_id int NOT NULL AUTO_INCREMENT, user_name varchar(25), user_mail varchar(25), user_password varchar(25), user_img LONGBLOB, user_admin BOOLEAN, PRIMARY KEY(user_id));
```
### Dummy users
```

INSERT INTO users (user_id, user_name, user_mail, user_password, user_img, user_admin) VALUES (1, 'Martin', 'mar@vfl.dk', '123456', 'FFD8FFE000104A46494600010101004800480000FFE1005845786966000049492A00', true);
INSERT INTO users (user_id, user_name, user_mail, user_password, user_img, user_admin) VALUES (2, 'Jonas', 'jon@vfl.dk', '123456', 'FFD8FFE000104A46494600010101004800480000FFE1005845786966000049492A00', true);
INSERT INTO users (user_id, user_name, user_mail, user_password, user_img, user_admin) VALUES (3, 'Jacob', 'jac@vfl.dk', '123456', 'FFD8FFE000104A46494600010101004800480000FFE1005845786966000049492A00', true);
INSERT INTO users (user_id, user_name, user_mail, user_password, user_img, user_admin) VALUES (4, 'David', 'dav@vfl.dk', '123456', 'FFD8FFE000104A46494600010101004800480000FFE1005845786966000049492A00', true);

INSERT INTO users (user_id, user_name, user_mail, user_password, user_img, user_admin) VALUES (5, 'Eivind', 'eivind@example.com', '123456', 'FFD8FFE000104A46494600010101004800480000FFE1005845786966000049492A00', false);
INSERT INTO users (user_id, user_name, user_mail, user_password, user_img, user_admin) VALUES (6, 'Karen', 'karen@example.com', '123456', 'FFD8FFE000104A46494600010101004800480000FFE1005845786966000049492A00', false);
INSERT INTO users (user_id, user_name, user_mail, user_password, user_img, user_admin) VALUES (7, 'Ulla', 'ulla@example.com', '123456', 'FFD8FFE000104A46494600010101004800480000FFE1005845786966000049492A00', false);
```
