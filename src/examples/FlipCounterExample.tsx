import React from 'react'
import FlipCounter from '@/components/FlipCounter'

const FlipCounterExample: React.FC = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2>FlipCounter Examples</h2>
          
          {/* Example 1: Auto-updating Engagement Counter */}
          <div className="mb-4">
            <h4>Auto-updating Engagement Counter</h4>
            <p>This counter will animate from previousValue to currentValue, then STOP and wait for new values from the API (polling every 10 seconds)</p>
            <FlipCounter
              value={0} // Initial value (will be overridden by API)
              label="Total Engagements"
              progressType="engagement"
              enableAutoUpdate={true}
              className="mb-3"
            />
          </div>

          {/* Example 2: Auto-updating Challenge Counter */}
          <div className="mb-4">
            <h4>Auto-updating Challenge Counter</h4>
            <p>This counter tracks challenger progress, stops animation when reaching target, and shows "Waiting for new value..." status</p>
            <FlipCounter
              value={0} // Initial value (will be overridden by API)
              label="Active Challenges"
              progressType="challenge"
              enableAutoUpdate={true}
              className="mb-3"
            />
          </div>

          {/* Example 3: Manual Counter (traditional behavior) */}
          <div className="mb-4">
            <h4>Manual Counter</h4>
            <p>This counter only updates when the value prop changes (no API polling)</p>
            <FlipCounter
              value={12345}
              label="Manual Counter"
              enableAutoUpdate={false}
              className="mb-3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlipCounterExample