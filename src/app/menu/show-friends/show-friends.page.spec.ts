import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowFriendsPage } from './show-friends.page';

describe('ShowFriendsPage', () => {
  let component: ShowFriendsPage;
  let fixture: ComponentFixture<ShowFriendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFriendsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowFriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
