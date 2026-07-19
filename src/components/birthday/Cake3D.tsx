import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { CakeOption, Phase } from "./CakeTypes";

const radius = 2;
const height = 1.5;
const cutAngle = Math.PI * 0.3; // 54 degrees missing wedge

const CakeBody = ({ config, isSlice }: { config: CakeOption["config"]; isSlice?: boolean }) => {
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

    const extrudeSettings = {
        depth: height,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.05,
        bevelThickness: 0.05,
    };

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]}>
            {/* Main Sponge */}
            <mesh castShadow receiveShadow>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial color={config.spongeColor} roughness={0.8} />
            </mesh>
            
            {/* Top Frosting / Drip layer */}
            <mesh castShadow position={[0, 0, height - 0.01]}>
                <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.1, bevelSize: 0.02, bevelThickness: 0.02 }]} />
                <meshPhysicalMaterial 
                    color={config.dripColor} 
                    roughness={0.1} 
                    metalness={0.1} 
                    clearcoat={1} 
                    clearcoatRoughness={0.1} 
                />
            </mesh>
        </group>
    );
};

const Candle = ({ lit }: { lit: boolean }) => {
    const flameRef = useRef<THREE.Mesh>(null);
    
    useFrame(({ clock }) => {
        if (lit && flameRef.current) {
            flameRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 10) * 0.1;
            flameRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 15) * 0.05;
        }
    });

    return (
        <group position={[0, height + 0.5, 0]}>
            {/* Candle Body */}
            <mesh castShadow position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>
            {/* Flame */}
            {lit && (
                <mesh ref={flameRef} position={[0, 0.9, 0]}>
                    <coneGeometry args={[0.1, 0.3, 16]} />
                    <meshBasicMaterial color="#ffc107" />
                    <pointLight color="#ffc107" intensity={2} distance={5} />
                </mesh>
            )}
        </group>
    );
};

const Scene = ({ cake, phase }: { cake: CakeOption; phase: Phase }) => {
    const isCut = phase === "cutting" || phase === "burst" || phase === "quotes";
    const candlesLit = phase === "select" || phase === "blow-intro" || phase === "blowing" || phase === "wish";

    // Animate the slice separating
    const { slicePos } = useSpring({
        slicePos: isCut ? [0.8, 0.2, -0.4] : [0, 0, 0], // Pull slice out and slightly up
        config: { mass: 1, tension: 120, friction: 14 }
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} />
            <hemisphereLight skyColor="#ffffff" groundColor="#444444" intensity={0.6} />
            <pointLight position={[0, 2, 5]} intensity={0.5} />

            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                <group position={[0, -1, 0]}>
                    {/* Cake Stand */}
                    <mesh receiveShadow position={[0, -0.1, 0]}>
                        <cylinderGeometry args={[radius + 0.5, radius + 0.7, 0.2, 32]} />
                        <meshStandardMaterial color={cake.config.plateColor} roughness={0.3} metalness={0.2} />
                    </mesh>

                    {/* Main Cake Body */}
                    <CakeBody config={cake.config} />

                    {/* Slice Wedge */}
                    <animated.group position={slicePos as any}>
                        <CakeBody config={cake.config} isSlice />
                    </animated.group>

                    {/* Candles */}
                    <Candle lit={candlesLit} />
                </group>
            </Float>

            <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} />
        </>
    );
};

export const Cake3D = ({ cake, phase }: { cake: CakeOption; phase: Phase }) => {
    return (
        <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
            <Canvas shadows camera={{ position: [0, 3, 6], fov: 50 }}>
                <Suspense fallback={null}>
                    <Scene cake={cake} phase={phase} />
                </Suspense>
            </Canvas>
        </div>
    );
};
