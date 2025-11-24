/**
 * Exemples d'utilisation de l'API Fireblocks
 * 
 * Ces exemples montrent comment utiliser les routes API Fireblocks
 * depuis le frontend ou d'autres services.
 */

// ============================================
// EXEMPLE 1: Créer une transaction
// ============================================

export async function createFireblocksTransaction() {
  const response = await fetch('/api/fireblocks/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assetId: 'BTC',
      source: {
        type: 'VAULT_ACCOUNT',
        id: '0', // ID du compte vault source
      },
      destination: {
        type: 'EXTERNAL_WALLET',
        oneTimeAddress: {
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Adresse Bitcoin
        },
      },
      amount: '0.5', // Montant en BTC
      note: 'Transfert vers cold storage',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la création de la transaction');
  }

  const data = await response.json();
  return data.data; // TransactionResponse
}

// ============================================
// EXEMPLE 2: Récupérer une transaction
// ============================================

export async function getFireblocksTransaction(txId: string) {
  const response = await fetch(`/api/fireblocks/transactions?id=${txId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération de la transaction');
  }

  const data = await response.json();
  return data.data; // TransactionResponse
}

// ============================================
// EXEMPLE 3: Lister les comptes vault
// ============================================

export async function getFireblocksVaults() {
  const response = await fetch('/api/fireblocks/vaults');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération des vaults');
  }

  const data = await response.json();
  return data.data; // VaultAccount[]
}

// ============================================
// EXEMPLE 4: Récupérer un compte vault spécifique
// ============================================

export async function getFireblocksVault(vaultId: string) {
  const response = await fetch(`/api/fireblocks/vaults?id=${vaultId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération du vault');
  }

  const data = await response.json();
  return data.data; // VaultAccount
}

// ============================================
// EXEMPLE 5: Vérifier le statut des APIs
// ============================================

export async function checkAPIStatus() {
  const response = await fetch('/api/status');

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du statut');
  }

  const data = await response.json();
  return data; // { status: {...}, testResults: {...} }
}

// ============================================
// EXEMPLE 6: Utilisation complète avec gestion d'erreurs
// ============================================

export async function transferBTC(
  fromVaultId: string,
  toAddress: string,
  amount: string
) {
  try {
    // 1. Vérifier que Fireblocks est configuré
    const status = await checkAPIStatus();
    if (!status.status.fireblocks.enabled) {
      throw new Error('Fireblocks API non configurée');
    }

    // 2. Créer la transaction
    const transaction = await createFireblocksTransaction();

    // 3. Attendre la confirmation (polling)
    let txStatus = transaction.status;
    while (txStatus === 'PENDING_SIGNATURE' || txStatus === 'PENDING_AUTHORIZATION') {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 2 secondes
      const updatedTx = await getFireblocksTransaction(transaction.id);
      txStatus = updatedTx.status;
    }

    // 4. Retourner le résultat
    if (txStatus === 'COMPLETED') {
      return {
        success: true,
        transactionId: transaction.id,
        txHash: transaction.txHash,
      };
    } else {
      throw new Error(`Transaction échouée: ${txStatus}`);
    }
  } catch (error: any) {
    console.error('Erreur lors du transfert:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// EXEMPLE 7: Utilisation dans un composant React
// ============================================

/*
import { useState } from 'react';
import { createFireblocksTransaction, getFireblocksVaults } from '@/examples/fireblocks-usage';

export function FireblocksTransfer() {
  const [loading, setLoading] = useState(false);
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    // Charger les vaults au montage
    getFireblocksVaults().then(setVaults);
  }, []);

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const result = await createFireblocksTransaction();
      alert(`Transaction créée: ${result.id}`);
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Transfert Fireblocks</h2>
      <button onClick={handleTransfer} disabled={loading}>
        {loading ? 'En cours...' : 'Créer transaction'}
      </button>
    </div>
  );
}
*/


