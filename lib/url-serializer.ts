import { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'

/**
 * Serializes a CustomCalculatorConfig object into a URL-safe Base64 string.
 */
export function serializeConfig(config: CustomCalculatorConfig): string {
  try {
    const json = JSON.stringify(config)
    // base64 encode supporting unicode characters
    const base64 = btoa(unescape(encodeURIComponent(json)))
    // Make URL safe: replace '+' with '-', '/' with '_', and strip trailing '='
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch (err) {
    console.error('Failed to serialize config:', err)
    return ''
  }
}

/**
 * Deserializes a URL-safe Base64 string back into a CustomCalculatorConfig object.
 */
export function deserializeConfig(str: string): CustomCalculatorConfig | null {
  if (!str) return null
  try {
    // Restore standard base64 characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    // Restore padding '=' if needed
    while (base64.length % 4) {
      base64 += '='
    }
    const json = decodeURIComponent(escape(atob(base64)))
    return JSON.parse(json) as CustomCalculatorConfig
  } catch (err) {
    console.error('Failed to deserialize config:', err)
    return null
  }
}
