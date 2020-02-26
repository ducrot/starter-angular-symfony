export function jsonDateParse(arg: string | Date): Date {
  if (arg instanceof Date) {
    return arg;
  }
  if (isIso8601(arg)) {
    return new Date(arg);
  }
  throw new Error();
}

export function jsonDateTryParse(arg: any): Date | undefined {
  if (arg === undefined || arg === null) {
    return undefined;
  }
  if (arg instanceof Date) {
    return arg;
  }
  if (isIso8601(arg)) {
    return new Date(arg);
  }
  return undefined;
}

function isIso8601(value: any) {
  if (value === null || value === undefined || typeof value !== 'string') {
    return false;
  }
  if (value.length < 20 || value.length > 35) {
    // lengths are not tested, this is just a guess
    return false;
  }
  return re_iso8601.test(value);
}

// Migrated from AngularJS https://raw.githubusercontent.com/Ins87/angular-date-interceptor/master/src/angular-date-interceptor.js
const re_iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;
