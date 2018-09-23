# PayRunIO.Demo.UI

The demo is written as a node app, with a thin client written in handlebars and styling written with sass. 

To get started/setup:

1. Run `node -v` and ensure you have at least node v9.6.0 installed. 
2. Run `npm install --dev` to install all the npm package dependencies. When installing in production omit the `--dev` flag. 
3. Install `aurelia-cli` which is required to run the aurelia bits: `npm install aurelia-cli -g`
4. Install `gulp` which is required to run builds: `npm install -g gulp`
5. Run `gulp` from the root of the checked out repo.

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
