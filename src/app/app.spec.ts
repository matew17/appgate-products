import { provideRouter } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { App } from './app';
import { Layout } from '@components/layout/layout';
import { MockLayoutComponent } from '@mocks/components/layout.mock';
import { mockModalService } from '@mocks/services/modal.mock';
import { ModalService } from '@services/modal/modal';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: ModalService, useValue: mockModalService },
      ],
    })
      .overrideComponent(App, {
        remove: { imports: [Layout] },
        add: { imports: [MockLayoutComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;

    modalService = TestBed.inject(ModalService);
  });

  afterEach(() => {
    mockModalService.registerHostViewContainer.calls.reset();
  });

  it('should create the app component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerHostViewContainer only once on init', () => {
    fixture.detectChanges();

    expect(modalService.registerHostViewContainer).toHaveBeenCalledTimes(1);

    fixture.detectChanges();
    expect(modalService.registerHostViewContainer).toHaveBeenCalledTimes(1);
  });

  it('should render layout component', () => {
    fixture.detectChanges();

    const layout = fixture.nativeElement.querySelector('app-layout');
    const layoutContent = layout.textContent;

    expect(layoutContent).toContain('Mock Layout Component');
  });
});
