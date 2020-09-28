import { AppState } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { accountInfo } from './actions'
import { AccountInfo } from './types'

export function useAccountInfo(): AccountInfo {
  return useSelector((state: AppState) => state.wallet.accountInfo)
}

export function useAccountInfoUpdate(): (info: AccountInfo) => void {
  const dispatch = useDispatch()
  return useCallback((info: AccountInfo) => dispatch(accountInfo({accountInfo: info})), [dispatch])
}
