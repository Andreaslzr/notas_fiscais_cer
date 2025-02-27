import { BACKEND_URL } from "~/models/app";
import type { InvoiceItem } from "~/models/invoiceItens";

export const getItem = (idItem: string): Promise<InvoiceItem|null>  => {
    return useFetch<InvoiceItem>(
      `${BACKEND_URL}/invoice-item?invoiceFK=${idItem}`)
      .then(resposta=> {
        return Promise.resolve(resposta.data.value);      
      })
      .catch(error=>{
        console.log("error", error);
        return Promise.reject(null);
      })  
  };