import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchCriteriaSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public searchCriteria$: Observable<any> = this.searchCriteriaSubject.asObservable();

  constructor() {}

  setSearchCriteria(criteria: any): void {
    this.searchCriteriaSubject.next(criteria);
  }

  getSearchCriteria(): Observable<any> {
    return this.searchCriteria$;
  }}
