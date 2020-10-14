import { AppState } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { accountInfo, wrongNetwork } from './actions'
import { AccountInfo } from './types'

export function useAccountInfo(): AccountInfo {
  return useSelector((state: AppState) => state.wallet.accountInfo)
}

export function useAccountInfoUpdate(): (info: AccountInfo) => void {
  const dispatch = useDispatch()
  return useCallback((info: AccountInfo) => dispatch(accountInfo({accountInfo: info})), [dispatch])
}

export function useWrongNetwork(): boolean {
  return useSelector((state: AppState) => state.wallet.wrongNetwork)
}

export function useWrongNetworkUpdate(): (wrong: boolean) => void {
  const dispatch = useDispatch()
  return useCallback((wrong: boolean) => dispatch(wrongNetwork({wrongNetwork: wrong})), [dispatch])
}