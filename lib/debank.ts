/**
 * DeBank Pro OpenAPI Helper
 * Documentation: https://pro-openapi.debank.com/
 * 
 * Ce module fournit des fonctions pour interagir avec l'API DeBank Pro
 * et mapper les données vers le format attendu par le frontend.
 */

const DEBANK_BASE_URL = "https://pro-openapi.debank.com/v1";

// ⚠️ Mets ta clé dans .env.local : DEBANK_ACCESS_KEY=xxxxxxxx
const DEBANK_ACCESS_KEY = process.env.DEBANK_ACCESS_KEY;

if (!DEBANK_ACCESS_KEY) {
  console.warn(
    "[DeBank] ⚠️ DEBANK_ACCESS_KEY manquant. Ajoute-le dans .env.local"
  );
}

// Types pour les réponses DeBank
export interface DeBankProtocol {
  id: string;
  name: string;
  chain: string;
  portfolio_item_list?: DeBankPortfolioItem[];
}

export interface DeBankPortfolioItem {
  stats?: {
    asset_usd_value?: number;
    debt_usd_value?: number;
  };
  detail?: {
    supply_token_list?: DeBankToken[];
    asset_token_list?: DeBankToken[];
    collateral_token_list?: DeBankToken[];
    borrow_token_list?: DeBankToken[];
    debt_token_list?: DeBankToken[];
    debt_list?: DeBankToken[];
  };
}

export interface DeBankToken {
  symbol?: string;
  amount?: number;
  price?: number;
}

// Types pour le format frontend
export interface CollateralPosition {
  asset: "BTC" | "ETH" | string;
  protocol: string;
  chain: string;
  collateralAmount: number;
  collateralPriceUsd: number;
  debtToken: string;
  debtAmount: number;
  borrowApr: number;
  liquidationThreshold: number;
}

export interface CollateralClient {
  id: string;
  name: string;
  tag: string;
  wallets: string[];
  positions: CollateralPosition[];
  totalValue: number;
  totalDebt: number;
  healthFactor: number;
  lastUpdate: string;
}

/**
 * Appel générique DeBank Pro OpenAPI
 * @param path - ex: "/user/all_complex_protocol_list"
 * @param params - query params
 */
async function debankFetch(
  path: string,
  params: Record<string, string | undefined> = {}
): Promise<any> {
  const url = new URL(DEBANK_BASE_URL + path);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      AccessKey: DEBANK_ACCESS_KEY || "",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `[DeBank] ${res.status} ${res.statusText} for ${url.toString()} – ${text}`
    );
  }

  return res.json();
}

/**
 * Récupère la liste "complexe" de protocoles pour un wallet
 * Endpoint: /user/all_complex_protocol_list
 * Documentation: https://pro-openapi.debank.com/
 * 
 * @param wallet - adresse ERC20
 * @param chains - ex: ["eth", "arb", "base"]
 */
export async function fetchUserComplexProtocols(
  wallet: string,
  chains: string[] = ["eth"]
): Promise<DeBankProtocol[]> {
  const chain_ids = chains.join(",");
  
  // Endpoint DeBank Pro OpenAPI pour récupérer tous les protocoles complexes d'un utilisateur
  const data = await debankFetch("/user/all_complex_protocol_list", {
    id: wallet,
    chain_ids,
  });

  // data est typiquement un array de protocoles
  return Array.isArray(data) ? data : [];
}

/**
 * Normalise un symbole token → "BTC" / "ETH" / autre
 */
function normalizeAssetSymbol(symbol?: string): string {
  if (!symbol) return "OTHER";
  const s = symbol.toUpperCase();
  if (s.includes("BTC")) return "BTC";
  if (s.includes("ETH")) return "ETH";
  return s;
}

/**
 * Mappe un "portfolio item" DeBank vers une position collatérale
 * 
 * ⚠️ Les champs exacts (asset_token_list, debt_token_list, supply_token_list, borrow_token_list)
 * doivent être vérifiés sur la doc + la vraie réponse DeBank.
 * 
 * Structure attendue de DeBank:
 * - detail.supply_token_list ou detail.asset_token_list → tokens en collatéral
 * - detail.borrow_token_list ou detail.debt_token_list → tokens empruntés
 * - stats.asset_usd_value → valeur totale du collatéral en USD
 * - stats.debt_usd_value → valeur totale de la dette en USD
 */
function mapPortfolioItemToPosition(
  protocol: DeBankProtocol,
  item: DeBankPortfolioItem
): CollateralPosition {
  const stats = item.stats || {};

  const collatUsd = stats.asset_usd_value || 0;
  const debtUsd = stats.debt_usd_value || 0;

  // On récupère le premier token collat et le premier token de dette
  const detail = item.detail || {};
  const assetTokens =
    detail.supply_token_list ||
    detail.asset_token_list ||
    detail.collateral_token_list ||
    [];
  const debtTokens =
    detail.borrow_token_list ||
    detail.debt_token_list ||
    detail.debt_list ||
    [];

  const mainAsset = assetTokens[0] || {};
  const mainDebt = debtTokens[0] || {};

  const assetSymbol = normalizeAssetSymbol(mainAsset.symbol);
  const collateralAmount = mainAsset.amount || 0;
  const collateralPriceUsd = mainAsset.price || 0;

  const debtTokenSymbol = mainDebt.symbol || "USD";
  const debtAmount = mainDebt.amount || debtUsd; // fallback sur debtUsd

  return {
    asset: assetSymbol, // ex: "BTC" / "ETH"
    protocol: protocol.id || protocol.name || "unknown",
    chain: protocol.chain || "unknown",
    collateralAmount,
    collateralPriceUsd,
    debtToken: debtTokenSymbol,
    debtAmount,
    // APR non fourni directement par DeBank → 0 en attendant mieux
    // TODO: Récupérer l'APR depuis un autre endpoint ou une autre source
    borrowApr: 0,
    liquidationThreshold: 0.9,
  };
}

/**
 * Construit la structure "client collatéral" pour un wallet donné
 *
 * @param wallet - adresse ERC20 (ID du client)
 * @param options
 * @param options.name - nom affiché (sinon wallet tronqué)
 * @param options.tag - "Restaurant" / "VIP" / etc.
 * @param options.chains - chains à interroger
 * @param options.allowedProtocols - liste d'ID protocoles autorisés (Morpho, etc.)
 */
export async function buildCollateralClientFromDeBank(
  wallet: string,
  options: {
    name?: string;
    tag?: string;
    chains?: string[];
    allowedProtocols?: string[];
  } = {}
): Promise<CollateralClient> {
  const {
    name,
    tag = "Client",
    chains = ["eth"],
    allowedProtocols = [], // si vide → pas de filtre par protocole
  } = options;

  const protoList = await fetchUserComplexProtocols(wallet, chains);

  const positions: CollateralPosition[] = [];

  for (const protocol of protoList || []) {
    const protocolId = protocol.id || "";
    if (
      Array.isArray(allowedProtocols) &&
      allowedProtocols.length > 0 &&
      !allowedProtocols.includes(protocolId)
    ) {
      continue;
    }

    const itemList = protocol.portfolio_item_list || [];
    for (const item of itemList) {
      const pos = mapPortfolioItemToPosition(protocol, item);

      // On ignore les positions vides (0 collat & 0 dette)
      if (pos.collateralAmount === 0 && pos.debtAmount === 0) continue;

      positions.push(pos);
    }
  }

  const displayName =
    name ||
    `${wallet.slice(0, 6)}...${wallet.slice(wallet.length - 4, wallet.length)}`;

  // Calculer totalValue et totalDebt depuis les positions
  let totalValue = 0;
  let totalDebt = 0;

  for (const position of positions) {
    const collateralValue = position.collateralAmount * position.collateralPriceUsd;
    totalValue += collateralValue;
    totalDebt += position.debtAmount;
  }

  // Calculer healthFactor (ratio collatéral/dette)
  // Health factor = totalValue / totalDebt (si totalDebt > 0)
  let healthFactor = 0;
  if (totalDebt > 0) {
    healthFactor = totalValue / totalDebt;
  } else if (totalValue > 0) {
    // Si pas de dette mais du collatéral, health factor très élevé
    healthFactor = 999;
  }

  const now = new Date().toISOString();

  return {
    id: wallet,
    name: displayName,
    tag,
    wallets: [wallet],
    positions,
    totalValue,
    totalDebt,
    healthFactor,
    lastUpdate: now,
  };
}

