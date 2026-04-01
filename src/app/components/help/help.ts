import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: false,
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {
faqToggle(index: number) {
  const faqList = document.querySelectorAll('.faq-answer');
  faqList.forEach((el, i) => {
    el.setAttribute('style', i === index && el.clientHeight === 0 ? 'display:block' : 'display:none');
  });
}
}
