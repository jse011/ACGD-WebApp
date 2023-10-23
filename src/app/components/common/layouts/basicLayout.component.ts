import { Component } from '@angular/core';
import { detectBody } from '../../../app.helpers';

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BasicLayoutComponent {

  public ngOnInit():any {
    //detectBody();
  }

  public onResize(){
    //detectBody();
  }

}