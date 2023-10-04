import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  public products: FavoriteType[] = [];
  public serverStaticPath: string = environment.serverStaticPath;
  public cartProducts: CartType | null = null;

  constructor(private favoriteService: FavoriteService, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error: string = (data as DefaultResponseType).message;
          throw new Error((error));
        }

        this.products = data as FavoriteType[];

        //Домашка 1
        if (this.products && this.products.length > 0) {
          this.cartService.getCart()
            .subscribe(cartData => {
              if ((data as DefaultResponseType).error !== undefined) {
                const error: string = (data as DefaultResponseType).message;
                throw new Error((error));
              }

              this.cartProducts = cartData as CartType;

              if (this.cartProducts && this.cartProducts.items.length > 0) {
                this.products.map(item => {
                  this.cartProducts!.items.forEach(cartItem => {
                    if (cartItem.product.id === item.id) {
                      item.quantity = cartItem.quantity;
                    }
                  })
                })
              }
            })
        }
      });
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id);
      })
  }


  removeFromCart(product: FavoriteType): void {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error(((data as DefaultResponseType).message));
        }

        product.quantity = 0;
      });
  }

  addToCart(product: FavoriteType): void {
    this.cartService.updateCart(product.id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error(((data as DefaultResponseType).message));
        }

        product.quantity = 1;
      });
  }

  updateCount(product: FavoriteType, value: number): void {
    if (value) {
      this.cartService.updateCart(product.id, value)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error(((data as DefaultResponseType).message));
          }

          product.quantity = value;
        });
    }
  }
}
