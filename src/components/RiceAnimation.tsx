import { useEffect } from 'react'

const RiceAnimation = () => {
  useEffect(() => {
    const canvas = document.getElementById("rice-confetti") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let riceGrains: Rice[] = []
    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    let animationId: number

    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    class Rice {
      x: number
      y: number
      size: number
      speed: number
      angle: number
      spin: number
      color: string

      constructor() {
        this.x = Math.random() * W
        this.y = Math.random() * -50
        this.size = 8 + Math.random() * 6 // rice grain size
        this.speed = 1 + Math.random() * 2
        this.angle = Math.random() * Math.PI * 2
        this.spin = 0.02 + Math.random() * 0.05
        this.color = Math.random() > 0.5 ? "#f5f5dc" : "#fffaf0" // off-white shades
      }

      update() {
        this.y += this.speed
        this.angle += this.spin
        if (this.y > H) this.y = -10
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.ellipse(0, 0, this.size, this.size / 3, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Create rice grains
    for (let i = 0; i < 100; i++) {
      riceGrains.push(new Rice())
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)
      riceGrains.forEach(rice => {
        rice.update()
        rice.draw()
      })
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <>
      <style>{`
        #rice-confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          background: transparent;
        }
        
        @media (prefers-reduced-motion: reduce) {
          #rice-confetti {
            display: none;
          }
        }
      `}</style>
      
      <canvas id="rice-confetti"></canvas>
    </>
  )
}

export default RiceAnimation