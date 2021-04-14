# spdy-braidify-heisenbug

This is a minimal test case showing a bug (specifically, a heisenbug) in [node-spdy 4.0.2](https://github.com/spdy-http2/node-spdy) when [braidify](https://github.com/braid-org/braidjs) is used.

## Setup

Run:

```
yarn install
yarn devcert
```

## Show the Bug

You'll need 3 terminals:

1. [First Terminal] Start the node-spdy server: `yarn start`
2. [Second Terminal] Start curl with a Braid 'Subscribe' header: `yarn subscribe`
3. [Third Terminal] Start a test: `yarn test`

The server starts at version 1, and the test creates a version 2 and version 3 via 'PUT'. Note that curl shows version 1 and version 2, but no version 3 appears.

## Show the Heisenbug

When enabling node-spdy debug output, the above bug disappears:

1. [First Terminal] Start the node-spdy server, with DEBUG logs: `DEBUG=spdy:stream:server yarn start`
2. [Second Terminal] Start curl with a Braid 'Subscribe' header: `yarn subscribe`
3. [Third Terminal] Start the test: `yarn test`

The server starts at version 1, and the test creates a version 2 and version 3 via 'PUT', as before. Now, however, note that the curl terminal shows version 1, 2, AND 3.
