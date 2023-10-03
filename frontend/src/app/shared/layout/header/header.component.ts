import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {LoaderService} from "../../services/loader.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    searchField = new FormControl()
    public showedSearch: boolean = false;
    public serverStaticPath: string = environment.serverStaticPath;
    public products: ProductType[] = [];
    public count: number = 0;
    public isLogged: boolean = false;
    @Input() categories: CategoryWithTypeType[] = [];

    constructor(private authService: AuthService, private _snackBar: MatSnackBar,
                private router: Router, private cartService: CartService,
                private productService: ProductService, private loaderService: LoaderService) {
        this.isLogged = this.authService.getIsLoggedIn();
    }

    ngOnInit(): void {
        this.searchField.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe(value => {
                if (value && value.length > 2) {
                    this.productService.searchProducts(value)
                        .subscribe((data: ProductType[]) => {
                            this.products = data;
                        })
                } else {
                    this.products = [];
                }
            })

        this.authService.isLogged$.subscribe((isLoggedIn: boolean): void => {
            this.isLogged = isLoggedIn;
        });

        this.cartService.getCartCount()
            .subscribe((data: { count: number } | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                    throw new Error(((data as DefaultResponseType).message));
                }

                this.count = (data as { count: number }).count;
            });

        this.cartService.count$
            .subscribe(count => {
                this.count = count;
            })
    }

    public logout(): void {
        this.authService.logout()
            .subscribe({
                next: (): void => {
                    this.doLogout();
                },
                error: (): void => {
                    this.doLogout();
                }
            })
    }

    private doLogout(): void {
        this.authService.removeTokens();
        this.authService.userId = null;
        this._snackBar.open('Вы вышли из системы');
        this.router.navigate(['/']);
    }

    // public changedSearchValue(newValue: string) {
    //     this.searchValue = newValue;
    //
    //
    // }

    public selectProduct(url: string) {
        this.router.navigate(['/product/' + url]);
        this.searchField.setValue('');
        this.products = [];
    }

    public changeShowedSearch(value: boolean) {
        setTimeout(() => {
            this.showedSearch = value;
        }, 100);
    }
}
