import { useState } from 'react'
import { useChainSpace, useQueryChainSpace } from '@/hooks/useChainSpace'
import { useEthBalance } from '@/hooks/useEthBalance'
import { precision } from '@/lib/math'
import { toFloorFixed } from '@/lib/utils'
import { Space } from '@prisma/client'
import { Button } from '../ui/button'
import { AmountInput } from './AmountInput'
import { BuyBtn } from './BuyBtn'
import { EthBalance } from './EthBalance'
import { SpaceTokenBalance } from './SpaceTokenBalance'

interface Props {
  isConnected: boolean
  space: Space
}

export const BuyPanel = ({ space, isConnected }: Props) => {
  const [ethAmount, setEthAmount] = useState<string>('')
  const [purchasedAmount, setPurchasedAmount] = useState<string>('')
  const { refetch } = useQueryChainSpace()
  const { ethBalance } = useEthBalance()
  const { space: chainSpace } = useChainSpace()

  const isAmountValid =
    parseFloat(ethAmount) > 0 && parseFloat(purchasedAmount) > 0

  const isInsufficientBalance = ethBalance.valueDecimal < parseFloat(ethAmount)

  const handleEthChange = (value: string) => {
    setEthAmount(value)
    if (!value) {
      return setPurchasedAmount('')
    }

    const tokenAmountDecimal = precision.toDecimal(
      chainSpace.getTokenAmount(precision.token(value)),
    )
    setPurchasedAmount(toFloorFixed(tokenAmountDecimal, 4).toString())
  }

  const validateAndSetPurchasedAmount = (value: string) => {
    // Validate and format input
    // if (/^\d*\.?\d*$/.test(value) && !value.startsWith('.')) { }
  }

  const handleMax = () => {
    setEthAmount(toFloorFixed(ethBalance.valueDecimal, 6).toString())

    const tokenAmountDecimal = precision.toDecimal(
      chainSpace.getTokenAmount(ethBalance.value),
    )
    setPurchasedAmount(toFloorFixed(tokenAmountDecimal, 4).toString())
  }

  return (
    <>
      <div className="mb-2 bg-gray-100 rounded-xl p-4">
        <div className="text-sm">Sell</div>
        <AmountInput
          symbolName="ETH"
          icon={<img src="/eth.png" alt="ETH" className="w-5 h-auto" />}
          value={ethAmount}
          onChange={(value) => handleEthChange(value)}
        />
        <div className="flex items-center justify-end gap-2 h-6">
          <EthBalance></EthBalance>
          <Button
            onClick={handleMax}
            disabled={!ethBalance}
            className="h-6 cursor-pointer text-xs text-white rounded-md px-2"
          >
            Max
          </Button>
        </div>
      </div>

      <div className="mb-4 bg-gray-100 rounded-xl p-4">
        <div className="text-sm">Buy</div>
        <AmountInput
          symbolName={space.symbolName}
          disabled
          icon={
            <img
              src={space.logo || ''}
              alt={space.symbolName}
              className="w-5 h-auto"
            />
          }
          value={purchasedAmount}
          onChange={(value) => validateAndSetPurchasedAmount(value)}
        />

        <div className="flex items-center justify-end gap-2 h-6">
          <SpaceTokenBalance />
        </div>
      </div>
      <BuyBtn
        ethAmount={ethAmount}
        purchasedAmount={purchasedAmount}
        isConnected={isConnected}
        handleSwap={() => {
          setEthAmount('')
          setPurchasedAmount('')
          refetch()
        }}
        isInsufficientBalance={isInsufficientBalance}
        isAmountValid={isAmountValid}
        space={space}
      />
    </>
  )
}