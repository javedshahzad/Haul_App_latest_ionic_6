import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hidevalue'
})
export class HidevaluePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
   transform(value: string, args:string[]) {
    let hideEle = '';
    if(value){
      let w = value;
      let wlen = w.length;
      
  
      for(let i=0;i<wlen;i++){
        if(i<3){
          hideEle += w[i];
        }
        else{
          hideEle += '.';
        }
      }
    }
    else{
      hideEle = '.....';
    }
    
    return hideEle;
  }

}
