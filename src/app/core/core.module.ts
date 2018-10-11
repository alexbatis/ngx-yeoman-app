import { YeomanEffects } from './effects/yeoman.effects';
/*-----------------------------------IMPORTS---------------------------------*/
/*--------------------THIRD PARTY-------------------*/
// Angular
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/*--------------------CUSTOM------------------------*/
// import { AnimationsService } from '@app/core/animations/animations.service';
// import { TitleService } from '@app/core/title/title.service';
import { AppConfig } from '@env/environment';
// Reducers
import { metaReducers } from '@app/core/meta-reducers/metas.reducer';
import { yeomanReducer } from '@app/core/reducers/yeoman.reducer';


/*-----------------------------------MODULE DEFINITION-----------------------*/
@NgModule({
  imports: [
    // Angular
    CommonModule,
    HttpClientModule,

    // NgRx
    StoreModule.forRoot({}, { metaReducers }),
    StoreModule.forFeature('yeoman', yeomanReducer),
    // StoreModule.forFeature('configurations', ConfigurationsReducer),
    // StoreModule.forFeature('modelForm', modelFormReducer),
    // StoreModule.forFeature('configurationForm', configurationFormReducer),
    EffectsModule.forRoot([
      YeomanEffects
    ]),

    // 3rd party
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [],
  providers: [],
  exports: [TranslateModule]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `/assets/i18n/`,
    '.json'
  );
}
