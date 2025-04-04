import { Pipe, PipeTransform } from '@angular/core';
// import { hierarchyLevels } from '../models/company-creation.model';

@Pipe({
  name: 'entityHierarchyLevels',
  standalone:true
})
export class EntityHierarchyLevelsPipe implements PipeTransform {

  transform(value:any [], levelDefId:number|string,parent?:string|number): any[] {
    let levels:any={2:"department",3:"section",4:"project"};
    if(levelDefId==1){
      return value.filter(item=>(item.levelDefId==1 ));
    }else if(!levelDefId)return [];
    let val =value.filter(item=>(item.levelDefId==levelDefId && item[levels[item.levelDefId]]==parent ));
    
    return val;} 

}
