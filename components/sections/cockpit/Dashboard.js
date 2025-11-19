import { useState, useEffect } from 'react';
import { useStats } from '../../../hooks/useAPI';

export default function CockpitDashboard() {
  const [kpiData, setKpiData] = useState({
    globalHashrate: '0',
    theoreticalHashrate: '0',
    performance: '0',
    btcProduction: '0',
    btcProductionUSD: '$0',
    btcChange: '+0%',
    totalMiners: '0',
    hostingProviders: '0',
    onlineMiners: '0',
    onlinePercentage: '0%',
    degradedMiners: '0',
    degradedPercentage: '0%',
    offlineMiners: '0',
    offlinePercentage: '0%'
  });

  const [accounts, setAccounts] = useState([]);
  const { data: statsData, loading, error } = useStats();

  useEffect(() => {
    if (statsData) {
      setKpiData({
        globalHashrate: statsData.globalHashrate || '0',
        theoreticalHashrate: statsData.theoreticalHashrate || '0',
        performance: statsData.performance || '0',
        btcProduction: statsData.btcProduction || '0',
        btcProductionUSD: statsData.btcProductionUSD || '$0',
        btcChange: statsData.btcChange || '+0%',
        totalMiners: statsData.totalMiners || '0',
        hostingProviders: statsData.hostingProviders || '0',
        onlineMiners: statsData.onlineMiners || '0',
        onlinePercentage: statsData.onlinePercentage || '0%',
        degradedMiners: statsData.degradedMiners || '0',
        degradedPercentage: statsData.degradedPercentage || '0%',
        offlineMiners: statsData.offlineMiners || '0',
        offlinePercentage: statsData.offlinePercentage || '0%'
      });
    }
  }, [statsData]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="cockpit-kpi-grid">
        <div className="kpi-box">
          <div className="kpi-box-glow"></div>
          <div className="kpi-box-content">
            <div className="kpi-box-label">Global Hashrate</div>
            <div className="kpi-box-value">{kpiData.globalHashrate} PH/s</div>
            <div className="kpi-box-meta">
              <span className="kpi-box-meta-item">Theoretical: {kpiData.theoreticalHashrate} PH/s</span>
              <span className="kpi-box-meta-item positive">Performance: {kpiData.performance}%</span>
            </div>
          </div>
        </div>
        
        <div className="kpi-box">
          <div className="kpi-box-glow"></div>
          <div className="kpi-box-content">
            <div className="kpi-box-label">BTC Production (24h)</div>
            <div className="kpi-box-value">{kpiData.btcProduction}</div>
            <div className="kpi-box-meta">
              <span className="kpi-box-meta-item">≈ {kpiData.btcProductionUSD} USD</span>
              <span className="kpi-box-meta-item positive">{kpiData.btcChange} vs yesterday</span>
            </div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-box-glow"></div>
          <div className="kpi-box-content">
            <div className="kpi-box-label">Total Miners</div>
            <div className="kpi-box-value">{kpiData.totalMiners}</div>
            <div className="kpi-box-meta">
              <span className="kpi-box-meta-item">Fleet capacity</span>
              <span className="kpi-box-meta-item">Across {kpiData.hostingProviders} hosting providers</span>
            </div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-box-glow"></div>
          <div className="kpi-box-content">
            <div className="kpi-box-label">Online Miners</div>
            <div className="kpi-box-value">{kpiData.onlineMiners}</div>
            <div className="kpi-box-meta">
              <span className="kpi-box-meta-item positive">{kpiData.onlinePercentage} of fleet</span>
              <span className="kpi-box-meta-item">Optimal performance</span>
            </div>
          </div>
        </div>

        <div className="kpi-box kpi-box-orange">
          <div className="kpi-box-glow"></div>
          <div className="kpi-box-content">
            <div className="kpi-box-label">Degraded Miners</div>
            <div className="kpi-box-value">{kpiData.degradedMiners}</div>
            <div className="kpi-box-meta">
              <span className="kpi-box-meta-item positive">{kpiData.degradedPercentage} of fleet</span>
              <span className="kpi-box-meta-item">Requires attention</span>
            </div>
          </div>
        </div>

        <div className="kpi-box kpi-box-red">
          <div className="kpi-box-glow"></div>
          <div className="kpi-box-content">
            <div className="kpi-box-label">Offline Miners</div>
            <div className="kpi-box-value">{kpiData.offlineMiners}</div>
            <div className="kpi-box-meta">
              <span className="kpi-box-meta-item positive">{kpiData.offlinePercentage} of fleet</span>
              <span className="kpi-box-meta-item">Under maintenance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cockpit-section" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header-home">
          <h3 className="section-title-home">Mining Accounts Summary</h3>
        </div>
        <div className="table-container">
          <table className="table table-unified-grid">
            <thead>
              <tr>
                <th>Account</th>
                <th>Miner Type</th>
                <th>Real-time</th>
                <th>Last 24h</th>
                <th>Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                    No mining accounts available
                  </td>
                </tr>
              ) : (
                accounts.map((account, index) => (
                  <tr key={index}>
                    <td>{account.name}</td>
                    <td>{account.minerType}</td>
                    <td>{account.realtime}</td>
                    <td>{account.last24h}</td>
                    <td>{account.active}</td>
                    <td>
                      <span className={`status-badge ${account.status === 'online' ? 'green' : account.status === 'degraded' ? 'orange' : 'red'}`}>
                        {account.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


