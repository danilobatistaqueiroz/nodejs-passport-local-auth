function verify(username, password, done) {
  let err = null;
  if(!username || username.length === 0) err = 'Username not provided'
  if(username.length < 3) err = 'Username minimum length must be at least 3 characters'
  if(!password || password.length === 0) err = 'Password not provided'
  if(password.length < 8) err = 'Password minimum length must be at least 8 characters'
  if (err) return done(err)
  if (!(username=="joke" && password=="joke123456")) {
    return done(null, false, { message: 'Incorrect username or password.' });
  }
  return done(null, {username:"joke",id:"1"});
}

let count = 1
printData = (req, res, next) => {
  console.log("\n==============================")
  console.log(`------------>  ${count++}`)

  console.log(`req.body.username -------> ${req.body.username}`) 
  console.log(`req.body.password -------> ${req.body.password}`)

  console.log(`\n req.session.passport -------> `)
  console.log(req.session.passport)

  console.log(`\n req.user -------> `) 
  console.log(req.user) 

  console.log("\n Session and Cookie")
  console.log(`req.session.id -------> ${req.session.id}`) 
  console.log(`req.session.cookie -------> `) 
  console.log(req.session.cookie) 

  console.log("===========================================\n")

  next()
}

module.exports = {verify,printData};