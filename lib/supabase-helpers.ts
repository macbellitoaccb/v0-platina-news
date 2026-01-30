// Helper functions for Supabase operations with retry logic

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 1, // Apenas 2 tentativas (reduzido de 3)
  initialDelay: 1000, // Reduzido para 1 segundo
  maxDelay: 5000,
  backoffMultiplier: 2,
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 500 // Reduzido para 500ms entre requisições

async function waitForRateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await sleep(waitTime)
  }

  lastRequestTime = Date.now()
}

// Função que tenta uma operação e retorna null em caso de falha (sem exceção)
export async function trySupabaseOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
): Promise<T | null> {
  try {
    await waitForRateLimit()
    return await operation()
  } catch (error: any) {
    console.error(`[v0] ${operationName} failed:`, error?.message || String(error))
    return null
  }
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
      await waitForRateLimit()

      const result = await operation()
      return result
    } catch (error: any) {
      lastError = error
      const errorMessage = error?.message || String(error)

      // Check if it's a retryable error
      const isRetryable =
        errorMessage.includes("Too Many Requests") ||
        errorMessage.includes("Too Many R") ||
        errorMessage.includes("429") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("Unexpected token") ||
        errorMessage.includes("is not valid JSON") ||
        errorMessage.includes("521") ||
        errorMessage.includes("Web server is down") ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("ECONNREFUSED")

      // If it's the last attempt or not retryable, throw
      if (attempt === opts.maxRetries || !isRetryable) {
        throw error
      }

      await sleep(delay)
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay)
    }
  }

  throw lastError
}
