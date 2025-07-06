import { PaginateDataResponse, SearchQueryDto } from "../dto";

 
export interface AbstractCrud<D,S> {
     create(data: Partial<D>): Promise<S>; 
     search(query: string): Promise<S[]>;
     searchAll(filters: SearchQueryDto<D>): Promise<PaginateDataResponse<S>>;
     findById(id: number):Promise<S | null>;
     update(id: number, data: Partial<D>): Promise<S>;
     delete(id: number): Promise<void>;
     count(filters: SearchQueryDto<D>): Promise<number>;
     exists(id: number): Promise<boolean>;
}


export interface ResponseSummary<T>{
  data?:T,
  message?:string,
  success:boolean 
}
