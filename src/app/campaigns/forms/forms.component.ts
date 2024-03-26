import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Campaign } from '../types/campaign';
import { DataService } from '../../services/data.service';
import { CampaignsService } from '../../services/campaigns.service';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, startWith } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsComponent implements OnInit {
  keyWordsControl: FormControl;
  myForm: FormGroup = new FormGroup({});
  budgetInicial: number = 10000;
  budget: number = this.budgetInicial;
  changedCampaign: { id: number; status: string } = { id: 0, status: '' };
  isEditing: boolean = false;
  campaigns: Campaign[] = [];
  products: string[] = this.dataService.getProducts();
  towns: string[] = this.dataService.getTowns();
  keyWord: string = '';
  keys$: Observable<string[]> = of([]);
  keyWordsArr: string[] = [];
  keyWords$: Observable<string[]> = of([]);

  editedCampaign: Campaign = {
    id: 4,
    name: '',
    productName: '',
    keyWords: ['', ''],
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

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private campaignsService: CampaignsService,
  ) {
    this.keyWordsControl = new FormControl('', Validators.required);
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      productName: ['', Validators.required],
      keyWords: this.keyWordsControl,
      bidAmount: [0, Validators.required],
      fund: [0, Validators.required],
      town: ['', Validators.required],
      radius: [0, Validators.required],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.keyWords$ = this.keyWordsControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((keyword) => {
        if (keyword && keyword.length >= 2) {
          return of(
            this.dataService.getKeyWords().filter((w) => w.includes(keyword)),
          );
        } else {
          return of([]);
        }
      }),
    );
  }

  showList() {
    this.listIsVisible = true;
  }

  hideList() {
    this.listIsVisible = false;
  }

  fetchKeywords() {
    const keywords = this.dataService.getKeyWords();
    this.keyWords$ = of(keywords);
  }

  onSelect(event: TypeaheadMatch) {
    this.keyWord = event.item;
  }

  onSelectKeyword(event: TypeaheadMatch<string>) {
    const selectedKey: string = event.item;
    if (this.keyWord.includes(',')) {
      this.keyWord += this.removeCharsBeforeLastComma(selectedKey) + ',';
    } else {
      this.keyWord = selectedKey + ',';
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

  reverseArrayToString(inputArray: string[]): string {
    const reversedString = inputArray.join(', ');

    return reversedString;
  }

  testForm(): void {
    this.keyWordsArr = this.splitString(this.keyWord);

    this.editedCampaign.name = this.myForm.value.name;
    this.editedCampaign.productName = this.myForm.value.productName;
    this.editedCampaign.keyWords = this.keyWordsArr;
    this.editedCampaign.bidAmount = this.myForm.value.bidAmount;
    this.editedCampaign.fund = this.myForm.value.fund;
    this.editedCampaign.town = this.myForm.value.town;
    this.editedCampaign.radius = this.myForm.value.radius;
    this.editedCampaign.status = this.myForm.value.status;

    if (this.isEditing) {
      this.campaigns[this.changedCampaign.id - 1] = this.editedCampaign;
      this.campaignsService.editCampaign(this.editedCampaign); // Call editCampaign method
      this.isEditing = false;
    } else {
      this.campaigns.push(this.editedCampaign);
      this.campaignsService.addCampaign(this.editedCampaign); // Call addCampaign method
    }

    this.myForm.reset();
    this.keyWord = '';
    this.editedCampaign = {
      id: this.campaigns.length + 1,
      name: '',
      productName: '',
      keyWords: [],
      bidAmount: 0,
      fund: 0,
      town: '',
      status: '',
      radius: 0,
    };
    this.budget = this.getBalance();
  }

  getCost(): number {
    if (this.campaigns) {
      return this.campaigns
        .filter((c) => c.status !== 'removed')
        .map((campaign) => campaign.fund)
        .reduce((previous, current) => previous + current, 0);
    }
    return 0;
  }
  getBalance(): number {
    return this.budgetInicial - this.getCost();
  }

  onCampaignChange(c: { id: number; status: string }) {
    this.changedCampaign = c;
    console.log(this.changedCampaign);
    const cam = this.campaigns.find((c) => c.id === this.changedCampaign.id);
    if (this.changedCampaign.status === 'removed' && cam) {
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
      }
      this.isEditing = true;
      this.getBalance();
      this.budget += this.editedCampaign.fund;
    }
  }
}
