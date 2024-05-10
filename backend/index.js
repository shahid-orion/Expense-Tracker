import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'

import { ApolloServer } from '@apollo/server'
// import { startStandaloneServer } from "@apollo/server/standalone"
import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from './typeDefs/index.js'
import dotenv from 'dotenv'
import { connectDB } from './db/connectDB.js'

//authentications -->
import passport from 'passport'
import session from 'express-session'
import MongoDBStore from 'connect-mongodb-session'
import { buildContext } from 'graphql-passport'
import { configurePassport } from './passport/passport.config.js'

// assigning session to mongoDBStore as example --> for cjs
// var MongoDBStore = require('connect-mongodb-session')(session);
const mongoDBStore = MongoDBStore(session)

// Configure environment variables
dotenv.config()
configurePassport()

const app = express()
const httpServer = http.createServer(app)

//create a store for authentication
const store = new mongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
})
store.on('error', (error) => console.log(error))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // this option specifies whether to save teh session to the store on every request
    saveUninitialized: false, // option specifies whether to save uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //  Expires in 1 day
      httpOnly: true, // this option prevents the Cross-Site Scripting (XSS) attacks
    },
    store: store,
  }),
)
app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

// const { url } = await startStandaloneServer(server)
// Ensure we wait for our server to start
await server.start()

// console.log(`🚀 Server ready at ${url}`)
// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  }),
)

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
//connecting mongo db
await connectDB()

console.log(`🚀 Server ready at http://localhost:4000/`)
