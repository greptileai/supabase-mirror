export function VisualDemo() {
  return (
    <div className="border-t border-border relative">
      <div className="mx-auto max-w-[var(--container-max-w,75rem)] px-6 pb-16 md:pb-24">
        <div className="-translate-y-16 relative w-full aspect-[16/9]">
          {/* Gradient blob behind card */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[105%] w-[102%] rounded-[300px] blur-[50px]"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(62, 207, 142, 0.2) 0%, rgba(151, 62, 198, 0.2) 50%, rgba(62, 207, 142, 0.2) 100%)',
            }}
          />
          {/* Card */}
          <div
            className="relative z-10 w-full h-full rounded-xl border border-border bg-surface-75 flex items-center justify-center"
            style={{
              boxShadow:
                '0 0 0 0.5px var(--shadow-border-color), 0 149px 199px 0 rgba(0,0,0,0.07), 0 62.249px 83.137px 0 rgba(0,0,0,0.05), 0 33.281px 44.449px 0 rgba(0,0,0,0.04), 0 18.657px 24.918px 0 rgba(0,0,0,0.04), 0 9.909px 13.234px 0 rgba(0,0,0,0.03), 0 4.123px 5.507px 0 rgba(0,0,0,0.02)',
            }}
          >
            <span className="text-foreground-muted text-sm">Visual demo</span>
          </div>
        </div>
      </div>
    </div>
  )
}
