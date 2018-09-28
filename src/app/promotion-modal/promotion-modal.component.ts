import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {PopupData} from '../popup-data';

@Component({
  selector: 'app-promotion-modal',
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.css']
})
export class PromotionModalComponent implements OnInit {

  private couleur: string;
  private piece: string;
  private lienTour: string;
  private lienCavalier: string;
  private lienFou: string;
  private lienDame: string;

  private lienImageDeb = '../../assets/img/';
  private lienImageFin = '.png';

  constructor(public dialogRef: MatDialogRef<PromotionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupData) {
      this.couleur = data.couleur;
    }

    public returnPiece(piece: string): string {
      let piecemodif: string = piece + '_' + this.couleur;
      if (piece === 'dame' || piece === 'tour') {
        if (this.couleur === 'noir') {
          piecemodif += 'e';
        } else {
          piecemodif += 'he';
        }
      }
      return piecemodif;
    }

  ngOnInit() {
    if (this.couleur === 'blanc') {
      this.lienTour = this.lienImageDeb + 'tour_blanche' + this.lienImageFin;
      this.lienCavalier = this.lienImageDeb + 'cav_blanc' + this.lienImageFin;
      this.lienFou = this.lienImageDeb + 'fou_blanc' + this.lienImageFin;
      this.lienDame = this.lienImageDeb + 'dame_blanche' + this.lienImageFin;
    } else {
      this.lienTour = this.lienImageDeb + 'tour_noire' + this.lienImageFin;
      this.lienCavalier = this.lienImageDeb + 'cav_noir' + this.lienImageFin;
      this.lienFou = this.lienImageDeb + 'fou_noir' + this.lienImageFin;
      this.lienDame = this.lienImageDeb + 'dame_noire' + this.lienImageFin;
    }
  }

}
