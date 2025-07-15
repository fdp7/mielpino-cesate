import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, Html } from "@react-three/drei";
import { Color, Mesh, Material } from 'three';

type ModelProps = {
    scale: number;
    position: [number, number, number];
    distanceFactor: number;
    rotation: [number, number, number];
    occlude: boolean;
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
    productType?: string; // "wax", "honey", "salame", "generic"
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
                    position: [0, 0.65, 0],
                    distanceFactor: 2.5,
                    rotation: [-Math.PI / 2, 0, 0],
                    occlude: true
                };
            case "honey":
                return {
                    scale: scale,
                    position: [0, 0.045, 0],
                    distanceFactor: 0.12,
                    rotation: [-Math.PI / 2, 0, 0],
                    occlude: true
                };
            case "salame":
                return {
                    scale: scale * 0.05,
                    position: [0, 0.65, 0],
                    distanceFactor: 2.5,
                    rotation: [-Math.PI / 2, 0, 0],
                    occlude: true
                };
            case "pancetta":
                return {
                    scale: scale * 0.05,
                    position: [0, 0.65, 0],
                    distanceFactor: 2.5,
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

    // Effetto per applicare proprietà ai materiali basato sul tipo di prodotto
    useEffect(() => {
        if (clonedScene) {
            if (productType === "honey") {

                // Logica per il miele
                const vetroMesh = clonedScene.getObjectByName('vetro');
                if (vetroMesh && vetroMesh instanceof Mesh) {
                    const material = vetroMesh.material as Material;
                    if (material && 'color' in material) {
                        material.color = new Color(0xffffff);
                        material.transparent = true;
                        material.opacity = 0.1;
                    }
                }

                const mieleMesh = clonedScene.getObjectByName('miele');
                if (mieleMesh && mieleMesh instanceof Mesh) {
                    const material = mieleMesh.material as Material;
                    if (material) {
                        const clonedMaterial = material.clone() as any;
                        clonedMaterial.transparent = true;
                        clonedMaterial.opacity = 0.8;
                        clonedMaterial.metalness = 0.1;
                        clonedMaterial.roughness = 0.2;
                        clonedMaterial.color = new Color(honeyColor);
                        mieleMesh.material = clonedMaterial;
                    }
                }

                const tappoMesh = clonedScene.getObjectByName('tappo');
                if (tappoMesh && tappoMesh instanceof Mesh) {
                    const material = tappoMesh.material as Material;
                    if (material) {
                        const clonedMaterial = material.clone() as any;
                        // Modifica il colore che viene moltiplicato con la texture
                        clonedMaterial.color = new Color("#FFD700"); // Oro più brillante per influenzare la texture
                        clonedMaterial.metalness = 0.8;
                        clonedMaterial.roughness = 0.3;

                        // Aggiusta la texture
                        if (clonedMaterial.map) {
                            clonedMaterial.map.repeat.set(2, 3);
                            clonedMaterial.map.wrapS = clonedMaterial.map.wrapT = 1000; // RepeatWrapping
                            clonedMaterial.map.needsUpdate = true;
                        }
                        tappoMesh.material = clonedMaterial;
                    }
                }

                const etichettaMesh = clonedScene.getObjectByName('etichetta');
                if (etichettaMesh && etichettaMesh instanceof Mesh) {
                    const material = etichettaMesh.material as Material;
                    if (material) {
                        const clonedMaterial = material.clone() as any;
                        //clonedMaterial.color = new Color("#FFD700"); // Oro più brillante per influenzare la texture
                        clonedMaterial.metalness = 0;
                        clonedMaterial.roughness = 3;
                        etichettaMesh.material = clonedMaterial;
                    }
                }
            } else if (productType === "wax") {
                // Logica per la cera
                const ceraMesh = clonedScene.getObjectByName('cera') || clonedScene.getObjectByName('wax');
                if (ceraMesh && ceraMesh instanceof Mesh) {
                    const material = ceraMesh.material as Material;
                    if (material) {
                        const clonedMaterial = material.clone() as any;
                        clonedMaterial.color = new Color(honeyColor);
                        clonedMaterial.metalness = 0.05;
                        clonedMaterial.roughness = 0.8;
                        ceraMesh.material = clonedMaterial;
                    }
                }
            }
            // Per "generic" non applica modifiche specifiche
        }
    }, [clonedScene, honeyColor, productType]);

    return (
        <group ref={groupRef} scale={modelProps.scale}>
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