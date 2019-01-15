import { Component, OnInit, Output } from '@angular/core';
import { InitPlateauService } from '../init-plateau.service';
import { JournalEventService } from '../journal-event.service';
import { TraitementTabDataService } from '../traitement-tab-data.service';
import { CaseData } from '../case-data';
import { MatDialog } from '@angular/material';

import { element } from 'protractor';
import { PromotionModalComponent } from '../promotion-modal/promotion-modal.component';
import { TourJeuData } from '../tour-jeu-data';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  private tabData: CaseData[];
  private couleurEnCours: string;
  private tourdeJeu: number;
  private checkStateCases: CaseData[];
  private caseSelectionnee: CaseData;
  private casesDeplacementPossible: CaseData[];
  private echecEtMat: string;

  constructor(private initPlateauService: InitPlateauService,
    private traitementTabDataService: TraitementTabDataService,
    private journalEventService: JournalEventService,
    public dialog: MatDialog) { }

  getPiece(x: number, y: number): string {
    const caseRecup: CaseData = this.traitementTabDataService.getCaseData(x, y, this.tabData);
    return caseRecup != null ? caseRecup.piece : null;
  }

  clickCase(x: number, y: number) {
    if (this.casesDeplacementPossible != null
      && this.casesDeplacementPossible.some((el) => el.coordX === x && el.coordY === y)
      && this.caseSelectionnee.piece.includes(this.couleurEnCours)) {
        this.deplacementPiece(this.caseSelectionnee, x, y);
        this.resetCaseSelect();
    } else {
      this.toogleCaseActive(x, y);
    }
  }

  deplacementPiece(caseDepart: CaseData, xArrivee: number, yArrivee: number) {
    this.tabData.find((elmCase) => elmCase.coordX === xArrivee && elmCase.coordY === yArrivee).piece = caseDepart.piece;
    if (caseDepart.piece.includes('roi')) {
      this.checkRoque(caseDepart.coordX, caseDepart.coordY, xArrivee);
    } else if (caseDepart.piece.includes('pion')) {
      this.checkCoupEnPassant(caseDepart.coordX, caseDepart.coordY, xArrivee);
    }
    const tourEventData: TourJeuData = {
      tour: this.tourdeJeu,
      couleur: this.couleurEnCours,
      xDepart: caseDepart.coordX,
      yDepart: caseDepart.coordY,
      xArrivee: xArrivee,
      yArrivee: yArrivee,
      piece: caseDepart.piece
    };
    this.journalEventService.add(tourEventData);
    this.checkPromotion(caseDepart.piece, xArrivee, yArrivee, this.couleurEnCours);
    caseDepart.piece = null;
    this.checkCheckState();
    this.tourSuivant();
  }

  checkPromotion(piece: string, xArrivee: number, yArrivee: number, couleurPion: string) {
    if (piece != null && piece.includes('pion') &&
    (yArrivee === 1 && this.couleurEnCours.includes('blanc')) ||
    (yArrivee === 8 && this.couleurEnCours.includes('noir'))) {
      this.openPopupPromotion(xArrivee, yArrivee);
    }
  }

  checkCoupEnPassant(xdepart: number, ydepart: number, xarrivee: number) {
    const lastMove: TourJeuData = this.journalEventService.getLastMove();
    if (this.couleurEnCours.includes('blanc') && ydepart === 4
    && lastMove.piece.includes('pion')
    && (lastMove.xDepart === xdepart + 1 || lastMove.xDepart === xdepart - 1)
    && lastMove.yDepart === 2
    && lastMove.yArrivee === 4) {
      // coup en passant blanc
      this.tabData.find((elmCase) => elmCase.coordX === xarrivee && elmCase.coordY === 4).piece = null;
} else if (this.couleurEnCours.includes('noir') && ydepart === 5
    && lastMove.piece.includes('pion')
    && (lastMove.xDepart === xdepart + 1 || lastMove.xDepart === xdepart - 1)
    && lastMove.yDepart === 7
    && lastMove.yArrivee === 5) {
      // coup en passant noir
      this.tabData.find((elmCase) => elmCase.coordX === xarrivee && elmCase.coordY === 5).piece = null;
}
  }

  checkRoque(xdepart: number, ydepart: number, xarrivee: number) {
    if (xdepart === 5) {
      if (ydepart === 8) {
        if (xarrivee === 7) {
          this.tabData.find((elmCase) => elmCase.coordX === 6 && elmCase.coordY === ydepart).piece = 'tour_blanche';
          this.tabData.find((elmCase) => elmCase.coordX === 8 && elmCase.coordY === ydepart).piece = null;
        } else if (xarrivee === 3) {
          this.tabData.find((elmCase) => elmCase.coordX === 4 && elmCase.coordY === ydepart).piece = 'tour_blanche';
          this.tabData.find((elmCase) => elmCase.coordX === 1 && elmCase.coordY === ydepart).piece = null;
        }
      } else if (ydepart === 1) {
        if (xarrivee === 7) {
          this.tabData.find((elmCase) => elmCase.coordX === 6 && elmCase.coordY === ydepart).piece = 'tour_noire';
          this.tabData.find((elmCase) => elmCase.coordX === 8 && elmCase.coordY === ydepart).piece = null;
        } else if (xarrivee === 3) {
          this.tabData.find((elmCase) => elmCase.coordX === 4 && elmCase.coordY === ydepart).piece = 'tour_noire';
          this.tabData.find((elmCase) => elmCase.coordX === 1 && elmCase.coordY === ydepart).piece = null;
        }
      }
    }
  }

  openPopupPromotion(xArrivee: number, yArrivee: number) {
    const dialogRef = this.dialog.open(PromotionModalComponent, {
      maxWidth: '600px',
      data: {couleur: this.couleurEnCours},
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe(result => {
      this.tabData.find((elmCase) => elmCase.coordX === xArrivee && elmCase.coordY === yArrivee).piece = result;
    });
  }

  tourSuivant() {
    this.tourdeJeu++;
    this.couleurEnCours = this.couleurEnCours === 'blanc' ? 'noir' : 'blanc';
  }

  modifClassCases(x: number, y: number): string[] {
    const listeClass: string[] = [''];
    if (this.checkStateCases != null && this.checkStateCases.length > 0) {
      if (this.checkStateCases.some((el) => el.coordX === x && el.coordY === y)) {
        listeClass.push('checkCase');
      } else {
        const pieceCase = this.getPiece(x, y);
        if (pieceCase != null && pieceCase.includes('roi') && pieceCase.includes(this.couleurEnCours)) {
          listeClass.push('checkKingCase');
        }
      }
    }
    if (this.caseSelectionnee != null) {
      if (this.caseSelectionnee.piece != null && this.caseSelectionnee.piece.includes(this.couleurEnCours)) {
        if (this.caseSelectionnee.coordX === x && this.caseSelectionnee.coordY === y) {
          listeClass.push('caseSelection');
        } else if (this.casesDeplacementPossible != null) {
          const caseDeplacement: CaseData = this.casesDeplacementPossible.find((el) => el.coordX === x && el.coordY === y);
          if (caseDeplacement != null) {
            if (caseDeplacement.piece != null) {
              listeClass.push('redBackground');
            } else {
              listeClass.push('greenBackground');
            }
          }
        }
      }
    }
    return listeClass;
  }

  toogleCaseActive(x, y) {
    this.caseSelectionnee = this.traitementTabDataService.getCaseData(x, y, this.tabData);
    this.casesDeplacementPossible = this.traitementTabDataService
    .getDeplacementPossible(this.caseSelectionnee, this.tabData, this.couleurEnCours, true);
  }

  resetCaseSelect() {
    this.caseSelectionnee = null;
    this.casesDeplacementPossible = null;
  }

  checkCheckState() {
    this.checkStateCases = this.traitementTabDataService.checkCheckState(this.tabData, this.couleurEnCours);
    if (this.checkStateCases.length > 0) {
      let msg = 'echec';
      if (this.traitementTabDataService.isGameFinished(this.tabData, this.couleurEnCours)) {
        this.echecEtMat = this.couleurEnCours;
        msg = 'echec et Mat !';
      }
      // this.journalEventService.add(msg);
    }
  }

  ngOnInit() {
    this.tabData = this.initPlateauService.initPlateauFull();
    this.tourdeJeu = 1;
    this.couleurEnCours = 'blanc';
  }

}
