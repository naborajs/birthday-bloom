import { useMemo } from "react";
import { motion } from "framer-motion";
import { CakeOption } from "./CakeTypes";

export const CutSparks = ({ count, color }: { count: number; color: string }) => {
    const sparks = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + Math.random() * 20 - 10,
        distance: 80 + Math.random() * 120,
        size: 5 + Math.random() * 8,
        duration: 0.6 + Math.random() * 0.5,
        hue: i % 2 === 0 ? color : "45",
    })), [count, color]);
    
    return (
        <div className="absolute inset-0 pointer-events-none z-30">
            {sparks.map((s) => (
                <motion.div 
                    key={s.id} 
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} 
                    animate={{
                        x: Math.cos((s.angle * Math.PI) / 180) * s.distance,
                        y: Math.sin((s.angle * Math.PI) / 180) * s.distance,
                        opacity: 0,
                        scale: 0,
                        rotate: s.angle * 2
                    }} 
                    transition={{ duration: s.duration, ease: "easeOut" }} 
                    className="absolute left-1/2 top-1/2 rounded-full" 
                    style={{
                        width: s.size,
                        height: s.size,
                        background: s.hue.startsWith('hsl') ? s.hue : `hsl(${s.hue}, 100%, 70%)`,
                        boxShadow: `0 0 20px ${s.hue.startsWith('hsl') ? s.hue : `hsl(${s.hue}, 100%, 70%)`}, 0 0 40px white`,
                    }}
                />
            ))}
        </div>
    );
};

export const MagicDust = ({ count }: { count: number }) => {
    const dust = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        size: Math.random() * 4 + 1.5,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 2
    })), [count]);
    
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {dust.map(d => (
                <motion.div 
                    key={d.id} 
                    initial={{ opacity: 0, x: 0, y: 0 }} 
                    animate={{
                        opacity: [0, 0.9, 0],
                        x: d.x,
                        y: d.y - 100,
                        scale: [0, 1.8, 0]
                    }} 
                    transition={{ duration: d.duration, repeat: Infinity, delay: d.delay }} 
                    className="absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full blur-[1px]" 
                    style={{ width: d.size, height: d.size, boxShadow: "0 0 10px white" }}
                />
            ))}
        </div>
    );
};

export const CakeSVG = ({ cake, split, candlesLit, name, springConfig }: {
    cake: CakeOption;
    split: boolean;
    candlesLit: boolean;
    name: string;
    springConfig?: any;
}) => {
    return (
        <motion.div 
            animate={{ 
                rotateX: split ? 28 : 12, 
                rotateY: split ? 8 : 0, 
                scale: split ? 1.15 : 1 
            }} 
            transition={springConfig ?? { type: "spring", stiffness: 80, damping: 12 }} 
            className="relative preserve-3d" 
            style={{ perspective: "1500px" }}
        >
            <svg viewBox="0 0 240 240" className="w-72 sm:w-96 md:w-[36rem] mx-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-visible">
                <defs>
                    <filter id="cakeDepth">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                        <feOffset in="blur" dx="0" dy="10" result="offsetBlur" />
                        <feComponentTransfer in="offsetBlur" result="opacity">
                            <feFuncA type="linear" slope="0.6" />
                        </feComponentTransfer>
                        <feComposite in="SourceGraphic" in2="opacity" operator="over" />
                    </filter>
                    <filter id="candleGlow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="plateGlow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
                        <feOffset dx="0" dy="15" result="offset" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.4"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="layerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="black" stopOpacity="0.45" />
                        <stop offset="30%" stopColor="white" stopOpacity="0.15" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.35" />
                        <stop offset="75%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.6" />
                    </linearGradient>
                    <radialGradient id="topFrosting" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                        <stop offset="70%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="black" stopOpacity="0.25" />
                    </radialGradient>
                    <filter id="frostingTexture">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                        <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="3">
                            <feDistantLight azimuth="45" elevation="55" />
                        </feDiffuseLighting>
                        <feComposite operator="in" in2="SourceGraphic" />
                        <feBlend mode="multiply" in2="SourceGraphic" />
                    </filter>
                    <linearGradient id="plateMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(0,0%,85%)"/>
                        <stop offset="50%" stopColor="hsl(0,0%,95%)"/>
                        <stop offset="100%" stopColor="hsl(0,0%,60%)"/>
                    </linearGradient>
                </defs>

                {/* Plate / Stand */}
                <g style={{ transform: split ? "translateY(15px)" : "none", transition: "all 1s ease" }}>
                    <ellipse cx="120" cy="215" rx="105" ry="25" fill="black" opacity="0.6" filter="blur(15px)" />
                    <ellipse cx="120" cy="210" rx="115" ry="30" fill="url(#plateMetal)" filter="url(#plateGlow)"/>
                    <ellipse cx="120" cy="208" rx="110" ry="28" fill={cake.plate} />
                    <path d="M100,235 L140,235 L130,250 L110,250 Z" fill="url(#plateMetal)"/>
                </g>

                {/* Bottom Tier */}
                <g style={{ transform: split ? "translateX(-45px) rotate(-14deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <path d="M25,160 L25,195 Q70,210 120,205 L120,160 Q70,145 25,160 Z" fill={cake.layers[0]} filter="url(#cakeDepth)" />
                    <path d="M25,160 L25,195 Q70,210 120,205 L120,160 Q70,145 25,160 Z" fill="url(#layerGrad)" />
                    <path d="M25,160 Q70,175 120,160 Q70,145 25,160 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
                    
                    {/* Drizzle & Sprinkles */}
                    {cake.drizzle && (
                        <path d="M35,165 Q45,185 55,165 Q65,180 75,163 Q85,175 95,161 Q105,185 115,160" fill="none" stroke={cake.drizzle} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
                    )}
                </g>
                <g style={{ transform: split ? "translateX(45px) rotate(14deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <path d="M120,205 Q170,210 215,195 L215,160 Q170,145 120,160 L120,205 Z" fill={cake.layers[0]} filter="url(#cakeDepth)" />
                    <path d="M120,205 Q170,210 215,195 L215,160 Q170,145 120,160 L120,205 Z" fill="url(#layerGrad)" />
                    <path d="M120,160 Q170,175 215,160 Q170,145 120,160 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
                    
                    {cake.drizzle && (
                        <path d="M125,160 Q135,185 145,160 Q155,180 165,160 Q180,185 195,162 Q205,175 210,160" fill="none" stroke={cake.drizzle} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
                    )}
                </g>

                {/* Middle Tier */}
                <g style={{ transform: split ? "translateX(-28px) rotate(-10deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <path d="M40,110 L40,150 Q80,160 120,155 L120,110 Q80,100 40,110 Z" fill={cake.layers[1]} filter="url(#cakeDepth)" />
                    <path d="M40,110 L40,150 Q80,160 120,155 L120,110 Q80,100 40,110 Z" fill="url(#layerGrad)" />
                    <path d="M40,110 Q80,125 120,110 Q80,100 40,110 Z" fill={cake.frosting} filter="url(#frostingTexture)" opacity="0.95" />
                    
                    {/* Embedded Plaque Left */}
                    <path d="M60,135 Q90,145 120,142 L120,122 Q90,125 60,115 Z" fill="#3a1c0d" opacity="0.9"/>
                    <path d="M62,133 Q90,143 118,140 L118,124 Q90,127 62,117 Z" fill="#522b16"/>
                </g>
                <g style={{ transform: split ? "translateX(28px) rotate(10deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <path d="M120,155 Q160,160 200,150 L200,110 Q160,100 120,110 L120,155 Z" fill={cake.layers[1]} filter="url(#cakeDepth)" />
                    <path d="M120,155 Q160,160 200,150 L200,110 Q160,100 120,110 L120,155 Z" fill="url(#layerGrad)" />
                    <path d="M120,110 Q160,125 200,110 Q160,100 120,110 Z" fill={cake.frosting} filter="url(#frostingTexture)" opacity="0.95" />
                    
                    {/* Embedded Plaque Right */}
                    <path d="M120,142 Q150,145 180,135 L180,115 Q150,125 120,122 Z" fill="#3a1c0d" opacity="0.9"/>
                    <path d="M122,140 Q150,143 178,133 L178,117 Q150,127 122,124 Z" fill="#522b16"/>
                </g>

                {/* Nameplate text (rendered above middle tier so it splits cleanly) */}
                <g style={{ transform: split ? "translateX(-28px) rotate(-10deg)" : "translateX(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)", clipPath: "polygon(0 0, 120px 0, 120px 240px, 0 240px)" }}>
                    <text x="120" y="134" textAnchor="middle" fill="#fcd34d" className="font-display font-black uppercase" style={{ fontSize: '11px', letterSpacing: '3px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        {name.substring(0, Math.ceil(name.length/2))}
                    </text>
                </g>
                <g style={{ transform: split ? "translateX(28px) rotate(10deg)" : "translateX(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)", clipPath: "polygon(120px 0, 240px 0, 240px 240px, 120px 240px)" }}>
                    <text x="120" y="134" textAnchor="middle" fill="#fcd34d" className="font-display font-black uppercase" style={{ fontSize: '11px', letterSpacing: '3px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        <tspan dx={`${Math.ceil(name.length/2) * 5}px`}>{name.substring(Math.ceil(name.length/2))}</tspan>
                    </text>
                </g>

                {/* Top Tier */}
                <g style={{ transform: split ? "translateX(-18px) rotate(-6deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <path d="M55,60 L55,100 Q87.5,110 120,105 L120,60 Q87.5,50 55,60 Z" fill={cake.layers[2]} filter="url(#cakeDepth)" />
                    <path d="M55,60 L55,100 Q87.5,110 120,105 L120,60 Q87.5,50 55,60 Z" fill="url(#layerGrad)" />
                    <path d="M55,60 Q87.5,75 120,60 Q87.5,50 55,60 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
                    <path d="M55,60 Q87.5,75 120,60 Q87.5,50 55,60 Z" fill="url(#topFrosting)" />
                    
                    {cake.drizzle && (
                        <path d="M60,65 Q70,95 80,63 Q95,85 105,62 Q115,80 120,61" fill="none" stroke={cake.drizzle} strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
                    )}
                </g>
                <g style={{ transform: split ? "translateX(18px) rotate(6deg)" : "translateX(0) rotate(0)", transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                    <path d="M120,105 Q152.5,110 185,100 L185,60 Q152.5,50 120,60 L120,105 Z" fill={cake.layers[2]} filter="url(#cakeDepth)" />
                    <path d="M120,105 Q152.5,110 185,100 L185,60 Q152.5,50 120,60 L120,105 Z" fill="url(#layerGrad)" />
                    <path d="M120,60 Q152.5,75 185,60 Q152.5,50 120,60 Z" fill={cake.frosting} filter="url(#frostingTexture)" />
                    <path d="M120,60 Q152.5,75 185,60 Q152.5,50 120,60 Z" fill="url(#topFrosting)" />
                    
                    {cake.drizzle && (
                        <path d="M120,61 Q130,80 140,61 Q150,90 160,63 Q175,80 180,62" fill="none" stroke={cake.drizzle} strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
                    )}
                </g>

                {/* Candles attached firmly to the top tier */}
                {[80, 100, 120, 140, 160].map((cx, i) => (
                    <g key={i} style={{ 
                        transform: split 
                            ? (cx < 120 ? "translateX(-18px) rotate(-6deg)" : cx > 120 ? "translateX(18px) rotate(6deg)" : "scale(0.8) translateY(15px) translateX(-5px) rotate(-10deg)") 
                            : "none", 
                        transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" 
                    }}>
                        <rect x={cx - 2.5} y="15" width="5" height="42" rx="2" fill={`hsl(${i * 40 + 160}, 80%, 75%)`} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                        {/* Candle stripes */}
                        <path d={`M${cx-2.5},25 L${cx+2.5},20 M${cx-2.5},35 L${cx+2.5},30 M${cx-2.5},45 L${cx+2.5},40`} stroke="white" strokeWidth="2" opacity="0.6"/>
                        
                        {candlesLit ? (
                            <g className="animate-flame-premium" filter="url(#candleGlow)">
                                <ellipse cx={cx} cy="5" rx="6" ry="14" fill={cake.accent} style={{ filter: "blur(1px)" }} />
                                <ellipse cx={cx} cy="7" rx="3" ry="9" fill="white" />
                                <circle cx={cx} cy="5" r="22" fill={cake.accent} opacity="0.25" className="animate-pulse" />
                            </g>
                        ) : (
                            <motion.path 
                                initial={{ opacity: 0.6, pathLength: 1, y: 0 }} 
                                animate={{ opacity: 0, y: -40 }} 
                                transition={{ duration: 2, ease: "easeOut" }} 
                                d={`M${cx},15 Q${cx-5},5 ${cx},0`} 
                                stroke="rgba(255,255,255,0.7)" 
                                strokeWidth="2" 
                                fill="none"
                            />
                        )}
                    </g>
                ))}

                {/* The Cut Reveal Glow */}
                {split && (
                    <rect x="117" y="25" width="6" height="180" fill="white" opacity="0.9" style={{ animation: "golden-reveal 1s ease-out both", filter: "blur(4px)" }} />
                )}
            </svg>
        </motion.div>
    );
};
