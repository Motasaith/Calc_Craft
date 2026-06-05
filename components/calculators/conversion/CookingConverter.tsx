'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertCooking } from '@/lib/calc-engine'

const units = ['tsp', 'tbsp', 'fl oz', 'cup', 'pint', 'quart', 'gallon', 'ml', 'l', 'g', 'oz', 'lb']
const unitLabels: Record<string, string> = {
  tsp: 'tsp (Teaspoon)', tbsp: 'tbsp (Tablespoon)', 'fl oz': 'fl oz (Fluid Ounce)', cup: 'cup',
  pint: 'pint', quart: 'quart', gallon: 'gallon', ml: 'ml (Milliliter)', l: 'L (Liter)',
  g: 'g (Gram)', oz: 'oz (Ounce)', lb: 'lb (Pound)',
}

const ingredients = ['water', 'milk', 'olive oil', 'vegetable oil', 'flour', 'sugar', 'brown sugar', 'powdered sugar', 'butter', 'salt', 'honey', 'maple syrup']

export default function CookingConverter() {
  const [value, setValue] = useState('1'); const [from, setFrom] = useState('cup'); const [to, setTo] = useState('ml')
  const [ingredient, setIngredient] = useState('water')
  const v = parseFloat(value)
  const valid = !isNaN(v)
  const result = valid ? convertCooking(v, from, to, ingredient) : 0
  const options = units.map((u) => ({ value: u, label: unitLabels[u] || u }))

  return (
    <FormCalculatorShell title="Cooking Converter" badge="CONVERSION">
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="cook-val" />
      <RetroSelect label="Ingredient" value={ingredient} onChange={setIngredient} id="cook-ingr"
        options={ingredients.map((i) => ({ value: i, label: i.charAt(0).toUpperCase() + i.slice(1) }))} />
      <div className="grid grid-cols-2 gap-3">
        <RetroSelect label="From" value={from} onChange={setFrom} options={options} id="cook-from" />
        <RetroSelect label="To" value={to} onChange={setTo} options={options} id="cook-to" />
      </div>
      {valid && <div className="mt-4"><ResultDisplay label={`${value} ${from} =`} value={`${result} ${to}`} large /></div>}
    </FormCalculatorShell>
  )
}
