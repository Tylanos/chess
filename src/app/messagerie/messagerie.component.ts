import { Component, OnInit } from '@angular/core';
import { JournalEventService } from '../journal-event.service';
import { TourJeuData } from '../tour-jeu-data';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css']
})
export class MessagerieComponent implements OnInit {

  constructor(public journalEventService: JournalEventService) { }

  ngOnInit() {
  }

  construireMessage(tourDeJeuData: TourJeuData): string {
    return 'tour ' + tourDeJeuData.tour + ' : ' + tourDeJeuData.piece
    + ' ' + tourDeJeuData.xDepart + '-' + tourDeJeuData.yDepart + ' => ' + tourDeJeuData.xArrivee + '-' + tourDeJeuData.yArrivee;
  }

}
