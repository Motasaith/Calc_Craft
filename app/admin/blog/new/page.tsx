import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PostEditorForm from '@/components/admin/PostEditorForm'
import { createPost } from '@/app/admin/actions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'New Blog Post',
  robots: { index: false, follow: false },
}

export default async function NewBlogPostPage() {
  async function handleCreate(formData: FormData) {
    'use server'
    const id = await createPost(formData)
    redirect(`/admin/blog/${id}/edit`)
  }

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-dark-300 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to posts
      </Link>
      <h1 className="font-heading text-2xl font-bold text-white mb-6">
        New Blog Post
      </h1>

      {/* Create a draft first, then redirect to the editor */}
      <form action={handleCreate}>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
        >
          Create draft &amp; open editor
        </button>
      </form>
    </div>
  )
}