// Helper functions for Supabase operations with retry logic

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retrySupabaseOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }
  let lastError: any
  let delay = opts.initialDelay

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      console.log(`[v0] ${operationName} - Attempt ${attempt + 1}/${opts.maxRetries + 1}`)
      const result = await operation()

      if (attempt > 0) {
        console.log(`[v0] ${operationName} - Success after ${attempt + 1} attempts`)
      }

      return result
    } catch (error: any) {
      lastError = error
      const errorMessage = error?.message || String(error)

      console.error(`[v0] ${operationName} - Attempt ${attempt + 1} failed:`, errorMessage)

      // Check if it's a rate limiting error
      const isRateLimitError =
        errorMessage.includes("Too Many Requests") ||
        errorMessage.includes("Too Many R") ||
        errorMessage.includes("429") ||
        errorMessage.includes("rate limit")

      // Check if it's a JSON parse error (often caused by rate limiting)
      const isJsonError =
        errorMessage.includes("Unexpected token") ||
        errorMessage.includes("is not valid JSON") ||
        errorMessage.includes("JSON")

      // If it's the last attempt or not a retryable error, throw
      if (attempt === opts.maxRetries) {
        console.error(`[v0] ${operationName} - All ${opts.maxRetries + 1} attempts failed`)
        throw error
      }

      // Only retry on rate limiting or network errors
      if (!isRateLimitError && !isJsonError) {
        console.error(`[v0] ${operationName} - Non-retryable error, throwing immediately`)
        throw error
      }

      // Wait before retrying with exponential backoff
      console.log(`[v0] ${operationName} - Waiting ${delay}ms before retry...`)
      await sleep(delay)

      // Increase delay for next attempt
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay)
    }
  }

  throw lastError
}
