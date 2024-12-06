# designogkonstruktion

Production: https://wriggleflap.beamtic.net/vfl/

## Project setup
```
npm install
```

## Development on localhost
Content for the frontend `.env` file doing development:
```
VUE_APP_API_BASE_URL=http://localhost:8081
```

### Runs a development server with hot-reload capability
```
npm run serve
```

**Lints and fixes files**
```
npm run lint
```

**Customize configuration**
```
See [Configuration Reference](https://cli.vuejs.org/config/).
```

**List of Material Design Icons**
```
https://pictogrammers.com/library/mdi/
```

**The backend for this project:**
```
https://github.com/jacobseated/designogkonstruktion-backend
```

## Deployment to Production
1. Clone the project from GitHub onto your server.
```
cd [project-dir]
git clone https://github.com/Zaah91/designogkonstruktion.git
```

2. Compile the app to `dist/`:
```
npm run build
```

3. Finally, deploy to your v-host. E.g. Using "Apache HTTP Server" as an example:
```
cp -R dist/* /var/www/html/vfl
chmod -R www-data:www-data /var/www/html/vfl
```
Apache will then serve the frontend using Let's Encrypt certificates. How to install Let's Encrypt or configure Apache virtual hosts is not covered here.

4. Remember to update the `.env` file:
```
VUE_APP_API_BASE_URL=https://wriggleflap.beamtic.net:8081
NODE_ENV=production
```

#### Updating
To fetch the latest code from GitHub simply run:
```
git pull
```
Then repeat the steps to build and copy the files to `/var/www/html/vfl`
