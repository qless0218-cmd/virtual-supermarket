import { Canvas } from '@react-three/fiber'
import { ContactShadows, PointerLockControls, RoundedBox, Text } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { products } from './store'

const wood = '#b18d64'
const steel = '#4f5b58'
const productOrder = products

function Box({ position, size, color, ...props }) {
  return <mesh position={position} castShadow receiveShadow {...props}><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.76} /></mesh>
}

function ProductPack({ product, id }) {
  const trim = product.color
  const label = <>
    <RoundedBox args={[.2, .18, .018]} radius={.018} smoothness={2} position={[0, -.02, .145]}>
      <meshStandardMaterial color="#f4ecd8" roughness={.58} />
    </RoundedBox>
    <Box position={[0, .045, .157]} size={[.14, .024, .012]} color={trim} />
    <Box position={[0, -.075, .157]} size={[.12, .012, .012]} color="#b9a987" />
  </>

  if (product.id === 'avocado' || product.id === 'tomatoes' || product.id === 'berries') {
    const fruitColor = product.id === 'avocado' ? '#5d713b' : product.id === 'tomatoes' ? '#d54b3d' : '#5265a0'
    return <group>
      {[[-.08, .04, 0], [.06, .09, -.035], [.015, -.08, .018]].map((p, i) => <mesh key={i} position={p} scale={product.id === 'avocado' ? [.72, 1, .68] : [1, .9, .85]} castShadow>
        <sphereGeometry args={[.13 + i * .006, 18, 14]} />
        <meshStandardMaterial color={fruitColor} roughness={product.id === 'berries' ? .34 : .76} />
      </mesh>)}
      {product.id !== 'berries' && <mesh position={[.05, .2, -.03]} rotation={[.2, .1, .3]}><coneGeometry args={[.025, .09, 5]} /><meshStandardMaterial color="#536344" roughness={.88} /></mesh>}
    </group>
  }

  if (product.id === 'sourdough') return <group>
    <mesh position={[0, .03, 0]} rotation={[0, 0, -.08]} scale={[1, .72, .7]} castShadow><sphereGeometry args={[.24, 20, 14]} /><meshStandardMaterial color="#b7814e" roughness={.88} /></mesh>
    <mesh position={[0, .11, .01]} rotation={[0, 0, -.08]} scale={[.76, .12, .4]}><sphereGeometry args={[.2, 18, 12]} /><meshStandardMaterial color="#d2aa72" roughness={.92} /></mesh>
    {[-.06, .01, .08].map((x, i) => <mesh key={i} position={[x, .19, .03]} rotation={[0, 0, -.25]}><boxGeometry args={[.012, .1, .06]} /><meshStandardMaterial color="#e9d2aa" /></mesh>)}
  </group>

  if (product.id === 'croissant') return <group rotation={[0, .15, .05]}>
    {[-.11, 0, .11].map((x, i) => <mesh key={i} position={[x, .02 + (i === 1 ? .025 : 0), 0]} rotation={[0, 0, (i - 1) * .18]} scale={[.75, 1, .65]} castShadow>
      <sphereGeometry args={[.16, 18, 14]} /><meshStandardMaterial color={i === 1 ? '#dfa858' : '#c78b43'} roughness={.68} />
    </mesh>)}
  </group>

  if (product.id === 'eggs') return <group>
    <RoundedBox args={[.42, .12, .29]} radius={.035} smoothness={3} position={[0, -.09, 0]} castShadow><meshStandardMaterial color="#bca777" roughness={.87} /></RoundedBox>
    {[-.11, 0, .11].map((x, i) => <mesh key={i} position={[x, .03, 0]} scale={[.72, 1, .75]} castShadow><sphereGeometry args={[.085, 16, 12]} /><meshStandardMaterial color={i === 1 ? '#f1e8d3' : '#e7d7b5'} roughness={.38} /></mesh>)}
  </group>

  if (product.id === 'milk') return <group>
    <RoundedBox args={[.32, .4, .25]} radius={.028} smoothness={3} position={[0, .01, 0]} castShadow><meshStandardMaterial color="#eef0e9" roughness={.4} /></RoundedBox>
    <mesh position={[0, .235, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[.18, .1, 4]} /><meshStandardMaterial color="#94b5be" roughness={.56} /></mesh>
    {label}
  </group>

  if (product.id === 'yogurt' || product.id === 'coffee' || product.id === 'chocolate' || product.id === 'pasta') {
    const bag = product.id === 'coffee' || product.id === 'pasta'
    const bar = product.id === 'chocolate'
    if (bar || bag) return <group>
      <RoundedBox args={[bar ? .33 : .3, bar ? .42 : .4, .16]} radius={bar ? .025 : .06} smoothness={3} position={[0, .01, 0]} castShadow>
        <meshStandardMaterial color={bar ? '#5a342d' : trim} roughness={bar ? .28 : .83} metalness={bar ? .04 : 0} />
      </RoundedBox>
      <RoundedBox args={[.23, .19, .018]} radius={.02} smoothness={2} position={[0, .01, .095]}><meshStandardMaterial color={bar ? '#d6b36c' : '#efe4c7'} roughness={.58} /></RoundedBox>
      <Box position={[0, .085, .107]} size={[.16, .026, .012]} color={bar ? '#754538' : '#667a49'} />
      <Box position={[0, -.075, .107]} size={[.11, .012, .012]} color="#c2ac80" />
    </group>
    return <group>
      <mesh position={[0, -.01, 0]} castShadow><cylinderGeometry args={[.17, .15, .28, 20]} /><meshStandardMaterial color="#f1eee6" roughness={.32} /></mesh>
      <mesh position={[0, .145, 0]}><cylinderGeometry args={[.18, .18, .035, 20]} /><meshStandardMaterial color={trim} roughness={.35} /></mesh>
      <RoundedBox args={[.21, .13, .018]} radius={.018} smoothness={2} position={[0, -.01, .155]}><meshStandardMaterial color="#f4ecd8" /></RoundedBox>
      <Box position={[0, .025, .166]} size={[.16, .023, .012]} color={trim} />
    </group>
  }

  // Olive oil and kombucha are glass bottles with a foil cap and paper label.
  const amber = product.id === 'kombucha'
  return <group>
    <mesh position={[0, -.045, 0]} castShadow>
      <cylinderGeometry args={[.13, .145, .29, 20]} />
      <meshPhysicalMaterial color={amber ? '#9b572e' : '#586b37'} roughness={.24} metalness={.04} clearcoat={.38} clearcoatRoughness={.25} />
    </mesh>
    <mesh position={[0, .14, 0]} castShadow><cylinderGeometry args={[.065, .09, .12, 16]} /><meshPhysicalMaterial color={amber ? '#9b572e' : '#586b37'} roughness={.22} clearcoat={.4} /></mesh>
    <mesh position={[0, .225, 0]}><cylinderGeometry args={[.07, .07, .065, 16]} /><meshStandardMaterial color={amber ? '#d5b56c' : '#c3a95d'} roughness={.32} metalness={.38} /></mesh>
    {label}
  </group>
}

function ShelfUnit({ x, onSelect }) {
  const shelves = [0.55, 1.28, 2.02]
  const items = useMemo(() => Array.from({ length: 204 }, (_, i) => {
    const side = i % 2 ? 1 : -1
    const row = Math.floor(i / 2)
    const level = row % 3
    const slot = Math.floor(row / 3)
    const product = productOrder[(slot + level * 2 + Math.round((x + 5) * 2)) % productOrder.length]
    const z = -5.3 + slot * .315
    return { side, level, z, product, id: `${x}-${i}` }
  }), [x])
  return <group position={[x, 0, 0]}>
    <Box position={[0, .18, 0]} size={[1.45, .32, 11.5]} color="#77634f" />
    <Box position={[0, 1.38, -.35]} size={[.055, 2.52, 11.3]} color="#687569" />
    {[-.57, .57].map(side => <group key={side}>
      {shelves.map(y => <group key={y}>
        <Box position={[side * .65, y, -0.35]} size={[.12, .12, 11.35]} color={wood} />
        <Box position={[side * .71, y + .035, -0.35]} size={[.03, .12, 11.35]} color="#efe8d9" />
        {Array.from({ length: 11 }, (_, i) => <Box key={i} position={[side * .73, y + .04, -4.95 + i * .92]} size={[.018, .085, .34]} color={i % 4 === 0 ? '#e4d6b5' : '#fbf8ef'} />)}
      </group>)}
      <Box position={[side * .63, 1.76, -6.06]} size={[.16, 2.05, .18]} color={steel} />
      <Box position={[side * .63, 1.76, 5.35]} size={[.16, 2.05, .18]} color={steel} />
    </group>)}
    {items.map(({ side, level, z, product, id }) => {
      const y = shelves[level] + .29
      return <group key={id} position={[side * .55, y, z]} onClick={e => { e.stopPropagation(); onSelect(product) }} onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
        <group scale={.83}><ProductPack product={product} id={id} /></group>
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

function ProduceWall({ onSelect }) {
  const sections = [
    { label: 'APPLES', color: '#bd4335', product: products[0] },
    { label: 'CITRUS', color: '#e6a33f', product: products[1] },
    { label: 'PEARS', color: '#8ba348', product: products[0] },
    { label: 'TOMATOES', color: '#d8503c', product: products[1] },
    { label: 'GREENS', color: '#56814a', product: products[0] },
    { label: 'BERRIES', color: '#586397', product: products[2] },
  ]
  return <group position={[0, 0, -10.3]}>
    <Box position={[0, 1.5, -.52]} size={[11.1, 3.0, .65]} color="#303a35" />
    {[.55, 1.35, 2.15].map(y => <Box key={y} position={[0, y, -.05]} size={[10.75, .09, 1.05]} color="#ba9467" />)}
    {sections.map((section, index) => {
      const x = -4.45 + index * 1.78
      return <group key={section.label}>
        {[.82, 1.62, 2.42].map((y, row) => <group key={y}>
          <Box position={[x, y - .14, .15]} size={[1.68, .3, .95]} color={row === 1 ? '#b18d64' : '#987650'} />
          {Array.from({ length: 8 }, (_, n) => <mesh key={n} position={[x - .65 + (n % 4) * .42, y + .08 + (Math.floor(n / 4) * .09), .47 + (n % 2) * .15]} scale={[1, .9, .82]} castShadow onClick={() => onSelect(section.product)}>
            <sphereGeometry args={[.18, 16, 12]} /><meshStandardMaterial color={section.color} roughness={.56} />
          </mesh>)}
        </group>)}
        <Text position={[x, .38, .71]} fontSize={.12} color="#fff7e5" anchorX="center" anchorY="middle" fontWeight={700}>{section.label}</Text>
      </group>
    })}
    <Box position={[0, 3.48, .12]} size={[7.2, .78, .2]} color="#315c3e" />
    <Text position={[0, 3.5, .24]} fontSize={.46} color="#fff9e8" anchorX="center" anchorY="middle" fontWeight={800}>FRESH PRODUCE</Text>
  </group>
}

function ShoppingCart() {
  return <group position={[0, -.12, 6.4]} scale={1.22}>
    {/* front rail and basket mouth */}
    <mesh position={[0, .71, .04]} castShadow><boxGeometry args={[2.25, .11, .12]} /><meshStandardMaterial color="#c51f2a" roughness={.31} /></mesh>
    {[-.91, .91].map(x => <group key={x}>
      <mesh position={[x, .79, -.47]}><meshStandardMaterial color="#aeb6b5" metalness={.72} roughness={.29} /><boxGeometry args={[.055, .58, .055]} /></mesh>
      <mesh position={[x, .5, -.93]}><meshStandardMaterial color="#aeb6b5" metalness={.72} roughness={.29} /><boxGeometry args={[.045, .42, .045]} /></mesh>
      <mesh position={[x, .27, -.93]}><meshStandardMaterial color="#aeb6b5" metalness={.72} roughness={.29} /><cylinderGeometry args={[.055, .055, .1, 16]} /></mesh>
    </group>)}
    {[-.88, -.55, -.22, .11, .44, .77].map((z, i) => <mesh key={`wire${i}`} position={[0, .82 - i * .045, z]}><meshStandardMaterial color="#aeb6b5" metalness={.72} roughness={.29} /><boxGeometry args={[1.92, .022, .018]} /></mesh>)}
    {[-.82, -.48, -.14, .2, .54, .82].map((x, i) => <mesh key={`wirex${i}`} position={[x, .68, -.47]}><meshStandardMaterial color="#aeb6b5" metalness={.72} roughness={.29} /><boxGeometry args={[.018, .48, 1.12]} /></mesh>)}
    {[-.9, .9].map(x => <mesh key={`handle${x}`} position={[x, .67, .52]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.045, .045, .78, 16]} /><meshStandardMaterial color="#d31e2c" roughness={.3} /></mesh>)}
    <mesh position={[0, .64, .52]}><boxGeometry args={[1.8, .11, .11]} /><meshStandardMaterial color="#d31e2c" roughness={.3} /></mesh>
    <mesh position={[0, .18, -.12]}><meshStandardMaterial color="#aeb6b5" metalness={.72} roughness={.29} /><boxGeometry args={[1.45, .045, 1.55]} /></mesh>
    {[-.72, .72].map(x => [-.7, .38].map(z => <group key={`${x}-${z}`} position={[x, .13, z]}>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.15, .15, .08, 20]} /><meshStandardMaterial color="#293238" roughness={.68} /></mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.055, .055, .085, 16]} /><meshStandardMaterial color="#aeb6b5" metalness={.72} roughness={.29} /></mesh>
    </group>))}
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
    {Array.from({ length: 9 }, (_, i) => <Box key={`beam${i}`} position={[-11, 5.9, -10 + i * 2.5]} size={[22, .16, .16]} color="#323b39" />)}
    {[-10, -5, 0, 5, 10].map(x => <Box key={`cross${x}`} position={[x, 5.9, 0]} size={[.16, .16, 22]} color="#323b39" />)}
    {[-7, -2.3, 2.3, 7].flatMap(x => [-7, -1, 5].map(z => <group key={`light${x}${z}`} position={[x, 5.78, z]}>
      <Box position={[0, 0, 0]} size={[3.4, .08, .28]} color="#515c58" />
      <Box position={[0, -.055, 0]} size={[3.08, .012, .2]} color="#fff9eb" />
      <pointLight position={[0, -.25, 0]} intensity={1.05} distance={7} color="#fff2d9" />
    </group>))}
  </group>
}

function ColdAisle() {
  return <group position={[-10.55, 0, -.3]}>
    <Box position={[0, 2.1, 0]} size={[2.25, 4.2, 12.4]} color="#d6d9d4" />
    <Box position={[1.12, 2.12, 0]} size={[.06, 4.15, 12.15]} color="#eef4ef" />
    {Array.from({ length: 6 }, (_, i) => {
      const z = -5.08 + i * 2.02
      return <group key={z}>
        <Box position={[1.17, 2.1, z]} size={[.08, 3.95, 1.92]} color="#293b3b" />
        <mesh position={[1.225, 2.1, z]} castShadow><boxGeometry args={[.035, 3.78, 1.72]} /><meshPhysicalMaterial color="#b7d4d0" metalness={.08} roughness={.12} transmission={.22} transparent opacity={.36} /></mesh>
        <Box position={[1.25, .34, z]} size={[.1, .1, 1.74]} color="#3c544b" />
        {[.75, 1.45, 2.15, 2.85].map((y, row) => <group key={y}>
          <Box position={[1.24, y, z]} size={[.08, .035, 1.64]} color="#d9e0dc" />
          {Array.from({ length: 5 }, (_, n) => <group key={n} position={[1.29, y + .22, z - .63 + n * .31]}>
            <mesh castShadow><cylinderGeometry args={[.095, .095, .35, 18]} /><meshStandardMaterial color={['#e9e4d5','#b6d7db','#efd7b2','#e6d3cb'][Math.floor((n + row) % 4)]} roughness={.36} /></mesh>
            <mesh position={[.052, 0, 0]}><boxGeometry args={[.015, .17, .14]} /><meshStandardMaterial color={['#738c6a','#7195a2','#b46c4f','#778caf'][n % 4]} /></mesh>
          </group>)}
        </group>)}
        <Box position={[1.29, 3.92, z]} size={[.04, .09, 1.72]} color="#fff6e6" />
      </group>
    })}
    <Box position={[.98, 4.38, 0]} size={[.38, .48, 12.5]} color="#25483a" />
    <Text position={[.76, 4.38, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={.28} color="#fff8e8" anchorX="center" anchorY="middle" fontWeight={700}>CHILLED · FRESH DAILY</Text>
  </group>
}

function Store({ onSelect }) {
  return <>
    <color attach="background" args={['#d7d6ce']} />
    <fog attach="fog" args={['#d7d6ce', 21, 42]} />
    <hemisphereLight args={['#f3f1e9', '#857d6d', .72]} />
    <ambientLight intensity={.45} />
    <directionalLight position={[-7, 8, 6]} intensity={.72} />
    <group>
      <mesh position={[0, -.12, 0]} receiveShadow><boxGeometry args={[24, .24, 26]} /><meshStandardMaterial color="#aaa9a3" roughness={.17} metalness={.12} /></mesh>
      {Array.from({ length: 13 }, (_, i) => <Box key={`tile${i}`} position={[0, .006, -11.5 + i * 1.9]} size={[23.8, .012, .018]} color="#96958f" />)}
      {Array.from({ length: 13 }, (_, i) => <Box key={`tilex${i}`} position={[-11.5 + i * 1.9, .006, 0]} size={[.018, .012, 25.8]} color="#96958f" />)}
      <Box position={[0, 3.25, -12.6]} size={[24, 6.6, .35]} color="#f1eee6" />
      <Box position={[0, 6.04, 0]} size={[23.8, .18, 25.8]} color="#363c39" />
      <Box position={[-12, 3.25, 0]} size={[.32, 6.5, 26]} color="#f1eee6" />
      <Box position={[12, 3.25, 0]} size={[.32, 6.5, 26]} color="#f1eee6" />
      <Box position={[0, 2.65, -12.36]} size={[7.6, 1.0, .12]} color="#294b3c" />
      <Text position={[0, 2.66, -12.27]} fontSize={.62} color="#fff9ec" anchorX="center" anchorY="middle" fontWeight={800} letterSpacing={.08}>MARKET LANE</Text>
      <Text position={[0, 1.86, -12.26]} fontSize={.18} color="#d6e1d5" anchorX="center" anchorY="middle" letterSpacing={.16}>GOOD FOOD. GOOD DAYS.</Text>
      <Ceiling />
      <ColdAisle />
      {[-3.8, 3.8].map(x => <ShelfUnit key={x} x={x} onSelect={onSelect} />)}
      <ProduceWall onSelect={onSelect} />
      <ProduceIsland onSelect={onSelect} />
      <ShoppingCart />
      {[-3.8, 3.8].map((x, i) => <group key={`aisle${x}`} position={[x, 3.05, -7.1]}>
        <Box position={[0, 0, 0]} size={[1.65, .55, .08]} color={['#d8bb72', '#c96c54', '#718c73'][i]} />
        <Text position={[0, 0, .055]} fontSize={.26} color="#fffdf3" anchorX="center" anchorY="middle" fontWeight={700}>0{i + 1}</Text>
      </group>)}
      <Text position={[-8.4, 2.0, -11.2]} fontSize={.22} color="#34583e" anchorX="center" anchorY="middle" fontWeight={700}>FARM FRESH</Text>
      <Text position={[8.4, 2.0, -11.2]} fontSize={.22} color="#34583e" anchorX="center" anchorY="middle" fontWeight={700}>BAKED IN STORE</Text>
    </group>
    <ContactShadows position={[0, -.005, 0]} opacity={.22} scale={28} blur={2} far={4} />
  </>
}

function WalkControls({ onSelect }) {
  const keys = useRef({})
  const { camera } = useThree()
  useEffect(() => {
    const validKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    const down = event => { if (validKeys.includes(event.code)) { keys.current[event.code] = true; event.preventDefault() } }
    const up = event => { if (validKeys.includes(event.code)) keys.current[event.code] = false }
    const clear = () => { keys.current = {} }
    const moveView = event => {
      const forward = new THREE.Vector3()
      camera.getWorldDirection(forward); forward.y = 0; forward.normalize()
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()
      const shift = new THREE.Vector3()
      if (event.detail === 'up') shift.copy(forward)
      if (event.detail === 'down') shift.copy(forward).negate()
      if (event.detail === 'left') shift.copy(right).negate()
      if (event.detail === 'right') shift.copy(right)
      camera.position.addScaledVector(shift, 1.1)
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -10.8, 10.8)
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -11.7, 11.8)
      camera.position.y = 1.68
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    window.addEventListener('store-nudge', moveView)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', clear); window.removeEventListener('store-nudge', moveView) }
  }, [camera])
  useFrame((_, delta) => {
    const state = keys.current
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward); forward.y = 0; forward.normalize()
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()
    const x = Number(state.KeyD || state.ArrowRight) - Number(state.KeyA || state.ArrowLeft)
    const z = Number(state.KeyW || state.ArrowUp) - Number(state.KeyS || state.ArrowDown)
    if (x || z) {
      const movement = forward.multiplyScalar(z).addScaledVector(right, x).normalize()
      camera.position.addScaledVector(movement, Math.min(delta, .05) * 3.4)
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -10.8, 10.8)
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -11.7, 11.8)
      camera.position.y = 1.68
    }
  })
  return <>
    <Store onSelect={onSelect} />
    <PointerLockControls selector="#walk-button" />
  </>
}

export function StoreCanvas({ onSelect }) {
  return <Canvas shadows camera={{ position: [0, 1.75, 9.2], fov: 50, near: .1, far: 80 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}><Store onSelect={onSelect} /><WalkControls /></Suspense>
  </Canvas>
}

export default StoreCanvas
