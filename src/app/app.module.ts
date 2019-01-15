import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { CaseComponent } from './case/case.component';
import { TimesPipe } from './times.pipe';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PromotionModalComponent } from './promotion-modal/promotion-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    CaseComponent,
    TimesPipe,
    MessagerieComponent,
    PromotionModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [PromotionModalComponent]
})
export class AppModule { }
