export interface Status {
  id: number;
  name: string;
}

export interface CreateStatusDto {
  name: string;
}

export interface UpdateStatusDto extends CreateStatusDto {
  id: number;
} 
