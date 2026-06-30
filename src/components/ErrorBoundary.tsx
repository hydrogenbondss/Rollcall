import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

// Catches render-time errors so a single failing component can't blank the
// whole app. Shows a minimal recovery screen instead of a white void.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Roll Call render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-4">Something went wrong</p>
          <h1 className="font-display text-3xl text-[#f0ece8] mb-6">This view failed to load.</h1>
          <a href="./" className="font-body text-sm text-[#c28223] hover:text-[#f0ece8] transition-colors">
            Return to Roll Call &rarr;
          </a>
        </div>
      )
    }
    return this.props.children
  }
}
