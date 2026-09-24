import { useMemo } from "react";
import * as THREE from "three";
import { useSpring, animated } from "@react-spring/three";
import { Phase } from "./CakeTypes";

interface CakeKnife3DProps {
    phase: Phase;
}

export const CakeKnife3D = ({ phase }: CakeKnife3DProps) => {
    const isVisible = phase === "knife-enter" || phase === "cutting" || phase === "burst" || phase === "quotes";
    const isCutting = phase === "cutting";

    // Animated 3D Knife Coordinates and Rotations
    // Target cut angle aligns with cake slice (~-25 deg bisector => X ~ 1.9, Z ~ 0.85)
    const { position, rotation, opacity } = useSpring({
        position: !isVisible
            ? [1.35, 5.2, 0.65]
            : phase === "knife-enter"
                ? [1.35, 2.15, 0.65] // Hovering right above the slice cutline
                : isCutting
                    ? [1.25, 0.22, 0.58] // Sliced fully down through the cake to the plate
                    : [1.8, 0.38, 0.9], // Pulled aside slightly to present the severed slice
        rotation: !isVisible
            ? [0.1, 2.69, 0.5]
            : phase === "knife-enter"
                ? [0.08, 2.69, 0.26] // Angled downward, ready to plunge
                : isCutting
                    ? [0.02, 2.69, 0.02] // Leveled flat after cutting through
                    : [0.08, 2.55, -0.12], // Resting presentation angle
        opacity: isVisible ? 1 : 0,
        config: isCutting
            ? { mass: 1.2, tension: 140, friction: 18 } // Solid cutting resistance feel
            : { mass: 1, tension: 180, friction: 22 }
    });

    // Custom 3D Pastry Knife Blade Shape
    const bladeShape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0); // At bolster
        s.lineTo(2.5, 0.05); // Cutting edge to tip
        s.quadraticCurveTo(2.65, 0.2, 2.45, 0.38); // Pointed rounded tip
        s.lineTo(0, 0.42); // Spine back to bolster
        s.lineTo(0, 0); // Down to bolster heel
        return s;
    }, []);

    // Handle Shape with ergonomic curvature
    const handleShape = useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, 0.02);
        s.lineTo(-1.45, -0.04);
        s.quadraticCurveTo(-1.58, 0.18, -1.45, 0.4);
        s.lineTo(0, 0.38);
        s.lineTo(0, 0.02);
        return s;
    }, []);

    if (!isVisible && opacity.get() < 0.01) {
        return null;
    }

    return (
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        <animated.group position={position as any} rotation={rotation as any}>
            {/* 1. Stainless Steel Blade */}
            <mesh castShadow receiveShadow position={[0, 0, -0.012]}>
                <extrudeGeometry
                    args={[
                        bladeShape,
                        {
                            depth: 0.024,
                            bevelEnabled: true,
                            bevelSegments: 3,
                            steps: 1,
                            bevelSize: 0.008,
                            bevelThickness: 0.008,
                        }
                    ]}
                />
                <meshPhysicalMaterial
                    color="#ffffff"
                    metalness={0.96}
                    roughness={0.08}
                    clearcoat={0.9}
                    clearcoatRoughness={0.05}
                    reflectivity={1.0}
                />
            </mesh>

            {/* Blade Bevel Cutting Edge Accent Line */}
            <mesh position={[1.25, 0.02, 0]}>
                <boxGeometry args={[2.5, 0.015, 0.026]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* 2. Luxury Brass Bolster / Collar */}
            <mesh castShadow position={[0, 0.2, 0]}>
                <boxGeometry args={[0.08, 0.46, 0.09]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.92}
                    roughness={0.16}
                />
            </mesh>

            {/* 3. Ergonomic Walnut Handle */}
            <mesh castShadow receiveShadow position={[0, 0, -0.045]}>
                <extrudeGeometry
                    args={[
                        handleShape,
                        {
                            depth: 0.09,
                            bevelEnabled: true,
                            bevelSegments: 4,
                            steps: 1,
                            bevelSize: 0.035,
                            bevelThickness: 0.035,
                        }
                    ]}
                />
                <meshPhysicalMaterial
                    color="#2a1810"
                    roughness={0.4}
                    metalness={0.05}
                    clearcoat={0.3}
                    clearcoatRoughness={0.2}
                />
            </mesh>

            {/* 4. Golden Rivets on the Handle */}
            {[-0.35, -0.75, -1.15].map((x, i) => (
                <mesh key={i} position={[x, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.032, 0.032, 0.165, 16]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        metalness={0.95}
                        roughness={0.12}
                    />
                </mesh>
            ))}
        </animated.group>
    );
};
