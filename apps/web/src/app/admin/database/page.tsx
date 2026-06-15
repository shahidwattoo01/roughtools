'use client'

import { useEffect, useState, useCallback } from 'react'

type Tab = 'tables' | 'query' | 'redis'

interface DbOverview {
  dbSize: string
  connections: { numbackends: number; max_conn: number }
  tables: { name: string; rows: number; totalSize: string; indexSize: string; lastVacuum: string | null }[]
}

interface RedisInfo {
  connected: boolean
  usedMemory?: string; peakMemory?: string; totalKeys?: number
  prefixCounts?: Record<string, number>; error?: string
}

interface QueryResult {
  rows: Record<string, unknown>[]
  rowCount: number; executionMs: number; truncated?: boolean; message?: string
}

export default function AdminDatabasePage() {
  const [tab, setTab] = useState<Tab>('tables')
  const [db, setDb] = useState<DbOverview | null>(null)
  const [redis, setRedis] = useState<RedisInfo | null>(null)
  const [sql, setSql] = useState('SELECT relname AS table_name, n_live_tup AS row_count\nFROM pg_stat_user_tables\nORDER BY n_live_tup DESC\nLIMIT 20;')
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [running, setRunning] = useState(false)
  const [queryHistory, setQueryHistory] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/admin/database?action=overview').then(r => r.json()).then(setDb)
  }, [])

  useEffect(() => {
    if (tab === 'redis' && !redis) {
      fetch('/api/admin/database?action=redis').then(r => r.json()).then(setRedis)
    }
  }, [tab, redis])

  const runQuery = useCallback(async () => {
    if (!sql.trim()) return
    setRunning(true); setQueryResult(null)
    const res = await fetch('/api/admin/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    })
    const data = await res.json()
    setQueryResult(data)
    setRunning(false)
    if (res.ok) setQueryHistory(h => [sql, ...h.filter(q => q !== sql)].slice(0, 20))
  }, [sql])

  const cols = queryResult?.rows[0] ? Object.keys(queryResult.rows[0]) : []

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Database</h1>
        {db && (
          <div className="flex items-center gap-4 text-[12px] text-[#888]">
            <span>Size: <strong className="text-white">{db.dbSize}</strong></span>
            <span>Connections: <strong className={db.connections.numbackends / db.connections.max_conn > 0.8 ? 'text-[#f87171]' : 'text-white'}>{db.connections.numbackends}/{db.connections.max_conn}</strong></span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] border border-white/8 rounded-xl p-1 w-fit">
        {([['tables','Table Browser'],['query','Query Runner'],['redis','Redis']] as [Tab,string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-[12px] transition-colors ${tab === id ? 'bg-[#1a6b3c] text-white' : 'text-[#555] hover:text-[#aaa]'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table Browser */}
      {tab === 'tables' && (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/6 flex justify-between items-center">
            <span className="text-[13px] font-medium">Tables — {db?.tables?.length ?? 0} user tables</span>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/5">
                {['Table','Rows (est.)','Total Size','Index Size','Last Vacuum'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-[#444] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(db?.tables ?? []).map(t => (
                <tr key={t.name} className="border-b border-white/4 hover:bg-white/2 cursor-pointer"
                  onClick={() => { setSql(`SELECT * FROM "${t.name}" LIMIT 50;`); setTab('query') }}>
                  <td className="px-4 py-2.5 font-mono text-[#aaa]">{t.name}</td>
                  <td className="px-4 py-2.5 tabular-nums">{t.rows.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-[#888]">{t.totalSize}</td>
                  <td className="px-4 py-2.5 text-[#888]">{t.indexSize}</td>
                  <td className="px-4 py-2.5 text-[#555]">
                    {t.lastVacuum ? new Date(t.lastVacuum).toLocaleDateString('en-GB') : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Query Runner */}
      {tab === 'query' && (
        <div className="space-y-4">
          <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-xl px-4 py-2.5 text-[12px] text-[#fbbf24]">
            ⚠ Read-only mode — only SELECT and WITH queries are permitted. Destructive keywords are blocked.
          </div>

          <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
              <span className="text-[13px] font-medium">SQL Query</span>
              <div className="flex items-center gap-3">
                {queryResult && <span className="text-[11px] text-[#888]">{queryResult.rowCount} rows · {queryResult.executionMs}ms</span>}
                <button onClick={runQuery} disabled={running}
                  className="bg-[#1a6b3c] hover:bg-[#145230] disabled:opacity-50 text-white rounded-lg px-4 py-1.5 text-[12px] font-medium transition-colors">
                  {running ? 'Running…' : '▶ Run'}
                </button>
              </div>
            </div>
            <textarea
              value={sql} onChange={e => setSql(e.target.value)}
              onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') runQuery() }}
              rows={6}
              spellCheck={false}
              className="w-full bg-[#0f0f0f] px-4 py-3 text-[13px] font-mono text-[#e5e5e5] resize-none focus:outline-none leading-[1.7]"
              placeholder="SELECT ..."
            />
            <div className="px-4 py-2 border-t border-white/5 text-[10px] text-[#444]">Ctrl+Enter to run</div>
          </div>

          {/* Query history */}
          {queryHistory.length > 0 && (
            <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-white/5 text-[11px] text-[#555]">Recent queries</div>
              {queryHistory.slice(0, 5).map((q, i) => (
                <button key={i} onClick={() => setSql(q)}
                  className="w-full text-left px-4 py-2 text-[11px] font-mono text-[#888] hover:text-[#aaa] hover:bg-white/2 truncate block border-b border-white/4 last:border-0">
                  {q.replace(/\n/g, ' ').slice(0, 80)}…
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {queryResult && (
            <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
              {queryResult.message ? (
                <div className="px-4 py-3 text-[#f87171] text-[12px] font-mono">{queryResult.message}</div>
              ) : (
                <>
                  <div className="px-4 py-2 border-b border-white/5 text-[11px] text-[#555] flex justify-between">
                    <span>{queryResult.rowCount} rows returned{queryResult.truncated ? ' (truncated at 500)' : ''}</span>
                    <span>{queryResult.executionMs}ms</span>
                  </div>
                  <div className="overflow-auto max-h-[360px]">
                    <table className="text-[11px] w-full">
                      <thead className="sticky top-0 bg-[#1a1a1a]">
                        <tr className="border-b border-white/5">
                          {cols.map(c => <th key={c} className="text-left px-3 py-2 text-[10px] uppercase text-[#444] whitespace-nowrap font-medium">{c}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.rows.map((row, i) => (
                          <tr key={i} className="border-b border-white/4 hover:bg-white/2">
                            {cols.map(c => (
                              <td key={c} className="px-3 py-1.5 font-mono text-[#ccc] whitespace-nowrap max-w-[200px] truncate">
                                {row[c] === null ? <span className="text-[#444]">NULL</span>
                                  : typeof row[c] === 'object' ? JSON.stringify(row[c]).slice(0, 80)
                                  : String(row[c])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Redis */}
      {tab === 'redis' && (
        <div className="space-y-4">
          {!redis ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-[#1a6b3c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !redis.connected ? (
            <div className="bg-[#f87171]/10 border border-[#f87171]/20 rounded-xl p-5 text-[13px] text-[#f87171]">
              ✗ Redis not reachable — {redis.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Used Memory',  value: redis.usedMemory ?? '—' },
                  { label: 'Peak Memory',  value: redis.peakMemory ?? '—' },
                  { label: 'Total Keys',   value: (redis.totalKeys ?? 0).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4 text-center">
                    <div className="text-xl font-semibold">{value}</div>
                    <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/6 text-[13px] font-medium">Key Prefixes</div>
                {Object.entries(redis.prefixCounts ?? {}).map(([prefix, count], i, arr) => (
                  <div key={prefix} className={`flex items-center justify-between px-4 py-2.5 ${i < arr.length - 1 ? 'border-b border-white/4' : ''}`}>
                    <code className="text-[12px] font-mono text-[#aaa]">{prefix}*</code>
                    <span className="text-[12px] tabular-nums">{count} keys</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
                <div className="text-[12px] font-medium mb-3">Cache Management</div>
                <div className="flex flex-wrap gap-2">
                  {['iq:qbank','iq:norms','iq:percentiles','tool:','cache:'].map(prefix => (
                    <button key={prefix}
                      onClick={async () => {
                        if (!confirm(`Flush all keys matching ${prefix}*?`)) return
                        // TODO: POST /api/admin/database/flush with prefix
                        alert('Flush endpoint not yet wired — add /api/admin/database/flush route')
                      }}
                      className="text-[11px] border border-[#f87171]/20 hover:border-[#f87171] text-[#f87171]/60 hover:text-[#f87171] rounded-lg px-3 py-1.5 transition-colors">
                      Flush {prefix}*
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
