import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Campaign } from '../types/campaign';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() avalibleCampaigns: Campaign[] | null | undefined;
  @Output() changedC: EventEmitter<{id: number, status: string}> = new EventEmitter<{id: number, status: string}>();
  campaigns: Campaign[] = [];
  parentBalance: number = 10000;
  ogBalance: number = this.parentBalance;
  changedCampaign: {id: number, status: string} = {id: 0, status: ''};
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    if (this.avalibleCampaigns) {
    this.campaigns = this.avalibleCampaigns;
    }
    this.parentBalance = this.getBalance();
  }


  removeCampaign(campaign: Campaign): void {
    this.campaigns = this.campaigns.filter((c) => c.id !== campaign.id)
    this.changedCampaign.id = campaign.id;
    this.changedCampaign.status = 'removed';
    this.parentBalance = this.ogBalance - this.getCost();
    this.changeC(this.changedCampaign);
  }

  editCampaign(campaign: Campaign): void {
    this.changedCampaign.id = campaign.id;
    this.changedCampaign.status = 'edit';
    this.changeC(this.changedCampaign);
  }

  getCost(): number  {
    if(this.campaigns) {
    return this.campaigns
    .map(campaign => campaign.fund)
    .reduce((previous, current) => previous + current, 0);
    }
    return 0;
  }
  getBalance(): number {
    this.parentBalance -= this.getCost();
    return this.parentBalance;
  }

  changeC(campaign: {id: number, status: string}) : void {
    this.changedC.emit(campaign);
  }
}
