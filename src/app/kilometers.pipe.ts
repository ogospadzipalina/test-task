import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kilometers'
})
export class KilometersPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value) || value === null) {
      return '';
    }

    return `${value} km`;
  }
}
