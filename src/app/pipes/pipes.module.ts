import { NgModule } from '@angular/core';
import { BasenamePipe } from './basename.pipe';
import { HidevaluePipe } from './hidevalue.pipe';
import { KeyvaluePipe } from './keyvalue.pipe';

@NgModule({
	declarations: [KeyvaluePipe,
    HidevaluePipe,
    BasenamePipe,
    BasenamePipe],
	imports: [],
	exports: [KeyvaluePipe,
    HidevaluePipe,
    BasenamePipe,
    BasenamePipe]
})
export class PipesModule {}
