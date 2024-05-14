import { users } from '../dummyData/data.js'
import User from '../models/user.model.js'

import bcrypt from 'bcryptjs' // Make sure to import bcryptjs
import { UserInputError } from 'apollo-server-express' // Importing the error class to throw specific GraphQL errors

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input
        if (!username || !name || !password || !gender) {
          throw new Error('All fields are required')
        }
        const existingUser = await User.findOne({ username })
        if (existingUser) {
          throw new UserInputError('User already exists')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // https://avatar-placeholder.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic,
        })

        await newUser.save()
        await context.login(newUser)
        return newUser
      } catch (error) {
        console.error('Error in signUp: ', error)
        throw new Error(error.message || 'Internal server error')
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input
        if (!username || !password) throw new Error('All Fields are required')
        const { user } = await context.authenticate('graphql-local', {
          username,
          password,
        })

        await context.login(user)

        return user
      } catch (error) {
        console.error('Error in login: ', error)
        throw new Error(error.message || 'Internal server error')
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout()
        const { req, res } = context
        req.session.destroy((error) => {
          if (error) {
            console.error('Error in logout: ', error)
            throw error
          }
        })
        res.clearCookie('connect.sid')
        return { message: 'Logged out successfully' }
      } catch (error) {
        console.error('Error in login: ', error)
        throw new Error(error.message || 'Internal server error')
      }
    },
  },
  Query: {
    // users: async () => {
    //     return users
    // },
    authUser: async (_, __, context) => {
      // try {
      //   const user = await context.getUser()
      //   return user
      // } catch (error) {
      //   console.error('Error in authUser: ', error)
      //   throw new Error(error.message || 'Internal server error')
      // }
      try {
        if (!context.user) {
          console.log('No user found in context', context) // Log to see if this is the issue
          return null
        }
        console.log('User found:', context.user)
        const user = await User.findById(context.user._id) // Confirm user ID is available
        return user
      } catch (error) {
        console.error('Error in authUser:', error)
        throw new Error(error.message || 'Internal server error')
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId) // User from MongoDB

        // finding user by id using JS function
        // const user = users.find((user) => user._id === userId)

        return user
      } catch (error) {
        console.error('Error in user query: ', error)
        throw new Error(error.message || 'Error getting user')
      }
    },
  },
  // Add User<-->transaction relationship
  // User: {
  //   transactions: async (parent) => {
  //     try {
  //       const transactions = await Transaction.find({ userId: parent._id })
  //       return transactions
  //     } catch (error) {
  //       console.log('Error in user.transactions resolver: ', error)
  //       throw new Error(error.message || 'Internal server error')
  //     }
  //   },
  // },
}

export default userResolver
