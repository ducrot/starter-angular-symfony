import { Params } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';


export class QueryMapper<T extends object> {

  private readonly defaultValue: T;
  private valueSubject: BehaviorSubject<T>;
  private paramsSubject: ReplaySubject<Params> = new ReplaySubject<Params>(1);

  public constructor(defaultValue: T) {
    this.defaultValue = defaultValue;
    const val = Object.assign({}, defaultValue);
    this.valueSubject = new BehaviorSubject<T>(val);
  }


  get valueChange$(): Observable<T> {
    return this.valueSubject.asObservable();
  }

  get paramsChange$(): Observable<Params> {
    return this.paramsSubject.asObservable();
  }


  forceValueChange() {
    this.valueSubject.next(this.valueSubject.getValue());
  }


  update(update: Partial<T>): void {
    const newVal = Object.assign({}, this.valueSubject.getValue(), update);
    if (this.areEqual(newVal, this.valueSubject.getValue())) {
      return;
    }
    const pm = this.toParams(newVal);
    this.paramsSubject.next(pm);
  }


  parse(params: Params): void {
    const partial = this.fromParams(params);
    const newVal = Object.assign({}, this.defaultValue, partial);
    if (this.areEqual(newVal, this.valueSubject.getValue())) {
      return;
    }
    this.valueSubject.next(newVal);
  }


  private fromParams(pm: Params): Partial<T> {
    const r: { [index: string]: any } = {};
    const d: { [index: string]: any } = this.defaultValue;
    for (let k in d) {
      if (!pm.hasOwnProperty(k) || pm[k] === null) {
        continue;
      }
      const t = typeof d[k];
      if (t === 'string') {
        r[k] = pm[k].toString();
      } else if (t === 'number') {
        r[k] = parseInt(pm[k].toString());
      } else if (t === 'boolean') {
        r[k] = pm[k] === 'true';
      } else {
        throw new Error();
      }
    }
    return r as Partial<T>;
  }

  private toParams(value: T): Params {
    const d: { [index: string]: any } = this.defaultValue;
    const v: { [index: string]: any } = value;
    const pm: Params = {};
    for (let k in d) {
      if (v[k] !== d[k]) {
        pm[k] = v[k].toString();
      }
    }
    return pm;
  }

  private areEqual(a: T, b: T): boolean {
    const d: { [index: string]: any } = this.defaultValue;
    for (let k in d) {
      if (a[k] !== b[k]) {
        return false;
      }
    }
    return true;
  }


}
