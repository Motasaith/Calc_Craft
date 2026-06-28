import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import PostEditorForm from '@/components/admin/PostEditorForm'
import { getPostById } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Edit Blog Post',
  robots: { index: false, follow: false },
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

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
        Edit Blog Post
      </h1>
      <PostEditorForm post={post} />
    </div>
  )
}