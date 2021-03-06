export interface CreateDegreeRequest {
  name: string;
  rankId: number;
}

export interface Degree {
  id: number;
  name: string;
  rankName: string;
}

export type Degrees = Degree[];

export interface UpdateDegreeRequest {
  id: number;
  name: string;
}
