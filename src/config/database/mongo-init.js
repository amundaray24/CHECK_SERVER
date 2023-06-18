print('################ MONGO ENTRYPOINT START ################');
db.createUser(
  {
      user: process.env["CHECK_MONGO_USER"],
      pwd: process.env["CHECK_MONGO_PASSWORD"],
      roles: [ { role: "readWrite", db: process.env["CHECK_MONGO_DATABASE"] } ]
  }
)
db.createCollection("CHECK_LOGIN_USER")
db.CHECK_LOGIN_USER.insertOne({user: process.env["CHECK_MONGO_USER"] , password: process.env["CHECK_ADMIN_PASSWORD"], attempts: 3,"__v": 0})
print('################ MONGO ENTRYPOINT END ################');