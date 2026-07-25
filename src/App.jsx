import React, { Suspense, createRef, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, OrbitControls, Html, Text } from '@react-three/drei'
import { Physics, useBox, usePlane, useRaycastVehicle } from '@react-three/cannon'
import { Vector3, Quaternion } from 'three'

const MODEL_URL = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/jeep/model.gltf'

function useControls() {
  const [controls, setControls] = useState({ forward: false, backward: false, left: false, right: false, brake: false })

  useEffect(() => {
    const update = (key, value) => {
      setControls((prev) => ({ ...prev, [key]: value }))
    }

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()
      if (key === 'arrowup' || key === 'w') update('forward', true)
      if (key === 'arrowdown' || key === 's') update('backward', true)
      if (key === 'arrowleft' || key === 'a') update('left', true)
      if (key === 'arrowright' || key === 'd') update('right', true)
      if (key === ' ' || key === 'shift') update('brake', true)
    }

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase()
      if (key === 'arrowup' || key === 'w') update('forward', false)
      if (key === 'arrowdown' || key === 's') update('backward', false)
      if (key === 'arrowleft' || key === 'a') update('left', false)
      if (key === 'arrowright' || key === 'd') update('right', false)
      if (key === ' ' || key === 'shift') update('brake', false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return controls
}

function ThirdPersonCamera({ targetRef }) {
  const { camera } = useThree()
  const idealPosition = useMemo(() => new Vector3(0, 2.5, -8), [])
  const lookAtPosition = useMemo(() => new Vector3(), [])
  const tempVec = useMemo(() => new Vector3(), [])
  const tempQuaternion = useMemo(() => new Quaternion(), [])

  useFrame(() => {
    if (!targetRef?.current) return
    targetRef.current.getWorldPosition(lookAtPosition)
    targetRef.current.getWorldQuaternion(tempQuaternion)
    tempVec.copy(idealPosition).applyQuaternion(tempQuaternion).add(lookAtPosition)
    camera.position.lerp(tempVec, 0.08)
    camera.lookAt(lookAtPosition)
  })

  return null
}

function WorldBoundary({ position, rotation, args }) {
  const [ref] = useBox(() => ({ args, position, rotation, type: 'Static' }))
  return (
    <mesh ref={ref} position={position} rotation={rotation} receiveShadow castShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#202530" />
    </mesh>
  )
}

function StaticBuilding({ position, args, label }) {
  const [ref] = useBox(() => ({ args, position, type: 'Static' }))
  return (
    <group>
      <mesh ref={ref} position={position} castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color="#2f435a" metalness={0.05} roughness={0.85} />
      </mesh>
      <Text position={[position[0], position[1] + args[1] / 2 + 0.4, position[2]]} fontSize={0.65} color="#ffffff" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  )
}

function ParkingSign({ position, label }) {
  const [postRef] = useBox(() => ({ args: [0.18, 2.2, 0.18], position, type: 'Static' }))
  const [boardRef] = useBox(() => ({ args: [1.4, 0.56, 0.12], position: [position[0], position[1] + 2.1, position[2]], type: 'Static' }))

  return (
    <group>
      <mesh ref={postRef} castShadow receiveShadow>
        <boxGeometry args={[0.18, 2.2, 0.18]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh ref={boardRef} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.56, 0.12]} />
        <meshStandardMaterial color="#fcba03" emissive="#fb9f00" emissiveIntensity={0.18} />
      </mesh>
      <Text position={[position[0], position[1] + 2.1, position[2] + 0.14]} fontSize={0.27} color="#111111" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  )
}

function ParkingZone({ center, radius }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center[0], 0.03, center[2]]} receiveShadow>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color="#1d4ed8" opacity={0.35} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[center[0], 0.04, center[2]]} receiveShadow>
        <ringGeometry args={[radius - 0.35, radius - 0.1, 64]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function GroundPlane() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0], material: { friction: 0.95, restitution: 0.05 } }))
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#2b3140" roughness={0.92} metalness={0.03} />
    </mesh>
  )
}

function JeepFallbackModel() {
  return (
    <group>
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.6, 4.2]} />
        <meshStandardMaterial color="#e02424" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.45, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.7, 2.4]} />
        <meshStandardMaterial color="#c62828" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.88, 1.2]} rotation={[-0.2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.8, 0.9]} />
        <meshStandardMaterial color="#8cf0ff" opacity={0.7} transparent roughness={0.25} />
      </mesh>
      {[[-1.05, 0.18, 1.55], [1.05, 0.18, 1.55], [-1.05, 0.18, -1.55], [1.05, 0.18, -1.55]].map((pos, index) => (
        <mesh key={index} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.37, 0.37, 0.6, 20]} />
          <meshStandardMaterial color="#111111" metalness={0.1} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0.9, 0.35, -2.1]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.12, 0.14]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-0.9, 0.35, -2.1]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.12, 0.14]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  )
}

function Vehicle({ controls, onParkedChange, setTargetRef }) {
  const chassisBody = useRef()
  const wheelRefs = useRef([createRef(), createRef(), createRef(), createRef()])
  const parkingCenter = useMemo(() => new Vector3(8, 0, -6), [])
  const parkingRadius = 3.2

  const wheelInfos = useMemo(
    () => [
      {
        chassisConnectionPointLocal: [1, -0.32, 1.35],
        directionLocal: [0, -1, 0],
        axleLocal: [-1, 0, 0],
        suspensionStiffness: 25,
        suspensionRestLength: 0.35,
        radius: 0.45,
        frictionSlip: 6,
        dampingRelaxation: 2.5,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.02,
      },
      {
        chassisConnectionPointLocal: [-1, -0.32, 1.35],
        directionLocal: [0, -1, 0],
        axleLocal: [-1, 0, 0],
        suspensionStiffness: 25,
        suspensionRestLength: 0.35,
        radius: 0.45,
        frictionSlip: 6,
        dampingRelaxation: 2.5,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.02,
      },
      {
        chassisConnectionPointLocal: [1, -0.32, -1.6],
        directionLocal: [0, -1, 0],
        axleLocal: [-1, 0, 0],
        suspensionStiffness: 25,
        suspensionRestLength: 0.35,
        radius: 0.45,
        frictionSlip: 6,
        dampingRelaxation: 2.5,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.02,
      },
      {
        chassisConnectionPointLocal: [-1, -0.32, -1.6],
        directionLocal: [0, -1, 0],
        axleLocal: [-1, 0, 0],
        suspensionStiffness: 25,
        suspensionRestLength: 0.35,
        radius: 0.45,
        frictionSlip: 6,
        dampingRelaxation: 2.5,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.02,
      },
    ],
    []
  )

  const [chassisRef] = useBox(() => ({
    mass: 1400,
    args: [2.3, 0.6, 4.2],
    position: [0, 0.9, 0],
    rotation: [0, Math.PI, 0],
    allowSleep: false,
  }))

  const [vehicleBody, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody: chassisRef,
    wheelInfos,
    wheels: wheelRefs.current,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }))

  useEffect(() => {
    if (setTargetRef) setTargetRef(chassisRef)
  }, [chassisRef, setTargetRef])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!chassisRef.current) return
      const position = new Vector3()
      chassisRef.current.getWorldPosition(position)
      const inside = position.distanceTo(parkingCenter) < parkingRadius
      onParkedChange?.(inside)
    }, 100)
    return () => clearInterval(interval)
  }, [chassisRef, onParkedChange, parkingCenter, parkingRadius])

  useFrame(() => {
    if (!vehicleApi) return
    const engineForce = 2000
    const brakeForce = controls.brake ? 220 : 0
    const steerValue = controls.left ? 0.45 : controls.right ? -0.45 : 0
    const driveForce = controls.forward ? -engineForce : controls.backward ? engineForce : 0

    vehicleApi.applyEngineForce(driveForce, 2)
    vehicleApi.applyEngineForce(driveForce, 3)
    vehicleApi.setBrake(brakeForce, 0)
    vehicleApi.setBrake(brakeForce, 1)
    vehicleApi.setBrake(brakeForce, 2)
    vehicleApi.setBrake(brakeForce, 3)
    vehicleApi.setSteeringValue(steerValue, 0)
    vehicleApi.setSteeringValue(steerValue, 1)
  })

  return (
    <group ref={chassisRef}>
      <JeepFallbackModel />
      {wheelInfos.map((wheel, index) => (
        <mesh
          key={index}
          ref={wheelRefs.current[index]}
          position={wheel.chassisConnectionPointLocal}
          rotation={[0, 0, Math.PI / 2]}
          visible={false}
        >
          <cylinderGeometry args={[wheel.radius, wheel.radius, 0.3, 16]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}

function ParkingOverlay({ parked }) {
  return (
    <div style={{ position: 'absolute', top: 18, left: 18, color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', zIndex: 10 }}>
      <div style={{ marginBottom: 12, padding: 14, borderRadius: 18, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.18)' }}>
        <div style={{ fontSize: 14, opacity: 0.75, marginBottom: 6 }}>Controls: WASD / Arrows — hold Shift or Space to brake</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{parked ? '🚗 Parked in zone' : '🚦 Drive to the parking area'}</div>
      </div>
      {parked && (
        <div style={{ maxWidth: 320, padding: 16, borderRadius: 18, background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(96, 165, 250, 0.24)' }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Contacts</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>
            <div>Email: hello@example.com</div>
            <div>Phone: +381 60 1234 567</div>
            <div>Location: Novi Sad, Serbia</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const controls = useControls()
  const [parked, setParked] = useState(false)
  const [targetRef, setTargetRef] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ParkingOverlay parked={parked} />
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4.5, 16], fov: 45 }}>
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[8, 16, 8]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <directionalLight position={[-12, 8, -10]} intensity={0.35} />
        <fog attach="fog" args={['#ffffff', 20, 65]} />
        <Environment preset="forest" />

        <Suspense fallback={<Html center style={{ color: '#17212e', fontSize: '1.1rem' }}>Loading Jeep Wrangler...</Html>}>
          <Physics gravity={[0, -30, 0]} broadphase="SAP" defaultContactMaterial={{ friction: 0.8, restitution: 0.1 }}>
            <GroundPlane />
            <WorldBoundary args={[80, 2, 1]} position={[0, 1, -40]} rotation={[0, 0, 0]} />
            <WorldBoundary args={[80, 2, 1]} position={[0, 1, 40]} rotation={[0, 0, 0]} />
            <WorldBoundary args={[1, 2, 80]} position={[-40, 1, 0]} rotation={[0, 0, 0]} />
            <WorldBoundary args={[1, 2, 80]} position={[40, 1, 0]} rotation={[0, 0, 0]} />
            <StaticBuilding position={[-14, 1.75, -8]} args={[14, 3.5, 10]} label="Contacts" />
            <ParkingSign position={[8, 1, -6]} label="Parking" />
            <ParkingZone center={[8, 0, -6]} radius={3} />
            <Vehicle controls={controls} onParkedChange={setParked} setTargetRef={setTargetRef} />
            <ContactShadows position={[0, -0.01, 0]} opacity={0.5} blur={2.5} far={6} />
          </Physics>
        </Suspense>

        <ThirdPersonCamera targetRef={targetRef} />
        <OrbitControls makeDefault enabled={parked} minDistance={4} maxDistance={25} maxPolarAngle={Math.PI / 2 - 0.25} />
      </Canvas>
    </div>
  )
}

