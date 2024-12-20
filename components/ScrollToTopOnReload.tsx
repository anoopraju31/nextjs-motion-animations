'use client'

import { useEffect, type FC, type ReactNode } from 'react'

type Props = {
	children: ReactNode
}

const ScrollToTopOnReload: FC<Props> = ({ children }) => {
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0
		})
	}, [])

	return <div>{children}</div>
}

export default ScrollToTopOnReload
