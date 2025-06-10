import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from '@components/layout/layout';
import { ModalService } from '@services/modal/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private modalService = inject(ModalService);
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.modalService.registerHostViewContainer(this.viewContainerRef);
  }
}
