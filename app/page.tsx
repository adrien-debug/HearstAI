'use client'

import HomeOverview from '@/components/home/HomeOverview'
import '@/components/home/Home.css'

export default function Home() {
  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <HomeOverview />
      </div>
    </div>
  )
}




