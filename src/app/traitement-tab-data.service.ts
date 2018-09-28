import { Injectable } from '@angular/core';
import { CaseData } from './case-data';
import { element } from 'protractor';
import { JournalEventService } from './journal-event.service';
import { TourJeuData } from './tour-jeu-data';

@Injectable({
  providedIn: 'root'
})
export class TraitementTabDataService {

  private roque: boolean;

  constructor(public journalEventService: JournalEventService) { }

  getCaseData(x: number, y: number, tabData: CaseData[]): CaseData {
    return tabData.find((elem) => elem.coordX === x && elem.coordY === y);
  }

  getAllPieces(couleur: string, tabData: CaseData[]): CaseData[] {
    return tabData.filter((elem) => elem.piece != null && elem.piece.includes(couleur));
  }

/**
 * check statut du plateau pour voir si situation d'echec
 *
 * @param {CaseData[]} tabData
 * @param {string} couleurAttaquant couleur du joueur provocant potentiellement un echec
 * @returns {CaseData[]} la liste des cases contenant les pieces provocant un echec
 * @memberof TraitementTabDataService
 */
checkCheckState(tabData: CaseData[], couleurAttaquant: string, couleurEnCours: string = couleurAttaquant): CaseData[] {
    const piecesCouleur: CaseData[] = this.getAllPieces(couleurAttaquant, tabData);
    return piecesCouleur
    .filter((casePiecesCouleur) => (this.getDeplacementPossible(casePiecesCouleur, tabData, couleurEnCours)
    .find((caseCibleAtack) => caseCibleAtack != null && caseCibleAtack.piece != null && caseCibleAtack.piece.includes('roi')) != null));
  }

/**
 *
 * renvoie true si l'adversaire n'a aucun mouvement possible => fin du jeu
 * @param {CaseData[]} tabData
 * @param {string} couleurAttaquant
 * @returns {boolean}
 * @memberof TraitementTabDataService
 */
isGameFinished(tabData: CaseData[], couleurAttaquant: string): boolean {
    const couleurDefenseur = couleurAttaquant.includes('noir') ? 'blanc' : 'noir';
    const piecesAdversaire: CaseData[] = this.getAllPieces(couleurDefenseur, tabData);
    return piecesAdversaire.every((caseEnCours) => {
      const depPoss = this.getDeplacementPossible(caseEnCours, tabData, couleurDefenseur, true);
      return depPoss.length === 0;
    });
  }
/**
 * renvoie true si le coup entré en paramêtre provoque un echec au joueur et est donc interdit
 *
 * @param {CaseData[]} tabData
 * @param {string} couleurEnCours
 * @param {CaseData} caseDepart
 * @param {CaseData} caseArrivee
 * @returns {boolean}
 * @memberof TraitementTabDataService
 */
getAutoCheckMove(tabData: CaseData[], couleurEnCours: string, caseDepart: CaseData, caseArrivee: CaseData): boolean {
    // check si le deplacement entraine une mise en echec et est donc impossible
    const tableauTest = JSON.parse(JSON.stringify( tabData ));
    tableauTest.find((elmCase) => elmCase.coordX === caseArrivee.coordX && elmCase.coordY === caseArrivee.coordY).piece = caseDepart.piece;
    tableauTest.find((elmCase) => elmCase.coordX === caseDepart.coordX && elmCase.coordY === caseDepart.coordY).piece = null;
    return (this.checkCheckState(tableauTest, (couleurEnCours.includes('noir') ? 'blanc' : 'noir')).length > 0);
  }

  /**
   *methode principale servant à calculer les deplacement possibles pour la case selectionnee
   *
   * @param {CaseData} caseSelectionnee
   * @param {CaseData[]} tabData
   * @memberof TraitementTabDataService
   */
  getDeplacementPossible(caseSelectionnee: CaseData, tabData: CaseData[], couleurEnCours: string, testEchec: boolean = false): CaseData[] {
    let casesDeplacementsPossibles: CaseData[] = [] as CaseData[];
    if (caseSelectionnee.piece != null) {
      if (caseSelectionnee.piece.includes('pion')) {
        casesDeplacementsPossibles = this.getDeplacementPion(caseSelectionnee.coordX, caseSelectionnee.coordY, tabData, couleurEnCours);
      } else if (caseSelectionnee.piece.includes('tour')) {
        casesDeplacementsPossibles = this.getDeplacementTour(caseSelectionnee.coordX, caseSelectionnee.coordY, tabData, couleurEnCours);
      } else if (caseSelectionnee.piece.includes('fou')) {
        casesDeplacementsPossibles = this.getDeplacementFou(caseSelectionnee.coordX, caseSelectionnee.coordY, tabData, couleurEnCours);
      } else if (caseSelectionnee.piece.includes('dame')) {
        casesDeplacementsPossibles = this.getDeplacementDame(caseSelectionnee.coordX, caseSelectionnee.coordY, tabData, couleurEnCours);
      } else if (caseSelectionnee.piece.includes('roi')) {
        casesDeplacementsPossibles =
        this.getDeplacementRoi(caseSelectionnee.coordX, caseSelectionnee.coordY, tabData, couleurEnCours, testEchec);
      } else if (caseSelectionnee.piece.includes('cav')) {
        casesDeplacementsPossibles = this.getDeplacementCav(caseSelectionnee.coordX, caseSelectionnee.coordY, tabData, couleurEnCours);
      }

      if (testEchec === true) {
        casesDeplacementsPossibles = casesDeplacementsPossibles.filter((caseArrivee) => !this.getAutoCheckMove(tabData, couleurEnCours,
          this.getCaseData(caseSelectionnee.coordX, caseSelectionnee.coordY, tabData), caseArrivee));
      }
      if (this.roque === true) {
        this.roque = false;
        const ligneBlancheOuNoire = couleurEnCours.includes('blanc') ? 8 : 1;
        const caseRoi: CaseData = {coordX: 5, coordY: ligneBlancheOuNoire, piece: 'roi_' + couleurEnCours};
        const fausseCaseRoi: CaseData = {coordX: 6, coordY: ligneBlancheOuNoire, piece: 'roi_' + couleurEnCours};

        casesDeplacementsPossibles = casesDeplacementsPossibles.filter((caseArrivee) =>
          !this.getAutoCheckMove(tabData, couleurEnCours, fausseCaseRoi, {coordX: 5, coordY: ligneBlancheOuNoire})
          && !this.getAutoCheckMove(tabData, couleurEnCours, caseRoi, {coordX: 6, coordY: ligneBlancheOuNoire}));

        casesDeplacementsPossibles = casesDeplacementsPossibles.filter((caseArrivee) =>
          !this.getAutoCheckMove(tabData, couleurEnCours, fausseCaseRoi, {coordX: 5, coordY: ligneBlancheOuNoire})
          && !this.getAutoCheckMove(tabData, couleurEnCours, caseRoi, {coordX: 4, coordY: ligneBlancheOuNoire}));
          }

    }
    return casesDeplacementsPossibles;
  }

  getDeplacementPion(x: number, y: number, tabData: CaseData[], couleurEnCours: string): CaseData[] {
    const caseAutorisees: CaseData[] = [];
    const sensDeplacement: number = couleurEnCours.includes('blanc') ? -1 : 1;
    // test deplacement simple
    let caseTestee: CaseData = this.getCaseData(x, (y + sensDeplacement), tabData);
    if (caseTestee != null && caseTestee.piece == null) {
      caseAutorisees.push(caseTestee);
      // test deplacement double
      if (y === 7 && sensDeplacement === -1 || y === 2 && sensDeplacement === 1) {
        caseTestee = this.getCaseData(x, (y + (2 * sensDeplacement)), tabData);
        if (caseTestee != null && caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        }
      }
    }
    // test attaque
    const lastMove: TourJeuData = this.journalEventService.getLastMove();
    for (let i = -1; i < 2; i += 2) {
      caseTestee = this.getCaseData(x + i, (y + (sensDeplacement)), tabData);
      if (caseTestee != null && caseTestee.piece != null && !caseTestee.piece.includes(couleurEnCours)) {
        caseAutorisees.push(caseTestee);
      } else if (couleurEnCours.includes('blanc') && y === 4
                && lastMove.piece.includes('pion')
                && lastMove.xDepart === x + i
                && lastMove.yDepart === 2
                && lastMove.yArrivee === 4) {
                  // coup en passant blanc
                  caseAutorisees.push(caseTestee);
      } else if (couleurEnCours.includes('noir') && y === 5
                && lastMove.piece.includes('pion')
                && lastMove.xDepart === x + i
                && lastMove.yDepart === 7
                && lastMove.yArrivee === 5) {
                  // coup en passant noir
                  caseAutorisees.push(caseTestee);
      }
    }
    return caseAutorisees;
  }

  getDeplacementFou(x: number, y: number, tabData: CaseData[], couleurEnCours: string): CaseData[] {
    const caseAutorisees: CaseData[] = [];
    let caseTestee: CaseData;
    // test deplacements haut droite (+x -y)
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x + i, y - i, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }
    // test deplacements haut gauche (-x -y)
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x - i, y - i, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }
    // test deplacements bas droite (+x +y)
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x + i, y + i, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }
    // test deplacements bas gauche (-x +y)
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x - i, y + i, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }
    return caseAutorisees;
  }

  getDeplacementTour(x: number, y: number, tabData: CaseData[], couleurEnCours: string): CaseData[] {
    const caseAutorisees: CaseData[] = [];
    // test deplacements horizontaux (x)
    let caseTestee: CaseData;
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x + i, y, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x - i, y, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }
    // test deplacements verticaux (y)
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x, y + i, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }
    for (let i = 1; i < 9; i++) {
      caseTestee = this.getCaseData(x, y - i, tabData);
      if (caseTestee != null) {
        if (caseTestee.piece == null) {
          caseAutorisees.push(caseTestee);
        } else {
          if (!caseTestee.piece.includes(couleurEnCours)) {
            caseAutorisees.push(caseTestee);
          }
          break;
        }
      }
    }

    return caseAutorisees;
  }

  getDeplacementDame(x: number, y: number, tabData: CaseData[], couleurEnCours: string): CaseData[] {
    console.log('deplacementDame');
    return this.getDeplacementTour(x, y, tabData, couleurEnCours).concat(this.getDeplacementFou(x, y, tabData, couleurEnCours));
  }

  getDeplacementRoi(x: number, y: number, tabData: CaseData[], couleurEnCours: string, testEchec: boolean): CaseData[] {
    const caseAutorisees: CaseData[] = [];
    for (let a = -1; a < 2; a++) {
      for (let b = -1; b < 2; b++) {
        if (!(a === 0 && b === 0)) {
          const caseTestee = this.getCaseData(x + a, y + b, tabData);
          if (caseTestee != null && (caseTestee.piece == null || !caseTestee.piece.includes(couleurEnCours))) {
            caseAutorisees.push(caseTestee);
          }
        }
      }
    }
    // roque
    const ligneBlancheOuNoire = couleurEnCours.includes('blanc') ? 8 : 1;
    if (this.journalEventService.isPremierDeplacement(5, ligneBlancheOuNoire) && testEchec) {
      // petit roque
      if (this.journalEventService.isPremierDeplacement(8, ligneBlancheOuNoire)
      && this.getCaseData(6, ligneBlancheOuNoire, tabData).piece == null
      && this.getCaseData(7, ligneBlancheOuNoire, tabData).piece == null
      ) {
        this.roque = true;
        caseAutorisees.push(this.getCaseData(7, ligneBlancheOuNoire, tabData));
      }
      // grand roque
      if (this.journalEventService.isPremierDeplacement(1, ligneBlancheOuNoire)
      && this.getCaseData(4, ligneBlancheOuNoire, tabData).piece == null
      && this.getCaseData(3, ligneBlancheOuNoire, tabData).piece == null
      ) {
        this.roque = true;
        caseAutorisees.push(this.getCaseData(3, ligneBlancheOuNoire, tabData));
      }
    }
    return caseAutorisees;
  }

  getDeplacementCav(x: number, y: number, tabData: CaseData[], couleurEnCours: string): CaseData[] {
    const caseAutorisees: CaseData[] = [];
    for (let i = -2; i < 3; i++) {
      if (i !== 0) {
        const j: number = (i === -2 || i === 2) ? 1 : 2;
        let caseTestee: CaseData = this.getCaseData(x + i, y + j, tabData);
        if (caseTestee != null && (caseTestee.piece == null || !caseTestee.piece.includes(couleurEnCours))) {
          caseAutorisees.push(caseTestee);
        }
        caseTestee = this.getCaseData(x + i, y - j, tabData);
        if (caseTestee != null && (caseTestee.piece == null || !caseTestee.piece.includes(couleurEnCours))) {
          caseAutorisees.push(caseTestee);
        }
      }
    }
    return caseAutorisees;
  }

}
