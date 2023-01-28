import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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

export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,
    @Inject('BaseURL') public baseURL: any) { }

  ngOnInit() {

    this.dishservice.getFeaturedDish()
      .subscribe({ next: dish => this.dish = dish, error: errmess => this.dishErrMess = <any>errmess });

    this.promotionservice.getFeaturedPromotion()
      .subscribe({ next: promotion => this.promotion = promotion, error: errmess => this.promotionErrMess = <any>errmess });

    this.leaderservice.getFeaturedLeader()
      .subscribe({ next: leader => this.leader = leader, error: errmess => this.leaderErrMess = <any>errmess });

  }

}
