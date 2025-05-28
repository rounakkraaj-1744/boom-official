import { Wallet } from "lucide-react"

export default function WalletPromo() {
  return (
    <div className="text-center mt-12">
      <div className="inline-flex items-center space-x-2 text-purple-300">
        <Wallet className="w-5 h-5" />
        <span>New users get ₹500 wallet balance!</span>
      </div>
    </div>
  )
}