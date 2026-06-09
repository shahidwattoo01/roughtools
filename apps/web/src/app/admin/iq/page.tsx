'use client'

import { useState } from 'react'
import { QuestionBankManager } from './_components/QuestionBankManager'
import { SessionInspector } from './_components/SessionInspector'
import { NormingDashboard } from './_components/NormingDashboard'

type Tab = 'questions' | 'sessions' | 'norming'

const TABS: { id: Tab; label: string; desc: string }[] = [
  { id: 'questions', label: 'Question Bank',     desc: 'Browse, filter, and bulk-manage scored and pilot questions' },
  { id: 'sessions',  label: 'Session Inspector', desc: 'Search completed sessions, view scores and validity flags' },
  { id: 'norming',   label: 'Norming',           desc: 'Population statistics, snapshot history, manual recalculation' },
]

export default function AdminIqPage() {
  const [activeTab, setActiveTab] = useState<Tab>('questions')

  return (
    <div className="bg-[#f5f5f3] dark:bg-[#121212] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[12px] text-[#555] dark:text-[#aaa] mb-3">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#a21caf] dark:text-[#e879f9] font-medium">IQ Test</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a] dark:text-[#f0f0f0]">IQ Test Administration</h1>
          <p className="text-[13px] text-[#555] dark:text-[#aaa] mt-1">
            Manage the question bank, inspect sessions, and monitor norming health.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-[#1e1e1e] rounded-xl border border-black/8 dark:border-white/8 p-1.5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors text-left',
                activeTab === tab.id
                  ? 'bg-[#a21caf] text-white shadow-sm'
                  : 'text-[#555] dark:text-[#aaa] hover:bg-black/5 dark:hover:bg-white/5',
              ].join(' ')}
            >
              <span className="block">{tab.label}</span>
              <span className={`text-[10px] font-normal block mt-0.5 ${activeTab === tab.id ? 'text-white/75' : 'text-[#aaa] dark:text-[#666]'}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'questions' && <QuestionBankManager />}
          {activeTab === 'sessions'  && <SessionInspector />}
          {activeTab === 'norming'   && <NormingDashboard />}
        </div>

      </div>
    </div>
  )
}
