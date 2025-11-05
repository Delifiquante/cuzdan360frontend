// Dosya Yolu: src/components/ui/blur-text.tsx
"use client";

import { motion, Transition, Easing } from "framer-motion"; // 'motion/react' yerine 'framer-motion' kullandık
import { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type BlurTextProps = {
    text?: string;
    delay?: number;
    className?: string;
    animateBy?: "words" | "letters";
    direction?: "top" | "bottom";
    threshold?: number;
    rootMargin?: string;
    animationFrom?: Record<string, string | number>;
    animationTo?: Array<Record<string, string | number>>;
    easing?: Easing | Easing[];
    onAnimationComplete?: () => void;
    stepDuration?: number;
};

const buildKeyframes = (
    from: Record<string, string | number>,
    steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
    const keys = new Set<string>([
        ...Object.keys(from),
        ...steps.flatMap((s) => Object.keys(s)),
    ]);

    const keyframes: Record<string, Array<string | number>> = {};
    keys.forEach((k) => {
        keyframes[k] = [
            from[k as keyof typeof from],
            ...steps.map((s) => s[k as keyof typeof s]),
        ];
    });
    return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
                                               text = "",
                                               delay = 200,
                                               className = "",
                                               animateBy = "words",
                                               direction = "top",
                                               threshold = 0.1,
                                               rootMargin = "0px",
                                               animationFrom,
                                               animationTo,
                                               easing = (t: number) => t,
                                               onAnimationComplete,
                                               stepDuration = 0.35,
                                           }) => {
    const elements = animateBy === "words" ? text.split(" ") : text.split("");
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    const defaultFrom = useMemo(
        () =>
            direction === "top"
                ? { filter: "blur(10px)", opacity: 0, y: -50 }
                : { filter: "blur(10px)", opacity: 0, y: 50 },
        [direction]
    );

    const defaultTo = useMemo(
        () => [
            {
                filter: "blur(5px)",
                opacity: 0.5,
                y: direction === "top" ? 5 : -5,
            },
            { filter: "blur(0px)", opacity: 1, y: 0 },
        ],
        [direction]
    );

    const fromSnapshot = animationFrom ?? defaultFrom;
    const toSnapshots = animationTo ?? defaultTo;

    const stepCount = toSnapshots.length + 1;
    const totalDuration = stepDuration * (stepCount - 1);
    const times = Array.from(
        { length: stepCount },
        (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1))
    );

    return (
        <p
            ref={ref}
            className={cn(
                "blur-text flex flex-wrap", // 'flex' ve 'flex-wrap' eklendi
                className
            )}
        >
            {elements.map((segment, index) => {
                const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

                const spanTransition: Transition = {
                    duration: totalDuration,
                    times,
                    delay: (index * delay) / 1000,
                    ease: easing as any, // Tipleme uyuşmazlığı için 'as any'
                };

                return (
                    <motion.span
                        key={index}
                        initial={fromSnapshot}
                        animate={inView ? animateKeyframes : fromSnapshot}
                        transition={spanTransition}
                        onAnimationComplete={
                            index === elements.length - 1 ? onAnimationComplete : undefined
                        }
                        style={{
                            display: "inline-block",
                            willChange: "transform, filter, opacity",
                        }}
                    >
                        {segment === " " ? "\u00A0" : segment}
                        {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
                    </motion.span>
                );
            })}
        </p>
    );
};

export default BlurText;