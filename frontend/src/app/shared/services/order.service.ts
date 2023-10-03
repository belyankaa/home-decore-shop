import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {OrderType} from "../../../types/order.type";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    public count: number = 0;
    public count$: Subject<number> = new Subject<number>();

    constructor(private http: HttpClient) {
    }

    public creatOrder(params: OrderType): Observable<OrderType | DefaultResponseType> {
        return this.http.post<OrderType | DefaultResponseType>(environment.api + 'orders', params, {withCredentials: true})
    }

    public getOrders(): Observable<OrderType[] | DefaultResponseType> {
        return this.http.get<OrderType[] | DefaultResponseType>(environment.api + 'orders')
    }
}
