interface ErrorAlertProps {
  error: string
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null

  return <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">{error}</div>
}
