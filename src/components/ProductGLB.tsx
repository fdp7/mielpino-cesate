import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, Html } from "@react-three/drei";
import { Color, Mesh } from 'three';

type ModelProps = {
    scale?: number;
    position?: [number, number, number];
    distanceFactor?: number;
    rotation?: [number, number, number];
    occlude?: boolean;
}

export default function ProductGLB({
    modelPath,
    scale = 1,
    honeyColor = "#FFA500",
    stockLevel = 0,
    productType = "honey",
    showStockLevel = true
}: {
    modelPath: string;
    scale?: number;
    honeyColor?: string;
    stockLevel?: number;
    productType?: "honey" | "wax" | "generic";
    showStockLevel?: boolean;
}) {
    const { scene } = useGLTF(modelPath);
    const groupRef = useRef(null);

    const clonedScene = useMemo(() => scene?.clone(), [scene]);

    // Calcola le proprietà del modello basate sul tipo di prodotto
    const modelProps: ModelProps = useMemo(() => {
        switch (productType) {
            case "wax":
                return {
                    scale: scale * 0.05,
                    position: [0, 0.62, 0],
                    distanceFactor: 2.5,
                    rotation: [-Math.PI / 2, 0, 0],
                    occlude: true
                };
            case "honey":
                return {
                    scale: scale,
                    position: [0, 0.042, 0],
                    distanceFactor: 0.12,
                    rotation: [-Math.PI / 2, 0, 0],
                    occlude: true
                };
            case "generic":
            default:
                return {
                    scale: scale,
                    position: [0, 0, 0],
                    distanceFactor: 0.12,
                    rotation: [-Math.PI / 2, 0, 0],
                    occlude: true
                };
        }
    }, [scale, productType]);

    // Estrai la scala finale dalle proprietà del modello
    const finalScale = modelProps.scale;

    // Effetto per applicare proprietà ai materiali basato sul tipo di prodotto
    useEffect(() => {
        if (clonedScene) {
            if (productType === "honey") {
                // Logica esistente per il miele
                const vetroMesh = clonedScene.getObjectByName('vetro');
                if (vetroMesh && vetroMesh instanceof Mesh) {
                    if (vetroMesh.material) {
                        vetroMesh.material.color = new Color(0xffffff);
                        vetroMesh.material.transparent = true;
                        vetroMesh.material.opacity = 0.1;
                    }
                }

                const mieleMesh = clonedScene.getObjectByName('miele');
                if (mieleMesh && mieleMesh instanceof Mesh) {
                    if (mieleMesh.material) {
                        const originalMaterial = mieleMesh.material.clone();
                        originalMaterial.transparent = true;
                        originalMaterial.opacity = 0.8;
                        originalMaterial.metalness = 0.1;
                        originalMaterial.roughness = 0.2;
                        originalMaterial.color = new Color(honeyColor);
                        mieleMesh.material = originalMaterial;
                    }
                }
            } else if (productType === "wax") {
                // Logica per la cera - adatta i nomi degli oggetti nel tuo modello cera.glb
                const ceraMesh = clonedScene.getObjectByName('cera') || clonedScene.getObjectByName('wax');
                if (ceraMesh && ceraMesh instanceof Mesh) {
                    if (ceraMesh.material) {
                        const material = ceraMesh.material.clone();
                        material.color = new Color(honeyColor); // usa lo stesso parametro colore
                        material.metalness = 0.05;
                        material.roughness = 0.8;
                        ceraMesh.material = material;
                    }
                }
            }
            // Per "generic" non applica modifiche specifiche
        }
    }, [clonedScene, honeyColor, productType]);

    return (
        <group ref={groupRef} scale={finalScale}>
            <primitive object={clonedScene} />

            {/* Quantity Indicator */}
            {stockLevel > 0 && showStockLevel && (
                <group position={modelProps.position}>
                    <Html
                        transform
                        occlude={modelProps.occlude}
                        distanceFactor={modelProps.distanceFactor}
                        rotation={modelProps.rotation}
                    >
                        <div className="flex items-center justify-center">
                            <div className="bg-amber-50 border-2 border-amber-600 px-3 py-1 rounded-full text-sm font-bold text-amber-800 shadow-lg whitespace-nowrap">
                                {stockLevel} kg
                            </div>
                        </div>
                    </Html>
                </group>
            )}
        </group>
    );
}