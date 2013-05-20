var nconf = require('nconf'),
    server = require('./server.js');

// Get the configuration
nconf.argv()
    .env()
    .file({ file: 'config/voyeur.json' })
    .defaults({
        'server_port': 3000
    });

// set up server and pass the database configuration
return server().listen(nconf.get('server_port'));
