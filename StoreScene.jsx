import { Canvas } from '@react-three/fiber'
import { ContactShadows, Html, OrbitControls, Text } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { products } from './store'

const wood = '#b18d64'
const steel = '#4f5b58'
const productOrder = products

function Box({ position, size, color, ...props }) {
  return <mesh position={position} castShadow receiveShadow {...props}><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.76} /></mesh>
}

function ShelfUnit({ x, onSelect }) {
  const shelves = [0.55, 1.28, 2.02]
  const items = useMemo(() => Array.from({ length: 40 }, (_, i) => {
    const side = i % 2 ? 1 : -1
    const row = Math.floor(i / 2)
    const level = row % 3
    const slot = Math.floor(row / 3)
    const product = productOrder[(slot + level * 2 + Math.round((x + 5) * 2)) % productOrder.length]
    const z = -6.25 + slot * 0.68
    const varied = (i % 5) * 0.025
    return { side, level, z, product, varied, id: `${x}-${i}` }
  }), [x])
  return <group position={[x, 0, 0]}>
    <Box position={[0, .18, 0]} size={[1.45, .32, 11.5]} color="#77634f" />
    {[-.57, .57].map(side => <group key={side}>
      {shelves.map(y => <group key={y}>
        <Box position={[side * .65, y, -0.35]} size={[.11, .11, 11.35]} color={wood} />
        <Box position={[side * .70, y + .13, -0.35]} size={[.035, .04, 11.35]} color="#dac9a8" />
      </group>)}
      <Box position={[side * .63, 1.76, -6.06]} size={[.16, 2.05, .18]} color={steel} />
      <Box position={[side * .63, 1.76, 5.35]} size={[.16, 2.05, .18]} color={steel} />
    </group>)}
    {items.map(({ side, level, z, product, varied, id }) => {
      const y = shelves[level] + .3
      const cylinder = id.charCodeAt(id.length - 1) % 4 === 0
      return <group key={id} position={[side * .55, y, z]} onClick={e => { e.stopPropagation(); onSelect(product) }} onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
        {cylinder ? <mesh castShadow position={[0, .12, 0]}><cylinderGeometry args={[.13, .13, .38, 14]} /><meshStandardMaterial color={product.color} roughness={.42} /></mesh> : <Box position={[0, .12, 0]} size={[.24 + varied, .35 + varied, .23]} color={product.color} />}
        <mesh position={[0, .125, cylinder ? .133 : .117]}><planeGeometry args={[.14, .16]} /><meshBasicMaterial color="#fff9e9" /></mesh>
      </group>
    })}
  </group>
}

function ProduceIsland({ onSelect }) {
  const p = products.slice(0, 3)
  return <group position={[-8.2, 0, -1.4]}>
    <Box position={[0, .48, 0]} size={[2.1, .8, 2.6]} color="#d8c5a0" />
    {p.map((item, i) => <group key={item.id} position={[(i - 1) * .63, .94, 0]} onClick={() => onSelect(item)}>
      <Box position={[0, -.04, 0]} size={[.59, .14, 2.35]} color={['#496244', '#a4483d', '#4b4a71'][i]} />
      {Array.from({ length: 9 }, (_, n) => <mesh key={n} position={[(n % 3 - 1) * .15, .13 + (n % 2) * .04, (Math.floor(n / 3) - 1) * .58]} castShadow><sphereGeometry args={[.14, 16, 12]} /><meshStandardMaterial color={item.color} roughness={.54} /></mesh>)}
      <mesh position={[0, .14, .12]} visible={false}><boxGeometry args={[.7, .5, 2.5]} /><meshBasicMaterial transparent opacity={0} /></mesh>
    </group>)}
    <Box position={[0, 1.2, -1.36]} size={[2.15, .56, .08]} color="#e4efe2" />
    <Text position={[0, 1.2, -1.30]} fontSize={.22} color="#315c3e" anchorX="center" anchorY="middle" fontWeight={700}>FRESH TODAY</Text>
  </group>
}

function Checkout() {
  return <group position={[6.8, 0, 7.2]} rotation={[0, Math.PI, 0]}>
    {[0, 2.15, 4.3].map((z, i) => <group key={z} position={[0, 0, z]}>
      <Box position={[0, .62, 0]} size={[2.4, 1.18, 1.3]} color={i === 1 ? '#d9a861' : '#be8b57'} />
      <Box position={[0, 1.24, -.03]} size={[2.5, .1, 1.42]} color="#485a50" />
      <Box position={[.55, 1.43, -.05]} size={[.58, .28, .42]} color="#223c37" />
      <Text position={[0, 2.0, -.4]} fontSize={.19} color="#fff3d9" anchorX="center" anchorY="middle" fontWeight={700}>CHECKOUT {i + 1}</Text>
    </group>)}
  </group>
}

function Ceiling() {
  return <group>
    {Array.from({ length: 9 }, (_, i) => <Box key={`beam${i}`} position={[-11, 5.9, -10 + i * 2.5]} size={[22, .12, .12]} color="#e5e1d7" />)}
    {[-10, -5, 0, 5, 10].map(x => <Box key={`cross${x}`} position={[x, 5.9, 0]} size={[.11, .12, 22]} color="#dedbd1" />)}
    {[-8, -4, 0, 4, 8].flatMap(x => [-7, -1, 5].map(z => <group key={`light${x}${z}`} position={[x, 5.78, z]}>
      <Box position={[0, 0, 0]} size={[2.6, .05, .42]} color="#fffdf2" />
      <pointLight position={[0, -.25, 0]} intensity={9} distance={7} color="#fff4da" />
    </group>))}
  </group>
}

function Store({ onSelect }) {
  return <>
    <color attach="background" args={['#eae8df']} />
    <fog attach="fog" args={['#eae8df', 18, 38]} />
    <ambientLight intensity={1.35} />
    <directionalLight position={[-4, 9, 7]} intensity={2.3} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={14} shadow-camera-bottom={-14} />
    <group>
      <mesh position={[0, -.12, 0]} receiveShadow><boxGeometry args={[24, .24, 26]} /><meshStandardMaterial color="#d7d2c7" roughness={.86} /></mesh>
      {Array.from({ length: 13 }, (_, i) => <Box key={`tile${i}`} position={[0, .006, -11.5 + i * 1.9]} size={[23.8, .012, .018]} color="#c8c1b5" />)}
      {Array.from({ length: 13 }, (_, i) => <Box key={`tilex${i}`} position={[-11.5 + i * 1.9, .006, 0]} size={[.018, .012, 25.8]} color="#c8c1b5" />)}
      <Box position={[0, 3.25, -12.6]} size={[24, 6.6, .35]} color="#f1eee6" />
      <Box position={[-12, 3.25, 0]} size={[.32, 6.5, 26]} color="#f1eee6" />
      <Box position={[12, 3.25, 0]} size={[.32, 6.5, 26]} color="#f1eee6" />
      <Box position={[0, 2.65, -12.36]} size={[7.6, 1.0, .12]} color="#294b3c" />
      <Text position={[0, 2.66, -12.27]} fontSize={.62} color="#fff9ec" anchorX="center" anchorY="middle" fontWeight={800} letterSpacing={.08}>MARKET LANE</Text>
      <Text position={[0, 1.86, -12.26]} fontSize={.18} color="#d6e1d5" anchorX="center" anchorY="middle" letterSpacing={.16}>GOOD FOOD. GOOD DAYS.</Text>
      <Ceiling />
      {[-4.1, 0, 4.1].map(x => <ShelfUnit key={x} x={x} onSelect={onSelect} />)}
      <ProduceIsland onSelect={onSelect} />
      <Checkout />
      {[-4.1, 0, 4.1].map((x, i) => <group key={`aisle${x}`} position={[x, 3.05, -7.1]}>
        <Box position={[0, 0, 0]} size={[1.65, .55, .08]} color={['#d8bb72', '#c96c54', '#718c73'][i]} />
        <Text position={[0, 0, .055]} fontSize={.26} color="#fffdf3" anchorX="center" anchorY="middle" fontWeight={700}>0{i + 1}</Text>
      </group>)}
      <Text position={[-8.4, 2.0, -11.2]} fontSize={.22} color="#34583e" anchorX="center" anchorY="middle" fontWeight={700}>FARM FRESH</Text>
      <Text position={[8.4, 2.0, -11.2]} fontSize={.22} color="#34583e" anchorX="center" anchorY="middle" fontWeight={700}>BAKED IN STORE</Text>
    </group>
    <ContactShadows position={[0, -.005, 0]} opacity={.22} scale={28} blur={2} far={4} />
  </>
}

export default function StoreScene({ onSelect }) {
  const controls = useRef()
  useEffect(() => {
    const moveView = event => {
      if (!controls.current) return
      const { camera, target } = controls.current
      const direction = new THREE.Vector3().subVectors(target, camera.position)
      direction.y = 0
      direction.normalize()
      const shift = new THREE.Vector3()
      if (event.detail === 'up') shift.copy(direction).multiplyScalar(1.15)
      if (event.detail === 'down') shift.copy(direction).multiplyScalar(-1.15)
      if (event.detail === 'left') shift.set(-1.15, 0, 0)
      if (event.detail === 'right') shift.set(1.15, 0, 0)
      camera.position.add(shift)
      target.add(shift)
      controls.current.update()
    }
    window.addEventListener('store-nudge', moveView)
    return () => window.removeEventListener('store-nudge', moveView)
  }, [])
  return <Canvas shadows camera={{ position: [0, 3.8, 11.2], fov: 48, near: .1, far: 80 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}><Store onSelect={onSelect} /><OrbitControls ref={controls} makeDefault target={[0, 1.45, -1.6]} minDistance={4.2} maxDistance={20} minPolarAngle={.32} maxPolarAngle={1.48} enableDamping dampingFactor={.075} maxAzimuthAngle={.8} minAzimuthAngle={-.8} /></Suspense>
  </Canvas>
}
