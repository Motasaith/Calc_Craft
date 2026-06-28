import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customCalculators } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import LibraryPageClient from './LibraryPageClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Library',
  robots: { index: false, follow: false },
}

export default async function LibraryPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-2xl font-bold text-white mb-3">
            Sign in to view your library
          </h1>
          <p className="text-sm text-dark-300 mb-6">
            Save calculators from the builder and access them here anytime.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
          >
            Sign in with Google
          </a>
        </div>
      </div>
    )
  }

  // Fetch the user's saved calculators.
  const userCalculators = await db
    .select()
    .from(customCalculators)
    // @ts-expect-error — session.user.id is available with DB strategy
    .where(eq(customCalculators.userId, session.user.id))

  return <LibraryPageClient calculators={userCalculators} />
}