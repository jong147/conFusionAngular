import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Params, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  providers: [DatePipe]
})

export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective: any;
  commentForm: FormGroup;
  comment: Comment;

  dish: Dish;
  dishcopy: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  // Prepare today's date for the comment
  today: Date = new Date();
  errMess: string;

  formErrors: any = {
    'author': '',
    'comment': ''
  };

  validationMessages: any = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 50 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 2 characters long.',
      'maxlength': 'Comment cannot be more than 500 characters long.'
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public baseURL: any,) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe({
      next: dishIds => this.dishIds = dishIds,
      error: errmess => this.errMess = <any>errmess
    })
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id);
        (errmess: any) => this.errMess = <any>errmess
      });
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {

    this.comment = this.commentForm.value;
    // Adding the date to the comment
    this.comment.date = this.today.toISOString();
    // Pushing the comment to the dish
    // this.dish.comments.push(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe({
        next: dish => {
          this.dish = dish; this.dishcopy = dish;
        },
        error: errmess => { this.dish = null as any; this.dishcopy = null as any; this.errMess = <any>errmess; }
        //revisar as any
      })
    console.log(this.comment);
    this.commentForm.reset({
      comment: '',
      author: ''
    });
    this.commentFormDirective.resetForm();
    // Resetting the rating to 5
    this.commentForm.controls['rating'].setValue(5);

  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
