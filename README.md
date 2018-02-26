# Webpack advanced config with the full capabilities

> Webpack 3.11.0

## Additional

> Used a Webpack + PostCSS + Sass + Normalize + Jade + Uglifyjs + Favicons-webpack-plugin

## All special plugin included in local package.json

> 'static' + 'webpack-dev-server' + 'rimraf'

``` bash
# install dependencies
npm install

# start webpack + watch
webpack
# or for Dev (see package.json)
npm run start
# or for Prod
npm run build

# start server WDS (webpack-dev-server) at localhost:9000
npm run start:dev

# start without WDS via 'static' server at localhost:8080
cd dist
static &

```