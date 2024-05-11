import { users } from '../dummyData/data.js'
import User from '../models/user.model.js'

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input
        if (!username || !name || !password || !gender) {
          throw new UserInputError('All fields are required')
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
        console.error('Error in signUp: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input
        const { user } = await context.authenticate('graphql-local', {
          username,
          password,
        })

        await context.login(user)

        return user
      } catch (error) {
        console.error('Error in login: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout()
        const { req } = context
        req.session.destroy((err) => {
          if (err) {
            console.error('Error in logout: ', err)
            throw err
          }
        })
        req.clearCookie('connect.sid')
        return { message: 'Logged out successfully' }
      } catch (error) {
        console.error('Error in login: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    },
  },
  Query: {
    // users: async () => {
    //     return users
    // },
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser()
        return user
      } catch (error) {
        console.error('Error in authUser: ', err)
        throw new Error(err.message || 'Internal server error')
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId)
        return user
      } catch (error) {
        console.error('Error in user query: ', err)
        throw new Error(err.message || 'Error getting user')
      }
    },
  },
  // Add User<-->transaction relationship
  // User: {
  //   transactions: async (parent) => {
  //     try {
  //       const transactions = await Transaction.find({ userId: parent._id })
  //       return transactions
  //     } catch (err) {
  //       console.log('Error in user.transactions resolver: ', err)
  //       throw new Error(err.message || 'Internal server error')
  //     }
  //   },
  // },
}

export default userResolver
