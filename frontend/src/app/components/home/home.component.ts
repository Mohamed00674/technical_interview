import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';
import { Blog, BlogComment } from '../../core/models/blog.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  blogs: Blog[] = [];
  newComment: { [blogId: string]: string } = {};
  userRoles: string[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.fetchAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs.map((b) => ({
          ...b,
          comments: Array.isArray(b.comments) ? b.comments : [],
        }));
      },
      error: (err) => console.error(err),
    });
  }

  addComment(blog: Blog) {
    const content = this.newComment[blog._id!];
    if (!content?.trim()) return;

    this.blogService.addComment(blog._id!, content).subscribe({
      next: (comment) => {
        blog.comments = blog.comments || [];
        blog.comments.push(comment);
        this.newComment[blog._id!] = '';
      },
      error: (err) => console.error(err),
    });
  }
}
