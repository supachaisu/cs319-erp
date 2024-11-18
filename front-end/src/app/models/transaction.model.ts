export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Transaction {
  // System-generated fields
  id: number;
  date: Date;
  updatedAt: Date;
  // User-provided fields
  description: string;
  amount: number; // Whole Baht (100 = 100 THB)
  type: TransactionType;
  category: string;
  status: TransactionStatus;
}

// CreateTransactionDto only has fields needed for creation
export interface CreateTransactionDto {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

// UpdateTransactionDto makes all fields optional + allows status update
export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {
  status?: TransactionStatus;
}
