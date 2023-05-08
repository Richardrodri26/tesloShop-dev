export interface DashboardSummaryResponse {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number; // role client
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number; // 10 o menos
}