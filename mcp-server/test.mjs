// Test del MCP server por stdio: initialize → tools/list → tools/call.
import { spawn } from 'node:child_process';

const child = spawn('node', ['server.mjs'], { cwd: import.meta.dirname, stdio: ['pipe', 'pipe', 'inherit'] });
let buf = '';
const pending = [];
child.stdout.on('data', (d) => {
  buf += d.toString();
  let idx;
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    try {
      pending.push(JSON.parse(line));
    } catch {}
  }
});

const send = (msg) => child.stdin.write(JSON.stringify(msg) + '\n');
const wait = (ms = 3000) =>
  new Promise((resolve, reject) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (pending.length) {
        clearInterval(iv);
        resolve(pending.shift());
      } else if (Date.now() - t0 > ms) {
        clearInterval(iv);
        reject(new Error('timeout esperando respuesta MCP'));
      }
    }, 50);
  });

send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1' } } });
const init = await wait();
console.log('initialize:', init.result?.serverInfo?.name, init.result?.serverInfo?.version);
send({ jsonrpc: '2.0', method: 'notifications/initialized' });

send({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
const list = await wait();
console.log('tools:', list.result?.tools?.map((t) => t.name).join(', '));

send({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'buscar_negocios', arguments: { consulta: 'plomero' } } });
const call1 = await wait();
const r1 = JSON.parse(call1.result.content[0].text);
console.log('buscar plomero →', r1.length, 'resultado(s):', r1.map((b) => b.slug).join(', '));

send({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'ver_planes', arguments: {} } });
const call2 = await wait();
const r2 = JSON.parse(call2.result.content[0].text);
console.log('planes →', r2.map((p) => `${p.slug}`).join(', '));

send({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'ver_negocio', arguments: { slug: 'no-existe' } } });
const call3 = await wait();
console.log('slug inexistente isError:', call3.result.isError === true);

child.kill();
console.log('MCP OK');
