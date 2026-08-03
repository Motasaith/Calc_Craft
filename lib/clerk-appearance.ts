/**
 * Shared Clerk appearance theme.
 *
 * Clerk's prebuilt components (<UserButton>, <UserProfile>) carry a large amount
 * of functionality it would be a mistake to reimplement by hand: email and phone
 * management, password changes, MFA enrolment, connected accounts, active
 * device sessions, and account deletion. Each of those is a multi-step flow with
 * its own verification and edge cases.
 *
 * So rather than rebuild them, they are restyled. This object maps Clerk's
 * internal element names onto the site's own look — the cream background, the
 * white cards with soft borders, and the dark button with the amber drop shadow
 * used everywhere else. The result matches the hand-built /sign-in and /sign-up
 * pages without giving up a single Clerk feature.
 *
 * Element names come from Clerk's appearance API. If a future Clerk version
 * renames one, the rule is silently ignored rather than breaking the page — the
 * component just falls back to its default styling for that part.
 */

export const clerkAppearance = {
  variables: {
    colorPrimary: '#0f766e',
    colorText: '#1a2019',
    colorTextSecondary: '#5b6159',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#1a2019',
    colorDanger: '#dc2626',
    colorSuccess: '#059669',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
  },

  elements: {
    // Containers
    rootBox: 'w-full',
    card: 'bg-white border border-dark-800/10 shadow-sm rounded-2xl',
    cardBox: 'shadow-none border-0',
    navbar: 'bg-[#f7f5ef] border-r border-dark-800/10',
    navbarButton: 'text-dark-600 hover:text-dark-900 font-semibold',
    navbarButtonActive: 'bg-white text-dark-900 shadow-sm',
    pageScrollBox: 'bg-white',
    scrollBox: 'bg-white rounded-2xl',

    // Headings
    headerTitle: 'text-dark-900 font-extrabold tracking-tight',
    headerSubtitle: 'text-dark-500 text-xs font-medium',
    profileSectionTitleText: 'text-dark-900 font-bold',
    profileSectionPrimaryButton: 'text-primary-700 font-bold hover:text-primary-800',

    // The site's signature button: dark with an amber shelf underneath.
    formButtonPrimary:
      'bg-dark-900 hover:bg-dark-800 text-white font-extrabold text-sm normal-case ' +
      'rounded-2xl shadow-[0_4px_0_#dfaa44] hover:-translate-y-0.5 active:translate-y-px transition-all',
    formButtonReset: 'text-dark-500 hover:text-dark-900 font-bold',

    // Inputs
    formFieldInput:
      'bg-white border border-dark-800/15 rounded-xl text-sm text-dark-900 ' +
      'focus:border-primary-700 focus:ring-2 focus:ring-primary-100',
    formFieldLabel: 'text-[11px] font-bold uppercase tracking-wider text-dark-600',
    formFieldHintText: 'text-dark-400 text-xs',
    formFieldErrorText: 'text-red-600 text-xs font-medium',

    // Secondary actions
    badge: 'bg-primary-50 text-primary-700 font-bold',
    avatarBox: 'rounded-xl',
    userButtonAvatarBox: 'w-8 h-8 rounded-xl',
    userButtonPopoverCard: 'bg-white border border-dark-800/10 shadow-xl rounded-2xl',
    userButtonPopoverActionButton: 'text-dark-700 hover:bg-[#f7f5ef] font-semibold',
    userButtonPopoverActionButtonText: 'text-dark-700 font-semibold',
    userButtonPopoverFooter: 'hidden',

    // Clerk's own branding line — the plan allows removing it.
    footer: 'hidden',
    footerAction: 'hidden',

    // Social buttons, to match the trio on /sign-in and /sign-up
    socialButtonsBlockButton:
      'bg-white border border-dark-800/10 hover:border-dark-800/20 hover:bg-dark-50 ' +
      'text-dark-700 font-bold rounded-xl normal-case',

    dividerLine: 'bg-dark-800/10',
    dividerText: 'text-dark-400 text-[10px] font-bold uppercase tracking-widest',

    // Danger zone
    formButtonPrimary__destructive: 'bg-red-600 hover:bg-red-700 shadow-[0_4px_0_#991b1b]',
  },
} as const
