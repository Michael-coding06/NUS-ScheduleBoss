import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Snowman(props) {
  const group = React.useRef()
  const { nodes, materials, animations } = useGLTF('./snow_man.glb')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
      const firstAction = actions[Object.keys(actions)[0]]
      firstAction?.reset().setEffectiveTimeScale(0.5).fadeIn(0.5).play()
      return () => firstAction?.fadeOut(0.5)
    }, [actions])
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="476bd03fc98b47789d63e16406f4ae6afbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Line002" position={[-8.348, 35.105, -0.125]}>
                  <group name="Object002" position={[-4.914, -7.692, 0]}>
                    <group name="Box002" position={[-5.494, 3.862, -2.019]} rotation={[0, 0, -0.159]}>
                      <group name="Group001" position={[-0.345, -5.735, 1.577]} rotation={[-Math.PI / 2, -0.159, 0]}>
                        <group name="Helix001" position={[0.525, -1.227, 15.35]} rotation={[0, -0.144, 0]} scale={1.223}>
                          <mesh name="Helix001_Material_#26_0" geometry={nodes['Helix001_Material_#26_0'].geometry} material={materials.Material_26} />
                        </group>
                        <group name="Line004" position={[2.449, -1.116, -4.802]} rotation={[Math.PI / 2, 0, 0]}>
                          <mesh name="Line004_Material_#26_0" geometry={nodes['Line004_Material_#26_0'].geometry} material={materials.Material_26} />
                        </group>
                        <group name="Line009" position={[-0.362, -1.031, 21.28]} rotation={[-1.584, -0.248, 2.513]}>
                          <mesh name="Line009_Material_#26_0" geometry={nodes['Line009_Material_#26_0'].geometry} material={materials.Material_26} />
                        </group>
                      </group>
                      <mesh name="Box002_Material_#26_0" geometry={nodes['Box002_Material_#26_0'].geometry} material={materials.Material_26} />
                    </group>
                    <group name="Object_22" position={[-1.236, 3.374, 0.125]}>
                      <mesh name="Object002_Material_#26_0" geometry={nodes['Object002_Material_#26_0'].geometry} material={materials.Material_26} />
                    </group>
                  </group>
                  <group name="Object_19" position={[-6.15, -4.318, 0.125]}>
                    <mesh name="Line002_Material_#26_0" geometry={nodes['Line002_Material_#26_0'].geometry} material={materials.Material_26} />
                  </group>
                </group>
                <group name="Line003" position={[8.727, 35.612, 0]}>
                  <group name="Object001" position={[6.103, 8.642, -0.678]}>
                    <group name="Object_37" position={[-4.493, -0.19, 0.678]}>
                      <mesh name="Object001_Material_#26_0" geometry={nodes['Object001_Material_#26_0'].geometry} material={materials.Material_26} />
                    </group>
                    <group name="Shape001" position={[-14.383, 9.519, 0.467]} rotation={[-Math.PI / 2, 0, 0]} scale={1.051}>
                      <group name="Cylinder001" position={[-0.425, 0, 0]}>
                        <mesh name="Cylinder001_Material_#26_0" geometry={nodes['Cylinder001_Material_#26_0'].geometry} material={materials.Material_26} />
                      </group>
                      <mesh name="Shape001_Material_#26_0" geometry={nodes['Shape001_Material_#26_0'].geometry} material={materials.Material_26} />
                    </group>
                  </group>
                  <group name="Object_34" position={[1.61, 8.452, 0]}>
                    <mesh name="Line003_Material_#26_0" geometry={nodes['Line003_Material_#26_0'].geometry} material={materials.Material_26} />
                  </group>
                </group>
                <group name="Cylinder002" position={[-1.999, 49.634, 5.771]}>
                  <mesh name="Cylinder002_Material_#26_0" geometry={nodes['Cylinder002_Material_#26_0'].geometry} material={materials.Material_26} />
                </group>
                <group name="Cylinder003" position={[2.465, 49.634, 5.771]}>
                  <mesh name="Cylinder003_Material_#26_0" geometry={nodes['Cylinder003_Material_#26_0'].geometry} material={materials.Material_26} />
                </group>
                <group name="Cylinder004" position={[0.013, 47.989, 6.679]}>
                  <mesh name="Cylinder004_Material_#26_0" geometry={nodes['Cylinder004_Material_#26_0'].geometry} material={materials.Material_26} />
                </group>
                <group name="GeoSphere001" position={[0, 10.982, -0.26]} rotation={[-Math.PI / 2, 0, 0]} scale={0.471}>
                  <mesh name="GeoSphere001_Material_#26_0" geometry={nodes['GeoSphere001_Material_#26_0'].geometry} material={materials.Material_26} />
                </group>
                <group name="GeoSphere002" position={[0, 31.945, -0.26]} rotation={[-Math.PI / 2, 0, 0]} scale={0.352}>
                  <mesh name="GeoSphere002_Material_#26_0" geometry={nodes['GeoSphere002_Material_#26_0'].geometry} material={materials.Material_26} />
                </group>
                <group name="GeoSphere003" position={[0, 47.805, -0.26]} rotation={[-Math.PI / 2, 0, 0]} scale={0.265}>
                  <mesh name="GeoSphere003_Material_#26_0" geometry={nodes['GeoSphere003_Material_#26_0'].geometry} material={materials.Material_26} />
                </group>
                <group name="Line001" position={[0.321, 45.695, 5.575]}>
                  <mesh name="Line001_Material_#26_0" geometry={nodes['Line001_Material_#26_0'].geometry} material={materials.Material_26} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('./snow_man.glb')
