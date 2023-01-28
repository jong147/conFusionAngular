import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  featuredLeader: Leader;
  errMess: string;

  constructor(private leaderService: LeaderService,
    @Inject('BaseURL') public baseURL: any) { }

  ngOnInit(): void {

    this.leaderService.getLeaders()
      .subscribe({ next: leaders => this.leaders = leaders, error: errmess => this.errMess = <any>errmess });
    
    this.leaderService.getFeaturedLeader()
      .subscribe({ next: featuredLeader => this.featuredLeader = featuredLeader, error: errmess => this.errMess = <any>errmess });

    // this.leaderService.getLeaders()
    //   .subscribe(leaders => this.leaders = leaders);

    // this.leaderService.getFeaturedLeader()
    //   .subscribe(featuredLeader => this.featuredLeader = featuredLeader);
  }

}
