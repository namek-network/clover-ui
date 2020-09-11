import { AppState } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { balance, address } from './actions'
import { AllToken } from './reducer'

export function useBalance(): AllToken | undefined {
  return useSelector((state: AppState) => state.application.balance)
}

export function useBalanceUpdate(): (count: AllToken) => void {
  const dispatch = useDispatch()
  return useCallback((count: AllToken) => dispatch(balance(count)), [dispatch])
}

export function useAddress(): string | undefined {
    return useSelector((state: AppState) => state.application.address)
}

export function useAddressUpdate(): (addr: string) => void {
    const dispatch = useDispatch()
    return useCallback((addr: string) => dispatch(address(addr)), [dispatch])
  }