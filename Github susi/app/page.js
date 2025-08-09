'use client';
import { useState } from 'react';

export default function HomePage() {
  const [log, setLog] = useState('Waiting...');

  async function sendCommand(command) {
    setLog(`Sending: ${command}...`);
    try {
      const res = await fetch(`/api/handy?mode=${command}`);
      const data = await res.json();
      setLog(JSON.stringify(data, null, 2));
    } catch (err) {
      setLog('Error: ' + err.message);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>Mistress Susi — TeaseMachine.ai</h1>
      <h3>Prototype: handy control & session buttons</h3>
      <div style={{ margin: '2rem 0' }}>
        <button style={{ background: 'blue', color: 'white', padding: '1rem', marginRight: '1rem' }} onClick={() => sendCommand('edge')}>Edge me</button>
        <button style={{ background: 'red', color: 'white', padding: '1rem', marginRight: '1rem' }} onClick={() => sendCommand('deny')}>Deny me</button>
        <button style={{ background: 'green', color: 'white', padding: '1rem' }} onClick={() => sendCommand('come')}>Let me come</button>
      </div>
      <pre style={{ background: '#222', padding: '1rem' }}>{log}</pre>
    </main>
  );
}
