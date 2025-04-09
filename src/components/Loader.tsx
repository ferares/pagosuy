import Spinner from "./Spinner"

interface LoaderProps { active: boolean, message?: string }

export default function Loader({ active, message }: LoaderProps) {
  return (
    <div className={`loader ${active ? "active" : ""}`}>
      {message && (<span className="loader-message" role="alert">{message}</span>)}
      <Spinner />
    </div>
  )
}