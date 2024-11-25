export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
}

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  id: number;
} 