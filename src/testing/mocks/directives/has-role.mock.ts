import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class MockHasRole implements OnInit {
  @Input('appHasRole') requiredRoles: string | string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }
}
