import User from '../models/transaction.model.js' // Importing the User model from the transaction.model.js file
import passport from 'passport' // Importing the passport library
import bcrypt from 'bcryptjs' // Importing the bcryptjs library for password hashing
import { GraphQLLocalStrategy } from 'graphql-passport' // Importing the GraphQLLocalStrategy from the graphql-passport library

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log('Serializing User') // Logging a message when serializing the user
    done(null, user.id) // Serializing the user by their ID
  })

  passport.deserializeUser(async (id, done) => {
    console.log('Deserializing User') // Logging a message when deserializing the user
    try {
      const user = await User.findById(id) // Finding the user by their ID
      done(null, user) // Deserializing the user
    } catch (error) {
      done(error) // Handling any errors that occur during deserialization
    }
  })

  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      try {
        const user = await User.findOne({ username }) // Finding the user by their username
        if (!user) {
          throw new Error('Invalid username or password') // Throwing an error if the user is not found
        }

        const validPassword = await bcrypt.compare(password, user.password) // Comparing the provided password with the hashed password stored in the user object
        if (!validPassword) {
          throw new Error('Invalid username or password') // Throwing an error if the password is invalid
        }

        return done(null, user) // Authenticating the user
      } catch (error) {
        return done(error) // Handling any errors that occur during authentication
      }
    }),
  )
}
