import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Campaign } from '../types/campaign';
import { CampaignsService } from '../../services/campaigns.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() avalibleCampaigns: Campaign[] | null | undefined;
  @Output() changedC: EventEmitter<{ id: number; status: string }> =
    new EventEmitter<{ id: number; status: string }>();
  campaigns: Campaign[] = [];
  parentBalance: number = 10000;
  ogBalance: number = this.parentBalance;
  changedCampaign: { id: number; status: string } = { id: 0, status: '' };
  constructor(private campaignsService: CampaignsService) {}

  ngOnInit(): void {
    this.campaignsService.getCampaigns().subscribe((campaigns) => {
      this.campaigns = campaigns;
    });

    this.campaignsService.parentBalance$.subscribe((balance) => {
      this.parentBalance = balance;
    });
  }

  removeCampaign(campaign: Campaign): void {
    this.campaignsService.removeCampaign(campaign);
  }

  editCampaign(campaign: Campaign): void {
    this.campaignsService.editCampaign(campaign);
  }
}
