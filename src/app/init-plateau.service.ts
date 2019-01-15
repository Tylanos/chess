import { Injectable } from '@angular/core';
import { CaseData } from './case-data';

@Injectable({
  providedIn: 'root'
})
export class InitPlateauService {

  constructor() { }

  public initPlateau(x: number, y: number): CaseData {
    const caseData: CaseData = new CaseData;
    caseData.coordX = x;
    caseData.coordY = y;
    switch (y) {
      case 1:
        switch (x) {
          case 1:
          case 8:
            caseData.piece = 'tour_noire';
            break;
          case 3:
          case 6:
            caseData.piece = 'fou_noir';
            break;
          case 2:
          case 7:
            caseData.piece = 'cav_noir';
            break;
          case 4:
            caseData.piece = 'dame_noire';
            break;
          case 5:
            caseData.piece = 'roi_noir';
            break;
          default:
            caseData.piece = null;
        }
        break;
      case 2:
        caseData.piece = 'pion_noir';
        break;
      case 7:
        caseData.piece = 'pion_blanc';
        break;
      case 8:
        switch (x) {
          case 1:
          case 8:
            caseData.piece = 'tour_blanche';
            break;
          case 3:
          case 6:
            caseData.piece = 'fou_blanc';
            break;
          case 2:
          case 7:
            caseData.piece = 'cav_blanc';
            break;
          case 4:
            caseData.piece = 'dame_blanche';
            break;
          case 5:
            caseData.piece = 'roi_blanc';
            break;
          default:
            caseData.piece = null;
            break;
        }
        break;
      default:
        caseData.piece = null;
    }
    return caseData;
  }

  public initPlateauFull(): CaseData[] {
    const dataTabFull: CaseData[] = [];
    for (let x = 1; x < 9; x++) {
      for (let y = 1; y < 9; y++) {
        dataTabFull.push(this.initPlateau(x, y));
      }
    }
    return dataTabFull;
  }
}
