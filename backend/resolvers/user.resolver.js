import { users } from '../dummyData/data.js'

const userResolver = {
  Mutation: {
    // signUp: async (_, { input }) => {
    //   const user = new User(input)
    //   await user.save()
    //   return user
    // },
    // login: async (_, { input }, { res }) => {
    //   const { username, password } = input
    //   const user = await User.findOne({ username })
    //   if (!user) {
    //     throw new UserInputError("User not found")
    //   }
    //   const isPasswordValid = await bcrypt.compare(password, user.password)
    //   if (!isPasswordValid) {
    //     throw new UserInputError("Password is incorrect")
    //   }
    //   const payload = {
    //     _id: user._id,
    //     username: user.username,
    //   }
    //   const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //     expiresIn: "1d",
    //   })
    //   res.cookie("token", token, { httpOnly: true })
    //   return user
    // },
    // logout: (_, __, { res }) => {
    //   res.clearCookie("token")
    //   return { message: "Logged out successfully" }
    // },
  },
  Query: {
    // users: async () => {
    //     return await User.find()
    // },
    // authUser: async (_, __, { user }) => {
    //     if (!user) {
    //         throw new AuthenticationError('Unauthenticated')
    //     }
    //     return user
    // },
    // user: async (_, { userId }) => {
    //     return await User.findById(userId)
    // },
    users: (_, __, { req, res }) => {
      return users
    },
    user: (_, { userId }) => {
      return users.find((user) => user._id === userId)
    },
  },
}

export default userResolver
