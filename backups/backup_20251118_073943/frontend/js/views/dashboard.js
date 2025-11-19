// Dashboard View Template - HEARST STYLE
// Basé sur le design de la capture d'écran
import { Icons } from '../icons.js';

export function renderDashboard(data) {
    return `
        <div class="dashboard-view">
            <div class="dashboard-content">
                <!-- Section Wallet -->
                <div class="wallet-section">
                    <div class="section-header-home">
                        <button class="btn btn-primary btn-transaction-history" id="btn-transaction-history">
                            Transaction history
                        </button>
                    </div>

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
                            <div class="wallet-address">
                                <span class="wallet-address-text">1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</span>
                                <button class="wallet-address-copy" onclick="copyWalletAddress()" title="Copy address">
                                    ${Icons.copy || '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="5" y="5" width="10" height="10" rx="1"/><path d="M3 3h8v8"/></svg>'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Wallet Incoming Transactions -->
                    <div class="transactions-section">
                        <div class="section-header-home">
                            <h3 class="section-title-home">Wallet incoming transactions</h3>
                            <div class="section-header-labels">
                                <span class="header-label">Date</span>
                                <span class="header-label">BTC Transaction</span>
                            </div>
                        </div>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>BTC Transaction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2025-07-09</td>
                                        <td class="transaction-amount">0.005650 BTC</td>
                                    </tr>
                                    <tr>
                                        <td>2025-07-09</td>
                                        <td class="transaction-amount">0.005650 BTC</td>
                                    </tr>
                                    <tr>
                                        <td>2025-07-09</td>
                                        <td class="transaction-amount">0.005650 BTC</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Section Transaction History -->
                <div class="transaction-history-section">
                    <div class="section-header-home">
                        <h2 class="section-title-home">Transaction history</h2>
                        <div class="transaction-history-header-right">
                            <div class="section-header-labels">
                                <span class="header-label">AKT04</span>
                                <span class="header-label">Total reward</span>
                            </div>
                            <div class="transaction-history-controls">
                                <div class="date-range-selector" id="date-range-selector">
                                    <span class="date-range-text">June 1, 2025 - June 30, 2025</span>
                                    <span class="date-range-arrow">▼</span>
                                </div>
                                <select class="contract-selector">
                                    <option>Contracts AL01</option>
                                </select>
                                <button class="btn btn-primary" id="btn-export-excel">
                                    Export to excel
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Transaction History Table -->
                    <div class="table-container">
                        <table class="table transaction-history-table">
                            <thead>
                                <tr>
                                    <th>AKT04</th>
                                    <th>Total reward</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>June 2, 2025</td>
                                    <td>
                                        <div class="reward-details">
                                            <span class="reward-amount">0.021144 BTC</span>
                                            <span class="reward-hashrate">2041.42 TH/s</span>
                                            <span class="reward-total">0.082848 BTC</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>June 3, 2025</td>
                                    <td>
                                        <div class="reward-details">
                                            <span class="reward-amount">0.021144 BTC</span>
                                            <span class="reward-hashrate">2041.42 TH/s</span>
                                            <span class="reward-total">0.082848 BTC</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>June 4, 2025</td>
                                    <td>
                                        <div class="reward-details">
                                            <span class="reward-amount">0.021144 BTC</span>
                                            <span class="reward-hashrate">2041.42 TH/s</span>
                                            <span class="reward-total">0.082848 BTC</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>June 5, 2025</td>
                                    <td>
                                        <div class="reward-details">
                                            <span class="reward-amount">0.021144 BTC</span>
                                            <span class="reward-hashrate">2041.42 TH/s</span>
                                            <span class="reward-total">0.082848 BTC</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="table-total-row">
                                    <td><strong>Total</strong></td>
                                    <td><strong class="total-amount">2.026587 BTC</strong></td>
                                </tr>
                            </tfoot>
                        </table>
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
    padding: var(--space-12);
    width: 100%;
    max-width: 100%;
    margin: 0;
}

.dashboard-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
}

/* Section Headers */
.section-header-home {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-8);
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
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.4;
}

/* Wallet Section */
.wallet-section {
    margin-bottom: var(--space-12);
}

.wallet-section .section-header-home {
    padding-left: var(--space-10);
}

.wallet-card {
    background: var(--primary-grey);
    border: var(--border-thin) solid var(--grey-100);
    border-radius: var(--radius-lg);
    padding: var(--space-10);
    margin-bottom: var(--space-8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(197, 255, 167, 0.05);
    transition: all var(--duration-normal) var(--ease-in-out);
}

.wallet-card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(197, 255, 167, 0.1);
    transform: translateY(-2px);
}

.wallet-card-header {
    margin-bottom: var(--space-8);
}

.wallet-card-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
}

.wallet-card-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
}

.wallet-balance {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.wallet-balance-btc {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--primary-green);
    letter-spacing: -0.02em;
    line-height: 1.2;
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
    border: var(--border-thin) solid var(--grey-100);
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
    color: var(--primary-green);
    box-shadow: 0 0 12px rgba(197, 255, 167, 0.2);
}

.wallet-address-copy svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
}

/* Transactions Section */
.transactions-section {
    margin-top: var(--space-8);
}

.transaction-amount {
    color: var(--primary-green);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    text-shadow: 0 0 10px rgba(197, 255, 167, 0.2);
}

/* Transaction History Section */
.transaction-history-section {
    margin-top: var(--space-12);
}

.transaction-history-header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-4);
}

.section-header-labels {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.header-label {
    color: var(--text-muted);
}

.transaction-history-controls {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
}

.date-range-selector {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--primary-grey);
    border: var(--border-thin) solid var(--grey-100);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-in-out);
}

.date-range-selector:hover {
    border-color: var(--primary-green);
    background: var(--grey-200);
    box-shadow: 0 0 0 1px rgba(197, 255, 167, 0.2);
}

.date-range-text {
    font-weight: var(--font-medium);
}

.date-range-arrow {
    font-size: var(--text-xs);
    color: var(--text-secondary);
}

.contract-selector {
    padding: var(--space-3) var(--space-4);
    background: var(--primary-grey);
    border: var(--border-thin) solid var(--grey-100);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--text-sm);
    font-family: var(--font-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-in-out);
}

.contract-selector:hover {
    border-color: var(--primary-green);
    box-shadow: 0 0 0 1px rgba(197, 255, 167, 0.2);
}

.contract-selector:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(197, 255, 167, 0.1);
}

/* Transaction History Table */
.transaction-history-table {
    margin-top: var(--space-4);
}

.reward-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
}

.reward-amount {
    color: var(--primary-green);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    font-size: var(--text-base);
    text-shadow: 0 0 10px rgba(197, 255, 167, 0.2);
}

.reward-hashrate {
    color: var(--text-secondary);
    font-size: var(--text-sm);
}

.reward-total {
    color: var(--text-primary);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    font-size: var(--text-base);
    margin-top: var(--space-2);
}

.table-total-row {
    background: rgba(42, 42, 42, 0.5);
    border-top: var(--border-medium) solid rgba(197, 255, 167, 0.2);
    backdrop-filter: blur(8px);
}

.table-total-row td {
    padding: var(--space-4);
    font-size: var(--text-base);
}

.total-amount {
    color: var(--primary-green);
    font-size: var(--text-lg);
    font-family: var(--font-mono);
    text-shadow: 0 0 12px rgba(197, 255, 167, 0.3);
    font-weight: var(--font-bold);
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
    background-color: #70D467 !important;
    box-shadow: 0 0 12px rgba(197, 255, 167, 0.55) !important;
    transform: translateY(-1px) !important;
    color: #000 !important;
}

/* Responsive */
@media (max-width: 1024px) {
    .dashboard-view {
        padding: var(--space-6);
    }
    
    .section-header-home {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .transaction-history-controls {
        width: 100%;
    }
    
    .date-range-selector,
    .contract-selector {
        flex: 1;
        min-width: 200px;
    }
}

@media (max-width: 768px) {
    .wallet-balance-btc {
        font-size: var(--text-3xl);
    }
    
    .transaction-history-controls {
        flex-direction: column;
        width: 100%;
    }
    
    .date-range-selector,
    .contract-selector {
        width: 100%;
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

export const dashboardTemplate = renderDashboard;
export { dashboardStyles };
