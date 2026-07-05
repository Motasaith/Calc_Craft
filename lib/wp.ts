export const WP_API_URL = 'https://cms.homeofcalculators.com/wp-json/wp/v2'

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const username = process.env.WP_USERNAME
  const password = process.env.WP_APPLICATION_PASSWORD
  if (username && password) {
    let token = ''
    if (typeof Buffer !== 'undefined') {
      token = Buffer.from(`${username}:${password}`).toString('base64')
    } else {
      token = btoa(`${username}:${password}`)
    }
    headers['Authorization'] = `Basic ${token}`
  }
  return headers
}


export interface WPCalculator {
  id: number
  slug: string
  title: { rendered: string }
  content?: { rendered: string }
  acf: {
    brand_name: string
    theme: string
    layout: string
    require_submit: boolean
    calculator_type: 'simple' | 'react'
    react_component_id: string
    input_1_name?: string
    input_2_name?: string
    input_3_name?: string
    input_4_name?: string
    input_5_name?: string
    input_1_type?: string
    input_2_type?: string
    input_3_type?: string
    input_4_type?: string
    input_5_type?: string
    math_formula?: string
    formula_2?: string
    formula_3?: string
  }
}

export async function getCalculators(): Promise<WPCalculator[]> {
  try {
    let allCalculators: WPCalculator[] = []
    let page = 1
    let totalPages = 1

    while (page <= totalPages) {
      const res = await fetch(`${WP_API_URL}/calculator?_embed&per_page=100&page=${page}`, {
        headers: getHeaders(),
        next: { revalidate: 60 } // optional ISR revalidation
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.error(`Fetch calculators failed: ${res.url} - Status ${res.status} - Body: ${body}`)
        throw new Error(`Failed to fetch calculators: Status ${res.status}`)
      }
      
      const data = await res.json()
      allCalculators = [...allCalculators, ...data]
      
      const totalPagesHeader = res.headers.get('x-wp-totalpages')
      if (totalPagesHeader) {
        totalPages = parseInt(totalPagesHeader, 10)
      } else {
        break // Fallback if header is missing
      }
      page++
    }
    
    return allCalculators
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getCalculatorBySlug(slug: string): Promise<WPCalculator | null> {
  try {
    const res = await fetch(`${WP_API_URL}/calculator?slug=${slug}&_embed`, {
      headers: getHeaders(),
      next: { revalidate: 60 }
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`Fetch calculator by slug failed: ${res.url} - Status ${res.status} - Body: ${body}`)
      throw new Error(`Failed to fetch calculator: Status ${res.status}`)
    }
    const data = await res.json()
    return data[0] || null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getPosts() {
  try {
    let allPosts: any[] = []
    let page = 1
    let totalPages = 1

    while (page <= totalPages) {
      const res = await fetch(`${WP_API_URL}/posts?_embed&per_page=100&page=${page}`, {
        headers: getHeaders(),
        next: { revalidate: 60 }
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.error(`Fetch posts failed: ${res.url} - Status ${res.status} - Body: ${body}`)
        throw new Error(`Failed to fetch posts: Status ${res.status}`)
      }
      
      const data = await res.json()
      allPosts = [...allPosts, ...data]
      
      const totalPagesHeader = res.headers.get('x-wp-totalpages')
      if (totalPagesHeader) {
        totalPages = parseInt(totalPagesHeader, 10)
      } else {
        break
      }
      page++
    }
    return allPosts
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, {
      headers: getHeaders(),
      next: { revalidate: 60 }
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`Fetch post by slug failed: ${res.url} - Status ${res.status} - Body: ${body}`)
      throw new Error(`Failed to fetch post: Status ${res.status}`)
    }
    const data = await res.json()
    return data[0] || null
  } catch (error) {
    console.error(error)
    return null
  }
}
