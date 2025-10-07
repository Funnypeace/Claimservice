import { Component, ReactNode } from "react";

export default class ErrorBoundary extends Component<{children:ReactNode},{error:any}> {
  state = { error: null as any };
  static getDerivedStateFromError(error:any){ return { error }; }
  componentDidCatch(err:any, info:any){ console.error("UI Error:", err, info); }
  render(){
    if (this.state.error) {
      return (
        <div style={{padding:16}}>
          <h2>Unerwarteter Fehler im UI</h2>
          <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.error?.message||this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
