/**
 * Decorative full-screen background for auth pages (light blue / white, soft motion).
 */
export function AuthAnimatedBackdrop() {
  return (
    <div
      className='pointer-events-none absolute inset-0 isolate overflow-hidden'
      aria-hidden
    >
      <div className='absolute inset-0 bg-linear-to-br from-sky-100/90 via-white to-indigo-100/70 dark:from-background dark:via-background dark:to-muted/40' />

      <div className='absolute inset-0 animate-auth-grid-drift bg-[linear-gradient(to_right,oklch(0.55_0.12_252/6%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.55_0.12_252/6%)_1px,transparent_1px)] opacity-[0.45] [background-size:32px_32px] dark:opacity-[0.12]' />

      <div className='absolute top-[12%] -left-[8%] size-[min(55vw,28rem)] animate-auth-blob-1 rounded-full bg-linear-to-br from-sky-300/50 to-blue-200/35 blur-[4rem] dark:from-sky-600/20 dark:to-blue-600/15' />

      <div className='absolute top-[42%] -right-[5%] size-[min(48vw,24rem)] animate-auth-blob-2 rounded-full bg-linear-to-bl from-indigo-200/55 to-violet-200/40 blur-[3.5rem] dark:from-indigo-600/18 dark:to-violet-600/14' />

      <div className='absolute bottom-[8%] left-[14%] size-[min(36vw,16rem)] animate-auth-blob-3 rounded-full bg-sky-200/45 blur-[2.75rem] dark:bg-sky-500/14' />

      <svg
        className='absolute -bottom-[5%] left-[-5%] h-[clamp(220px,32vw,360px)] w-[110%] min-w-[800px] animate-auth-wave-shift text-sky-200/65 dark:text-sky-500/22'
        viewBox='0 0 1440 320'
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='none'
      >
        <path
          fill='currentColor'
          d='M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,138.7C672,149,768,203,864,218.7C960,235,1056,213,1152,176C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
        />
      </svg>

      <div className='absolute inset-0 bg-linear-to-t from-white/55 via-transparent to-white/35 dark:from-background/85 dark:to-background/40' />
    </div>
  )
}
