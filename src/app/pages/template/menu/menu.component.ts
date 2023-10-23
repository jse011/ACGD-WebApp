import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services';
import { IMenu } from 'src/app/_interface/IMenu.interface';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  itemsMenu: IMenu[];

  constructor(
    private readonly menuService: MenuService,
    private session: SessionService
  ) {
    this.itemsMenu = menuService.getItems();
  }

  ngOnInit(): void {}

  checkPermission(routename: any): boolean {
    
    return this.session.validatePermission(routename);
  }
}