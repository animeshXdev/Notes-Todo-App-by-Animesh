'use client'

import { ModeToggle } from "./ModeToggle"


export default function FloatingToggle() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ModeToggle/>
    </div>
  )
}
