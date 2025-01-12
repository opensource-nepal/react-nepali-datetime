import React, { useState, useRef, useLayoutEffect, useCallback } from 'react'

import styles from './PopoverContent.module.scss'
import classNames from '../../../../utils/classNames'

const WINDOW_HEIGHT_THRESHOLD = 150

interface IPopoverContentProps {
  children: React.ReactNode
  popoverChildRef?: React.RefObject<HTMLInputElement>
  onOutsideClick?: () => void
  onMouseDown?: (event: React.MouseEvent) => void
  onMouseEnter?: (event: React.MouseEvent) => void
}

const PopoverContent: React.FC<IPopoverContentProps> = ({
  popoverChildRef,
  children,
  onOutsideClick,
  onMouseDown,
  onMouseEnter,
}) => {
  const popupRef = useRef<HTMLDivElement | null>(null)
  const [popupStyles, setPopupStyles] = useState<React.CSSProperties>()

  const updatePopupPosition = useCallback(() => {
    const popupChild = popoverChildRef?.current
    if (!popupChild) {
      setPopupStyles({})
      return
    }

    const { bottom, height } = popupChild.getBoundingClientRect()
    const shouldPlaceAbove = bottom + WINDOW_HEIGHT_THRESHOLD > window.innerHeight

    setPopupStyles(shouldPlaceAbove ? { bottom: height } : { top: height })
  }, [popoverChildRef])

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (!onOutsideClick) {
        return
      }

      const target = event.target as Node
      if (
        !popoverChildRef?.current?.contains(target) &&
        !popupRef.current?.contains(target)
      ) {
        onOutsideClick()
      }
    },
    [popoverChildRef, onOutsideClick]
  )

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!onOutsideClick) {
      return
    }

    const relatedTarget = event.relatedTarget as Node
    if (!popoverChildRef?.current?.contains(relatedTarget)) {
      onOutsideClick()
    }
  }

  useLayoutEffect(() => {
    updatePopupPosition()
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [handleOutsideClick, updatePopupPosition])

  if (!popupStyles) {
    return null
  }

  return (
    <div
      className={classNames('ndt-popover-content', styles.popoverContent)}
      ref={popupRef}
      style={popupStyles}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      {children}
    </div>
  )
}

export default PopoverContent
