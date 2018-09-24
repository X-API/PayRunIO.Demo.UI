# PayRunIO.Demo.UI

The demo is written as a node app, with a thin client written in handlebars and styling written with sass. 

To get started/setup:

1. Run `node -v` and ensure you have at least node v9.6.0 installed. 
2. Run `npm install --dev` to install all the npm package dependencies. When installing in production omit the `--dev` flag. 
3. Install `aurelia-cli` which is required to run the aurelia bits: `npm install aurelia-cli -g`
4. Install `gulp` which is required to run builds: `npm install -g gulp`
5. Run `gulp` from the root of the checked out repo.

## Gulp tasks

### `lint`

Lints all js files. Check `.eslintrc.json` for the rules it uses when linting. 

### `sass`

Compiles `content/scss/main.scss` to `content/css/main.css`. Simples.

### `server`

Starts the node server, as setup in `app.js`, using nodemon. Watches the following files, and on change will re-run the server:

- `app.js`
- `api/**/*.js`

### `start-au-cli`

Runs `au run` which is an aurelia-cli command, this in turns watches the `src` folder and will transcompile all js and html file changes into `/content/dist`. For more information on these tasks check out:

- The `/aurelia_project` directory that holds the gulp tasks specific to aurelia.
- `aurelia-cli` documentation [here](https://aurelia.io/docs/build-systems/aurelia-cli/). 

### `watch-sass`

Watches all `scss` files in `/content/scss` and executes the sass task (detailed above) on a file change. 

### `default`

Runs all of the above, in parallel. 

## FAQs

### How do I run the server up in IIS?

See https://www.simplymigrate.com/2017/04/11/internet-information-server-iis-node-js-in-producton-iisnode/. 

### How do I run on port 80?

The simplest solution is to run the node app on port 80 by passing in the port number. If this isn't available/is reserved then you can use any of the following solutions.

#### Windows

See https://adamtuttle.codes/add-node-to-existing-iis-server/

#### Linux

```
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```

#### MacOS

```
sudo ipfw add 1 forward 127.0.0.1,3000 ip from any to any 80 in
```

### Keeping the node server "alive"

Wondering how to keep the node server up if it ever crashes out for any reason?

1. Install `forever` globally on the server using `npm install forever -g`
2. Run `forever start app.js`
3. To view the list of processes running forever run `forever list` in your terminal
4. To stop a forever process run `forever stop {index-from-list}`
