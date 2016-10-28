import { Component } from '@angular/core';

import {OcticonService} from '../../providers/octicon';

import {FileService} from '../../providers/filehttp'

@Component({
  selector: 'comment-reactions',
  templateUrl: 'comment-reactions.html'
})
export class CommentReactions {
  REACTIONS = [
    {
      image: '1f44d',
      content: '+1'
    },
    {
      image: '1f44e',
      content: '-1'
    },
    {
      image: '1f604',
      content: 'Laugh'
    },
    {
      image: '1f389',
      content: 'Hooray'
    },
    {
      image: '1f615',
      content: 'Confused'
    },
    {
      image: '2764',
      content: 'Heart'
    }
  ]
  isPanelOpen: Boolean = false;

  constructor(
    public octicon: OcticonService,
    private filehttp: FileService
  ) {}

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
  }

  toggleReaction(reaction) {
    this.togglePanel();
  }
}
