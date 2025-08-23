
import React ,{useEffect} from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export function Desktop(props) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('./desktop.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
        const firstAction = actions[Object.keys(actions)[0]]
        firstAction?.reset().fadeIn(0.5).play()
        return () => firstAction?.fadeOut(0.5)
      }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="edf61d3267a744eba66abbd3ffc14de4fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="MONITOR" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="CAMERAS" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="PESCO��O" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="PESCO��O_BRANCO_0" geometry={nodes['PESCO��O_BRANCO_0'].geometry} material={materials.BRANCO} />
                </group>
                <group name="BASE" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="BASE_BRANCO_0" geometry={nodes.BASE_BRANCO_0.geometry} material={materials.BRANCO} />
                </group>
                <group name="GABINETE" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="GABINETE_BRANCO_0" geometry={nodes.GABINETE_BRANCO_0.geometry} material={materials.BRANCO} />
                </group>
                <group name="FRENTE" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="FRENTE_CINZA_0" geometry={nodes.FRENTE_CINZA_0.geometry} material={materials.CINZA} />
                </group>
                <group name="PARAFUSO" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="PARAFUSO_Material004_0" geometry={nodes.PARAFUSO_Material004_0.geometry} material={materials['Material.004']} />
                </group>
                <group name="FRENTE_DISK" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="FRENTE_DISK_BRANCO_0" geometry={nodes.FRENTE_DISK_BRANCO_0.geometry} material={materials.BRANCO} />
                </group>
                <group name="DISK" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="DISK_Material002_0" geometry={nodes.DISK_Material002_0.geometry} material={materials['Material.002']} />
                </group>
                <group name="CABO_MOUSE" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="CABO_MOUSE_BRANCO_0" geometry={nodes.CABO_MOUSE_BRANCO_0.geometry} material={materials.BRANCO} />
                </group>
                <group name="OLHOS" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="OLHOS001" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="BOTAO" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="BOTAO_BRANCO_0" geometry={nodes.BOTAO_BRANCO_0.geometry} material={materials.BRANCO} />
                </group>
                <group name="MOUSE" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="MOUSE_BRANCO_0" geometry={nodes.MOUSE_BRANCO_0.geometry} material={materials.BRANCO} />
                </group>
                <group name="RIGGING" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <group name="Object_29">
                    <group name="Object_30" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <group name="Object_35" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <group name="Object_37" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                      <skinnedMesh name="Object_38" geometry={nodes.Object_38.geometry} material={materials.OLHO} skeleton={nodes.Object_38.skeleton} morphTargetDictionary={nodes.Object_38.morphTargetDictionary} morphTargetInfluences={nodes.Object_38.morphTargetInfluences} />
                    </group>
                    <group name="Object_39" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                      <skinnedMesh name="Object_40" geometry={nodes.Object_40.geometry} material={materials.OLHO} skeleton={nodes.Object_40.skeleton} morphTargetDictionary={nodes.Object_40.morphTargetDictionary} morphTargetInfluences={nodes.Object_40.morphTargetInfluences} />
                    </group>
                    <group name="Neck_00" position={[0.001, -0.069, 0.011]} rotation={[1.577, 0, 0]}>
                      <primitive object={nodes.Head_01} />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
          <skinnedMesh name="Object_31" geometry={nodes.Object_31.geometry} material={materials.CINZA} skeleton={nodes.Object_31.skeleton} />
          <skinnedMesh name="Object_32" geometry={nodes.Object_32.geometry} material={materials.BRANCO} skeleton={nodes.Object_32.skeleton} />
          <skinnedMesh name="Object_33" geometry={nodes.Object_33.geometry} material={materials.Glass_Simple} skeleton={nodes.Object_33.skeleton} />
          <skinnedMesh name="Object_34" geometry={nodes.Object_34.geometry} material={materials['Material.003']} skeleton={nodes.Object_34.skeleton} />
          <skinnedMesh name="Object_36" geometry={nodes.Object_36.geometry} material={materials.CINZA} skeleton={nodes.Object_36.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('./desktop.glb')
