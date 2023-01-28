import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
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

export class MenuComponent implements OnInit {

  dishes: Dish[];
  errMess: string;

  // selectedDish: Dish;

  // onSelect(dish: Dish) {
  //   this.selectedDish = dish;
  // }

  constructor(private dishService: DishService,
    @Inject('BaseURL') public baseURL: any) { }

  ngOnInit() {

    this.dishService.getDishes().subscribe({
      next: dishes => this.dishes = dishes,
      error: errmess => this.errMess = <any>errmess
    })

  }

}
