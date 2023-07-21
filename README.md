# Signin-signup-login-project
 
app.js --> Express server having routes like signup, signin, login, logout, cross origin resource sharing and also having database connectivity.

index.js --> It import app.js and listen on a particular port

controllers/ authController.js --> controller like signup, signin, forgotPassword, resetPassword, login, logout and export it to routes

routes/ authRoute.js --> It imports controllers and make get, post request.

Middleware/ jwtAuth.js --> import jsonwebtoken and find id and email from token.

Models/ userSchema.js --> Schema of user like name, email, password with the help of mongoose.

config/ db.js -->  using mongodb database with the help of mongoose.
