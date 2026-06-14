'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function TileCalculator() {
  const [areaLength, setAreaLength] = useState('5')
  const [areaWidth, setAreaWidth] = useState('4')
  const [tileLength, setTileLength] = useState('0.6')
  const [tileWidth, setTileWidth] = useState('0.6')
  const [waste, setWaste] = useState('10')
  const [result, setResult] = useState<{area:number,tiles:number,boxes:number}|null>(null)

  const calculate = () => {
    const al = parseFloat(areaLength), aw = parseFloat(areaWidth)
    const tl = parseFloat(tileLength), tw = parseFloat(tileWidth)
    const w = parseFloat(waste)
    if (isNaN(al)||isNaN(aw)||isNaN(tl)||isNaN(tw) || tl<=0||tw<=0) { setResult(null); return }
    const area = al * aw
    const tileArea = tl * tw
    const tiles = Math.ceil((area / tileArea) * (1 + w / 100))
    setResult({ area, tiles, boxes: Math.ceil(tiles / 10) })
  }

  return (
    <FormCalculatorShell title="Tile Calculator" badge="CONSTRUCTION">
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Room Area</div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={areaLength} onChange={setAreaLength} placeholder="5" id="tile-al" /><RetroInput label="Width (m)" value={areaWidth} onChange={setAreaWidth} placeholder="4" id="tile-aw" /></div>
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2 mt-3">Tile Size</div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Length (m)" value={tileLength} onChange={setTileLength} placeholder="0.6" id="tile-tl" /><RetroInput label="Width (m)" value={tileWidth} onChange={setTileWidth} placeholder="0.6" id="tile-tw" /></div>
      <RetroInput label="Waste %" value={waste} onChange={setWaste} placeholder="10" id="tile-w" unit="%" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Area" value={`${result.area.toFixed(2)} m²`} />
          <ResultDisplay label="Tiles Needed" value={result.tiles} large />
          <ResultDisplay label="Boxes (10/pack)" value={result.boxes} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
