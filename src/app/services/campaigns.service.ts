import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Campaign } from '../campaigns/types/campaign';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  private campaignsSubject: BehaviorSubject<Campaign[]> = new BehaviorSubject<
    Campaign[]
  >([]);
  public campaigns$: Observable<Campaign[]> =
    this.campaignsSubject.asObservable();

  private changeSubject: BehaviorSubject<{ id: number; status: string }> =
    new BehaviorSubject<{ id: number; status: string }>({ id: 0, status: '' });
  public change$: Observable<{ id: number; status: string }> =
    this.changeSubject.asObservable();

  public parentBalance$: Observable<number> = of(0);

  constructor(private dataService: DataService) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const initialCampaigns = this.dataService.getCampaigns();
    this.campaignsSubject.next(initialCampaigns);
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.campaigns$;
  }

  removeCampaign(campaign: Campaign): void {
    const currentCampaigns = this.campaignsSubject.value;
    const updatedCampaigns = currentCampaigns.filter(
      (c) => c.id !== campaign.id,
    );
    this.campaignsSubject.next(updatedCampaigns);
    this.emitChange({ id: campaign.id, status: 'removed' });
  }

  editCampaign(campaign: Campaign): void {
    const currentCampaigns = this.campaignsSubject.value;
    const updatedCampaigns = currentCampaigns.map((c) =>
      c.id === campaign.id ? campaign : c,
    );
    this.campaignsSubject.next(updatedCampaigns);
    this.emitChange({ id: campaign.id, status: 'edit' });
  }

  addCampaign(campaign: Campaign): void {
    const currentCampaigns = this.campaignsSubject.value;
    const updatedCampaigns = [...currentCampaigns, campaign];
    this.campaignsSubject.next(updatedCampaigns);
  }

  getCost(): Observable<number> {
    return this.campaigns$.pipe(
      map((campaigns) =>
        campaigns.reduce((acc, campaign) => acc + campaign.fund, 0),
      ),
    );
  }

  getBalance(): Observable<number> {
    return this.getCost().pipe(map((cost) => 10000 - cost));
  }

  private emitChange(change: { id: number; status: string }): void {
    this.changeSubject.next(change);
  }
}
