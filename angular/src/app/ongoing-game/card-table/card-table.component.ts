import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from '../../model/events';
import { Subscription } from 'rxjs';
import { Deck } from '../../model/deck';
import { CurrentGameService } from '../current-game.service';
import { PlayerHandComponent } from './player-hand/player-hand.component';
import { KeyValuePipe, NgFor } from '@angular/common';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
    selector: 'shpp-card-table',
    templateUrl: './card-table.component.html',
    styleUrls: ['./card-table.component.scss'],
    standalone: true,
    imports: [TranslocoDirective, NgFor, PlayerHandComponent, KeyValuePipe, CommonModule]
})

export class CardTableComponent implements OnDestroy {
  state: GameState = {}
  canReveal = true;
  revealedBlockVisible = true
  deck?: Deck;

  private stateSubscription: Subscription;
  private revealedSubscription: Subscription;
  private revealedBlockVisibilitySubscription: Subscription;
  private deckSubscription: Subscription;

  constructor(private currentGameService: CurrentGameService) {
    this.stateSubscription = this.currentGameService.state$
    .subscribe((state: GameState) => {
      this.state = state;
    });

    this.deckSubscription = currentGameService.deck$
    .subscribe((deck: Deck) => this.deck = deck);

    this.revealedSubscription = currentGameService.revealed$
    .subscribe((revealed: boolean) => this.canReveal = !revealed)

    this.revealedBlockVisibilitySubscription = currentGameService.revealedBlockVisibility$
    .subscribe((visibility: boolean) => this.revealedBlockVisible = visibility)
  }

  revealCards(): void {
    this.currentGameService.revealCards();
  }

  endTurn(): void {
    this.currentGameService.endTurn();
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.revealedSubscription.unsubscribe();
    this.deckSubscription.unsubscribe();
    this.revealedBlockVisibilitySubscription.unsubscribe();
  }

  getId(item: any): string {
    return item.key;
  }
}
