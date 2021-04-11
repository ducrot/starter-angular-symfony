import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '@pb/app/user';
import {
  ListUserRequest,
  ListUserRequest_Disabled,
  ListUserResponse,
  UserManagementServiceClient
} from '@pb/app/user-management-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { from, Observable } from 'rxjs';
import { UserDialogComponent } from '@modules/admin/component/user-dialog/user-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryMapper } from '@app/lib/query-mapper';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Logger } from '@app/service/logger.service';
import { TranslateService } from '@ngx-translate/core';

const log = new Logger('UsersPageComponent');

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent {

  readonly response$: Observable<ListUserResponse>;
  readonly columnsToDisplay: string[] = ['username', 'name', 'lastLogin'];

  // this thing translates between parameters in the url and a ListUserRequest
  readonly query = new QueryMapper<ListUserRequest>(ListUserRequest.create({
    page: 1,
    pageSize: 10,
    disabled: ListUserRequest_Disabled.NO
  }));

  readonly disabledAny = ListUserRequest_Disabled.ANY;
  readonly disabledYes = ListUserRequest_Disabled.YES;
  readonly disabledNo = ListUserRequest_Disabled.NO;


  constructor(
    private readonly matDialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private translate: TranslateService,
    private readonly client: UserManagementServiceClient
  ) {

    // whenever the parameters in the url change, we parse them
    route.params.subscribe(pm => this.query.parse(pm));

    // whenever the parsed parameters lead to a different ListUserRequest,
    // we execute that request, so the display updates.
    this.response$ = this.query.valueChange$.pipe(
      switchMap(request => from(client.list(request))),
      map(finishedCall => finishedCall.response),
      tap(x => log.debug('ListUserResponse:', x)),
      shareReplay(1)
    );

    // whenever query.update() is called, this executes and updates
    // the url parameters
    this.query.paramsChange$.subscribe(pm => {
      this.router.navigate(['./', pm], {
        relativeTo: this.route
      }).catch(e => console.error(e));
    });

  }


  async onCreateClick() {
    const dialogRef = this.matDialog.open(UserDialogComponent, {
      panelClass: 'user-dialog',
      data: {
        action: 'create'
      }
    });
    const user = await dialogRef.afterClosed().toPromise() as User | undefined;
    if (user) {
      this.translate.get('app.form.save_success').subscribe((res: string) => {
        this.snackBar.open(res);
      });
      // url parameters did not change, but we want to refresh the list anyway
      this.query.forceValueChange();
    }
  }

  async onEditClick(row: User) {
    const dialogRef = this.matDialog.open(UserDialogComponent, {
      panelClass: 'user-dialog',
      data: {
        user: row,
        action: 'update'
      }
    });
    const user = await dialogRef.afterClosed().toPromise() as User | undefined;
    if (user) {
      this.translate.get('app.form.save_success').subscribe((res: string) => {
        this.snackBar.open(res);
      });
      // url parameters did not change, but we want to refresh the list anyway
      this.query.forceValueChange();
    }
  }

  onPaginatorPage($event: PageEvent) {
    this.query.update({
      page: $event.pageIndex + 1,
      pageSize: $event.pageSize
    });
  }


  onEnabledButtonChange(request: ListUserRequest) {
    switch (request.disabled) {
      case ListUserRequest_Disabled.YES:
        this.query.update({disabled: ListUserRequest_Disabled.NO, page: 1});
        break;
      case ListUserRequest_Disabled.NO:
        this.query.update({disabled: ListUserRequest_Disabled.ANY});
        break;
      case ListUserRequest_Disabled.ANY:
        this.query.update({disabled: ListUserRequest_Disabled.NO, page: 1});
        break;
    }
  }

  onDisabledButtonChange(request: ListUserRequest) {
    switch (request.disabled) {
      case ListUserRequest_Disabled.YES:
        this.query.update({disabled: ListUserRequest_Disabled.ANY});
        break;
      case ListUserRequest_Disabled.NO:
        this.query.update({disabled: ListUserRequest_Disabled.YES, page: 1});
        break;
      case ListUserRequest_Disabled.ANY:
        this.query.update({disabled: ListUserRequest_Disabled.YES, page: 1});
        break;
    }
  }

  onDisabledFilterChange(change: MatButtonToggleChange) {
    this.query.update({disabled: change.value, page: 1});
  }

  onClearSearchButton() {
    this.query.update({searchText: ''});
  }

  onSearchChange(text: string) {
    // when search changes, we better go to page 1
    this.query.update({searchText: text, page: 1});
  }
}
