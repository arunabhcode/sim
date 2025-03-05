import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Check if we're in local storage mode (CLI usage with npx simstudio)
const isLocalStorage = process.env.USE_LOCAL_STORAGE === 'true'

// Create a type for our database client
type DrizzleClient = ReturnType<typeof drizzle>

// Create a mock implementation for localStorage mode
const createMockDb = (): DrizzleClient => {
  const mockHandler = {
    get: (target: any, prop: string) => {
      // Return a function that logs and returns empty results
      if (typeof prop === 'string') {
        return (...args: any[]) => {
          console.log(`[localStorage Mode] DB operation "${prop}" called with:`, args)

          // Create a chainable mock that always returns itself
          const chainableMock = new Proxy(
            {},
            {
              get: (target, chainProp) => {
                if (chainProp === 'then') {
                  // Make it thenable to work with await
                  return (resolve: Function) => resolve([])
                }
                return chainableMock
              },
            }
          )

          return chainableMock
        }
      }
      return undefined
    },
  }

  return new Proxy({} as DrizzleClient, mockHandler)
}

// Initialize the database client
let db: DrizzleClient

if (!isLocalStorage) {
  // In production, use the Vercel-generated POSTGRES_URL
  // In development, use the direct DATABASE_URL
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL!

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(connectionString, {
    prepare: false,
  })
  db = drizzle(client)
} else {
  // Use mock implementation in localStorage mode
  db = createMockDb()
}

// Export the database client (never null)
export { db }
