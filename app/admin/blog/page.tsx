import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { getAllPosts } from '@/lib/db/queries'
import { deletePost } from '@/app/admin/actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog Posts',
  robots: { index: false, follow: false },
}

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function AdminBlogPage() {
  const allPosts = await getAllPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">
            Blog Posts
          </h1>
          <p className="text-sm text-dark-300">
            {allPosts.length} post{allPosts.length !== 1 ? 's' : ''} total.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="glass-dark rounded-xl border border-dark-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700 text-left text-dark-300">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allPosts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-dark-400"
                >
                  No posts yet. Click &ldquo;New Post&rdquo; to get started.
                </td>
              </tr>
            ) : (
              allPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-dark-700/50 hover:bg-dark-700/30"
                >
                  <td className="px-4 py-3 text-white">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-200">
                    {post.category ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-dark-300">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-1.5 rounded-lg text-dark-300 hover:bg-dark-600 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form
                        action={async () => {
                          'use server'
                          await deletePost(post.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-dark-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}