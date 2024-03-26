import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms/forms.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KilometersPipe } from '../pipes/kilometers.pipe';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@NgModule({
  declarations: [KilometersPipe, FormsComponent, ListComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TypeaheadModule.forRoot(),
  ],
  exports: [ListComponent, FormsComponent],
})
export class CampaignsModule {}
