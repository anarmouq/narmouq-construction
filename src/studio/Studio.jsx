/* ==========================================================================
   DESIGN STUDIO — lay out rooms, add furniture and try finishes in 3D.
   Brought over from the form-and-foundation project and restyled in the
   Narmouq theme (styles: src/studio/studio.css).

   The 3D view is StudioScene.jsx; the plan data (rooms, furniture, undo,
   saving in the browser) is store.js; the furniture list and finishes are
   catalog.js.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CATALOG,
  catalogItem,
  FABRICS,
  finishById,
  FLOORS,
  ROOM_TYPES,
  SURFACES,
  WALLS,
} from './catalog.js'
import { roomContains, studio, useStudio } from './store.js'
import './studio.css'

/* Imported directly, not lazily: the 3D canvas fails to start when it first appears
   inside a React loading boundary. The whole studio page is already loaded on demand. */
import StudioScene, { studioCanvas } from './StudioScene.jsx'

/* Sent to the contact page so the form can be filled in for the visitor. */
export const BRIEF_KEY = 'narmouq-studio-brief'

/* ---------------------------------------------------------------- swatches */

function swatchStyle(color, pattern) {
  switch (pattern) {
    case 'wood':
      return {
        backgroundColor: color,
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(0,0,0,.16) 0 1px, transparent 1px 9px), repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 3px, rgba(0,0,0,.06) 3px 5px, transparent 5px 7px)',
      }
    case 'tile':
      return {
        backgroundColor: color,
        backgroundImage: 'linear-gradient(rgba(0,0,0,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.22) 1px, transparent 1px)',
        backgroundSize: '50% 50%',
      }
    case 'terrazzo':
      return {
        backgroundColor: color,
        backgroundImage:
          'radial-gradient(circle at 20% 30%, #a39a8e 0 2px, transparent 2.5px), radial-gradient(circle at 70% 60%, #c58c6a 0 1.5px, transparent 2px), radial-gradient(circle at 45% 80%, #6f6a62 0 1.5px, transparent 2px), radial-gradient(circle at 80% 20%, #8f8a82 0 2px, transparent 2.5px)',
      }
    case 'stone':
      return {
        backgroundColor: color,
        backgroundImage:
          'linear-gradient(125deg, transparent 40%, rgba(255,255,255,.35) 46%, transparent 52%), linear-gradient(160deg, transparent 60%, rgba(255,255,255,.22) 64%, transparent 68%)',
      }
    case 'concrete':
      return { backgroundColor: color, backgroundImage: 'radial-gradient(rgba(0,0,0,.12) 0.6px, transparent 0.8px)', backgroundSize: '5px 5px' }
    case 'metal':
      return { backgroundColor: color, backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,.35), transparent 45%, rgba(0,0,0,.25))' }
    default:
      return { backgroundColor: color }
  }
}

const floorPattern = (id) =>
  id.includes('oak') || id.includes('walnut') ? 'wood' : id === 'terrazzo' ? 'terrazzo' : id === 'polished-concrete' ? 'concrete' : 'tile'
const wallPattern = (id) => (id === 'oak-panel' ? 'wood' : id === 'concrete' ? 'concrete' : undefined)
const finishPattern = (f) => (f.tex === 'wood' ? 'wood' : f.tex === 'stone' ? 'stone' : f.tex === 'concrete' ? 'concrete' : f.metalness ? 'metal' : undefined)

function SwatchRow({ label, options, value, onPick }) {
  const current = options.find((o) => o.id === value)
  return (
    <fieldset className="st-swatches">
      <legend>
        <span className="st-label">{label}</span>
        <span className="st-swatches__current">{current?.label}</span>
      </legend>
      <div className="st-swatches__row">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            title={o.label}
            aria-label={o.label}
            aria-pressed={o.id === value}
            onClick={() => onPick(o.id)}
            className="st-swatch"
            style={o.style}
          />
        ))}
      </div>
    </fieldset>
  )
}

/* ----------------------------------------------------------------- bits */

function Seg({ value, options, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="st-seg">
      {options.map((o) => (
        <button key={o.v} type="button" aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

function IconBtn({ label, onClick, disabled, children }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="st-icon">
      {children}
    </button>
  )
}

function Stepper({ label, value, min, max, step, onChange }) {
  return (
    <div className="st-stepper">
      <span>{label}</span>
      <div>
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - step))}>−</button>
        <output>{value.toFixed(1)} m</output>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + step))}>+</button>
      </div>
    </div>
  )
}

/** tiny top-down drawing of a furniture piece, in proportion to its footprint */
function Glyph({ c }) {
  const s = 34 / Math.max(c.w, c.d)
  return (
    <svg viewBox="0 0 40 40" className="st-glyph" aria-hidden="true">
      <rect x={20 - (c.w * s) / 2} y={20 - (c.d * s) / 2} width={c.w * s} height={c.d * s} fill="none" stroke="currentColor" strokeWidth="1.2" />
      <line x1={20 - (c.w * s) / 2} x2={20 + (c.w * s) / 2} y1={20 - (c.d * s) / 2 + 2.5} y2={20 - (c.d * s) / 2 + 2.5} stroke="currentColor" strokeWidth="2.4" />
    </svg>
  )
}

/* ---------------------------------------------------------------- panels */

function RoomsPanel({ rooms, selectedId }) {
  return (
    <div>
      <p className="st-label">Your plan</p>
      {rooms.length === 0 ? (
        <p className="st-note">No rooms yet. Add one below. Rooms snap to a 0.5 m grid and join with doorways where they touch.</p>
      ) : (
        <ul className="st-rooms">
          {rooms.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => studio.select({ type: 'room', id: r.id })}
                aria-current={selectedId === r.id ? 'true' : undefined}
              >
                <span className="st-rooms__name">
                  <span className="st-rooms__chip" style={swatchStyle(FLOORS.find((f) => f.id === r.floor).color, floorPattern(r.floor))} />
                  {r.name}
                </span>
                <span className="st-rooms__size">
                  {r.w.toFixed(1)} × {r.d.toFixed(1)} m, {(r.w * r.d).toFixed(1)} m²
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="st-label st-gap">Add a room</p>
      <div className="st-grid2">
        {Object.keys(ROOM_TYPES).map((k) => (
          <button key={k} type="button" onClick={() => studio.addRoom(k)} className="st-add">
            <span>{ROOM_TYPES[k].label}</span>
            <span aria-hidden="true" className="st-add__plus">+</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function FurnishPanel({ onAdd, targetName }) {
  const cats = useMemo(() => [...new Set(CATALOG.map((c) => c.category))], [])
  return (
    <div>
      <p className="st-note st-note--top">
        Adding to <b>{targetName ?? 'the first room'}</b>. Select a room first to furnish it, then drag pieces into place.
      </p>
      {cats.map((cat) => (
        <div key={cat} className="st-gap">
          <p className="st-label">{cat}</p>
          <div className="st-grid2">
            {CATALOG.filter((c) => c.category === cat).map((c) => (
              <button key={c.kind} type="button" onClick={() => onAdd(c)} className="st-piece">
                <Glyph c={c} />
                <span>
                  <span className="st-piece__name">{c.label}</span>
                  <span className="st-piece__size">{c.w.toFixed(1)} × {c.d.toFixed(1)} m</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const finishOptions = (group) =>
  (group === 'fabric' ? FABRICS : SURFACES).map((f) => ({ id: f.id, label: f.label, style: swatchStyle(f.color, finishPattern(f)) }))

function EditPanel({ room, item, items }) {
  if (item) {
    const c = catalogItem(item.kind)
    return (
      <div>
        <p className="st-label">Selected piece</p>
        <h3 className="st-title">{c.label}</h3>
        <p className="st-meta">{c.w.toFixed(2)} × {c.d.toFixed(2)} m footprint</p>
        <div className="st-grid4">
          {[
            { l: '↺ 90°', t: 'Turn left 90°', f: () => studio.rotateItem(item.id, Math.PI / 2) },
            { l: '↻ 90°', t: 'Turn right 90°', f: () => studio.rotateItem(item.id, -Math.PI / 2) },
            { l: '↺ 15°', t: 'Turn left 15°', f: () => studio.rotateItem(item.id, Math.PI / 12) },
            { l: '↻ 15°', t: 'Turn right 15°', f: () => studio.rotateItem(item.id, -Math.PI / 12) },
          ].map((b) => (
            <button key={b.l} type="button" title={b.t} aria-label={b.t} onClick={b.f} className="st-small">{b.l}</button>
          ))}
        </div>
        <SwatchRow label={c.a.label} options={finishOptions(c.a.group)} value={item.a} onPick={(id) => studio.updateItem(item.id, { a: id })} />
        {c.b && <SwatchRow label={c.b.label} options={finishOptions(c.b.group)} value={item.b ?? c.b.default} onPick={(id) => studio.updateItem(item.id, { b: id })} />}
        <div className="st-grid2 st-gap">
          <button type="button" onClick={() => studio.duplicateItem(item.id)} className="btn btn--ghost btn--sm">Duplicate</button>
          <button type="button" onClick={() => studio.removeItem(item.id)} className="st-danger">Remove</button>
        </div>
      </div>
    )
  }

  if (room) {
    const inside = items.filter((i) => roomContains(room, i.x, i.z))
    return (
      <div>
        <p className="st-label">Selected room</p>
        <label className="st-rename">
          <span className="sr-only">Room name</span>
          <input
            key={room.id}
            defaultValue={room.name}
            maxLength={32}
            onBlur={(e) => e.target.value.trim() && e.target.value !== room.name && studio.updateRoom(room.id, { name: e.target.value.trim() })}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          />
        </label>
        <p className="st-meta">{(room.w * room.d).toFixed(1)} m². Drag the floor in the view to move it.</p>
        <div className="st-steppers">
          <Stepper label="Width" value={room.w} min={1.5} max={16} step={0.5} onChange={(w) => studio.resizeRoom(room.id, w, room.d)} />
          <Stepper label="Depth" value={room.d} min={1.5} max={16} step={0.5} onChange={(d) => studio.resizeRoom(room.id, room.w, d)} />
        </div>
        <SwatchRow
          label="Floor"
          options={FLOORS.map((f) => ({ id: f.id, label: f.label, style: swatchStyle(f.color, floorPattern(f.id)) }))}
          value={room.floor}
          onPick={(id) => studio.updateRoom(room.id, { floor: id })}
        />
        <SwatchRow
          label="Walls"
          options={WALLS.map((f) => ({ id: f.id, label: f.label, style: swatchStyle(f.color, wallPattern(f.id)) }))}
          value={room.wall}
          onPick={(id) => studio.updateRoom(room.id, { wall: id })}
        />
        {inside.length > 0 && (
          <div className="st-gap">
            <p className="st-label">In this room</p>
            <ul className="st-chips">
              {inside.map((i) => (
                <li key={i.id}>
                  <button type="button" onClick={() => studio.select({ type: 'item', id: i.id })}>{catalogItem(i.kind).label}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" onClick={() => studio.removeRoom(room.id)} className="st-danger st-danger--wide">
          Remove room{inside.length ? ` and its ${inside.length} piece${inside.length > 1 ? 's' : ''}` : ''}
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3 className="st-title">Nothing selected</h3>
      <p className="st-note">Click a room&rsquo;s floor or any piece of furniture in the view to edit it.</p>
      <ul className="st-keys">
        <li><kbd>Drag</kbd> Move furniture, or a selected room</li>
        <li><kbd>R</kbd> / <kbd>Shift R</kbd> Turn the piece</li>
        <li><kbd>D</kbd> Duplicate</li>
        <li><kbd>Arrows</kbd> Nudge</li>
        <li><kbd>Delete</kbd> Remove</li>
        <li><kbd>Ctrl Z</kbd> / <kbd>Ctrl Shift Z</kbd> Undo and redo</li>
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------ summary text */

function designBrief(rooms, items) {
  const total = rooms.reduce((s, r) => s + r.w * r.d, 0)
  const lines = [`Design Studio plan: ${rooms.length} room${rooms.length === 1 ? '' : 's'}, ${total.toFixed(1)} m² in total.`]
  for (const r of rooms) {
    const fl = FLOORS.find((f) => f.id === r.floor).label
    const wl = WALLS.find((f) => f.id === r.wall).label
    const pieces = items
      .filter((i) => roomContains(r, i.x, i.z))
      .map((i) => {
        const c = catalogItem(i.kind)
        return `${c.label} (${finishById(i.a).label}${i.b ? ` / ${finishById(i.b).label}` : ''})`
      })
      .join(', ')
    lines.push(`- ${r.name}, ${r.w} × ${r.d} m: ${fl} floor, ${wl} walls${pieces ? `. ${pieces}` : ''}.`)
  }
  return lines.join('\n')
}

/* ------------------------------------------------------------------ editor */

export default function Studio() {
  const rootRef = useRef(null)
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [tab, setTab] = useState('rooms')
  const [toast, setToast] = useState(null)
  const [full, setFull] = useState(false)
  const fromPanel = useRef(false)

  const rooms = useStudio((s) => s.rooms)
  const items = useStudio((s) => s.items)
  const selected = useStudio((s) => s.selected)
  const view = useStudio((s) => s.view)
  const walls = useStudio((s) => s.walls)
  const canUndo = useStudio((s) => s.past.length > 0)
  const canRedo = useStudio((s) => s.future.length > 0)

  const selRoom = selected?.type === 'room' ? rooms.find((r) => r.id === selected.id) : undefined
  const selItem = selected?.type === 'item' ? items.find((i) => i.id === selected.id) : undefined
  const target = selRoom ?? (selItem ? rooms.find((r) => roomContains(r, selItem.x, selItem.z)) : undefined) ?? rooms[0]

  /* Restore the saved plan, detect touch screens, and only run the 3D view while it is on screen. */
  useEffect(() => {
    studio.load()
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setMounted(true)
        setActive(e.isIntersecting)
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    const onMq = () => setMobile(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    // jump to the Edit tab when something is picked in the 3D view
    let last = studio.get().selected
    const unsub = studio.subscribe(() => {
      const s = studio.get().selected
      if (s !== last && s && !fromPanel.current) setTab('edit')
      last = s
      fromPanel.current = false
    })
    const onFs = () => setFull(document.fullscreenElement === el)
    document.addEventListener('fullscreenchange', onFs)
    return () => {
      io.disconnect()
      mq.removeEventListener('change', onMq)
      unsub()
      document.removeEventListener('fullscreenchange', onFs)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const addItem = useCallback(
    (c) => {
      if (!rooms.length) {
        setToast('Add a room first')
        return
      }
      fromPanel.current = true
      studio.addItem(c.kind)
      setToast(`${c.label} added to ${target?.name ?? 'the plan'}`)
    },
    [rooms.length, target?.name],
  )

  const onKey = (e) => {
    if (e.target.closest('input, select, textarea')) return
    const mod = e.ctrlKey || e.metaKey
    const sel = studio.get().selected
    if (mod && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      if (e.shiftKey) studio.redo()
      else studio.undo()
    } else if (mod && e.key.toLowerCase() === 'y') {
      e.preventDefault()
      studio.redo()
    } else if (!mod && sel) {
      const step = e.shiftKey ? 0.5 : 0.1
      const k = e.key
      if (k === 'Delete' || k === 'Backspace') studio.removeSelected()
      else if (k === 'Escape') studio.select(null)
      else if ((k === 'r' || k === 'R') && sel.type === 'item') studio.rotateItem(sel.id, e.shiftKey ? Math.PI / 2 : -Math.PI / 2)
      else if ((k === 'd' || k === 'D') && sel.type === 'item') studio.duplicateItem(sel.id)
      else if (k === 'ArrowLeft') studio.nudge(-step, 0)
      else if (k === 'ArrowRight') studio.nudge(step, 0)
      else if (k === 'ArrowUp') studio.nudge(0, -step)
      else if (k === 'ArrowDown') studio.nudge(0, step)
      else return
      e.preventDefault()
    }
  }

  const snapshot = () => {
    const gl = studioCanvas.gl
    if (!gl) return
    const a = document.createElement('a')
    a.href = gl.domElement.toDataURL('image/png')
    a.download = 'narmouq-design.png'
    a.click()
    setToast('Picture saved')
  }

  /* Hand the plan to the contact form as the start of the visitor's message. */
  const sendBrief = () => {
    try { sessionStorage.setItem(BRIEF_KEY, designBrief(rooms, items)) } catch { /* private mode: the form just starts empty */ }
    if (document.fullscreenElement) document.exitFullscreen()
    navigate('/contact#f-details')
  }

  const toggleFull = () => {
    const el = rootRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.().catch(() => setToast("Full screen isn't available here"))
  }

  const area = rooms.reduce((s, r) => s + r.w * r.d, 0)

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      onKeyDown={onKey}
      onPointerDown={(e) => {
        if (!e.target.closest('input, select, textarea, button')) rootRef.current?.focus({ preventScroll: true })
      }}
      className={`st${full ? ' is-full' : ''}`}
      aria-label="Design studio editor"
      role="application"
    >
      {/* ---------------- 3D view ---------------- */}
      <div className="st-view">
        {mounted && <StudioScene active={active} mobile={mobile} onReady={() => setReady(true)} />}
        <div aria-hidden="true" className={`st-loading${ready ? ' is-done' : ''}`}>
          <span>Preparing the drawing board</span>
        </div>

        <div className="st-toolbar st-toolbar--left">
          <Seg label="View" value={view} onChange={studio.setView} options={[{ v: '3d', l: '3D' }, { v: 'plan', l: 'Plan' }]} />
          {view === '3d' && (
            <Seg
              label="Walls"
              value={walls}
              onChange={studio.setWalls}
              options={[
                { v: 'cutaway', l: 'Cutaway' },
                { v: 'low', l: 'Low' },
                { v: 'full', l: 'Full' },
              ]}
            />
          )}
        </div>
        <div className="st-toolbar st-toolbar--right">
          <IconBtn label="Undo" onClick={studio.undo} disabled={!canUndo}>↶</IconBtn>
          <IconBtn label="Redo" onClick={studio.redo} disabled={!canRedo}>↷</IconBtn>
          <IconBtn label="Fit the plan to the view" onClick={studio.frame}>⤢</IconBtn>
          {!mobile && (
            <>
              <IconBtn label="Save a picture (PNG)" onClick={snapshot}>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <rect x="2.5" y="5" width="15" height="11" />
                  <circle cx="10" cy="10.5" r="3" />
                  <path d="M7 5l1.2-2h3.6L13 5" />
                </svg>
              </IconBtn>
              <IconBtn label={full ? 'Exit full screen' : 'Full screen'} onClick={toggleFull}>{full ? '⤡' : '⛶'}</IconBtn>
            </>
          )}
        </div>

        <div className="st-stats">
          <span><b>{rooms.length}</b> rooms</span>
          <span><b>{area.toFixed(1)}</b> m²</span>
          <span><b>{items.length}</b> pieces</span>
        </div>

        {toast && <div role="status" className="st-toast">{toast}</div>}
      </div>

      {/* ---------------- side panel ---------------- */}
      <aside className="st-side">
        <div role="tablist" aria-label="Studio tools" className="st-tabs">
          {[
            ['rooms', 'Rooms'],
            ['furnish', 'Furnish'],
            ['edit', 'Edit'],
          ].map(([t, l]) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              aria-controls={`studio-panel-${t}`}
              id={`studio-tab-${t}`}
              onClick={() => setTab(t)}
            >
              {l}
              {t === 'edit' && selected && <i className="st-tabs__dot" aria-label="(something is selected)" />}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`studio-panel-${tab}`} aria-labelledby={`studio-tab-${tab}`} className="st-panel" key={tab}>
          {tab === 'rooms' && <RoomsPanel rooms={rooms} selectedId={selRoom?.id} />}
          {tab === 'furnish' && <FurnishPanel onAdd={addItem} targetName={target?.name} />}
          {tab === 'edit' && <EditPanel room={selRoom} item={selItem} items={items} />}
        </div>

        <div className="st-foot">
          <button type="button" onClick={sendBrief} disabled={!rooms.length} className="btn btn--amber st-send">
            Send this design to our team <svg className="arrow"><use href="#arrow" /></svg>
          </button>
          <div className="st-foot__links">
            <button type="button" onClick={studio.reset} className="link-line">Load the sample apartment</button>
            <button type="button" onClick={studio.clear} className="link-line">Start from blank</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
