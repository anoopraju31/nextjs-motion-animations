'use client'

import { useEffect, useRef, type FC } from 'react'
import { useScroll, useTransform, motion } from 'motion/react'
import Lenis from '@studio-freight/lenis'
import Image from 'next/image'
import styles from './styles.module.scss'

const page: FC = () => {
	const container = useRef<HTMLDivElement | null>(null)
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start end', 'end start']
	})
	const sm = useTransform(scrollYProgress, [0, 1], [0, -50])
	const md = useTransform(scrollYProgress, [0, 1], [0, -150])
	const lg = useTransform(scrollYProgress, [0, 1], [0, -250])
	const images = [
		{
			src: '/images/1.jpg',
			y: 0
		},
		{
			src: '/images/2.jpg',
			y: lg
		},
		{
			src: '/images/3.jpg',
			y: md
		}
	]

	useEffect(() => {
		const lenis = new Lenis()

		// @ts-ignore
		function raf(time) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}

		requestAnimationFrame(raf)
	}, [])

	return (
		<div ref={container} className={styles.container}>
			<div className={styles.images}>
				{images.map(({ src, y }, idx) => (
					<motion.div style={{ y }} key={`i_${idx}`} className={styles.image__container}>
						<Image src={src} alt=';image' fill />
					</motion.div>
				))}
			</div>
		</div>
	)
}

export default page
