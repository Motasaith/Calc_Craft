export interface BlogPost {
  id: string
  title: { rendered: string }
  slug: string
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: { rendered: 'Welcome to Home of Calculators Blog' },
    slug: 'welcome',
    content: { rendered: '<p>This is a placeholder post.</p>' },
    excerpt: { rendered: '<p>Placeholder</p>' },
    date: new Date().toISOString()
  }
]

export async function getPosts(): Promise<BlogPost[]> {
  return mockPosts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return mockPosts.find(p => p.slug === slug) || null
}
