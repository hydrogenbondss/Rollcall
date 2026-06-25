import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'

export default function Home() {
  return (
    <div style={{ padding: '40px', color: 'white', background: '#111' }}>
      <h1 style={{ fontSize: '48px' }}>TEST - Site is working</h1>
      <p>If you can see this text, the React app is loading correctly.</p>
    </div>
  )
}
