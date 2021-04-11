import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Feature, features } from '@modules/features/features.data';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesComponent {

  features: Feature[] = features;

  constructor() {
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
