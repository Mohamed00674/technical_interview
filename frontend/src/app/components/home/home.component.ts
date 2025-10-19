import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  blogs = [
    {
      id: 1,
      title: 'First Blog',
      content: 'This is my first post.',
      comments: ['Nice!', 'Welcome!'],
    },
    {
      id: 2,
      title: 'Angular 17 Tips',
      content: 'Angular 17 is awesome!',
      comments: ['Totally agree!'],
    },
  ];
  newComment = '';

  addComment(blog: any) {
    if (this.newComment.trim()) {
      blog.comments.push(this.newComment);
      this.newComment = '';
    }
  }
}
