# Check Time Report

- Author: ANGERSON JOSE AMUNDARAY RENGIFO
- Version: 2.1.0
- Type: NodeJs

IMPORTANT:
```

must create .env file example:

TZ=<TIME-ZONE>
CHECK_ENV=<DEV|QA|PRD>
CHECK_PORT=<PORT>
CHECK_LOG_PATH=<LOG_PATH>
CHECK_MONGO_DOMAIN=<MONGO-DB-HOST>
CHECK_MONGO_PORT=<MONGO-DB-PORT>
CHECK_MONGO_DATABASE=<MONGO-DB-DATABASE>
CHECK_MONGO_USER=<MONGO-DB-CHECK-USER>
CHECK_MONGO_PASSWORD=<MONGO-DB-CHECK-PASSWORD>

```

OPTIONAL:
```

you could init database by creating a file on src/config/database/mongo-init.js, Example:

db.createUser(
  {
      user: "<MONGO-DB-CHECK-USER>",
      pwd: "<MONGO-DB-CHECK-PASSWORD>",
      roles: [ { role: "readWrite", db: "<MONGO-DB-DATABASE>" } ]
  }
)
db.createCollection("CHECK_LOGIN_USER")
db.CHECK_LOGIN_USER.insert({user: '<ADMIN USER>',password: '<PASSWORD GENERATED WHIT KEY>', attempts: 3,"__v": 0})
```


init command:
```
Dev:
npm run dev

PRD:
npm start

```