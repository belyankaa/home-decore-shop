import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PersonalRoutingModule} from './personal-routing.module';
import {OrdersComponent} from './orders/orders.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        OrdersComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        PersonalRoutingModule
    ]
})
export class PersonalModule {
}
