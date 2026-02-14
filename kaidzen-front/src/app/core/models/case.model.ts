export interface CreateCaseDto {
  salesNetworkId: string;
  problem: string;
  solution: string;
  result: string;
  dateFrom?: string;
  dateTo?: string;
}
export interface BusinessCase {
  id: string;
  salesNetworkId: string;
  salesNetwork?: { id: string; name: string };
  problem: string;
  solution: string;
  result: string;
  dateFrom?: Date;
  dateTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}
