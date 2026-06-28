'use client'

import { useState, useTransition } from 'react'
import TipTapEditor from './TipTapEditor'
import { updatePost } from '@/app/admin/actions'
import { Loader2, Save, Rocket } from 'lucide-react'

interface PostEditorFormProps {
  post?: {
    id: string
    title: string
    slug: string
    content: string | null
    excerpt: string | null
    seoTitle: string | null
    seoDescription: string | null
    ogImageUrl: string | null
    category: string | null
    readTime: string | null
    status: string
  }
}

export default function PostEditorForm({ post }: PostEditorFormProps) {
  const [content, setContent] = useState(post?.content ?? '')
  const [status, setStatus] = useState(post?.status ?? 'draft')
  const [publishing, setPublishing] = useState(false)
  const [pending, startTransition] = useTransition()

  const isEdit = !!post

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('content', content)
    formData.set('status', status)

    if (isEdit && post) {
      startTransition(async () => {
        await updatePost(post.id, formData)
        if (status === 'published') {
          setPublishing(true)
          setTimeout(() => setPublishing(false), 5000)
        }
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main editor column */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-1.5">
            Title
          </label>
          <input
            name="title"
            defaultValue={post?.title ?? ''}
            required
            placeholder="Enter your post title…"
            className="w-full rounded-lg bg-dark-800 border border-dark-700 px-4 py-2.5 text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-200 mb-1.5">
            Content
          </label>
          <TipTapEditor value={content} onChange={setContent} />
        </div>
      </div>

      {/* SEO sidebar */}
      <div className="space-y-4">
        <div className="glass-dark rounded-xl border border-dark-700 p-5 space-y-4">
          <h3 className="font-heading text-sm font-semibold text-white">
            Post Settings
          </h3>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1">
              Slug
            </label>
            <input
              name="slug"
              defaultValue={post?.slug ?? ''}
              placeholder="auto-generated-from-title"
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1">
              Category
            </label>
            <input
              name="category"
              defaultValue={post?.category ?? 'General'}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1">
              Read time
            </label>
            <input
              name="read_time"
              defaultValue={post?.readTime ?? ''}
              placeholder="e.g. 6 min read"
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              defaultValue={post?.excerpt ?? ''}
              rows={3}
              placeholder="Short summary for listings and SEO…"
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>
        </div>

        <div className="glass-dark rounded-xl border border-dark-700 p-5 space-y-4">
          <h3 className="font-heading text-sm font-semibold text-white">
            SEO
          </h3>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1">
              SEO title
            </label>
            <input
              name="seo_title"
              defaultValue={post?.seoTitle ?? ''}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1">
              SEO description
            </label>
            <textarea
              name="seo_description"
              defaultValue={post?.seoDescription ?? ''}
              rows={3}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1">
              OG image URL
            </label>
            <input
              name="og_image_url"
              defaultValue={post?.ogImageUrl ?? ''}
              className="w-full rounded-lg bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Status + actions */}
        <div className="glass-dark rounded-xl border border-dark-700 p-5 space-y-3">
          <h3 className="font-heading text-sm font-semibold text-white">
            Status
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                status === 'draft'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-dark-800 text-dark-300 border border-dark-700 hover:text-white'
              }`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                status === 'published'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-dark-800 text-dark-300 border border-dark-700 hover:text-white'
              }`}
            >
              Published
            </button>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-50 transition-colors"
          >
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === 'published' ? (
              <Rocket className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {status === 'published' ? 'Publish' : 'Save Draft'}
          </button>

          {publishing && (
            <p className="text-xs text-emerald-400 text-center">
              Publishing… your post will be live in ~60 seconds after Vercel
              rebuilds the static pages.
            </p>
          )}
        </div>
      </div>
    </form>
  )
}