import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float, Instance, Instances } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { CakeOption, Phase } from "./CakeTypes";
import { CakeKnife3D } from "./CakeKnife3D";

const radius = 2.1;
const height = 1.65;
const cutAngle = Math.PI * 0.28; // ~50.4 degrees wedge

/* ========================================================================= */
/* 1. Organic Flowing Ganache Drips                                          */
/* ========================================================================= */
const Drips = ({ config, isSlice }: { config: CakeOption["config"]; isSlice?: boolean }) => {
    const drips = useMemo(() => {
        const arr = [];
        const numDrips = 28;
        for (let i = 0; i < numDrips; i++) {
            const angle = (Math.PI * 2 / numDrips) * i;
            const inSlice = angle > (Math.PI * 2 - cutAngle + 0.04) && angle < (Math.PI * 2 - 0.04);
            if (isSlice && !inSlice) continue;
            if (!isSlice && inSlice) continue; // skip the slice gap in main body

            // Organic pseudo-random varied drip lengths
            const dripLength = 0.28 + Math.abs(Math.sin(i * 9.17)) * 0.55;
            arr.push({ angle, length: dripLength, i });
        }
        return arr;
    }, [isSlice]);

    return (
        <group>
            {drips.map((d) => {
                const x = Math.cos(d.angle) * (radius + 0.015);
                const y = Math.sin(d.angle) * (radius + 0.015);
                const zTop = height - 0.02;
                return (
                    <group key={d.i} position={[x, y, zTop]}>
                        {/* Tapered upper drip stem */}
                        <mesh position={[0, 0, -d.length / 2]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.045, 0.065, d.length, 10]} />
                            <meshPhysicalMaterial
                                color={config.dripColor}
                                roughness={0.06}
                                clearcoat={1.0}
                                clearcoatRoughness={0.08}
                            />
                        </mesh>
                        {/* Luscious rounded droplet bead at tip */}
                        <mesh position={[0, 0, -d.length]}>
                            <sphereGeometry args={[0.075, 12, 12]} />
                            <meshPhysicalMaterial
                                color={config.dripColor}
                                roughness={0.05}
                                clearcoat={1.0}
                                clearcoatRoughness={0.05}
                            />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

/* ========================================================================= */
/* 2. Piped Buttercream Rosettes (Swirls) & Glazed Strawberries              */
/* ========================================================================= */
const Rosettes = ({
    cake,
    isSlice,
    bottom = false
}: {
    cake: CakeOption;
    isSlice?: boolean;
    bottom?: boolean;
}) => {
    const config = cake.config;
    const creamColor = config.innerCreamColor || "#ffffff";
    const strawberryColor = config.cherryColor || "#e63946";

    const rosettes = useMemo(() => {
        const arr = [];
        const numRosettes = bottom ? 24 : 16;
        for (let i = 0; i < numRosettes; i++) {
            const angle = (Math.PI * 2 / numRosettes) * i;
            const inSlice = angle >= (Math.PI * 2 - cutAngle - 0.02) && angle <= (Math.PI * 2 + 0.02);
            if (isSlice && !inSlice) continue;
            if (!isSlice && inSlice) continue;

            arr.push({ angle, idx: i });
        }
        return arr;
    }, [isSlice, bottom]);

    return (
        <group position={[0, 0, bottom ? 0.08 : height]}>
            {rosettes.map((r) => {
                const rosetteRadius = radius - (bottom ? 0.05 : 0.22);
                const x = Math.cos(r.angle) * rosetteRadius;
                const y = Math.sin(r.angle) * rosetteRadius;
                return (
                    <group key={r.idx} position={[x, y, 0]} rotation={[0, 0, r.angle]}>
                        {/* Piped Buttercream Swirl */}
                        <mesh castShadow position={[0, 0, 0.06]}>
                            <torusKnotGeometry args={[0.09, 0.038, 32, 8, 2, 3]} />
                            <meshPhysicalMaterial
                                color={creamColor}
                                roughness={0.32}
                                clearcoat={0.35}
                                clearcoatRoughness={0.15}
                            />
                        </mesh>

                        {/* Top Crown Garnishes: Glazed Strawberry / Pearl (only on top rosettes) */}
                        {!bottom && (
                            <group position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
                                {cake.id === "chocolate" || cake.id === "royal" ? (
                                    /* Edible Gold Pearl / Dragée */
                                    <mesh castShadow>
                                        <sphereGeometry args={[0.08, 16, 16]} />
                                        <meshStandardMaterial
                                            color={config.toppingColor || "#d4af37"}
                                            metalness={0.92}
                                            roughness={0.14}
                                        />
                                    </mesh>
                                ) : (
                                    /* Glazed Fresh Strawberry */
                                    <group scale={0.9}>
                                        {/* Strawberry Body */}
                                        <mesh castShadow position={[0, 0, 0]}>
                                            <sphereGeometry args={[0.095, 16, 16]} />
                                            <meshPhysicalMaterial
                                                color={strawberryColor}
                                                roughness={0.15}
                                                clearcoat={0.9}
                                                clearcoatRoughness={0.08}
                                            />
                                        </mesh>
                                        <mesh castShadow position={[0, -0.07, 0]}>
                                            <coneGeometry args={[0.092, 0.16, 16]} />
                                            <meshPhysicalMaterial
                                                color={strawberryColor}
                                                roughness={0.18}
                                                clearcoat={0.85}
                                            />
                                        </mesh>
                                        {/* Little Green Stem Calyx */}
                                        <mesh position={[0, 0.09, 0]}>
                                            <cylinderGeometry args={[0.05, 0.01, 0.02, 5]} />
                                            <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
                                        </mesh>
                                    </group>
                                )}
                            </group>
                        )}
                    </group>
                );
            })}
        </group>
    );
};

/* ========================================================================= */
/* 3. Golden Pearls / Sprinkles Dust                                         */
/* ========================================================================= */
const Sprinkles = ({ accent, isSlice }: { accent: string; isSlice?: boolean }) => {
    const sprinkleData = useMemo(() => {
        const arr = [];
        const count = 120;
        for (let i = 0; i < count; i++) {
            const r = Math.sqrt(Math.abs(Math.sin(i * 17.3))) * (radius - 0.45);
            const theta = (Math.abs(Math.cos(i * 31.7)) * Math.PI * 2);

            const inSlice = theta >= (Math.PI * 2 - cutAngle) && theta <= Math.PI * 2;
            if (isSlice && !inSlice) continue;
            if (!isSlice && inSlice) continue;

            arr.push({
                position: [Math.cos(theta) * r, Math.sin(theta) * r, height + 0.04] as [number, number, number],
                scale: 0.6 + Math.abs(Math.sin(i)) * 0.6,
            });
        }
        return arr;
    }, [isSlice]);

    const pearlMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: accent,
        metalness: 0.85,
        roughness: 0.18
    }), [accent]);

    const pearlGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 12, 12), []);

    return (
        <Instances range={sprinkleData.length} material={pearlMaterial} geometry={pearlGeometry}>
            {sprinkleData.map((s, i) => (
                <Instance key={i} position={s.position} scale={s.scale} />
            ))}
        </Instances>
    );
};

/* ========================================================================= */
/* 4. Layered Gourmet Cake Body (Sponge, Crumb, and Velvety Filling)         */
/* ========================================================================= */
const CakeBody = ({ cake, isSlice }: { cake: CakeOption; isSlice?: boolean }) => {
    const config = cake.config;

    // Generate precise wedge shape for main body or slice
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        if (isSlice) {
            s.arc(0, 0, radius, Math.PI * 2 - cutAngle, Math.PI * 2, false);
        } else {
            s.arc(0, 0, radius, 0, Math.PI * 2 - cutAngle, false);
        }
        s.lineTo(0, 0);
        return s;
    }, [isSlice]);

    const getExtrudeSettings = (depth: number, bevel = 0.02) => ({
        depth,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: bevel,
        bevelThickness: bevel,
    });

    const layerH = height / 5; // 5 layered tiers: Sponge 1, Cream 1, Sponge 2, Cream 2, Sponge 3

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            {/* Sponge Layer 1 (Base Tier) */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerH, 0.025)]} />
                <meshStandardMaterial color={config.spongeColor} roughness={0.85} />
            </mesh>

            {/* Silky Ganache Filling Layer 1 */}
            <mesh castShadow position={[0, 0, layerH]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerH * 0.9, 0.015)]} />
                <meshPhysicalMaterial
                    color={config.fillingColor}
                    roughness={0.22}
                    clearcoat={0.3}
                />
            </mesh>

            {/* Sponge Layer 2 (Middle Tier) */}
            <mesh castShadow receiveShadow position={[0, 0, layerH * 1.9]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerH, 0.02)]} />
                <meshStandardMaterial color={config.spongeColor} roughness={0.85} />
            </mesh>

            {/* Silky Ganache Filling Layer 2 */}
            <mesh castShadow position={[0, 0, layerH * 2.9]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerH * 0.9, 0.015)]} />
                <meshPhysicalMaterial
                    color={config.fillingColor}
                    roughness={0.22}
                    clearcoat={0.3}
                />
            </mesh>

            {/* Sponge Layer 3 (Top Sponge Tier) */}
            <mesh castShadow receiveShadow position={[0, 0, layerH * 3.8]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerH, 0.02)]} />
                <meshStandardMaterial color={config.spongeColor} roughness={0.85} />
            </mesh>

            {/* Top Frosting Crown Layer with Velvety Sheen */}
            <mesh castShadow position={[0, 0, height - 0.06]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(0.14, 0.035)]} />
                <meshPhysicalMaterial
                    color={config.frostingColor}
                    roughness={0.38}
                    clearcoat={0.35}
                    clearcoatRoughness={0.15}
                />
            </mesh>

            {/* Drips & Decorative Accents */}
            <Drips config={config} isSlice={isSlice} />
            <Rosettes cake={cake} isSlice={isSlice} bottom={true} />
            <Rosettes cake={cake} isSlice={isSlice} bottom={false} />
            <Sprinkles accent={cake.accent} isSlice={isSlice} />
        </group>
    );
};

/* ========================================================================= */
/* 5. Birthday Candle with Dynamic Flame & Extinguish Smoke                  */
/* ========================================================================= */
const Candle = ({ lit, accent }: { lit: boolean; accent: string }) => {
    const flameRef = useRef<THREE.Group>(null);
    const outerFlameRef = useRef<THREE.Mesh>(null);
    const smokeRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (lit && flameRef.current && outerFlameRef.current) {
            flameRef.current.scale.y = 1 + Math.sin(t * 14) * 0.12;
            flameRef.current.scale.x = 1 + Math.sin(t * 18) * 0.06;
            flameRef.current.position.x = Math.sin(t * 9) * 0.02;
            outerFlameRef.current.scale.setScalar(1 + Math.sin(t * 7) * 0.12);
        }

        // Animate curling smoke wisp when extinguished
        if (!lit && smokeRef.current) {
            smokeRef.current.position.y += 0.015;
            smokeRef.current.scale.x += 0.01;
            smokeRef.current.scale.z += 0.01;
            smokeRef.current.rotation.y = t * 0.8;
        }
    });

    return (
        <group position={[0, height, 0]}>
            {/* Candle Porcelain Wax Cylinder */}
            <mesh castShadow position={[0, 0.42, 0]}>
                <cylinderGeometry args={[0.065, 0.075, 0.85, 24]} />
                <meshPhysicalMaterial
                    color="#fffdf7"
                    roughness={0.25}
                    clearcoat={0.4}
                />
            </mesh>

            {/* Candle Festive Spiral Stripes */}
            <mesh castShadow position={[0, 0.42, 0]} rotation={[0, Math.PI * 0.25, 0]}>
                <cylinderGeometry args={[0.07, 0.08, 0.85, 24, 1, false, 0, Math.PI * 0.7]} />
                <meshStandardMaterial color={accent} roughness={0.3} />
            </mesh>

            {/* Cotton Wick */}
            <mesh position={[0, 0.88, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>

            {/* Dynamic Flame */}
            {lit && (
                <group ref={flameRef} position={[0, 0.98, 0]}>
                    {/* Inner Intense Core */}
                    <mesh position={[0, 0.14, 0]}>
                        <coneGeometry args={[0.07, 0.28, 16]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    {/* Outer Warm Golden Amber Flame */}
                    <mesh ref={outerFlameRef} position={[0, 0.16, 0]}>
                        <coneGeometry args={[0.16, 0.42, 16]} />
                        <meshBasicMaterial
                            color="#ff9e00"
                            transparent
                            opacity={0.7}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>
                    {/* Dynamic Point Light */}
                    <pointLight color="#ffb703" intensity={2.2} distance={6} decay={2} />
                </group>
            )}

            {/* Extinguish Smoke Wisps */}
            {!lit && (
                <group ref={smokeRef} position={[0, 0.95, 0]}>
                    {[0, 1, 2].map((i) => (
                        <mesh key={i} position={[Math.sin(i * 2) * 0.04, i * 0.12, Math.cos(i * 2) * 0.04]}>
                            <sphereGeometry args={[0.035 + i * 0.02, 10, 10]} />
                            <meshBasicMaterial
                                color="#e0e0e0"
                                transparent
                                opacity={Math.max(0, 0.5 - i * 0.15)}
                                depthWrite={false}
                            />
                        </mesh>
                    ))}
                </group>
            )}
        </group>
    );
};

/* ========================================================================= */
/* 6. Sculpted Porcelain Pedestal Cake Platter                               */
/* ========================================================================= */
const CakeStand = ({ config }: { config: CakeOption["config"] }) => {
    const plateColor = config.plateColor || "#ffffff";
    const trimColor = config.plateTrimColor || "#d4af37";

    return (
        <group position={[0, -0.15, 0]}>
            {/* Top Porcelain Serving Platter */}
            <mesh receiveShadow position={[0, 0, 0]}>
                <cylinderGeometry args={[radius + 0.65, radius + 0.72, 0.22, 64]} />
                <meshPhysicalMaterial
                    color={plateColor}
                    roughness={0.12}
                    metalness={0.06}
                    clearcoat={0.9}
                    clearcoatRoughness={0.1}
                />
            </mesh>

            {/* Fine 24k Gold Rim Trim on Platter */}
            <mesh position={[0, 0.06, 0]}>
                <torusGeometry args={[radius + 0.68, 0.032, 16, 64]} />
                <meshStandardMaterial
                    color={trimColor}
                    metalness={0.92}
                    roughness={0.14}
                />
            </mesh>

            {/* Slender Concave Pedestal Neck */}
            <mesh position={[0, -0.32, 0]}>
                <cylinderGeometry args={[0.55, 0.85, 0.45, 48]} />
                <meshPhysicalMaterial
                    color={plateColor}
                    roughness={0.15}
                    metalness={0.05}
                    clearcoat={0.8}
                />
            </mesh>

            {/* Flared Pedestal Base Foot with Gold Accent */}
            <mesh receiveShadow position={[0, -0.58, 0]}>
                <cylinderGeometry args={[1.25, 1.45, 0.18, 48]} />
                <meshPhysicalMaterial
                    color={plateColor}
                    roughness={0.15}
                    metalness={0.05}
                    clearcoat={0.8}
                />
            </mesh>
            <mesh position={[0, -0.52, 0]}>
                <torusGeometry args={[1.35, 0.028, 16, 48]} />
                <meshStandardMaterial
                    color={trimColor}
                    metalness={0.92}
                    roughness={0.14}
                />
            </mesh>
        </group>
    );
};

/* ========================================================================= */
/* 7. Scene Composition with True 3D Knife & Animated Wedge                  */
/* ========================================================================= */
const Scene = ({ cake, phase }: { cake: CakeOption; phase: Phase }) => {
    const isCut = phase === "cutting" || phase === "burst" || phase === "quotes";
    const candlesLit = phase === "select" || phase === "baking" || phase === "blow-intro";

    // Animate slice pull-out cleanly along wedge bisector
    const { slicePos } = useSpring({
        slicePos: isCut ? [1.32, 0.0, 0.66] : [0, 0, 0],
        config: { mass: 1.2, tension: 120, friction: 16 }
    });

    return (
        <>
            {/* Gourmet Celebration Studio Lighting */}
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[5, 12, 6]}
                intensity={1.3}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0006}
            />
            <directionalLight position={[-6, 6, -4]} intensity={0.65} />
            <hemisphereLight args={["#ffffff", "#332211", 0.55]} />
            <pointLight position={[0, 4.5, 0]} intensity={0.8} />

            <Float speed={1.0} rotationIntensity={0.03} floatIntensity={0.08}>
                <group position={[0, -0.9, 0]}>
                    {/* Artisanal Cake Stand */}
                    <CakeStand config={cake.config} />

                    {/* Main Cake Body */}
                    <CakeBody cake={cake} />

                    {/* Severed Cake Wedge Slice */}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <animated.group position={slicePos as any}>
                        <CakeBody cake={cake} isSlice />
                    </animated.group>

                    {/* Birthday Candle */}
                    <Candle lit={candlesLit} accent={cake.accent} />

                    {/* True 3D Pastry Knife inside Scene */}
                    <CakeKnife3D phase={phase} />
                </group>
            </Float>

            {/* Soft Studio Floor Contact Shadows */}
            <ContactShadows position={[0, -1.85, 0]} opacity={0.55} scale={11} blur={2.2} far={4} />

            {/* Orbit Controls */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2 + 0.08}
                minPolarAngle={Math.PI / 4}
            />
        </>
    );
};

export const Cake3D = ({ cake, phase }: { cake: CakeOption; phase: Phase }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="w-full h-full min-h-[420px] cursor-grab active:cursor-grabbing select-none">
            <Canvas
                shadows
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                camera={{ position: [0, 4.8, 7.8], fov: 44 }}
                gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <Scene cake={cake} phase={phase} />
                </Suspense>
            </Canvas>
        </div>
    );
};
