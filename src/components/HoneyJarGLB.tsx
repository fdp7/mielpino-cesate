import React, { useRef, useEffect, useMemo } from 'react'
import { MeshTransmissionMaterial, useGLTF, Html } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { Color, Mesh } from 'three';

export default function HoneyJarGLB({modelPath, scale = 1, honeyColor = "#FFA500", stockLevel = 0}: {modelPath: string; scale?: number; honeyColor?: string; stockLevel?: number}){
    const { scene } = useGLTF(modelPath);
    const groupRef = useRef(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005;
        }
    });

    const clonedScene = useMemo(() => scene?.clone(), [scene]);

    // Effetto per applicare proprietà ai materiali
    useEffect(() => {
        if (clonedScene) {
            // Gestione del vetro - applica proprietà di trasmissione mantenendo trasparenza
            const vetroMesh = clonedScene.getObjectByName('vetro');
            if (vetroMesh && vetroMesh instanceof Mesh) {
                // Mantieni il materiale originale ma forza il colore trasparente
                if (vetroMesh.material) {
                    vetroMesh.material.color = new Color(0xffffff); // Bianco trasparente
                    vetroMesh.material.transparent = true;
                    vetroMesh.material.opacity = 0.1;
                }
            }

            // Gestione del miele - mantieni l'effetto honey con colore da database
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
        }
    }, [clonedScene, honeyColor]);

    return (
        <group ref={groupRef} scale={scale}>
            <primitive object={clonedScene} />
        </group>
    );
}