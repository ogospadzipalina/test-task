import { Component, OnInit } from '@angular/core';
import { NgForm,} from '@angular/forms';
import { Campaign } from '../types/campaign';
import { DataService } from '../../data.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})

export class FormsComponent implements OnInit {
  budgetInicial: number = 10000;
  budget: number = this.budgetInicial;
  changedCampaign:  {id: number, status: string} = {id: 0, status: ''};
  areWeEditing: boolean = false;
  campaigns: Campaign[] = [];
  products: string[] = this.dataService.getProducts();
  towns: string[] = this.dataService.getTowns();
  keyWord: string = '';
  keys$: Observable<string[]>;
  keyWordsArr: string[] = [];

  editedCampaign: Campaign = {
    id: 4,
    name: '',
    productName: '',
    keyWords: ['',''],
    bidAmount: 0,
    fund: 0,
    status: 'active',
    town: '',
    radius: 0,
  };

  name: string = '';
  productName: string = '';
  keyWords: string = '';
  bidAmount: number = 0;
  fund: number = 0;
  town: string = '';
  radius: number = 0;
  status: string = '';
  newId: number = 0;
  listIsVisible: boolean = false;

  constructor(private dataService: DataService) {this.keys$ = of([]);}

  ngOnInit(): void {
    this.campaigns = this.dataService.getCampaigns();
    console.log(this.campaigns);
    this.newId = this.campaigns.length + 1;
    this.budget = this.getBalance();
  }

  showList() {
    this.listIsVisible = true;
  }

  hideList() {
    this.listIsVisible = false;
  }

  doKeyWordSearch() {
    this.keys$ = of([]);
    if (this.keyWord.length > 0) {
      this.keys$ = this.fetchKeywords(this.keyWord);
    }
  }

  fetchKeywords(keyword: string): Observable<string[]> {
    const mockKeyword: string[] = this.dataService.getKeyWords();
    const q: string = this.removeCharsBeforeLastComma(keyword);
    return of(mockKeyword.filter((w)=> w.includes(q)));
  }

  selectKey(selectedKey: string) {
    if(this.keyWord.includes(',')) {
      this.keyWord += (this.removeCharsBeforeLastComma(selectedKey) + ',')
    } else {
    this.keyWord = (selectedKey + ',');
    }
  }

   removeCharsBeforeLastComma(inputString: string): string {
    const lastCommaIndex = inputString.lastIndexOf(',');

    if (lastCommaIndex !== -1) {
      return inputString.substring(lastCommaIndex + 1);
    } else {
      return inputString;
    }
  }

   splitString(inputString: string) {
    const stringArray = inputString.split(',');
    const trimmedArray = stringArray.map((str: string) => str.trim());

    return trimmedArray;
  }

 reverseArrayToString(inputArray: string[]) : string {
  const reversedString = inputArray.join(', ');

  return reversedString;
  }

  testForm(empForm: NgForm): void {
    console.log(empForm.value);
    this.keyWordsArr = this.splitString(this.keyWord);

    this.editedCampaign.name = this.name;
    this.editedCampaign.productName = this.productName;
    this.editedCampaign.keyWords = this.keyWordsArr;
    this.editedCampaign.bidAmount = this.bidAmount;
    this.editedCampaign.fund = this.fund;
    this.editedCampaign.town = this.town;
    this.editedCampaign.radius = this.radius;
    this.editedCampaign.status = this.status;

    if(this.areWeEditing) {
    this.campaigns[this.changedCampaign.id - 1] = this.editedCampaign;
    this.areWeEditing = false;

    } else {
      this.newId += 1;
      this.campaigns.push(this.editedCampaign);
    }
    console.log(this.keyWord);
    empForm.resetForm();

    this.name = '';
    this.productName = '';
    this.keyWord = '';
    this.bidAmount = 0;
    this.fund = 0;
    this.town = '';
    this.radius = 0;
    this.editedCampaign = {
      id: this.newId,
      name: '',
      productName: '',
      keyWords: [],
      bidAmount: 0,
      fund: 0,
      town: '',
      status: '',
      radius:  0,
    };
    this.budget = this.getBalance();
  }

  getCost(): number  {
    if(this.campaigns) {
    return this.campaigns
    .filter((c) => c.status !== 'removed')
    .map(campaign => campaign.fund)
    .reduce((previous, current) => previous + current, 0);
  }
    return 0;
  }
  getBalance(): number {
    return this.budgetInicial - this.getCost();
  }

  onCampaignChange(c: {id: number, status: string}) {
    this.changedCampaign = c;
    console.log(this.changedCampaign);
    const cam = this.campaigns.find((c) => c.id === this.changedCampaign.id);
    if(this.changedCampaign.status === 'removed' && cam) {
      this.getBalance();
      this.budget += cam?.fund;
      this.campaigns.filter((c) => c.id !== this.changedCampaign.id);
    } else {
      if (cam) {
      this.editedCampaign = cam;

      this.name = this.editedCampaign.name;
      this.productName = this.editedCampaign.productName;
      this.keyWord = this.reverseArrayToString(this.editedCampaign.keyWords);
      this.bidAmount = this.editedCampaign.bidAmount;
      this.fund = this.editedCampaign.fund;
      this.town = this.editedCampaign.town;
      this.radius = this.editedCampaign.radius;
      this.status = this.editedCampaign.status;
      console.log(this.keyWords);
      }
      this.areWeEditing = true;
      this.getBalance();
      this.budget += this.editedCampaign.fund;
    }
  }
}
