export interface CreateFlightRequest {
  code: string;
  name: string;
  personId: string;
}

export interface Flight {
  code: string;
  name: string;
  ownerName: string;
}

export type Flights = Flight[];