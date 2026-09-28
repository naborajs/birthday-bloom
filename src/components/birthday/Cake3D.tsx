import { useMemo, useRef, useEffect, Suspense } from "react";
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
            arr.push({
                angle,
                length: dripLength,
                i,
                stemGeo: new THREE.CylinderGeometry(0.045, 0.065, dripLength, 10),
            });
        }
        return arr;
    }, [isSlice]);

    const beadGeometry = useMemo(() => new THREE.SphereGeometry(0.075, 12, 12), []);

    const stemMaterial = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: config.dripColor,
                roughness: 0.06,
                clearcoat: 1.0,
                clearcoatRoughness: 0.08,
            }),
        [config.dripColor]
    );

    const beadMaterial = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: config.dripColor,
                roughness: 0.05,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
            }),
        [config.dripColor]
    );

    useEffect(() => () => drips.forEach((d) => d.stemGeo.dispose()), [drips]);
    useEffect(() => () => beadGeometry.dispose(), [beadGeometry]);
    useEffect(() => () => stemMaterial.dispose(), [stemMaterial]);
    useEffect(() => () => beadMaterial.dispose(), [beadMaterial]);

    return (
        <group>
            {drips.map((d) => {
                const x = Math.cos(d.angle) * (radius + 0.015);
                const y = Math.sin(d.angle) * (radius + 0.015);
                const zTop = height - 0.02;
                return (
                    <group key={d.i} position={[x, y, zTop]}>
                        {/* Tapered upper drip stem */}
                        <mesh
                            position={[0, 0, -d.length / 2]}
                            rotation={[Math.PI / 2, 0, 0]}
                            geometry={d.stemGeo}
                            material={stemMaterial}
                        />
                        {/* Luscious rounded droplet bead at tip */}
                        <mesh
                            position={[0, 0, -d.length]}
                            geometry={beadGeometry}
                            material={beadMaterial}
                        />
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
    const toppingColor = config.toppingColor || "#ffd700";

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

    const sharedGeos = useMemo(
        () => ({
            swirl: new THREE.TorusKnotGeometry(0.11, 0.046, 36, 10, 2, 3),
            pearl: new THREE.SphereGeometry(0.095, 20, 20),
            berryBody: new THREE.SphereGeometry(0.10, 16, 16),
            berryCone: new THREE.ConeGeometry(0.098, 0.17, 16),
            calyx: new THREE.CylinderGeometry(0.055, 0.015, 0.025, 6),
        }),
        []
    );

    const sharedMats = useMemo(
        () => ({
            cream: new THREE.MeshPhysicalMaterial({
                color: creamColor,
                roughness: 0.25,
                clearcoat: 0.5,
                clearcoatRoughness: 0.12,
            }),
            pearl: new THREE.MeshStandardMaterial({
                color: toppingColor,
                metalness: 0.96,
                roughness: 0.08,
            }),
            berryBody: new THREE.MeshPhysicalMaterial({
                color: strawberryColor,
                roughness: 0.12,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
            }),
            berryCone: new THREE.MeshPhysicalMaterial({
                color: strawberryColor,
                roughness: 0.14,
                clearcoat: 0.95,
                clearcoatRoughness: 0.05,
            }),
            calyx: new THREE.MeshStandardMaterial({
                color: "#2d6a4f",
                roughness: 0.6,
            }),
        }),
        [creamColor, toppingColor, strawberryColor]
    );

    useEffect(() => () => Object.values(sharedGeos).forEach((g) => g.dispose()), [sharedGeos]);
    useEffect(() => () => Object.values(sharedMats).forEach((m) => m.dispose()), [sharedMats]);

    return (
        <group position={[0, 0, bottom ? 0.08 : height]}>
            {rosettes.map((r) => {
                const rosetteRadius = radius - (bottom ? 0.05 : 0.22);
                const x = Math.cos(r.angle) * rosetteRadius;
                const y = Math.sin(r.angle) * rosetteRadius;
                return (
                    <group key={r.idx} position={[x, y, 0]} rotation={[0, 0, r.angle]}>
                        {/* Piped Buttercream Swirl */}
                        <mesh
                            castShadow
                            position={[0, 0, 0.06]}
                            geometry={sharedGeos.swirl}
                            material={sharedMats.cream}
                        />

                        {/* Top Crown Garnishes: Glazed Strawberry / Pearl (only on top rosettes) */}
                        {!bottom && (
                            <group position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
                                {cake.id === "chocolate" || cake.id === "royal" ? (
                                    /* Edible Gold Pearl / Dragée */
                                    <mesh
                                        castShadow
                                        geometry={sharedGeos.pearl}
                                        material={sharedMats.pearl}
                                    />
                                ) : (
                                    /* Glazed Fresh Strawberry */
                                    <group scale={1.05}>
                                        {/* Strawberry Body */}
                                        <mesh
                                            castShadow
                                            position={[0, 0, 0]}
                                            geometry={sharedGeos.berryBody}
                                            material={sharedMats.berryBody}
                                        />
                                        <mesh
                                            castShadow
                                            position={[0, -0.075, 0]}
                                            geometry={sharedGeos.berryCone}
                                            material={sharedMats.berryCone}
                                        />
                                        {/* Little Green Stem Calyx */}
                                        <mesh
                                            position={[0, 0.095, 0]}
                                            geometry={sharedGeos.calyx}
                                            material={sharedMats.calyx}
                                        />
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

    useEffect(() => () => pearlGeometry.dispose(), [pearlGeometry]);
    useEffect(() => () => pearlMaterial.dispose(), [pearlMaterial]);

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

    // Full wedge shape for top frosting cap
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

    // Inner wedge shape for interior sponge crumb and ganache tiers
    const innerShape = useMemo(() => {
        const s = new THREE.Shape();
        const rInner = radius - 0.045;
        s.moveTo(0, 0);
        if (isSlice) {
            s.arc(0, 0, rInner, Math.PI * 2 - cutAngle, Math.PI * 2, false);
        } else {
            s.arc(0, 0, rInner, 0, Math.PI * 2 - cutAngle, false);
        }
        s.lineTo(0, 0);
        return s;
    }, [isSlice]);

    // Outer frosted perimeter wall shape (covers curved outer boundary)
    const frostingWallShape = useMemo(() => {
        const s = new THREE.Shape();
        const startAngle = isSlice ? Math.PI * 2 - cutAngle : 0;
        const endAngle = isSlice ? Math.PI * 2 : Math.PI * 2 - cutAngle;
        const wallThickness = 0.05;

        s.absarc(0, 0, radius, startAngle, endAngle, false);
        s.lineTo(Math.cos(endAngle) * (radius - wallThickness), Math.sin(endAngle) * (radius - wallThickness));
        s.absarc(0, 0, radius - wallThickness, endAngle, startAngle, true);
        s.closePath();
        return s;
    }, [isSlice]);

    const layerH = height / 5; // 5 layered tiers: Sponge 1, Cream 1, Sponge 2, Cream 2, Sponge 3

    // Memoize extruded geometries so phase changes don't re-triangulate 12 meshes on the main thread
    const cakeGeos = useMemo(() => {
        const getExtrudeSettings = (depth: number, bevel = 0.02) => ({
            depth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: bevel,
            bevelThickness: bevel,
        });
        return {
            wall: new THREE.ExtrudeGeometry(frostingWallShape, {
                depth: height - 0.04,
                bevelEnabled: true,
                bevelSegments: 3,
                steps: 1,
                bevelSize: 0.015,
                bevelThickness: 0.015,
            }),
            sponge: new THREE.ExtrudeGeometry(innerShape, getExtrudeSettings(layerH, 0.02)),
            filling: new THREE.ExtrudeGeometry(innerShape, getExtrudeSettings(layerH * 0.9, 0.015)),
            crown: new THREE.ExtrudeGeometry(shape, getExtrudeSettings(0.14, 0.035)),
        };
    }, [frostingWallShape, innerShape, shape, layerH]);

    const cakeMats = useMemo(
        () => ({
            frostingWall: new THREE.MeshPhysicalMaterial({
                color: config.frostingColor,
                roughness: 0.32,
                clearcoat: 0.45,
                clearcoatRoughness: 0.12,
            }),
            sponge: new THREE.MeshStandardMaterial({
                color: config.spongeColor,
                roughness: 0.88,
            }),
            filling: new THREE.MeshPhysicalMaterial({
                color: config.fillingColor,
                roughness: 0.18,
                clearcoat: 0.4,
            }),
            frostingCrown: new THREE.MeshPhysicalMaterial({
                color: config.frostingColor,
                roughness: 0.32,
                clearcoat: 0.5,
                clearcoatRoughness: 0.12,
            }),
        }),
        [config.frostingColor, config.spongeColor, config.fillingColor]
    );

    useEffect(() => () => Object.values(cakeGeos).forEach((g) => g.dispose()), [cakeGeos]);
    useEffect(() => () => Object.values(cakeMats).forEach((m) => m.dispose()), [cakeMats]);

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            {/* Smooth Outer Frosting Coating Mantle */}
            <mesh
                castShadow
                receiveShadow
                position={[0, 0, 0]}
                geometry={cakeGeos.wall}
                material={cakeMats.frostingWall}
            />

            {/* Sponge Layer 1 (Base Tier) */}
            <mesh
                castShadow
                receiveShadow
                position={[0, 0, 0]}
                geometry={cakeGeos.sponge}
                material={cakeMats.sponge}
            />

            {/* Silky Ganache Filling Layer 1 */}
            <mesh
                castShadow
                position={[0, 0, layerH]}
                geometry={cakeGeos.filling}
                material={cakeMats.filling}
            />

            {/* Sponge Layer 2 (Middle Tier) */}
            <mesh
                castShadow
                receiveShadow
                position={[0, 0, layerH * 1.9]}
                geometry={cakeGeos.sponge}
                material={cakeMats.sponge}
            />

            {/* Silky Ganache Filling Layer 2 */}
            <mesh
                castShadow
                position={[0, 0, layerH * 2.9]}
                geometry={cakeGeos.filling}
                material={cakeMats.filling}
            />

            {/* Sponge Layer 3 (Top Sponge Tier) */}
            <mesh
                castShadow
                receiveShadow
                position={[0, 0, layerH * 3.8]}
                geometry={cakeGeos.sponge}
                material={cakeMats.sponge}
            />

            {/* Top Frosting Crown Layer with Velvety Sheen */}
            <mesh
                castShadow
                position={[0, 0, height - 0.06]}
                geometry={cakeGeos.crown}
                material={cakeMats.frostingCrown}
            />

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
const Candle = ({
    lit,
    accent,
    position = [0, height, 0],
    scale = 1,
    phaseOffset = 0,
}: {
    lit: boolean;
    accent: string;
    position?: [number, number, number];
    scale?: number;
    phaseOffset?: number;
}) => {
    const flameRef = useRef<THREE.Group>(null);
    const outerFlameRef = useRef<THREE.Mesh>(null);
    const smokeRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime + phaseOffset;
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
        <group position={position} scale={scale}>
            {/* Gold Candle Holder Base Collar */}
            <mesh position={[0, 0.03, 0]}>
                <cylinderGeometry args={[0.095, 0.11, 0.06, 20]} />
                <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.15} />
            </mesh>

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
            <mesh castShadow position={[0, 0.42, 0]} rotation={[0, Math.PI * 0.25 + phaseOffset, 0]}>
                <cylinderGeometry args={[0.07, 0.08, 0.85, 24, 1, false, 0, Math.PI * 0.7]} />
                <meshStandardMaterial color={accent} roughness={0.25} metalness={0.15} />
            </mesh>

            {/* Cotton Wick */}
            <mesh position={[0, 0.88, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>

            {/* Dynamic Flame */}
            {lit && (
                <group ref={flameRef} position={[0, 0.98, 0]}>
                    {/* Delicate Blue Flame Base at wick */}
                    <mesh position={[0, 0.04, 0]}>
                        <sphereGeometry args={[0.045, 12, 12]} />
                        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
                    </mesh>
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
                    {/* Dynamic Point Light (only on primary center candle to save GPU lights) */}
                    {phaseOffset === 0 && (
                        <pointLight color="#ffb703" intensity={3.2} distance={7} decay={2} />
                    )}
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
/* 5B. 3D Sculpted Heart & Gold Halo Cake Topper (Env Theme-Aware)           */
/* ========================================================================= */
const CakeTopper3D = ({ primaryColor }: { primaryColor: string }) => {
    const topperRef = useRef<THREE.Group>(null);

    const heartGeometry = useMemo(() => {
        const s = new THREE.Shape();
        const x = 0;
        const y = 0;
        s.moveTo(x, y + 0.12);
        s.bezierCurveTo(x, y + 0.12, x - 0.03, y + 0.22, x - 0.14, y + 0.22);
        s.bezierCurveTo(x - 0.28, y + 0.22, x - 0.28, y + 0.04, x - 0.28, y + 0.04);
        s.bezierCurveTo(x - 0.28, y - 0.08, x - 0.16, y - 0.18, x, y - 0.28);
        s.bezierCurveTo(x + 0.16, y - 0.18, x + 0.28, y - 0.08, x + 0.28, y + 0.04);
        s.bezierCurveTo(x + 0.28, y + 0.04, x + 0.28, y + 0.22, x + 0.14, y + 0.22);
        s.bezierCurveTo(x + 0.05, y + 0.22, x, y + 0.12, x, y + 0.12);

        return new THREE.ExtrudeGeometry(s, {
            depth: 0.06,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.02,
            bevelThickness: 0.02,
        });
    }, []);

    useEffect(() => {
        return () => {
            heartGeometry.dispose();
        };
    }, [heartGeometry]);

    useFrame(({ clock }) => {
        if (topperRef.current) {
            topperRef.current.rotation.y = Math.sin(clock.elapsedTime * 1.2) * 0.28;
        }
    });

    return (
        <group ref={topperRef} position={[0, height + 0.02, -0.58]}>
            {/* 24k Gold Stem Pin */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.42, 12]} />
                <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.12} />
            </mesh>
            {/* Outer Golden Halo Ring */}
            <mesh position={[0, 0.56, 0]}>
                <torusGeometry args={[0.38, 0.022, 16, 48]} />
                <meshStandardMaterial color="#ffd166" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Sculpted Glossy 3D Heart Gem */}
            <mesh geometry={heartGeometry} position={[0, 0.56, -0.03]} scale={0.95} castShadow>
                <meshPhysicalMaterial
                    color={primaryColor}
                    roughness={0.08}
                    metalness={0.18}
                    clearcoat={1.0}
                    clearcoatRoughness={0.05}
                />
            </mesh>
        </group>
    );
};

/* ========================================================================= */
/* 5C. 3D Floating Celebration Bokeh Orbs around the Cake                    */
/* ========================================================================= */
const CelebrationOrbs3D = ({ primaryColor }: { primaryColor: string }) => {
    const groupRef = useRef<THREE.Group>(null);

    const orbGeometries = useMemo(
        () => [
            new THREE.SphereGeometry(0.035, 12, 12),
            new THREE.SphereGeometry(0.035 + 0.018, 12, 12),
            new THREE.SphereGeometry(0.035 + 0.036, 12, 12),
        ],
        []
    );

    const orbMaterials = useMemo(
        () => ({
            gold: new THREE.MeshStandardMaterial({
                color: "#ffd166",
                emissive: "#ffb703",
                emissiveIntensity: 0.65,
                metalness: 0.8,
                roughness: 0.15,
            }),
            primary: new THREE.MeshStandardMaterial({
                color: primaryColor,
                emissive: primaryColor,
                emissiveIntensity: 0.65,
                metalness: 0.8,
                roughness: 0.15,
            }),
        }),
        [primaryColor]
    );

    useEffect(() => () => orbGeometries.forEach((g) => g.dispose()), [orbGeometries]);
    useEffect(() => {
        return () => {
            orbMaterials.gold.dispose();
            orbMaterials.primary.dispose();
        };
    }, [orbMaterials]);

    const orbs = useMemo(() => {
        return Array.from({ length: 18 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 18;
            const dist = 2.85 + (i % 3) * 0.45;
            const y = 0.2 + ((i * 7) % 10) * 0.22;
            return {
                position: [Math.cos(angle) * dist, y, Math.sin(angle) * dist] as [number, number, number],
                geoIdx: i % 3,
                isGold: i % 2 === 0,
            };
        });
    }, []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.elapsedTime * 0.14;
            groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.06;
        }
    });

    return (
        <group ref={groupRef}>
            {orbs.map((orb, idx) => (
                <mesh
                    key={idx}
                    position={orb.position}
                    geometry={orbGeometries[orb.geoIdx]}
                    material={orb.isGold ? orbMaterials.gold : orbMaterials.primary}
                />
            ))}
        </group>
    );
};

/* ========================================================================= */
/* 6. Sculpted Porcelain Pedestal Cake Platter                               */
/* ========================================================================= */
const CakeStand = ({ config, primaryColor }: { config: CakeOption["config"]; primaryColor: string }) => {
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
            <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius + 0.68, 0.032, 16, 64]} />
                <meshStandardMaterial
                    color={trimColor}
                    metalness={0.92}
                    roughness={0.14}
                />
            </mesh>

            {/* Outer Scalloped Gold Filigree Ring */}
            <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius + 0.70, 0.018, 12, 64]} />
                <meshStandardMaterial
                    color={trimColor}
                    metalness={0.9}
                    roughness={0.18}
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

            {/* Front Royal Gold & Gem Medallion on Pedestal Neck */}
            <group position={[0, -0.32, 0.72]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.13, 0.13, 0.03, 24]} />
                    <meshStandardMaterial color={trimColor} metalness={0.95} roughness={0.12} />
                </mesh>
                <mesh position={[0, 0, 0.02]}>
                    <sphereGeometry args={[0.075, 16, 16]} />
                    <meshPhysicalMaterial color={primaryColor} roughness={0.1} clearcoat={1.0} />
                </mesh>
            </group>

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
            <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
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
const Scene = ({
    cake,
    phase,
    primaryColor,
    isMobile,
}: {
    cake: CakeOption;
    phase: Phase;
    primaryColor: string;
    isMobile: boolean;
}) => {
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
            <ambientLight intensity={0.9} color="#fffcf5" />
            {/* Warm Key Light with Crisp Shadows */}
            <directionalLight
                position={[4.5, 8, 5]}
                intensity={2.6}
                color="#fffaf0"
                castShadow
                shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
                shadow-bias={-0.0004}
            />
            {/* Soft Cool Fill Light */}
            <directionalLight
                position={[-4.5, 4, 3]}
                intensity={1.2}
                color="#e0f2fe"
            />
            {/* Golden Rim Backlight for Dramatic Edge Separation & Specular Halo */}
            <directionalLight
                position={[0, 6, -5]}
                intensity={2.2}
                color="#ffd166"
            />
            {/* Warm Top Spotlight on Cake Crown */}
            <pointLight position={[0, 4.2, 0.5]} intensity={1.5} distance={8} color="#fff5ea" />
            {/* Ambient Hemisphere for Deep Rich Shadows */}
            <hemisphereLight args={["#ffffff", "#2b1810", 0.7]} />

            {/* 3D Floating Celebration Bokeh Orbs */}
            <CelebrationOrbs3D primaryColor={primaryColor} />

            <Float speed={1.0} rotationIntensity={0.03} floatIntensity={0.08}>
                <group position={[0, -0.25, 0]}>
                    {/* Artisanal Cake Stand */}
                    <CakeStand config={cake.config} primaryColor={primaryColor} />

                    {/* Main Cake Body */}
                    <CakeBody cake={cake} />

                    {/* Severed Cake Wedge Slice */}
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <animated.group position={slicePos as any}>
                        <CakeBody cake={cake} isSlice />
                    </animated.group>

                    {/* 3D Sculpted Heart & Gold Halo Topper */}
                    <CakeTopper3D primaryColor={primaryColor} />

                    {/* 3-Candle Tiered Birthday Array */}
                    <Candle lit={candlesLit} accent={cake.accent} position={[0, height, 0]} scale={1} phaseOffset={0} />
                    <Candle lit={candlesLit} accent={primaryColor} position={[-0.62, height, -0.22]} scale={0.82} phaseOffset={1.7} />
                    <Candle lit={candlesLit} accent={primaryColor} position={[0.62, height, -0.22]} scale={0.82} phaseOffset={3.4} />

                    {/* True 3D Pastry Knife inside Scene */}
                    <CakeKnife3D phase={phase} />
                </group>
            </Float>

            {/* Soft Studio Floor Contact Shadows — baked once (frames={1}) at 256px resolution */}
            <ContactShadows
                position={[0, -1.08, 0]}
                opacity={0.5}
                scale={12}
                blur={2.4}
                far={4}
                frames={1}
                resolution={256}
            />

            {/* Orbit Controls */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                target={[0, 0.7, 0]}
                maxPolarAngle={Math.PI / 2 + 0.08}
                minPolarAngle={Math.PI / 4}
            />
        </>
    );
};

export const Cake3D = ({
    cake,
    phase,
    primaryColor,
}: {
    cake: CakeOption;
    phase: Phase;
    primaryColor?: string;
}) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const effectiveColor = primaryColor || cake.accent || "#FF2A6D";

    return (
        <div className="w-full h-full min-h-[440px] cursor-grab active:cursor-grabbing select-none overflow-visible">
            <Canvas
                shadows
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                camera={{ position: [0, 4.4, 8.4], fov: 42 }}
                gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <Scene cake={cake} phase={phase} primaryColor={effectiveColor} isMobile={isMobile} />
                </Suspense>
            </Canvas>
        </div>
    );
};

