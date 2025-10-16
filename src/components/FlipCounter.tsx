import React, { useEffect, useRef } from 'react'

interface FlipCounterProps {
  value: number
  label: string
  className?: string
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

const FlipCounter: React.FC<FlipCounterProps> = ({ value, label, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterInstanceRef = useRef<FlipCounterClass | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize the counter
    const counter = new FlipCounterClass(containerRef.current, value)
    counterInstanceRef.current = counter

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  // Update counter when value changes
  useEffect(() => {
    if (counterInstanceRef.current) {
      counterInstanceRef.current.setValue(value)
    }
  }, [value])

  return (
    <div className={`flip-counter-container ${className}`}>
      <div className="d-flex gap-2 justify-content-center">
        <div ref={containerRef} className="flip-clock"></div>
      </div>
      <p className="counter-label mb-0 text-center mt-2">{label}</p>
    </div>
  )
}

export default FlipCounter