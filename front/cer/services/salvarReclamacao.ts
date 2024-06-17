import { BACKEND_URL } from "~/models/app";
import type { Warranty } from "~/models/Warranty";

export const salvarReclamacao = async (reclama: Warranty): Promise<Warranty | null> => {
    const {error,data} = await useFetch<Warranty>(`${BACKEND_URL}/warranty/`, {
      method: 'POST',
      body: reclama
    });
  return data.value;;
};