## Rate Limiter

#### Assumptions
Assume the counter starts at the first request of the IP. After an hour, the counter is reset.

#### Implement
I use Node.js, Express.js as server, and mongodb as database.

#### Test
Make sure mongodb is installed and started.

```bash
$ npm install
$ node server.js
```

After that, open a browser and request localhost:3000. The remaining and reset are both in html and header when success.


