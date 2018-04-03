# PayRunIO.Demo.UI

The demo is written as a node app, with a thin client written in handlebars and styling written with sass. 

To get started/setup:

1. Run `node -v` and ensure you have at least node v9.6.0 installed. 
2. Run `npm install --dev` to install all the npm package dependencies. When installing in production omit the `--dev` flag. 
3. Run `node app.js` this will startup the server, which will default to run on port 3000. This can be set to an explicit port by running `node app.js -p 80` which will run the app up on port 80.

## API Settings

In `constants.js` there are three settings that should be overwritten when running locally:

- `apiUrl` - Should be `https://api.test.payrun.io` or `https://api.payrun.io`. More information on the available environments can be found [here](http://developer.payrun.io/docs/getting-started/environments.html).
- `consumerKey` - This will be your own account's consumerKey which will be generated when [signing up for an account here](https://developer.payrun.io/Account/Register). 
- `consumerSecret` - This will be your own account's consumerSecret which will be generated when [signing up for an account here](https://developer.payrun.io/Account/Register). 

## Scripts

### `npm run watch`

Will run the up the node server, listen on port 3000 and watch the following file types for changes. If a change is detected it will restart the server. 

- *.js
- *.hbs
- *.scss

### `npm run test`

Will run all spec unit tests in jasmine.

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
