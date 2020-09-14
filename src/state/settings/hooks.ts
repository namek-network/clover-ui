import { AppState } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { slippageTol, transDeadline } from './actions'

export function useSlippageTol(): number {
  return useSelector((state: AppState) => state.settings.slippageTol)
}

export function useSlippageTolUpdate(): (spt: number) => void {
  const dispatch = useDispatch()
  return useCallback((spt: number) => dispatch(slippageTol(spt)), [dispatch])
}

export function useTransDeadline(): number {
    return useSelector((state: AppState) => state.settings.transDeadline)
}

export function useTransDeadlineUpdate(): (td: number) => void {
    const dispatch = useDispatch()
    return useCallback((td: number) => dispatch(transDeadline(td)), [dispatch])
  }