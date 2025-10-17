import React, { useEffect, useRef, useState, useCallback } from 'react'
import ProgressService, { ProgressData } from '@/services/progressService'

interface FlipCounterProps {
  value: number
  label: string
  className?: string
  progressType?: 'engagement' | 'challenge' | 'manual' // Type of progress to track
  enableAutoUpdate?: boolean // Enable automatic API polling
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
    // Create the new parent span
    const parent = document.createElement('span')
    parent.className = 'flip-clock__wrapper1'

    // Create the existing piece span
    const el = document.createElement('span')
    el.className = 'flip-clock__piece m-0'

    // Inner HTML for the piece
    el.innerHTML =
      '<b class="flip-clock__card card1">' +
      '<b class="card__top"></b>' +
      '<b class="card__bottom"></b>' +
      '<b class="card__back"><b class="card__bottom"></b></b>' +
      '</b>'

    // Append piece inside wrapper
    parent.appendChild(el)

    // Store element references
    this.el = parent
    this.piece = el
    this.top = el.querySelector('.card__top') as HTMLElement
    this.bottom = el.querySelector('.card__bottom') as HTMLElement
    this.back = el.querySelector('.card__back') as HTMLElement
    this.backBottom = el.querySelector('.card__back .card__bottom') as HTMLElement
    this.currentValue = ''
    this.update(value)
  }

  update(val: string | number) {
    const valStr = val.toString()
    if (valStr !== this.currentValue) {
      this.back.setAttribute('data-value', this.currentValue)
      this.bottom.setAttribute('data-value', this.currentValue)
      this.currentValue = valStr
      this.top.textContent = valStr
      this.backBottom.setAttribute('data-value', valStr)

      this.el.classList.remove('flip')
      void this.el.offsetWidth
      this.el.classList.add('flip')
    }
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
}

const FlipCounter: React.FC<FlipCounterProps> = ({ 
  value, 
  label, 
  className = '', 
  progressType,
  enableAutoUpdate = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterInstanceRef = useRef<FlipCounterClass | null>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const apiPollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isAnimatingRef = useRef<boolean>(false)
  const hasReachedTargetRef = useRef<boolean>(false)
  
  const [currentAnimatedValue, setCurrentAnimatedValue] = useState<number>(value)
  const [targetValue, setTargetValue] = useState<number>(value)
  const [isWaitingForNewValue, setIsWaitingForNewValue] = useState<boolean>(false)

  // Animation function to smoothly animate from previous to current value
  const animateToTarget = useCallback((from: number, to: number) => {
    if (from === to || !counterInstanceRef.current) return

    isAnimatingRef.current = true
    const difference = to - from
    const duration = Math.min(Math.abs(difference) * 50, 3000) // Max 3 seconds
    const steps = Math.max(Math.abs(difference), 30) // Minimum 30 steps for smooth animation
    const stepDuration = duration / steps

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current)
    }

    let currentStep = 0
    animationIntervalRef.current = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2 // Ease in-out

      const currentValue = Math.round(from + (difference * easeProgress))
      
      setCurrentAnimatedValue(currentValue)
      if (counterInstanceRef.current) {
        counterInstanceRef.current.setValue(currentValue)
      }

      if (currentStep >= steps) {
        clearInterval(animationIntervalRef.current!)
        animationIntervalRef.current = null
        isAnimatingRef.current = false
        hasReachedTargetRef.current = true
        setCurrentAnimatedValue(to)
        setIsWaitingForNewValue(true) // Now waiting for new value from API
        if (counterInstanceRef.current) {
          counterInstanceRef.current.setValue(to)
        }
        console.log(`Animation completed. Counter stopped at: ${to}. Waiting for new value from API...`)
      }
    }, stepDuration)
  }, [])

  // Fetch new progress data from API
  const fetchProgressData = useCallback(async () => {
    if (!enableAutoUpdate || !progressType) return

    // Don't fetch during animation unless we're waiting for new value
    if (isAnimatingRef.current && !isWaitingForNewValue) return

    try {
      const response = await ProgressService.getChallengerProgress()
      let newData: ProgressData
      
      if (progressType === 'engagement') {
        newData = response.data.erProgress
      } else {
        newData = response.data.challengerProgress
      }

      const newCurrentValue = newData.currentValue
      const newPreviousValue = newData.previousValue

      // Only animate if we have new data (different currentValue)
      if (newCurrentValue !== targetValue) {
        console.log(`New value arrived! Previous: ${newPreviousValue}, New: ${newCurrentValue}`)
        setIsWaitingForNewValue(false) // No longer waiting
        hasReachedTargetRef.current = false // Reset target reached flag
        setTargetValue(newCurrentValue)
        
        // Use current animated value as starting point if animation was stopped
        const startValue = isWaitingForNewValue ? currentAnimatedValue : newPreviousValue
        animateToTarget(startValue, newCurrentValue)
      } else if (isWaitingForNewValue) {
        console.log(`Still waiting for new value. Current API value: ${newCurrentValue} matches target: ${targetValue}`)
      }
    } catch (error) {
      console.error('Failed to fetch progress data:', error)
    }
  }, [enableAutoUpdate, progressType, targetValue, animateToTarget, isWaitingForNewValue, currentAnimatedValue])

  // Initialize counter
  useEffect(() => {
    if (!containerRef.current) return

    const counter = new FlipCounterClass(containerRef.current, value)
    counterInstanceRef.current = counter
    
    // Set initial values
    setTargetValue(value)
    setCurrentAnimatedValue(value)
    setIsWaitingForNewValue(false)
    hasReachedTargetRef.current = false

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [value])

  // Handle prop value changes (manual updates)
  useEffect(() => {
    if (!enableAutoUpdate && value !== targetValue) {
      // For manual mode, treat the new value as target and animate from current
      animateToTarget(currentAnimatedValue, value)
      setTargetValue(value)
    }
  }, [value, enableAutoUpdate, targetValue, currentAnimatedValue, animateToTarget])

  // Setup API polling when auto-update is enabled
  useEffect(() => {
    if (enableAutoUpdate && progressType) {
      // Initial fetch and animation
      fetchProgressData()
      
      // Set up polling interval (10 seconds)
      apiPollingIntervalRef.current = setInterval(() => {
        fetchProgressData()
      }, 10000) // 10 seconds

      return () => {
        if (apiPollingIntervalRef.current) {
          clearInterval(apiPollingIntervalRef.current)
        }
      }
    }
  }, [enableAutoUpdate, progressType, fetchProgressData])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
      if (apiPollingIntervalRef.current) {
        clearInterval(apiPollingIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className={`flip-counter-container ${className}`}>
      <div className="d-flex gap-2 justify-content-center">
        <div ref={containerRef} className="flip-clock"></div>
      </div>
      <p className="counter-label mb-0 text-center mt-2">
        {label}
        {isWaitingForNewValue && enableAutoUpdate && (
          <small className="d-block text-muted mt-1">
            <i className="fas fa-clock me-1"></i>
            Waiting for new value...
          </small>
        )}
      </p>
    </div>
  )
}

export default FlipCounter