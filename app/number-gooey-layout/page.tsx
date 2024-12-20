'use client'

import { useState, useRef, useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { motion } from 'framer-motion'
import ScrollToTopOnReload from '@/components/ScrollToTopOnReload'
import styles from './styles.module.scss'

export default function MultiBoxCounter() {
	const boxes = [1, 2, 3, 4, 5] // Array of box identifiers
	const boxRefs = useRef<(HTMLDivElement | null)[]>([]) // Refs for all boxes
	const [counter, setCounter] = useState<number>(0) // Counter state

	// State to track which boxes are visible
	const [visibleBoxes, setVisibleBoxes] = useState<Set<number>>(new Set())

	// Function to add ref to each box
	const addToRefs = (el: HTMLDivElement | null) => {
		if (el && !boxRefs.current.includes(el)) {
			boxRefs.current.push(el)
		}
	}

	useEffect(() => {
		const lenis = new Lenis()

		// @ts-ignore
		function raf(time) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}

		requestAnimationFrame(raf)
	}, [])

	// Set up scroll tracking for each box
	useEffect(() => {
		// Add event listener to each box to track scroll position
		const handleScroll = () => {
			boxRefs.current.forEach((boxRef, index) => {
				if (!boxRef) return

				const boxID = index + 1 // Box identifier (Box 1, Box 2, etc.)
				const rect = boxRef.getBoundingClientRect()
				const threshold = window.innerHeight * 0.6 // 40vh threshold

				if (rect.bottom <= threshold && !visibleBoxes.has(boxID)) {
					// If the box crosses the threshold, increment counter
					setCounter((prev) => prev + 1)
					setVisibleBoxes((prev) => new Set(prev).add(boxID))
				} else if (rect.bottom > threshold && visibleBoxes.has(boxID)) {
					// If the box moves back, decrement counter
					setCounter((prev) => prev - 1)
					setVisibleBoxes((prev) => {
						const updated = new Set(prev)
						updated.delete(boxID)
						return updated
					})
				}
			})
		}

		// Listen to scroll events
		window.addEventListener('scroll', handleScroll)

		// Cleanup the listener on component unmount
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [visibleBoxes]) // Depend on visibleBoxes to trigger updates

	// const y =

	return (
		<ScrollToTopOnReload>
			<main className={styles.main}>
				<div className={styles.number__container}>
					<span className={styles.number}>0</span>
					<motion.div
						style={{ y: `-${counter * 100}%` }}
						transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 1.5 }}
						className={styles.numbers}
					>
						{boxes.map((box, index) => (
							<span key={`box-${index}`} className={styles.number}>
								{box}.
							</span>
						))}
					</motion.div>
				</div>
				<div className={styles.card__container}>
					{boxes.map((box, index) => (
						<motion.div key={index} ref={addToRefs} className={styles.card}>
							<h2>Box {box}</h2>
						</motion.div>
					))}
				</div>
			</main>
		</ScrollToTopOnReload>
	)
}
