import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'basename'
})
export class BasenamePipe implements PipeTransform {

  /**
   * Takes a value and makes it lowercase.
   */
   transform(value: string, ...args) {
    var base = new String(value).substring(value.lastIndexOf('/') + 1); 
    // if(base.lastIndexOf(".") != -1){
    //   base = base.substring(0, base.lastIndexOf("."));
    // }    
    return base;
  }

}
