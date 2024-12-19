'use client'

import { useEffect, useRef, type FC } from 'react'
import { animate } from 'motion'

import styles from './styles.module.scss'

const numbers = [
	'M106.3,50.7c-35.4,0-57.4,33.2-57.4,72.5s22,72.5,57.4,72.5s57.4-33.2,57.4-72.5S141.7,50.7,106.3,50.7z',
	'M87.9,79.2c1.1-0.4,53.7-39.2,54.9-39.1v180.5',
	'M81.7,85.7c-1.4-67,112.3-55.1,90.2,11.6c-12.6,32-70.6,83.7-88.8,113.7h105.8',
	'M74.8,178.5c3,39.4,63.9,46.7,88.6,23.7c34.3-35.1,5.4-75.8-41.7-77c29.9,5.5,68.7-43.1,36.5-73.7 c-23.4-21.5-76.5-11.1-78.6,25',
	'M161.9,220.8 161.9,41 72.6,170.9 208.2,170.9',
	'M183.2,43.7H92.1l-10,88.3c0,0,18.3-21.9,51-21.9s49.4,32.6,49.4,48.2c0,22.2-9.5,57-52.5,57s-51.4-36.7-51.4-36.7'
]

const TextGooeyPage: FC = () => {
	const paths = useRef<(SVGPathElement | null)[]>([])
	const circles = useRef<(SVGCircleElement | null)[]>([])
	const number = useRef<number>(numbers.length - 1)
	const numberOfCircles = 30
	const radius = 20

	useEffect(() => {
		const changeNumber = () => {
			const currentNumber = number.current
			number.current = currentNumber === 0 ? numbers.length - 1 : currentNumber - 1

			const length = paths.current[currentNumber]?.getTotalLength()

			if (!length) return

			const step = length / numberOfCircles

			circles.current.forEach((circle, i) => {
				if (!paths.current[currentNumber] || !circle) return

				const { x, y } = paths.current[currentNumber].getPointAtLength(i * step)
				animate(circle, { cx: x, cy: y }, { delay: i * 0.025, ease: 'easeOut' })
			})
		}

		const interval = setInterval(changeNumber, 2000)

		return () => clearInterval(interval)
	}, [])

	return (
		<main className={styles.main}>
			<svg viewBox='0 0 256 256'>
				<defs>
					<filter id='filter'>
						<feGaussianBlur in='SourceAlpha' stdDeviation='20' result='blur' />
						<feColorMatrix
							in='blur'
							mode='matrix'
							values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15'
							result='filter'
						/>
					</filter>
				</defs>
				<g>
					{numbers.map((path, idx) => (
						<path
							key={`p_${idx}`}
							// @ts-ignore
							ref={(ref) => (paths.current[idx] = ref)}
							d={path}
						/>
					))}
				</g>

				<g>
					{[...Array(numberOfCircles)].map((_, idx) => (
						<circle
							key={`c_${idx}`}
							// @ts-ignore
							ref={(ref) => (circles.current[idx] = ref)}
							cx='128'
							cy='128'
							r={radius}
						/>
					))}
				</g>
			</svg>
		</main>
	)
}

export default TextGooeyPage
