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
