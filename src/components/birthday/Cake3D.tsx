import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float, Instance, Instances } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { CakeOption, Phase } from "./CakeTypes";

const radius = 2;
const height = 1.6;
const cutAngle = Math.PI * 0.3; // 54 degrees missing wedge

const Drips = ({ config, isSlice }: { config: CakeOption["config"]; isSlice?: boolean }) => {
    const drips = useMemo(() => {
        const arr = [];
        const numDrips = 36;
        for (let i = 0; i <= numDrips; i++) {
            const angle = (Math.PI * 2 / numDrips) * i;
            // The cut is from 2PI - cutAngle to 2PI
            const inSlice = angle > (Math.PI * 2 - cutAngle + 0.05) && angle < (Math.PI * 2 - 0.05);
            if (isSlice && !inSlice) continue;
            if (!isSlice && inSlice && angle > Math.PI) continue; // skip the gap in main body

            const dripLength = 0.3 + Math.abs(Math.sin(i * 13.37)) * 0.7;
            arr.push({ angle, length: dripLength });
        }
        return arr;
    }, [isSlice]);

    return (
        <group>
            {drips.map((d, idx) => {
                // To make the capsule point straight down (vertical), we don't need any Z-rotation on the mesh itself.
                // It just sits at the edge and we orient it perfectly downwards.
                return (
                    <mesh key={idx} position={[Math.cos(d.angle) * (radius + 0.02), Math.sin(d.angle) * (radius + 0.02), height - d.length / 2]} rotation={[Math.PI / 2, 0, 0]}>
                        <capsuleGeometry args={[0.08, d.length, 8, 8]} />
                        <meshPhysicalMaterial color={config.dripColor} roughness={0.05} clearcoat={1} clearcoatRoughness={0.1} />
                    </mesh>
                );
            })}
        </group>
    );
};

const Rosettes = ({ config, isSlice, bottom = false }: { config: CakeOption["config"]; isSlice?: boolean; bottom?: boolean }) => {
    const rosettes = useMemo(() => {
        const arr = [];
        const numRosettes = 28;
        for (let i = 0; i <= numRosettes; i++) {
            const angle = (Math.PI * 2 / numRosettes) * i;
            const inSlice = angle >= (Math.PI * 2 - cutAngle) && angle <= Math.PI * 2;
            if (isSlice && !inSlice) continue;
            if (!isSlice && inSlice && angle > Math.PI) continue;

            arr.push(angle);
        }
        return arr;
    }, [isSlice]);

    return (
        <group position={[0, 0, bottom ? 0.1 : height]}>
            {rosettes.map((angle, idx) => (
                <mesh key={idx} position={[Math.cos(angle) * (radius - 0.1), Math.sin(angle) * (radius - 0.1), 0]} rotation={[0, 0, angle]}>
                    <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0.2, Math.PI]} />
                    <meshPhysicalMaterial color="#ffffff" roughness={0.4} clearcoat={0.3} />
                </mesh>
            ))}
        </group>
    );
};

const Sprinkles = ({ accent, isSlice }: { accent: string; isSlice?: boolean }) => {
    const sprinkleData = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 250; i++) {
            const r = Math.sqrt(Math.abs(Math.sin(i * 12.3))) * (radius - 0.3);
            const theta = Math.abs(Math.cos(i * 45.6)) * Math.PI * 2;
            
            const inSlice = theta >= (Math.PI * 2 - cutAngle) && theta <= Math.PI * 2;
            if (isSlice && !inSlice) continue;
            if (!isSlice && inSlice) continue;
            
            arr.push({
                position: [Math.cos(theta) * r, Math.sin(theta) * r, height + 0.05] as [number, number, number],
                rotation: [Math.PI / 2, 0, Math.sin(i * 78.9) * Math.PI] as [number, number, number]
            });
        }
        return arr;
    }, [isSlice]);

    return (
        <Instances range={sprinkleData.length} material={new THREE.MeshStandardMaterial({ color: accent, roughness: 0.2 })} geometry={new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8)}>
            {sprinkleData.map((s, i) => (
                <Instance key={i} position={s.position} rotation={s.rotation} />
            ))}
        </Instances>
    );
};

const CakeBody = ({ cake, isSlice }: { cake: CakeOption; isSlice?: boolean }) => {
    const config = cake.config;
    
    // Generate the shape for either the main body (missing wedge) or the slice (the wedge)
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

    const getExtrudeSettings = (depth: number) => ({
        depth,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.03,
        bevelThickness: 0.03,
    });

    const layerHeight = height / 3;

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            {/* Sponge Layer 1 */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerHeight)]} />
                <meshStandardMaterial color={config.spongeColor} roughness={0.9} />
            </mesh>
            
            {/* Filling Layer */}
            <mesh castShadow position={[0, 0, layerHeight]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerHeight * 0.8)]} />
                <meshPhysicalMaterial color={cake.accent} roughness={0.3} transmission={0.2} />
            </mesh>
            
            {/* Sponge Layer 2 */}
            <mesh castShadow receiveShadow position={[0, 0, layerHeight * 1.8]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(layerHeight)]} />
                <meshStandardMaterial color={config.spongeColor} roughness={0.9} />
            </mesh>

            {/* Top Frosting Flat Layer */}
            <mesh castShadow position={[0, 0, height - 0.05]}>
                <extrudeGeometry args={[shape, getExtrudeSettings(0.15)]} />
                <meshPhysicalMaterial color={config.dripColor} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
            </mesh>

            <Drips config={config} isSlice={isSlice} />
            <Rosettes config={config} isSlice={isSlice} bottom={true} />
            <Rosettes config={config} isSlice={isSlice} bottom={false} />
            <Sprinkles accent={cake.accent} isSlice={isSlice} />
        </group>
    );
};

const Candle = ({ lit, accent }: { lit: boolean; accent: string }) => {
    const flameRef = useRef<THREE.Group>(null);
    const outerFlameRef = useRef<THREE.Mesh>(null);
    
    useFrame(({ clock }) => {
        if (lit && flameRef.current && outerFlameRef.current) {
            const t = clock.elapsedTime;
            flameRef.current.scale.y = 1 + Math.sin(t * 12) * 0.1;
            flameRef.current.scale.x = 1 + Math.sin(t * 18) * 0.05;
            flameRef.current.position.x = Math.sin(t * 8) * 0.02;
            
            outerFlameRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
        }
    });

    return (
        <group position={[0, height, 0]}>
            {/* Candle Body */}
            <mesh castShadow position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.06, 0.07, 0.8, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>
            {/* Candle Stripes */}
            <mesh castShadow position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.065, 0.075, 0.8, 16, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color={accent} />
            </mesh>
            {/* Wick */}
            {lit && (
                <mesh position={[0, 0.85, 0]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
            )}

            {/* Flame */}
            {lit && (
                <group ref={flameRef} position={[0, 0.95, 0]}>
                    <mesh position={[0, 0.15, 0]}>
                        <coneGeometry args={[0.08, 0.3, 16]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh ref={outerFlameRef} position={[0, 0.15, 0]}>
                        <coneGeometry args={[0.15, 0.4, 16]} />
                        <meshBasicMaterial color="#ffb830" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>
                    <pointLight color="#ffc107" intensity={2} distance={6} decay={2} />
                </group>
            )}
        </group>
    );
};

const Scene = ({ cake, phase }: { cake: CakeOption; phase: Phase }) => {
    const isCut = phase === "cutting" || phase === "burst" || phase === "quotes";
    const candlesLit = phase === "select" || phase === "blow-intro" || phase === "blowing" || phase === "wish";

    // Animate the slice separating
    // Slice is at angle ~333 deg in local space.
    // Movement vector: X = ~0.89, Y(local) = ~-0.45.
    // In global space (rotated -90 on X): X = 0.89, Z = 0.45
    const { slicePos } = useSpring({
        slicePos: isCut ? [1.2, 0.0, 0.6] : [0, 0, 0], // Pull slice out in correct direction
        config: { mass: 1, tension: 120, friction: 14 }
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.001} />
            <directionalLight position={[-5, 5, -5]} intensity={0.6} />
            <hemisphereLight args={["#ffffff", "#444444", 0.5]} />
            {/* Top light to keep cake illuminated even when candle goes out */}
            <pointLight position={[0, 4, 0]} intensity={0.6} />

            <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
                <group position={[0, -1, 0]}>
                    {/* Cake Stand */}
                    <mesh receiveShadow position={[0, -0.15, 0]}>
                        <cylinderGeometry args={[radius + 0.6, radius + 0.9, 0.3, 64]} />
                        <meshPhysicalMaterial color={cake.config.plateColor} roughness={0.2} metalness={0.4} clearcoat={0.5} />
                    </mesh>
                    <mesh position={[0, -0.4, 0]}>
                        <cylinderGeometry args={[1, 1.2, 0.5, 32]} />
                        <meshPhysicalMaterial color={cake.config.plateColor} roughness={0.3} metalness={0.2} />
                    </mesh>

                    {/* Main Cake Body */}
                    <CakeBody cake={cake} />

                    {/* Slice Wedge */}
                    <animated.group position={slicePos as any}>
                        <CakeBody cake={cake} isSlice />
                    </animated.group>

                    {/* Candles */}
                    <Candle lit={candlesLit} accent={cake.accent} />
                </group>
            </Float>

            <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={12} blur={2.5} far={4} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 4} />
        </>
    );
};

export const Cake3D = ({ cake, phase }: { cake: CakeOption; phase: Phase }) => {
    return (
        <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
            <Canvas shadows camera={{ position: [0, 4.5, 7.5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Scene cake={cake} phase={phase} />
                </Suspense>
            </Canvas>
        </div>
    );
};
