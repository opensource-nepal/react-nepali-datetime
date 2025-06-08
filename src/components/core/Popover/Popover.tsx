/*
 * Inspired from antd Popover (https://ant.design/components/popover)
 */
import { useRef } from 'react'
import PopoverContent from './PopoverContent'
import classNames from '../../../utils/classNames'

interface IPopoverProps {
  open: boolean
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  onOpenChange?: (newOpen: boolean) => void
  onContentMouseDown?: (event: React.MouseEvent) => void
  onContentMouseEnter?: (event: React.MouseEvent) => void
  onContentBlur?: (event: React.FocusEvent) => void
}

const Popover: React.FC<IPopoverProps> = ({
  children,
  content,
  open = false,
  className,
  onOpenChange,
  onContentMouseDown,
  onContentMouseEnter,
  onContentBlur,
}) => {
  const popoverChildRef = useRef<HTMLInputElement | null>(null)

  const setOpenValue = (openValue: boolean) => onOpenChange?.(openValue)

  return (
    <div
      className={classNames('ndt-popover', className)}
      style={{ position: 'relative' }}
    >
      <div
        className="ndt-popover-child"
        style={{ display: 'flex' }}
        ref={popoverChildRef}
        onClick={() => setOpenValue(true)}
      >
        {children}
      </div>
      {open && (
        <PopoverContent
          onOutsideClick={() => setOpenValue(false)}
          popoverChildRef={popoverChildRef}
          onMouseDown={onContentMouseDown}
          onMouseEnter={onContentMouseEnter}
          onBlur={onContentBlur}
        >
          {content}
        </PopoverContent>
      )}
    </div>
  )
}

export default Popover
