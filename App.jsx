import { Suspense, lazy, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Clock3, Compass, Heart, MapPin, Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
import { categories, money, products } from './store.js'

const StoreScene = lazy(() => import('./StoreScene.jsx'))

function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({})
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [favourites, setFavourites] = useState([])
  const [onlyPopular, setOnlyPopular] = useState(false)

  const visibleProducts = useMemo(() => products.filter(product =>
    (activeCategory === 'all' || product.category === activeCategory) &&
    (!onlyPopular || product.popular) &&
    (!search.trim() || `${product.name} ${product.detail} ${product.origin}`.toLowerCase().includes(search.trim().toLowerCase()))
  ), [activeCategory, search, onlyPopular])
  const cartItems = products.filter(product => cart[product.id])
  const itemCount = Object.values(cart).reduce((sum, amount) => sum + amount, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0)

  const addToCart = product => setCart(current => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }))
  const changeQty = (product, delta) => setCart(current => {
    const nextQty = (current[product.id] || 0) + delta
    const next = { ...current }
    if (nextQty <= 0) delete next[product.id]
    else next[product.id] = nextQty
    return next
  })
  const toggleFavourite = id => setFavourites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Market Lane home">
        <span className="brand-mark"><span /><span /><span /><span /></span>
        <span className="brand-copy"><strong>market lane</strong><small>YOUR NEIGHBOURHOOD, REIMAGINED</small></span>
      </a>
      <div className="store-status"><span className="status-dot" /><span>MARKET LANE · INDIRANAGAR</span><span className="status-divider" /><Clock3 size={14} /><span>Open until 10 pm</span><ChevronDown size={14} className="muted-icon" /></div>
      <div className="top-actions">
        <button className="icon-button help-button" onClick={() => setHelpOpen(true)} aria-label="How to explore"><CircleHelp size={19} /></button>
        <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /><span>My basket</span><b>{itemCount}</b></button>
      </div>
    </header>

    <section className="market-view" id="top">
      <div className="scene-wrap"><Suspense fallback={<div className="scene-loading"><span className="loading-mark">✳</span><strong>Opening the doors…</strong></div>}><StoreScene onSelect={setSelected} /></Suspense></div>
      <div className="scene-wash" />

      <aside className="category-rail">
        <div className="rail-heading"><span>EXPLORE</span><button className={`rail-filter ${onlyPopular ? 'active' : ''}`} onClick={() => setOnlyPopular(value => !value)} title="Show popular picks"><Sparkles size={15} /></button></div>
        <div className="category-list">
          {categories.map(category => <button className={`category-button ${activeCategory === category.id ? 'selected' : ''}`} key={category.id} onClick={() => setActiveCategory(category.id)}>
            <span className="category-icon">{category.emoji}</span><span>{category.label}</span>{activeCategory === category.id && <span className="selected-dot" />}
          </button>)}
        </div>
        <div className="rail-note"><span className="note-icon">✳</span><p>Good things are<br /><strong>closer than you think.</strong></p></div>
      </aside>

      <section className="browse-panel" aria-label="Shop products">
        <div className="panel-topline"><span><span className="live-dot" /> LIVE STORE</span><button className="panel-minimize" title="Hide product panel" onClick={e => e.currentTarget.closest('.browse-panel').classList.toggle('panel-collapsed')}><ArrowRight size={16} /></button></div>
        <div className="panel-intro"><div className="eyebrow">A LITTLE OF EVERYTHING</div><h1>Find your<br /><em>good stuff.</em></h1><p>Wander the aisles. Discover something delicious.</p></div>
        <label className="search-box"><Search size={17} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search the shelves" /><kbd>⌘ K</kbd></label>
        <div className="shelf-heading"><div><h2>{activeCategory === 'all' ? 'Staff favourites' : categories.find(item => item.id === activeCategory)?.label}</h2><span>{visibleProducts.length} lovely finds</span></div><button className="view-all" onClick={() => { setActiveCategory('all'); setOnlyPopular(false) }}>View all <ArrowUpRight size={14} /></button></div>
        <div className="product-list">
          {visibleProducts.length ? visibleProducts.slice(0, 8).map((product, index) => <article className="product-card" key={product.id} onClick={() => setSelected(product)}>
            <button className={`favourite-button ${favourites.includes(product.id) ? 'is-favourite' : ''}`} onClick={event => { event.stopPropagation(); toggleFavourite(product.id) }} aria-label="Save favourite"><Heart size={15} fill={favourites.includes(product.id) ? 'currentColor' : 'none'} /></button>
            <div className="product-art" style={{ '--product-color': product.color, '--delay': `${index * 60}ms` }}><span>{product.emoji}</span><i>{product.popular ? 'POPULAR' : product.aisle ? `AISLE ${product.aisle}` : 'FRESH'}</i></div>
            <div className="product-info"><div><strong>{product.name}</strong><span>{product.detail}</span></div><div className="product-buy"><b>{money(product.price)}</b>{cart[product.id] ? <div className="mini-qty" onClick={event => event.stopPropagation()}><button aria-label="Remove one" onClick={() => changeQty(product, -1)}><Minus size={12} /></button><span>{cart[product.id]}</span><button aria-label="Add one" onClick={() => addToCart(product)}><Plus size={12} /></button></div> : <button className="add-button" aria-label={`Add ${product.name}`} onClick={event => { event.stopPropagation(); addToCart(product) }}><Plus size={16} /></button>}</div></div>
          </article>) : <div className="empty-search"><span>🧺</span><strong>No finds this time</strong><p>Try a different search or browse all our shelves.</p></div>}
        </div>
        <button className="browse-aisles" onClick={() => { setActiveCategory('all'); setSearch(''); setOnlyPopular(false) }}><Compass size={17} /><span>Keep exploring the store</span><ArrowUpRight size={15} /></button>
      </section>

      <div className="store-caption"><span className="caption-line" /><div><strong>YOUR STORE, IN 3D</strong><span>Drag to look around · scroll to explore</span></div></div>
      <div className="scene-controls"><button title="Move view up" onClick={() => window.dispatchEvent(new CustomEvent('store-nudge', { detail: 'up' }))}><ArrowUpRight size={16} /></button><div><button title="Move left" onClick={() => window.dispatchEvent(new CustomEvent('store-nudge', { detail: 'left' }))}><ArrowLeft size={15} /></button><button title="Move down" onClick={() => window.dispatchEvent(new CustomEvent('store-nudge', { detail: 'down' }))}><ArrowDown size={15} /></button><button title="Move right" onClick={() => window.dispatchEvent(new CustomEvent('store-nudge', { detail: 'right' }))}><ArrowRight size={15} /></button></div></div>
      {itemCount > 0 && <button className="floating-basket" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /><span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span><strong>{money(subtotal)}</strong><ArrowUpRight size={15} /></button>}
    </section>

    <footer className="bottom-bar"><div className="footer-location"><MapPin size={14} /><span>Fresh from local farms, picked just for you.</span></div><div className="footer-right"><span>EST. 2024</span><span className="footer-separator" /><span>THOUGHTFULLY SOURCED · ALWAYS</span></div></footer>

    {selected && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null) }}><section className="product-modal">
      <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button>
      <div className="modal-art" style={{ '--product-color': selected.color }}><span>{selected.emoji}</span><div className="modal-orbit orbit-one" /><div className="modal-orbit orbit-two" /><i>MARKET LANE<br />GOOD THINGS</i></div>
      <div className="modal-body"><div className="eyebrow">{selected.category.toUpperCase()} · AISLE {selected.aisle}</div><h2>{selected.name}</h2><p className="modal-detail">{selected.detail}</p><div className="modal-origin"><span>✳</span> Thoughtfully sourced from <strong>{selected.origin}</strong></div><div className="modal-price-row"><strong>{money(selected.price)}</strong><span>Inclusive of all taxes</span></div><button className="modal-add" onClick={() => addToCart(selected)}>{cart[selected.id] ? <><Check size={17} /> Added to basket · {cart[selected.id]}</> : <><Plus size={17} /> Add to my basket</>}<span>{money(selected.price)}</span></button></div>
    </section></div>}

    {cartOpen && <div className="drawer-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer"><div className="drawer-header"><div><span className="eyebrow">A GOOD CHOICE</span><h2>Your basket <span>({itemCount})</span></h2></div><button className="modal-close" onClick={() => setCartOpen(false)} aria-label="Close basket"><X size={18} /></button></div>
      {cartItems.length ? <><div className="cart-lines">{cartItems.map(item => <article className="cart-line" key={item.id}><div className="cart-product-art" style={{ '--product-color': item.color }}>{item.emoji}</div><div className="cart-product-copy"><strong>{item.name}</strong><span>{item.detail}</span><b>{money(item.price)}</b></div><div className="qty-control"><button onClick={() => changeQty(item, -1)} aria-label="Remove one"><Minus size={13} /></button><span>{cart[item.id]}</span><button onClick={() => addToCart(item)} aria-label="Add one"><Plus size={13} /></button></div></article>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><strong className="free-delivery">On us today</strong></div><div className="total-row"><span>Total</span><strong>{money(subtotal)}</strong></div><button className="checkout-button" onClick={() => alert('Online checkout is coming in a later milestone. Your basket is saved for this visit.')}>Continue to checkout <ArrowRight size={17} /></button><p>Easy returns · Thoughtful delivery · Always local</p></div></> : <div className="empty-cart"><span>🧺</span><h3>Your basket is taking a little break.</h3><p>Pick something lovely from the shelves and it’ll show up here.</p><button onClick={() => setCartOpen(false)}>Back to the store <ArrowRight size={16} /></button></div>}
    </aside></div>}

    {helpOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setHelpOpen(false) }}><section className="help-modal"><button className="modal-close" onClick={() => setHelpOpen(false)} aria-label="Close"><X size={18} /></button><span className="help-sparkle"><Compass size={22} /></span><div className="eyebrow">MAKE YOURSELF AT HOME</div><h2>Take a little wander.</h2><p>Explore Market Lane like you're right here in the store.</p><div className="help-steps"><div><span>01</span><p><strong>Look around</strong>Drag anywhere in the store. On your phone, swipe to turn.</p></div><div><span>02</span><p><strong>Take in the aisles</strong>Scroll or pinch to move closer to your favourite shelves.</p></div><div><span>03</span><p><strong>Pick something lovely</strong>Tap a product in the aisle, or browse the shelf list.</p></div></div><button className="modal-add" onClick={() => setHelpOpen(false)}>Sounds lovely <ArrowRight size={17} /></button></section></div>}
  </main>
}

export default App
