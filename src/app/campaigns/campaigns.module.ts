import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms/forms.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KilometersPipe } from '../kilometers.pipe';


@NgModule({
  declarations: [
    KilometersPipe,
    FormsComponent,
    ListComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
    FormsComponent
  ]
})
export class CampaignsModule { }
