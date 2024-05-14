// import User from '../models/transaction.model.js' // Importing the User model from the transaction.model.js file
// import passport from 'passport' // Importing the passport library
// import bcrypt from 'bcryptjs' // Importing the bcryptjs library for password hashing
// import { GraphQLLocalStrategy } from 'graphql-passport' // Importing the GraphQLLocalStrategy from the graphql-passport library

// export const configurePassport = async () => {
//   passport.serializeUser((user, done) => {
//     // console.log('Serializing User') // Logging a message when serializing the user
//     done(null, user.id) // Serializing the user by their ID
//   })

//   passport.deserializeUser(async (id, done) => {
//     // console.log('Deserializing User') // Logging a message when deserializing the user
//     try {
//       const user = await User.findById(id) // Finding the user by their ID
//       done(null, user) // Deserializing the user
//     } catch (error) {
//       done(error) // Handling any errors that occur during deserialization
//     }
//   })

//   passport.use(
//     new GraphQLLocalStrategy(async (username, password, done) => {
//       try {
//         const user = await User.findOne({ username }) // Finding the user by their username
//         if (!user) {
//           throw new Error('Invalid username or password') // Throwing an error if the user is not found
//         }

//         const validPassword = await bcrypt.compare(password, user.password) // Comparing the provided password with the hashed password stored in the user object
//         if (!validPassword) {
//           throw new Error('Invalid username or password') // Throwing an error if the password is invalid
//         }

//         return done(null, user) // Authenticating the user
//       } catch (error) {
//         return done(error) // Handling any errors that occur during authentication
//       }
//     }),
//   )
// }

////////

import passport from 'passport'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { GraphQLLocalStrategy } from 'graphql-passport'

export const configurePassport = () => {
  passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${user.username}`)
    done(null, user.id) // Ensures only the user ID is stored in the session.
  })

  passport.deserializeUser(async (id, done) => {
    console.log(`Deserializing user with ID: ${id}`)
    try {
      const user = await User.findById(id)
      if (!user) {
        console.log('User not found during deserialization')
        return done(null, false) // User not found
      }
      done(null, user) // User found, attach to req.user
    } catch (error) {
      console.error('Error during deserialization:', error)
      done(error, null)
    }
  })

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username })
        if (!user) {
          console.log(`Login failed: User not found for username ${username}`)
          return done(null, false, { message: 'Invalid username or password' })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
          console.log(`Login failed: Invalid password for username ${username}`)
          return done(null, false, { message: 'Invalid username or password' })
        }

        console.log(`Login successful for username ${username}`)
        return done(null, user) // Successful authentication, user is logged in
      } catch (error) {
        console.error('Error during login:', error)
        return done(error)
      }
    }),
  )
}
