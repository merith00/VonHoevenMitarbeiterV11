
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email,password,done) =>{
        const user = await getUserByEmail(email)
        if (user.email == null) {
            return done(null, false, {message: 'Es existiert kein User mit dieser E-Mail Adresse'})
        }
        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user, {message: 'Erfolgreich eingeloggt'})
            } else {
                return done(null, false, {message: 'Falsches Passwort'})
            }
        } catch (error) {
            return done(error)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email', },
    authenticateUser))
    passport.serializeUser((user,done) => {done(null, user.id)})
    passport.deserializeUser(async (id,done) =>{
        return done(null, await getUserById(id))
    })
}

module.exports = initialize