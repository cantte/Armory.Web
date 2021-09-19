import HttpClient, { IsValidResponse } from '../../common/config/http';
import { CreateRankRequest, Rank, Ranks } from './Models';

export const createRank = async (data: CreateRankRequest): Promise<void> => {
  const response = await HttpClient.post('/Ranks', data);

  if (!IsValidResponse(response)) {
    throw new Error('No se pudo registrar el rango');
  }
};

export const getRanks = async (): Promise<Ranks> => {
  const response = await HttpClient.get<Ranks>('/Ranks');
  if (IsValidResponse(response)) {
    return response.data;
  }

  throw new Error('No se pudieron obtener los rangos.');
};

export const getRank = async (id: number): Promise<Rank> => {
  const response = await HttpClient.get<Rank>(`/Ranks/${id}`);
  if (IsValidResponse(response)) {
    return response.data;
  }

  throw new Error('No se puedo obtener el rango.');
};
