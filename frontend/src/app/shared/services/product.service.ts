import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ProductType} from "../../../types/product.type";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  public getBestProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.api + 'products/best')
  }

  public getProducts(params: ActiveParamsType): Observable<{totalCount: number, pages: number, items: ProductType[]}> {
    return this.http.get<{totalCount: number, pages: number, items: ProductType[]}>(environment.api + 'products', {
      params: params
    })
  }

  public getProduct(url: string): Observable<ProductType> {
    return this.http.get<ProductType>(environment.api + 'products/' + url)
  }

  public searchProducts(query: string): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.api + 'products/search?query=' + query)
  }
}
