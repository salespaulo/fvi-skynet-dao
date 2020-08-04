> [‘Own The Internet’ Hackathon](https://gitcoin.co/hackathon/own-the-internet)

-   Hackathon page: https://gitcoin.co/hackathon/own-the-internet

### Handshake

-   Project page: https://handshake.org
-   Learn Center: https://learn.namebase.io

### Sia

-   Project page: https://siasky.net
-   Docs: https://sia.tech/docs/#skynet

## Freunde Von Ideen - Node Data Access Object for Skynet

DAO Skynet Library, to access your JSON like Object data.

### Using

-   Terminal

```shell
mkdir test-dao-skynet
cd test-dao-skynet
npm install --save fvi-skynet-dao
touch index.js
vi index.js
```

-   Vi (Text editor)

```javascript
const SkynetDao = require('fvi-skynet-dao')

const opts = {
    // required
    modelId: 'unique id model',
    // optional
    mock: {
        onDownloadItem: (propId, skylink) => fs.createReadStream('test.xyz'),
        onDownloadIndexes: skylink => fs.createReadStream('test.xyz'),
        onUploadItem: (propId, idxs, currentSkylinkIdxs, data) => fs.createReadStream('test.xyz'),
        onUploadIndexes: indexes => fs.createReadStream('test.xyz'),
    },
    // optional
    indexes: {
        propId: 'myPropId', // optional, defaults "id"
        idxs: ['status'], // optional, index fields to find
        skylink: 'skylink_to_initial_indexes', // optional
    },
}

const dao = SkynetDao(opts)
```

### Create Object

```javascript
const modelItem = {
    status: true,
    firstName: 'First',
    lastName: 'Last name',
    tags: ['developer', 'nodejs', 'skynet'],
}

dao.create(modelItem)
    .then(res => console.log(res))
    .catch(e => console.error(e))

/*
Example of success print:
{
    item: {
        myPropId: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
        firstName: 'First',
        lastName: 'Last',
        status: true,
        skylink: 'sia://QAf9Q7dBSbMarLvyeE6HTQmwhr7RX9VMrP9xIMzpU3I',
        _versions: []
    },
    indexes: {
        values: [{status: true, skylink: 'sia://QAf9Q7dBSbMarLvyeE6HTQmwhr7RX9VMrP9xIMzpU3I'}],
        skylink: 'sia://QAf9Q7dBSbMarLvyeE6HTQmwhr7RX9VMrP9xIMzpU3I',
        _versions: []
    }
}
*/
```

### Read Object

```javascript
dao.read('sia://QAf9Q7dBSbMarLvyeE6HTQmwhr7RX9VMrP9xIMzpU3I')
    .then(res => console.log(res))
    .catch(e => console.error(e))
/*
Example of success print:
{
    myPropId: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
    firstName: 'First',
    lastName: 'Last',
    status: true,
    skylink: 'sia://QAf9Q7dBSbMarLvyeE6HTQmwhr7RX9VMrP9xIMzpU3I',
    _versions: []
}
*/
```

### Indexes

```javascript
dao.indexes()
    .then(res => console.log(res))
    .catch(e => console.error(e))

/*
Example of success print:
{
    values: [{status: true, skylink: 'sia://QAf9Q7dBSbMarLvyeE6HTQmwhr7RX9VMrP9xIMzpU3I'}],
    skylink: 'sia://QAf9Q7dBSbMarLvyeE6HTQmwhr7RX9VMrP9xIMzpU3I',
    _versions: []
}
*/
```

### Audit

-   [HIGH](./AUDIT.md)

# fvi-skynet-dao

-   `npm run compile`: Clean temp files and e directories.
-   `npm run debug-test`: Run mocha unit tests with DEBUG enabled.
-   `npm run test`: Run mocha unit tests.
-   `npm run debug-dev`: Run dev mode, waiting for changes to run unit tests with DEBUG enabled (watch mode).
-   `npm run dev`: Run dev mode, waiting for changes to run unit tests.
-   `npm run prod`: Run with NODE_ENV=production.
-   `npm run coverage`: Run unit tests and coverage with [nyc](https://github.com/istanbuljs/nyc/).
-   `npm run release`: Init git flow release from next package version, **patch**, [git flow](https://github.com/nvie/gitflow/).
-   `npm run release:minor`: Init git flow release from next package version, **minor**, [git flow](https://github.com/nvie/gitflow/).
-   `npm run release:major`: Init git flow release from next package version, **major**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:finish`: Finish current releas, [git flow](https://github.com/nvie/gitflow/).
