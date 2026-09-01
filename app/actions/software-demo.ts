'use server';

import {
  addSoftwareDemoProduct,
  approveSoftwareDemoRequisition,
  createSoftwareDemoExpense,
  createSoftwareDemoPayment,
  createSoftwareDemoProduction,
  createSoftwareDemoPurchase,
  createSoftwareDemoRequisition,
  createSoftwareDemoSale,
  createSoftwareDemoSalesOrder,
  deliverSoftwareDemoSalesOrder,
  getSoftwareDemoConfigBySlug,
  getSoftwareDemoSnapshot,
  initSoftwareDemoSession,
  transferSoftwareDemoStock,
} from '@/lib/services/software-demo.service';

export async function bootstrapSoftwareDemoAction(demoSlug: string, sessionId: string) {
  const config = await getSoftwareDemoConfigBySlug(demoSlug);
  if (!config) return { error: 'Demo not found' };
  await initSoftwareDemoSession(config.id, sessionId, config.business_type);
  const snapshot = await getSoftwareDemoSnapshot(config.id, sessionId);
  return { config, snapshot };
}

export async function refreshSoftwareDemoAction(configId: string, sessionId: string) {
  const snapshot = await getSoftwareDemoSnapshot(configId, sessionId);
  return { snapshot };
}

export async function addProductAction(input: Parameters<typeof addSoftwareDemoProduct>[0]) {
  const result = await addSoftwareDemoProduct(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function createPurchaseAction(input: Parameters<typeof createSoftwareDemoPurchase>[0]) {
  const result = await createSoftwareDemoPurchase(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function createSaleAction(input: Parameters<typeof createSoftwareDemoSale>[0]) {
  const result = await createSoftwareDemoSale(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function createPaymentAction(input: Parameters<typeof createSoftwareDemoPayment>[0]) {
  const result = await createSoftwareDemoPayment(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function createExpenseAction(input: Parameters<typeof createSoftwareDemoExpense>[0]) {
  const result = await createSoftwareDemoExpense(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function createProductionAction(input: Parameters<typeof createSoftwareDemoProduction>[0]) {
  const result = await createSoftwareDemoProduction(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function createRequisitionAction(input: Parameters<typeof createSoftwareDemoRequisition>[0]) {
  const result = await createSoftwareDemoRequisition(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function approveRequisitionAction(input: Parameters<typeof approveSoftwareDemoRequisition>[0]) {
  const result = await approveSoftwareDemoRequisition(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function createSalesOrderAction(input: Parameters<typeof createSoftwareDemoSalesOrder>[0]) {
  const result = await createSoftwareDemoSalesOrder(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function deliverSalesOrderAction(input: Parameters<typeof deliverSoftwareDemoSalesOrder>[0]) {
  const result = await deliverSoftwareDemoSalesOrder(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}

export async function transferStockAction(input: Parameters<typeof transferSoftwareDemoStock>[0]) {
  const result = await transferSoftwareDemoStock(input);
  if (result.error) return result;
  const snapshot = await getSoftwareDemoSnapshot(input.configId, input.sessionId);
  return { ...result, snapshot };
}
