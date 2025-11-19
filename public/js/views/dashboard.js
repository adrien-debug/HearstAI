// Dashboard View Template - HEARST STYLE
// Basé sur le design de la capture d'écran
import { Icons } from '../icons.js';

export function renderDashboard(data) {
    return `
        <div class="dashboard-view">
            <div class="dashboard-content">
                <!-- Section Wallet -->
                <div class="wallet-section">
                    <!-- BTC Wallet Card -->
                    <div class="wallet-card">
                        <div class="wallet-card-header">
                            <h3 class="wallet-card-title">BTC Wallet</h3>
                        </div>
                        <div class="wallet-card-body">
                            <div class="wallet-balance">
                                <div class="wallet-balance-btc">0.031819 BTC</div>
                                <div class="wallet-balance-usd">$3,628.13 USD</div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Charts Container (2 colonnes) -->
                    <div class="wallet-charts-container">
                        <!-- Graphique Performance Overview existant -->
                        <div class="wallet-chart-section">
                            <div class="chart-header">
                                <h2 class="chart-title">Performance Overview</h2>
                                <div class="chart-legend">
                                    <div class="legend-item">
                                        <span class="legend-dot green"></span>
                                        <span>BTC Wallet</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-dot gray"></span>
                                        <span>Transactions</span>
                                    </div>
                                </div>
                            </div>
                            <div class="chart-container">
                                <canvas id="walletPerformanceChart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Nouveau graphique Bar Chart -->
                        <div class="wallet-chart-section">
                            <div class="chart-header">
                                <h2 class="chart-title">Performance Bar Chart</h2>
                                <div class="chart-legend">
                                    <div class="legend-item">
                                        <span class="legend-dot green"></span>
                                        <span>BTC Wallet</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-dot gray"></span>
                                        <span>Transactions</span>
                                    </div>
                                </div>
                            </div>
                            <div class="chart-container">
                                <canvas id="walletBarChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Wallet Incoming Transactions -->
                    <div class="transactions-section">
                        <div class="section-header-home">
                            <h3 class="section-title-home">Wallet incoming transactions</h3>
                        </div>
                        <div class="table-container">
                            <table class="table table-unified-grid">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>BTC Transaction</th>
                                        <th>Wallet adresse</th>
                                        <th>Trx Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2025-01-18</td>
                                        <td class="transaction-amount">0.006234 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>a1b2c3d4e5f6...</td>
                                    </tr>
                                    <tr>
                                        <td>2025-01-17</td>
                                        <td class="transaction-amount">0.005891 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>f6e5d4c3b2a1...</td>
                                    </tr>
                                    <tr>
                                        <td>2025-01-16</td>
                                        <td class="transaction-amount">0.005432 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>9z8y7x6w5v4u...</td>
                                    </tr>
                                    <tr class="row-hidden" data-table="wallet">
                                        <td>2025-01-15</td>
                                        <td class="transaction-amount">0.004876 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>3t4u5v6w7x8y...</td>
                                    </tr>
                                    <tr class="row-hidden" data-table="wallet">
                                        <td>2025-01-14</td>
                                        <td class="transaction-amount">0.004521 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>7m8n9o0p1q2r...</td>
                                    </tr>
                                    <tr class="row-hidden" data-table="wallet">
                                        <td>2025-01-13</td>
                                        <td class="transaction-amount">0.004198 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>5k6l7m8n9o0p...</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="see-more-container">
                                <button class="btn-see-more" data-table="wallet">
                                    <span class="see-more-text">See more</span>
                                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Transaction History -->
                <div class="transaction-history-section">
                    <div class="transaction-history-header">
                        <h2 class="transaction-history-title">Transaction history</h2>
                        <div class="transaction-history-controls">
                            <select class="date-range-select" id="date-range-select">
                                <option value="January 1, 2025 - January 31, 2025">January 1, 2025 - January 31, 2025</option>
                                <option value="December 1, 2024 - December 31, 2024">December 1, 2024 - December 31, 2024</option>
                                <option value="November 1, 2024 - November 30, 2024">November 1, 2024 - November 30, 2024</option>
                            </select>
                            <select class="contract-select" id="contract-select">
                                <option value="Contracts AL01">Contracts AL01</option>
                                <option value="Contracts AL02">Contracts AL02</option>
                                <option value="Contracts AL03">Contracts AL03</option>
                            </select>
                            <button class="btn btn-primary btn-export-excel" id="btn-export-excel">
                                Export to excel
                            </button>
                        </div>
                    </div>

                    <!-- Transaction History Table -->
                    <div class="table-container transaction-history-table-container">
                        <table class="table transaction-history-table table-unified-grid">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Account</th>
                                    <th>Total Reward</th>
                                    <th>Hashrate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2025-01-18</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.084521 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr>
                                    <td>2025-01-17</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.083247 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr>
                                    <td>2025-01-16</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.082156 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr class="row-hidden" data-table="transaction-history">
                                    <td>2025-01-15</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.081892 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr class="row-hidden" data-table="transaction-history">
                                    <td>2025-01-14</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.080654 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr class="row-hidden" data-table="transaction-history">
                                    <td>2025-01-13</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.079432 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="see-more-container">
                            <button class="btn-see-more" data-table="transaction-history">
                                <span class="see-more-text">See more</span>
                                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Total Row -->
                    <div class="transaction-history-total">
                        <strong>Total: <span class="total-amount">0.491902 BTC</span></strong>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add custom styles for dashboard - HEARST THEME
const dashboardStyles = `
<style>
.dashboard-view {
    padding: 0;
    padding-top: 14px;
    width: 100%;
    margin: 0;
}

.dashboard-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
}

/* Section Headers */
.section-header-home {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-4);
}

.page-title-home {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 var(--space-2) 0;
    line-height: 1.3;
}

.page-subtitle {
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin: 0;
}

.section-title-home {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
    line-height: var(--leading-normal);
}

/* Wallet Section */
.wallet-section {
    margin-bottom: var(--space-8);
}

.wallet-section .section-header-home {
    padding-left: 0;
}

.transactions-section .section-header-home {
    padding-left: 0;
}

.section-title-home {
    padding-left: var(--space-4);
}

.wallet-card {
    background: rgba(26, 26, 26, 0.7) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: var(--border-thin) solid rgba(255, 255, 255, 0.05) !important;
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    margin-bottom: var(--space-6);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    transition: all var(--duration-normal) var(--ease-in-out);
    position: relative;
    overflow: hidden;
}

.wallet-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at top right,
        rgba(197, 255, 167, 0.05) 0%,
        transparent 50%
    );
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
}

.wallet-card > * {
    position: relative;
    z-index: 1;
}

.wallet-card:hover {
    box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.5),
        0 4px 16px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(197, 255, 167, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
    transform: translateY(-4px) !important;
}

.wallet-card-header {
    margin-bottom: var(--space-3);
}

.wallet-card-title {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
}

.wallet-card-body {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.wallet-balance {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.wallet-balance-btc {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: #C5FFA7;
    letter-spacing: -0.02em;
    line-height: var(--leading-tight);
    text-shadow: 0 0 20px rgba(197, 255, 167, 0.3);
}

.wallet-balance-usd {
    font-size: var(--text-lg);
    font-weight: var(--font-medium);
    color: var(--text-secondary);
}

.wallet-address {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: rgba(10, 10, 10, 0.6);
    border: var(--border-thin) solid var(--border-color);
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    backdrop-filter: blur(10px);
    transition: all var(--duration-fast) var(--ease-in-out);
}

.wallet-address:hover {
    border-color: rgba(197, 255, 167, 0.3);
    background: rgba(10, 10, 10, 0.8);
}

.wallet-address-text {
    flex: 1;
    word-break: break-all;
}

.wallet-address-copy {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--space-1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast) var(--ease-in-out);
}

.wallet-address-copy:hover {
    background: rgba(197, 255, 167, 0.1);
    color: #C5FFA7;
    box-shadow: 0 0 12px rgba(197, 255, 167, 0.2);
}

.wallet-address-copy svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
}

/* Wallet Chart Section */
.wallet-chart-section {
    width: 836px;
    min-height: 201px;
    flex: none;
    order: 2;
    align-self: stretch;
    flex-grow: 0;
    z-index: 2;
    margin-bottom: var(--space-6);
    background: rgba(26, 26, 26, 0.7) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: var(--border-thin) solid rgba(255, 255, 255, 0.05) !important;
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    transition: all var(--duration-normal) var(--ease-in-out);
    position: relative;
    overflow: hidden;
}

.wallet-chart-section::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at top right,
        rgba(197, 255, 167, 0.05) 0%,
        transparent 50%
    );
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
}

.wallet-chart-section > * {
    position: relative;
    z-index: 1;
}

.wallet-chart-section:hover {
    box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.5),
        0 4px 16px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(197, 255, 167, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
    gap: var(--space-3);
}

.chart-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
    line-height: var(--leading-normal);
}

.chart-legend {
    display: flex;
    gap: var(--space-4);
    align-items: center;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--text-secondary);
}

.legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.legend-dot.green {
    background-color: #C5FFA7;
    box-shadow: 0 0 8px rgba(197, 255, 167, 0.5);
}

.legend-dot.gray {
    background-color: #888888;
}

.wallet-chart-section .chart-container {
    position: relative;
    width: 100%;
    height: 201px;
    min-height: 201px;
}

/* Container pour les deux graphiques côte à côte */
.wallet-charts-container {
    display: flex;
    gap: var(--space-6);
    width: 100%;
    margin-bottom: var(--space-6);
}

.wallet-charts-container .wallet-chart-section {
    flex: 1;
    width: 50%;
    min-width: 0; /* Permet au flex de fonctionner correctement */
}

/* Responsive : passer en colonne sur petits écrans */
@media (max-width: 1024px) {
    .wallet-charts-container {
        flex-direction: column;
    }
    
    .wallet-charts-container .wallet-chart-section {
        width: 100%;
    }
}

/* Transactions Section */
.transactions-section {
    margin-top: var(--space-6);
}

.transactions-section .table-container {
    background: rgba(26, 26, 26, 0.7) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: var(--border-thin) solid rgba(255, 255, 255, 0.05) !important;
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    transition: all var(--duration-normal) var(--ease-in-out);
}

.transactions-section .table-container:hover {
    box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.5),
        0 4px 16px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(197, 255, 167, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.transactions-section .table thead tr {
    background: linear-gradient(180deg, #454646 0%, #3a3a3a 100%) !important;
    border-bottom: var(--border-medium) solid rgba(197, 255, 167, 0.3) !important;
}

.transactions-section .table thead th {
    padding: var(--space-3) var(--space-4);
    text-align: left;
    font-size: var(--text-xs);
    font-weight: var(--font-normal);
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: none;
}

.transactions-section .table tbody tr {
    transition: all var(--duration-fast) var(--ease-in-out);
}

.transactions-section .table tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.02) !important;
}

.transactions-section .table tbody tr:hover {
    background: linear-gradient(
        90deg,
        rgba(197, 255, 167, 0.05) 0%,
        rgba(197, 255, 167, 0.1) 50%,
        rgba(197, 255, 167, 0.05) 100%
    ) !important;
    box-shadow: inset 2px 0 0 #C5FFA7 !important;
    transform: translateX(2px) !important;
}

.transactions-section .table tbody td {
    padding: var(--space-4);
    font-size: var(--text-base);
    color: var(--text-secondary);
    border-bottom: var(--border-thin) solid var(--border-color);
}



.transaction-amount {
    color: #C5FFA7;
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    text-shadow: 0 0 10px rgba(197, 255, 167, 0.2);
}

/* Hidden rows by default */
.row-hidden {
    display: none;
}

.row-hidden.visible {
    display: table-row;
}

/* See More Button - Minimalist */
.see-more-container {
    padding: var(--space-2) var(--space-3);
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.03);
    background: transparent;
    position: relative;
}

.see-more-container::before {
    display: none;
}

.btn-see-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 8px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 11px;
    font-weight: var(--font-normal);
    font-family: var(--font-primary);
    cursor: pointer;
    transition: all 0.15s ease;
    border-radius: var(--radius-sm);
    letter-spacing: 0.1px;
    opacity: 0.7;
}

.btn-see-more:hover {
    color: #C5FFA7;
    opacity: 1;
    background: rgba(197, 255, 167, 0.03);
}

.btn-see-more:active {
    transform: translateY(0.5px);
}

.btn-see-more svg {
    width: 10px;
    height: 10px;
    stroke: currentColor;
    transition: transform 0.15s ease;
    opacity: 0.8;
}

.btn-see-more.expanded svg {
    transform: rotate(180deg);
}

.see-more-text {
    color: inherit;
}

/* Transaction History Section */
.transaction-history-section {
    margin-top: calc(var(--space-6) - 70px);
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
}

.transaction-history-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 24px !important;
    gap: 24px !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
}

.transaction-history-title {
    font-size: var(--text-xl) !important;
    font-weight: var(--font-semibold) !important;
    color: var(--text-primary) !important;
    margin: 0 !important;
    white-space: nowrap !important;
    flex: 0 0 auto !important;
    padding: 0 !important;
    padding-left: var(--space-4) !important;
    flex-shrink: 0 !important;
    letter-spacing: -0.02em !important;
}

.transaction-history-header {
    padding-left: 0 !important;
}

.transaction-history-controls {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: var(--space-3) !important;
    flex-wrap: nowrap !important;
    margin-left: auto !important;
    flex-shrink: 1 !important;
    min-width: 0 !important;
    max-width: 100% !important;
    justify-content: flex-end !important;
}

/* Assurer que les styles des selects sont appliqués */
.transaction-history-controls .date-range-select,
.transaction-history-controls .contract-select {
    min-width: 180px !important;
    max-width: 220px !important;
    width: auto !important;
    padding: var(--space-3) var(--space-4) !important;
    background: rgba(10, 10, 10, 0.6) !important;
    border: var(--border-thin) solid var(--border-color) !important;
    border-radius: var(--radius-md) !important;
    color: var(--text-primary) !important;
    font-size: var(--text-sm) !important;
    font-family: var(--font-primary) !important;
    cursor: pointer !important;
    transition: all var(--duration-fast) var(--ease-in-out) !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23cccccc' d='M6 9L1 4h10z'/%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right var(--space-4) center !important;
    padding-right: 40px !important;
    flex-shrink: 1 !important;
    box-sizing: border-box !important;
    backdrop-filter: blur(10px) !important;
}

.transaction-history-controls .date-range-select {
    min-width: 200px !important;
    max-width: 240px !important;
}

.transaction-history-controls .contract-select {
    min-width: 160px !important;
    max-width: 200px !important;
}

.transaction-history-controls .date-range-select:hover,
.transaction-history-controls .contract-select:hover {
    border-color: rgba(197, 255, 167, 0.3) !important;
    background: rgba(10, 10, 10, 0.8) !important;
}

.transaction-history-controls .date-range-select:focus,
.transaction-history-controls .contract-select:focus {
    outline: none !important;
    border-color: #C5FFA7 !important;
    box-shadow: 0 0 0 3px rgba(197, 255, 167, 0.1) !important;
}

.date-range-select,
.contract-select {
    padding: 10px 14px;
    background: var(--primary-grey);
    border: 1px solid var(--grey-100);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 14px;
    font-family: var(--font-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-in-out);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23cccccc' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;
    min-width: 200px;
}

.date-range-select {
    min-width: 280px;
}

.date-range-select:hover,
.contract-select:hover {
    border-color: #C5FFA7;
    background: rgba(197, 255, 167, 0.05);
}

.date-range-select:focus,
.contract-select:focus {
    outline: none;
    border-color: #C5FFA7;
    box-shadow: 0 0 0 1px rgba(197, 255, 167, 0.2);
}

.date-range-select option,
.contract-select option {
    background: var(--primary-grey);
    color: var(--text-primary);
    padding: 8px;
}

.btn-export-excel {
    white-space: nowrap !important;
    padding: var(--space-3) var(--space-6) !important;
    font-size: var(--text-sm) !important;
    font-weight: var(--font-semibold) !important;
    border-radius: var(--radius-full) !important;
    background: #C5FFA7 !important;
    color: #000000 !important;
    border: none !important;
    transition: all var(--transition-normal) !important;
    cursor: pointer !important;
    flex-shrink: 0 !important;
    box-sizing: border-box !important;
    letter-spacing: -0.01em !important;
    box-shadow: 
        0 4px 16px rgba(197, 255, 167, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

.btn-export-excel:hover:not(:disabled) {
    background: #B0FF8F !important;
    box-shadow: 
        0 6px 24px rgba(197, 255, 167, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
    transform: translateY(-1px) scale(1.02) !important;
}

.btn-export-excel:active:not(:disabled) {
    transform: translateY(0) scale(1) !important;
}

/* Transaction History Table */
.transaction-history-table-container {
    background: rgba(26, 26, 26, 0.7) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: var(--border-thin) solid rgba(255, 255, 255, 0.05) !important;
    border-radius: var(--radius-xl);
    overflow: hidden;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    transition: all var(--duration-normal) var(--ease-in-out);
}

.transaction-history-table-container:hover {
    box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.5),
        0 4px 16px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(197, 255, 167, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.transaction-history-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
}

.transaction-history-table thead tr {
    background: linear-gradient(180deg, #454646 0%, #3a3a3a 100%) !important;
    border-bottom: var(--border-medium) solid rgba(197, 255, 167, 0.3) !important;
}

.transaction-history-table thead th {
    padding: var(--space-3) var(--space-4);
    text-align: left;
    font-size: var(--text-xs);
    font-weight: var(--font-normal);
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: none;
}

.transaction-history-table tbody tr {
    transition: all var(--duration-fast) var(--ease-in-out);
}

.transaction-history-table tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.02) !important;
}

.transaction-history-table tbody tr:hover {
    background: linear-gradient(
        90deg,
        rgba(197, 255, 167, 0.05) 0%,
        rgba(197, 255, 167, 0.1) 50%,
        rgba(197, 255, 167, 0.05) 100%
    ) !important;
    box-shadow: inset 2px 0 0 #C5FFA7 !important;
    transform: translateX(2px) !important;
}

.transaction-history-table tbody td {
    padding: var(--space-4);
    font-size: var(--text-base);
    color: var(--text-secondary);
    border-bottom: var(--border-thin) solid var(--border-color);
}

.transaction-amount,
.transaction-reward {
    color: #C5FFA7;
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    text-shadow: 0 0 10px rgba(197, 255, 167, 0.2);
}

.transaction-history-total {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-4);
    padding-right: var(--space-4);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    letter-spacing: -0.01em;
}

.transaction-history-total .total-amount {
    color: #C5FFA7;
    margin-left: var(--space-2);
    text-shadow: 0 0 10px rgba(197, 255, 167, 0.2);
}

/* Button Transaction History - Premium Style */
.btn.btn-transaction-history,
button.btn-transaction-history {
    background-color: #C5FFA7 !important;
    color: #000 !important;
    border-radius: 30px !important;
    font-weight: 600 !important;
    padding: 10px 24px !important;
    transition: all 0.25s ease-in-out !important;
    border: none !important;
}

.btn.btn-transaction-history:hover,
button.btn-transaction-history:hover,
.btn.btn-transaction-history:active,
button.btn-transaction-history:active {
    background-color: #B0FF8F !important;
    box-shadow: 0 0 12px rgba(197, 255, 167, 0.55) !important;
    transform: translateY(-1px) !important;
    color: #000 !important;
}

/* Responsive */
@media (max-width: 1024px) {
    .dashboard-view {
        padding: 0;
    }
    
    .section-header-home {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .transaction-history-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
    }
    
    .transaction-history-controls {
        width: 100%;
    }
    
    .date-range-select,
    .contract-select {
        flex: 1;
        min-width: 200px;
    }
}

@media (max-width: 768px) {
    .wallet-balance-btc {
        font-size: var(--text-3xl);
    }
    
    .transaction-history-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .transaction-history-controls {
        flex-direction: column;
        width: 100%;
    }
    
    .date-range-select,
    .contract-select {
        width: 100%;
        min-width: unset;
    }
    
    .transaction-history-table {
        font-size: 12px;
    }
    
    .transaction-history-table thead th,
    .transaction-history-table tbody td {
        padding: 8px 12px;
    }
}
</style>
`;

// Fonction pour copier l'adresse du wallet
window.copyWalletAddress = function() {
    const address = '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck';
    navigator.clipboard.writeText(address).then(() => {
        // Optionnel: afficher une notification
        console.log('Address copied to clipboard');
    });
};

// Initialize See More buttons
function initSeeMoreButtons() {
    const seeMoreButtons = document.querySelectorAll('.btn-see-more');
    
    seeMoreButtons.forEach(button => {
        if (button.dataset.initialized) return;
        button.dataset.initialized = 'true';
        
        button.addEventListener('click', function() {
            const tableId = this.getAttribute('data-table');
            const hiddenRows = document.querySelectorAll(`.row-hidden[data-table="${tableId}"]`);
            const isExpanded = this.classList.contains('expanded');
            
            hiddenRows.forEach(row => {
                if (isExpanded) {
                    row.classList.remove('visible');
                } else {
                    row.classList.add('visible');
                }
            });
            
            if (isExpanded) {
                this.classList.remove('expanded');
                this.querySelector('.see-more-text').textContent = 'See more';
            } else {
                this.classList.add('expanded');
                this.querySelector('.see-more-text').textContent = 'See less';
            }
        });
    });
}

// Initialize Wallet Performance Chart
function initWalletPerformanceChart() {
    try {
        const ctx = document.getElementById('walletPerformanceChart');
        if (!ctx) {
            return;
        }

        // Verify it's a canvas element
        if (ctx.tagName !== 'CANVAS') {
            console.warn('walletPerformanceChart element is not a canvas');
            return;
        }

        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            setTimeout(initWalletPerformanceChart, 200);
            return;
        }

        // Create gradients
        const canvasContext = ctx.getContext('2d');
        if (!canvasContext) {
            console.warn('Could not get 2d context from canvas');
            return;
        }
        
        const btcGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
        btcGradient.addColorStop(0, 'rgba(197, 255, 167, 0.3)');
        btcGradient.addColorStop(0.5, 'rgba(197, 255, 167, 0.1)');
        btcGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

        const transactionGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
        transactionGradient.addColorStop(0, 'rgba(136, 136, 136, 0.25)');
        transactionGradient.addColorStop(0.5, 'rgba(136, 136, 136, 0.08)');
        transactionGradient.addColorStop(1, 'rgba(136, 136, 136, 0)');

        new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'BTC Wallet',
                    data: [0.025, 0.027, 0.029, 0.031, 0.030, 0.032, 0.031, 0.030, 0.032, 0.031, 0.031, 0.032],
                    borderColor: '#C5FFA7',
                    backgroundColor: btcGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#C5FFA7',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 3,
                    yAxisID: 'y'
                },
                {
                    label: 'Transactions',
                    data: [0.005, 0.0055, 0.0052, 0.0058, 0.0056, 0.0059, 0.0057, 0.0055, 0.0058, 0.0056, 0.0057, 0.0058],
                    borderColor: '#888888',
                    backgroundColor: transactionGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#888888',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { 
                intersect: false, 
                mode: 'index' 
            },
            plugins: {
                legend: { 
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    titleFont: { size: 13, family: 'Inter', weight: '700' },
                    bodyColor: '#E8E8E8',
                    bodyFont: { size: 12, family: 'Inter', weight: '500' },
                    borderColor: 'rgba(197, 255, 167, 0.3)',
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 8,
                    displayColors: true,
                    boxWidth: 12,
                    boxHeight: 12,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: { 
                        display: true,
                        color: 'rgba(255, 255, 255, 0.02)',
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#A3A3A3', 
                        font: { size: 11, family: 'Inter', weight: '500' },
                        padding: 10
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    grid: { 
                        color: 'rgba(255, 255, 255, 0.05)', 
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#CCCCCC', 
                        font: { size: 12, family: 'Inter', weight: '600' },
                        padding: 12,
                        callback: function(value) {
                            return value.toFixed(3) + ' BTC';
                        }
                    },
                    border: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    } catch (error) {
        console.warn('Error initializing Wallet Performance Chart:', error);
    }
}

function initWalletBarChart() {
    try {
        const ctx = document.getElementById('walletBarChart');
        if (!ctx) {
            return;
        }

        // Verify it's a canvas element
        if (ctx.tagName !== 'CANVAS') {
            console.warn('walletBarChart element is not a canvas');
            return;
        }

        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            setTimeout(initWalletBarChart, 200);
            return;
        }

        // Create gradients
        const canvasContext = ctx.getContext('2d');
        if (!canvasContext) {
            console.warn('Could not get 2d context from canvas');
            return;
        }

        const btcGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
        btcGradient.addColorStop(0, 'rgba(197, 255, 167, 0.8)');
        btcGradient.addColorStop(1, 'rgba(197, 255, 167, 0.3)');

        const transactionGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
    transactionGradient.addColorStop(0, 'rgba(136, 136, 136, 0.8)');
    transactionGradient.addColorStop(1, 'rgba(136, 136, 136, 0.3)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'BTC Wallet',
                    data: [0.025, 0.027, 0.029, 0.031, 0.030, 0.032, 0.031, 0.030, 0.032, 0.031, 0.031, 0.032],
                    backgroundColor: btcGradient,
                    borderColor: '#C5FFA7',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: 'Transactions',
                    data: [0.005, 0.0055, 0.0052, 0.0058, 0.0056, 0.0059, 0.0057, 0.0055, 0.0058, 0.0056, 0.0057, 0.0058],
                    backgroundColor: transactionGradient,
                    borderColor: '#888888',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { 
                intersect: false, 
                mode: 'index' 
            },
            plugins: {
                legend: { 
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    titleFont: { size: 13, family: 'Inter', weight: '700' },
                    bodyColor: '#E8E8E8',
                    bodyFont: { size: 12, family: 'Inter', weight: '500' },
                    borderColor: 'rgba(197, 255, 167, 0.3)',
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 8,
                    displayColors: true,
                    boxWidth: 12,
                    boxHeight: 12,
                    boxPadding: 6
                }
            },
            scales: {
                x: {
                    grid: { 
                        display: true,
                        color: 'rgba(255, 255, 255, 0.02)',
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#A3A3A3', 
                        font: { size: 11, family: 'Inter', weight: '500' },
                        padding: 10
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    grid: { 
                        color: 'rgba(255, 255, 255, 0.05)', 
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#CCCCCC', 
                        font: { size: 12, family: 'Inter', weight: '600' },
                        padding: 12,
                        callback: function(value) {
                            return value.toFixed(3) + ' BTC';
                        }
                    },
                    border: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    } catch (error) {
        console.warn('Error initializing Wallet Bar Chart:', error);
    }
}

// Auto-initialize when dashboard is rendered
if (typeof window !== 'undefined') {
    // Initialize immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initSeeMoreButtons();
            setTimeout(initWalletPerformanceChart, 200);
            setTimeout(initWalletBarChart, 200);
        });
    } else {
        // DOM already loaded, initialize after a short delay to ensure elements exist
        setTimeout(() => {
            initSeeMoreButtons();
            initWalletPerformanceChart();
            initWalletBarChart();
        }, 100);
    }
    
    // Also initialize when dashboard view is loaded
    window.initSeeMoreButtons = initSeeMoreButtons;
    window.initWalletPerformanceChart = initWalletPerformanceChart;
    window.initWalletBarChart = initWalletBarChart;
}

export const dashboardTemplate = renderDashboard;
export { dashboardStyles };
