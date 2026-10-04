import { useMotionValue, useInView, useSpring } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

const CountUp = ({ value, duration = 2, prefix = '', suffix = '', decimals = 0, className = '' }) => {

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, {duration: duration * 1000, bounce: 0})
    const [displayValue, setDisplayValue] = useState('0')

    useEffect(() => {
        if (isInView) {
            motionValue.set(value)
        }
    }, [isInView, value, motionValue])

    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest) => {
            setDisplayValue(latest.toFixed(decimals))
        })
        return unsubscribe
    }, [springValue, decimals])

  return (
    <span ref={ref} className={className}>
        {prefix}{Number(displayValue).toLocaleString()}{suffix}
    </span>
  )
}

export default CountUp