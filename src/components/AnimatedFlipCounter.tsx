import React, { useEffect, useRef, useState, useCallback } from 'react'
import ProgressService, { ProgressData } from '@/services/progressService'

interface AnimatedFlipCounterProps {
  progressType: 'challengerProgress' | 'erProgress'
  label: string
  className?: string
  animationDuration?: number // Duration in milliseconds for the entire animation
  pollInterval?: number // Interval to poll API after animation completes
}

class FlipDigit {
  el: HTMLElement
  piece: HTMLElement
  top: HTMLElement
  bottom: HTMLElement
  back: HTMLElement
  backBottom: HTMLElement
  currentValue: string

  constructor(value: string | number) {
    const parent = document.createElement('span')
    parent.className = 'flip-clock__wrapper1'

    const el = document.createElement('span')
    el.className = 'flip-clock__piece m-0'

    el.innerHTML =
      '<b class="flip-clock__card card1">' +
      '<b class="card__top"></b>' +
      '<b class="card__bottom"></b>' +
      '<b class="card__back"><b class="card__bottom"></b></b>' +
      '</b>'

    parent.appendChild(el)

    this.el = parent
    this.piece = el
    this.top = el.querySelector('.card__top') as HTMLElement
    this.bottom = el.querySelector('.card__bottom') as HTMLElement
    this.back = el.querySelector('.card__back') as HTMLElement
    this.backBottom = el.querySelector('.card__back .card__bottom') as HTMLElement
    this.currentValue = ''
    this.update(value)
  }

  update(val: string | number, forceAnimation: boolean = false) {
    const valStr = val.toString()
    const hasChanged = valStr !== this.currentValue

    if (hasChanged || forceAnimation) {
      this.back.setAttribute('data-value', this.currentValue)
      this.bottom.setAttribute('data-value', this.currentValue)
      this.currentValue = valStr
      this.top.textContent = valStr
      this.backBottom.setAttribute('data-value', valStr)

      // Only animate if the value actually changed or forced
      if (hasChanged || forceAnimation) {
        this.el.classList.remove('flip')
        void this.el.offsetWidth
        this.el.classList.add('flip')
      }
    }
  }

  // Update without animation for instant value changes
  updateInstant(val: string | number) {
    const valStr = val.toString()
    this.currentValue = valStr
    this.top.textContent = valStr
    this.back.setAttribute('data-value', valStr)
    this.bottom.setAttribute('data-value', valStr)
    this.backBottom.setAttribute('data-value', valStr)
  }
}

class FlipCounterClass {
  container: HTMLElement
  value: number
  digits: FlipDigit[]

  constructor(container: HTMLElement, startValue: number = 0) {
    this.container = container
    this.value = startValue
    this.digits = []
    this.render()
  }

  render() {
    this.container.innerHTML = ''
    const str = this.value.toString()
    this.digits = []
    for (let i = 0; i < str.length; i++) {
      const digit = new FlipDigit(str[i])
      this.container.appendChild(digit.el)
      this.digits.push(digit)
    }
  }

  update() {
    const str = this.value.toString()
    if (str.length > this.digits.length) {
      this.render()
    } else {
      for (let i = 0; i < this.digits.length; i++) {
        const digitIndex = str.length - this.digits.length + i
        const val = digitIndex >= 0 ? str[digitIndex] : '0'
        this.digits[i].update(val)
      }
    }
  }

  setValue(newValue: number) {
    this.value = newValue
    this.update()
  }

  // Set value with digit-level animation control
  setValueWithAnimation(newValue: number, oldValue: number) {
    const newStr = newValue.toString()
    const oldStr = oldValue.toString()

    // Pad strings to same length for comparison
    const maxLength = Math.max(newStr.length, oldStr.length)
    const paddedNew = newStr.padStart(maxLength, '0')
    const paddedOld = oldStr.padStart(maxLength, '0')

    // If we need more digits, re-render
    if (newStr.length > this.digits.length) {
      this.value = newValue
      this.render()
      return
    }

    this.value = newValue

    // Update each digit, animating only those that changed
    for (let i = 0; i < this.digits.length; i++) {
      const digitIndex = paddedNew.length - this.digits.length + i
      const newDigit = digitIndex >= 0 ? paddedNew[digitIndex] : '0'
      const oldDigit = digitIndex >= 0 && digitIndex < paddedOld.length ? paddedOld[digitIndex] : '0'

      // Only animate if the digit actually changed
      const shouldAnimate = newDigit !== oldDigit

      if (shouldAnimate) {
        this.digits[i].update(newDigit, true) // Force animation for changed digits
      } else {
        this.digits[i].updateInstant(newDigit) // No animation for unchanged digits
      }
    }
  }

  // Set value instantly without any animations
  setValueInstant(newValue: number) {
    const str = newValue.toString()
    if (str.length > this.digits.length) {
      this.value = newValue
      this.render()
      return
    }

    this.value = newValue
    for (let i = 0; i < this.digits.length; i++) {
      const digitIndex = str.length - this.digits.length + i
      const val = digitIndex >= 0 ? str[digitIndex] : '0'
      this.digits[i].updateInstant(val)
    }
  }
}

const AnimatedFlipCounter: React.FC<AnimatedFlipCounterProps> = ({
  progressType,
  label,
  className = '',
  animationDuration = 5000, // 5 seconds default
  pollInterval = 10000 // 10 seconds default
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterInstanceRef = useRef<FlipCounterClass | null>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [currentProgressData, setCurrentProgressData] = useState<ProgressData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastDisplayedValue, setLastDisplayedValue] = useState<number>(0)
  const lastDisplayedValueRef = useRef<number>(0)


  // Fetch progress data from API
  const fetchProgressData = useCallback(async () => {
    try {
      console.log(`${progressType}: Calling API...`)
      const response = await ProgressService.getChallengerProgress()
      const progressData = response.data[progressType]

      if (progressData) {
        console.log(`${progressType}: API response received:`, progressData)
        setCurrentProgressData(progressData)
        return progressData
      } else {
        console.warn(`${progressType}: No data found in API response`)
      }
    } catch (error) {
      console.error(`${progressType}: Error fetching data:`, error)
      // Don't throw the error to prevent page refresh, just log it
    }
    return null
  }, [progressType])

  // Create a ref to store the scheduling function to avoid circular dependencies
  const scheduleNextPollRef = useRef<() => void>()

  // Schedule next API poll - simplified to avoid dependency issues
  const scheduleNextPoll: () => void = useCallback(() => {
    console.log(`${progressType}: Scheduling next API poll in ${pollInterval}ms`)

    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current)
    }

    pollTimeoutRef.current = setTimeout(async () => {
      try {
        console.log(`${progressType}: Timer triggered - Fetching new progress data...`)
        const newData = await fetchProgressData()

        if (newData) {
          console.log(`${progressType}: API returned data:`, {
            currentValue: newData.currentValue,
            previousValue: newData.previousValue,
            difference: newData.difference,
            lastDisplayed: lastDisplayedValue
          })

          // Check if we're currently animating
          if (isAnimating) {
            console.log(`${progressType}: Still animating, rescheduling poll`)
            // If still animating, reschedule this poll
            setTimeout(() => scheduleNextPollRef.current?.(), 2000)
            return
          }

          // Check if data has been updated since last animation
          // Only consider it new data if the currentValue is different from what we last displayed
          const currentLastDisplayed = lastDisplayedValueRef.current
          const hasNewData = newData.currentValue !== currentLastDisplayed

          console.log(`${progressType}: hasNewData: ${hasNewData}, newCurrentValue: ${newData.currentValue}, lastDisplayedValue: ${currentLastDisplayed}`)

          if (hasNewData) {
            // Data has been updated - animate from current displayed value to new target
            console.log(`${progressType}: NEW data detected, animating from ${currentLastDisplayed} to ${newData.currentValue}`)
            const actualDifference = newData.currentValue - currentLastDisplayed
            setCurrentProgressData(newData)

            if (animateCounterRef.current) {
              animateCounterRef.current(currentLastDisplayed, newData.currentValue, actualDifference)
            }
          } else {
            // No new data - just schedule next poll without animation
            console.log(`${progressType}: SAME data, no animation needed. Scheduling next poll`)
            setTimeout(() => {
              if (scheduleNextPollRef.current) {
                scheduleNextPollRef.current()
              }
            }, 100)
          }
        } else {
          console.warn(`${progressType}: Failed to fetch data, retrying in ${pollInterval}ms`)
          // Retry on failure
          setTimeout(() => scheduleNextPollRef.current?.(), pollInterval)
        }
      } catch (error) {
        console.error(`${progressType}: Error during API polling:`, error)
        // Continue polling even on error
        setTimeout(() => scheduleNextPollRef.current?.(), pollInterval)
      }
    }, pollInterval)
  }, [progressType, pollInterval, fetchProgressData]) // Minimal dependencies to avoid re-creation

  // Store the function in ref to avoid circular dependency
  scheduleNextPollRef.current = scheduleNextPoll

  // Create ref for animate counter to avoid circular dependency
  const animateCounterRef = useRef<(fromValue: number, toValue: number, difference: number) => void>()

  // Animate counter from previousValue to currentValue
  const animateCounter: (fromValue: number, toValue: number, difference: number) => void = useCallback((fromValue: number, toValue: number, difference: number) => {
    console.log(`${progressType}: animateCounter called with fromValue: ${fromValue}, toValue: ${toValue}, difference: ${difference}`)

    // Check if there's no change to animate
    if (fromValue === toValue) {
      console.log(`${progressType}: No animation needed (fromValue === toValue), setting value to: ${toValue}`)
      // No animation needed, just set the final value
      if (counterInstanceRef.current) {
        counterInstanceRef.current.setValueInstant(toValue)
      }
      setLastDisplayedValue(toValue)
      lastDisplayedValueRef.current = toValue
      // Still schedule next poll to check for updates
      console.log(`${progressType}: Scheduling next poll after no-animation case`)

      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        console.log(`${progressType}: Executing scheduled poll from no-animation case`)
        if (scheduleNextPollRef.current) {
          scheduleNextPollRef.current()
        }
      }, 100)
      return
    }

    setIsAnimating(true)
    const absoluteDifference = Math.abs(difference)
    // For small differences, use at least 5 steps but max 50 for smooth animation
    const steps = Math.max(5, Math.min(absoluteDifference, 50))
    const stepDuration = animationDuration / steps
    const stepValue = difference / steps

    console.log(`${progressType}: Animation setup - absoluteDifference: ${absoluteDifference}, steps: ${steps}, stepDuration: ${stepDuration}, stepValue: ${stepValue}`)

    let currentStep = 0
    let currentValue = fromValue

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current)
    }

    animationIntervalRef.current = setInterval(() => {
      currentStep++
      const previousValue = currentValue
      currentValue = Math.round(fromValue + (stepValue * currentStep))

      // Ensure we don't exceed the target value (handle both positive and negative differences)
      const reachedTarget = (difference > 0 && currentValue >= toValue) || (difference < 0 && currentValue <= toValue) || currentStep >= steps

      console.log(`${progressType}: Step ${currentStep}/${steps} - currentValue: ${currentValue}, toValue: ${toValue}, reachedTarget: ${reachedTarget}`)

      if (reachedTarget) {
        currentValue = toValue
        if (counterInstanceRef.current) {
          // Use digit-level animation for the final value
          counterInstanceRef.current.setValueWithAnimation(currentValue, previousValue)
        }

        // Update the last displayed value
        setLastDisplayedValue(currentValue)
        lastDisplayedValueRef.current = currentValue

        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current)
          animationIntervalRef.current = null
        }

        console.log(`${progressType}: Animation completed, reached value: ${currentValue}`)

        // Use setTimeout to ensure state updates are processed before scheduling next poll
        setTimeout(() => {
          setIsAnimating(false)

          console.log(`${progressType}: States reset, scheduling next API poll after animation completion`)
          // Schedule next API call after animation completes and states are updated
          if (scheduleNextPollRef.current) {
            scheduleNextPollRef.current()
          }
        }, 100) // Small delay to ensure state updates

        return
      }

      if (counterInstanceRef.current) {
        // Use digit-level animation for each step
        counterInstanceRef.current.setValueWithAnimation(currentValue, previousValue)
      }
    }, stepDuration)
  }, [animationDuration, progressType]) // Removed scheduleNextPoll to avoid circular dependency

  // Store the animate counter function in ref
  animateCounterRef.current = animateCounter

  // Initialize counter and start first animation
  useEffect(() => {
    if (!containerRef.current) return

    const initializeCounter = async () => {
      const initialData = await fetchProgressData()
      if (initialData) {
        console.log(`${progressType}: Initializing with data:`, initialData)

        // Initialize counter with previous value
        const startValue = initialData.previousValue
        setLastDisplayedValue(startValue)
        lastDisplayedValueRef.current = startValue

        const counter = new FlipCounterClass(containerRef.current!, startValue)
        counterInstanceRef.current = counter

        console.log(`${progressType}: Starting initial animation from ${initialData.previousValue} to ${initialData.currentValue}`)

        // Start animation from previous to current
        animateCounter(initialData.previousValue, initialData.currentValue, initialData.difference)
      } else {
        console.warn(`${progressType}: No initial data received`)
        // Even if no data, try to schedule polling
        setTimeout(() => {
          console.log(`${progressType}: No initial data, starting polling cycle`)
          if (scheduleNextPollRef.current) {
            scheduleNextPollRef.current()
          }
        }, 1000)
      }
    }

    initializeCounter()

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current)
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  // Progress data changes are now handled by the scheduleNextPoll function
  // to avoid duplicate animations

  return (
    <div
  className={`card h-100 border-0 ${className}`}
  style={{
    background: 'linear-gradient(180deg, #ffffff 0%, #f7f7f7 100%)',
    border: '1px solid #e6e6e6',
    boxShadow:
      '0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
    position: 'relative',
  }}
>
  {/* Top thin highlight line */}
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '2px',
      background: 'linear-gradient(to right, #d4af37, transparent)',
      opacity: 0.5,
    }}
  ></div>

  <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-4">
    {/* Counter */}
    <div className="flip-counter-container w-100 mb-3">
      <div className="d-flex gap-2 justify-content-center">
        <div ref={containerRef} className="flip-clock"></div>
      </div>
    </div>

    {/* Subtle separator line */}
    <div
      style={{
        width: '40%',
        height: '2px',
        background: 'linear-gradient(to right, transparent, #c9a73b, transparent)',
        marginBottom: '12px',
      }}
    ></div>

    {/* Label */}
    <h6
      className="card-title fw-semibold mb-0"
      style={{
        color: '#2e2e2e',
        fontSize: '0.95rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {label}
      {isAnimating && <span className="ms-2 text-primary">🔄</span>}
    </h6>

    {/* Divider below label */}
    <div
      style={{
        width: '30%',
        height: '1px',
        backgroundColor: '#e0e0e0',
        marginTop: '10px',
      }}
    ></div>

    {/* Sub-info */}
    {currentProgressData && (
      <div className="text-center mt-2">
        <small
          className="text-muted"
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.3px',
            opacity: 0.8,
          }}
        >
          <span
            className={`badge ${
              currentProgressData.difference > 0
                ? 'bg-success'
                : currentProgressData.difference < 0
                ? 'bg-danger'
                : 'bg-secondary'
            }`}
          ></span>
        </small>
      </div>
    )}
  </div>

  {/* Bottom subtle accent strip */}
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '3px',
      background: 'linear-gradient(to right, transparent, #d4af37, transparent)',
      opacity: 0.3,
    }}
  ></div>
</div>


  )
}

export default AnimatedFlipCounter