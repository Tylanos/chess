import { Injectable } from '@angular/core';
import { TourJeuData } from './tour-jeu-data';

@Injectable({
  providedIn: 'root'
})
export class JournalEventService {

  public messages: TourJeuData[] = [];

  add(message: TourJeuData) {
    this.messages.push(message);
    console.log(message);
  }

  getJournal(): TourJeuData[] {
    return this.messages;
  }

  isPremierDeplacement(xInit: number, yInit: number): boolean {
    console.log(xInit, yInit);
    return this.messages.every((tourdeJeuData) => !(tourdeJeuData.xDepart === xInit && tourdeJeuData.yDepart === yInit));
  }

  getLastMove(): TourJeuData {
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
  }

  clear() {
    this.messages = [];
  }
}
