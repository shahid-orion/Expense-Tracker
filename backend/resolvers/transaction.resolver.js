import Transaction from '../models/transaction.model.js'

const transactionsResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error('You are unauthenticated')
        const userId = await context.getUser()._id

        const transactions = await Transaction.find({ userId })
        return transactions
      } catch (err) {
        console.log('Error in transactions resolver:', err)
        throw new Error(err.message || 'Error in transactions resolver')
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId)
        return transaction
      } catch (err) {
        console.log('Error in transaction resolver:', err)
        throw new Error(err.message || 'Error in transaction resolver')
      }
    },
    // add category statistics query later
    // categoryStatistics: async (_, __, context) => {
    //   if (!context.getUser()) throw new Error('Unauthorized')

    //   const userId = context.getUser()._id
    //   const transactions = await Transaction.find({ userId })
    //   const categoryMap = {}

    //   // const transactions = [
    //   // 	{ category: "expense", amount: 50 },
    //   // 	{ category: "expense", amount: 75 },
    //   // 	{ category: "investment", amount: 100 },
    //   // 	{ category: "saving", amount: 30 },
    //   // 	{ category: "saving", amount: 20 }
    //   // ];

    //   transactions.forEach((transaction) => {
    //     if (!categoryMap[transaction.category]) {
    //       categoryMap[transaction.category] = 0
    //     }
    //     categoryMap[transaction.category] += transaction.amount
    //   })

    //   // categoryMap = { expense: 125, investment: 100, saving: 50 }

    //   return Object.entries(categoryMap).map(([category, totalAmount]) => ({
    //     category,
    //     totalAmount,
    //   }))
    //   // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
    // },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error('You are unauthenticated')
        const userId = await context.getUser()._id

        const newTransaction = new Transaction({ ...input, userId })
        await newTransaction.save()
        return newTransaction
      } catch (err) {
        console.log('Error in createTransaction resolver:', err)
        throw new Error(err.message || 'Error in createTransaction resolver')
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        // const { transactionId, ...updates } = input
        // const updatedTransaction = await Transaction.findByIdAndUpdate(
        //   transactionId,
        //   updates,
        //   { new: true }
        // )
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true },
        )
        return updatedTransaction
      } catch (err) {
        console.log('Error in updateTransaction resolver:', err)
        throw new Error(err.message || 'Error in updateTransaction resolver')
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId,
        )
        return deletedTransaction
      } catch (err) {
        console.log('Error in deleteTransaction resolver:', err)
        throw new Error(err.message || 'Error in deleteTransaction resolver')
      }
    },
  },
  // Add Transaction<-->User relationship
  // Transaction: {
  //   user: async (parent) => {
  //     const userId = parent.userId
  //     try {
  //       const user = await User.findById(userId)
  //       return user
  //     } catch (err) {
  //       console.error('Error getting user:', err)
  //       throw new Error('Error getting user')
  //     }
  //   },
  // },
}

export default transactionsResolver
