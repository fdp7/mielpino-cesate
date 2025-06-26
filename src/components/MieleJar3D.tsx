import { useRef } from "react"
import {useFrame, useLoader} from "@react-three/fiber"
import { Html } from "@react-three/drei"
import {TextureLoader} from "three";

interface MieleJar3DProps {
    honeyLevel: number
    honeyColor?: string
    labelImageUrl?: string
}

export function MieleJar3D({ honeyLevel, honeyColor = "#FFDD00FF", labelImageUrl}: MieleJar3DProps) {
    const jarRef = useRef(null)

    const labelTexture = useLoader(TextureLoader, labelImageUrl)

    useFrame((state) => {
        if (jarRef.current) {
            jarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
        }
    })

    return (
        <group ref={jarRef}>
            {/* Jar Body (Glass) */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 3, 32]} />
                <meshStandardMaterial color="#f0f8ff" transparent opacity={0.3} roughness={0.1} metalness={0.1} />
            </mesh>

            {/* Jar Rim */}
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[1.25, 1.25, 0.1, 32]} />
                <meshStandardMaterial color="#c8c8c8" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Honey Level */}
            <mesh position={[0, -1.5 + (honeyLevel / 100) * 1.5, 0]}>
                <cylinderGeometry args={[1.15, 1.15, (honeyLevel / 100) * 3, 32]} />
                <meshStandardMaterial color={honeyColor} roughness={0.2} metalness={0.1} />
            </mesh>

            {/* Etichetta del barattolo - visibile solo se c'è un'immagine */}
            {labelTexture && (
                <mesh position={[0, 0, 1.25]}>
                    <planeGeometry args={[2, 1.5]} />
                    <meshStandardMaterial map={labelTexture} transparent />
                </mesh>
            )}

            {/* Lid */}
            <mesh position={[0, 1.8, 0]}>
                <cylinderGeometry args={[1.3, 1.3, 0.2, 32]} />
                <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Lid Handle */}
            <mesh position={[0, 2.0, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#f4e4bc" roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Quantity Indicator */}
            {honeyLevel > 0 && (
                <Html position={[2, -1.5 + (honeyLevel / 100) * 3, 0]}>
                    <div className="flex items-center">
                        <div className="w-4 h-0.5 bg-amber-800 mr-2"></div>
                        <div className="bg-amber-50 border border-amber-300 px-3 py-1 rounded-full text-sm font-bold text-amber-800 shadow-lg">
                            {honeyLevel}kg
                        </div>
                    </div>
                </Html>
            )}
        </group>
    )
}