import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit, OnChanges {

  @Input() coordX: number;
  @Input() coordY: number;
  @Input() piece: string;
  private pieceImg: string;

  constructor() { }

  clickCase() {
    console.log(this.coordX, this.coordY, this.piece);
    this.selectionPiece();
  }

  selectionPiece(): number[][] {
    return [[0, 1], [2, 3]];
  }

  ngOnInit() {
    this.pieceImg = '../../assets/img/' + this.piece + '.png';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.piece != null) {
      this.pieceImg = '../../assets/img/' + this.piece + '.png';
    }
    // changes.prop contains the old and the new value...
  }

}
