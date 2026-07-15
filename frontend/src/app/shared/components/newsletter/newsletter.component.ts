import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  template: `
    <section class="newsletter container">
      <div class="text">
        <h2>Stay upto date about our latest offers</h2>
      </div>
      <div class="form">
        <input type="email" placeholder="Enter your email address" disabled title="Newsletter signup isn't wired to a backend endpoint yet" />
        <button class="btn btn-outline" disabled>Subscribe to Newsletter</button>
      </div>
    </section>
  `,
  styles: [
    `
      .newsletter {
        background: var(--color-black);
        color: var(--color-white);
        border-radius: var(--radius-lg);
        padding: 40px;
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        align-items: center;
        justify-content: space-between;
        margin: 60px auto;
      }
      h2 { font-size: 28px; max-width: 420px; }
      .form { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 340px; }
      input {
        border-radius: var(--radius-full);
        border: none;
        padding: 14px 20px;
        font-size: 14px;
      }
      button { background: var(--color-white); color: var(--color-black); border: none; }
      @media (min-width: 700px) { .form { width: 340px; } }
    `,
  ],
})
export class NewsletterComponent {}
