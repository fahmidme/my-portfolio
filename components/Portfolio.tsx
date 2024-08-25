"use client";

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react'
import * as THREE from 'three'

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
  </svg>
)

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef(new THREE.Vector2())
  const cameraPosition = useRef(new THREE.Vector3(30, 30, 30))
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0))
  const pixelsRef = useRef<THREE.Group>(new THREE.Group())
  const slides = [
    { 
      title: "Fahmid", 
      subtitle: "Product Engineer & Designer",
      description: "Passionate about creating innovative solutions at the intersection of technology and design. Specializing in user-centric product development and cutting-edge engineering practices.",
      image: "/images/fahmid.jpg"
    },
    { 
      title: "GPT Protocol", 
      subtitle: "Blockchain & AI Integration",
      description: "Leading the development of GPT Protocol, a groundbreaking project that combines blockchain technology with artificial intelligence. Key aspects include:\n\n" +
        "• Deploying a Polygon zkEVM based blockchain\n" +
        "• Developing with NextJS and Generative AI\n" +
        "• Building a multi-chain bridge using Hyperlane\n" +
        "• Writing smart contracts for decentralized applications\n" +
        "• Integrating AI models with blockchain infrastructure\n\n" +
        "This project aims to create a new paradigm in decentralized AI-powered applications, leveraging the security and transparency of blockchain with the power of advanced AI models.",
      image: "/images/gpt-protocol.jpg"
    },
    { 
      title: "LegixAI", 
      subtitle: "AI for Accounting Firms",
      description: "Developing an innovative AI pipeline for accounting firms, revolutionizing how financial data is processed and analyzed. Key features include:\n\n" +
        "• Building with NextJS for a responsive, modern frontend\n" +
        "• Implementing advanced AI processing systems for financial document analysis\n" +
        "• Utilizing AWS for scalable, secure cloud infrastructure\n" +
        "• Creating intuitive dashboards for data visualization\n" +
        "• Automating routine accounting tasks with machine learning\n\n" +
        "LegixAI aims to significantly reduce the time and effort required for financial reporting and analysis, allowing accounting professionals to focus on high-value strategic tasks.",
      image: "/images/legixai.jpg"
    }
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isHovering) {
      timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
      }, 5000)
    }
    return () => clearInterval(timer)
  }, [isHovering])

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create wireframe pixels
    const pixelGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const pixelMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff })
    const pixels = pixelsRef.current
    for (let i = 0; i < 200; i++) {
      const pixel = new THREE.Mesh(pixelGeometry, pixelMaterial)
      pixel.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      )
      pixel.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      )
      pixels.add(pixel)
    }
    scene.add(pixels)

    // Create grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x444444)
    scene.add(gridHelper)

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`
        cursorRef.current.style.top = `${event.clientY}px`
      }
    }

    const handleScroll = () => {
      if (contentRef.current) {
        setScrollPosition(contentRef.current.scrollTop)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    contentRef.current?.addEventListener('scroll', handleScroll)

    const animate = () => {
      requestAnimationFrame(animate)

      // Animate camera
      cameraPosition.current.x = 30 * Math.cos(Date.now() * 0.0002)
      cameraPosition.current.z = 30 * Math.sin(Date.now() * 0.0002)
      camera.position.lerp(cameraPosition.current, 0.02)
      camera.lookAt(cameraTarget.current)

      // Animate pixels
      pixels.children.forEach((pixel: THREE.Mesh) => {
        pixel.position.add(pixel.userData.velocity)

        // Bounce off boundaries
        if (Math.abs(pixel.position.x) > 20) pixel.userData.velocity.x *= -1
        if (Math.abs(pixel.position.y) > 20) pixel.userData.velocity.y *= -1
        if (Math.abs(pixel.position.z) > 20) pixel.userData.velocity.z *= -1

        // React to cursor
        const distanceToMouse = new THREE.Vector2(pixel.position.x, pixel.position.y).distanceTo(mousePosition.current.multiplyScalar(20))
        if (distanceToMouse < 8) {
          const repelForce = new THREE.Vector3(
            pixel.position.x - mousePosition.current.x * 20,
            pixel.position.y + mousePosition.current.y * 20,
            0
          ).normalize().multiplyScalar(0.3)
          pixel.position.add(repelForce)
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      contentRef.current?.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="relative h-screen w-full bg-black text-white font-sans overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div ref={cursorRef} className="fixed w-4 h-4 bg-white pointer-events-none z-50 mix-blend-difference" style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }} />
      <div className="relative z-10 h-full flex flex-col">
        <nav className="p-4 flex justify-between items-center bg-black bg-opacity-50">
          <div className="text-sm">fahmid</div>
          <ul className="flex items-center space-x-6 text-sm">
            <li>
              <a href="mailto:fahmid@xxcorpinc.com" className="hover:text-gray-300 transition-colors">Contact</a>
            </li>
            <li>
              <a href="https://linkedin.com/in/fahmidme" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a href="https://x.com/hellofahmid" target="_blank" rel="noopener noreferrer" aria-label="X">
                <XIcon />
              </a>
            </li>
          </ul>
        </nav>

        <main className="flex-grow flex items-center justify-center px-4" ref={contentRef}>
          <div className="flex justify-between items-center w-full max-w-7xl">
            <div className="w-1/2 pr-8">
              <h1 className="text-4xl md:text-6xl font-light mb-4 transition-opacity duration-500">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl font-light mb-8 transition-opacity duration-500">
                {slides[currentSlide].subtitle}
              </p>
            </div>
            <div 
              className="w-1/2 pl-8 h-[70vh] overflow-y-auto custom-scrollbar" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div 
                className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-lg p-6 shadow-lg transition-opacity duration-300"
                style={{ opacity: Math.max(0, 1 - scrollPosition / 200) }}
              >
                <div className="w-full mb-6 overflow-hidden rounded-lg" style={{ maxHeight: 'calc(70vh - 12rem)' }}>
                  <img 
                    src={slides[currentSlide].image} 
                    alt={`${slides[currentSlide].title} illustration`} 
                    className="w-full h-auto object-contain"
                  />
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {slides[currentSlide].description}
                </p>
              </div>
            </div>
          </div>
        </main>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button 
            onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)}
            className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)}
            className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <footer className="p-4 text-xs bg-black bg-opacity-50">
          <div className="flex justify-between items-center">
            <span>© 2023 Fahmid</span>
            <div className="space-x-4">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}