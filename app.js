function loginPage(req,res,next){

  console.log("locals messages:",res.locals.messages);
  console.log("session:",req.session)
  res.send('loginPage');
}

function logout(req,res,next){
  req.session.destroy()
  res.sendStatus(204);
}
function dashboard(req,res,next){
  if (req.isAuthenticated()) {
    res.send('dashboard page');
  } else {
   res.send('loginPage');
  }
}

function profile(req,res,next){
  console.log("locals messages:",res.locals.messages);
  console.log("session:",req.session)
  res.send('profilePage');
}

function home(req,res,next){
  console.log("locals messages:",res.locals.messages);
  console.log("session:",req.session)
  res.send('homePage');
}

module.exports = {loginPage, logout, dashboard, home, profile}