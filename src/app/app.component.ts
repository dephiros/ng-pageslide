import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public checked = false;
  public checkedSlow = false;
  public checkedFast = false;
  public checkedUp = false;
  public checkedDown = false;
  public checkLeft = false;
  public checkPush = false;
  public checkEscape = false;
  public checkClassContainer = false;
  public checkNoOutside = false;
  public checkDynamicSize = false;
  public checkEvent = false;
  public checkInContainerLeft = false;
  public checkInContainerTop = false;
  public size = 100;

  public onClose() {
    alert('close');
  }

  public onOpen() {
    alert('open');
  }
}
