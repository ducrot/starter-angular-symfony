import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { User } from '@pb/app/user';
import {
  ListRequest,
  ListRequest_Disabled,
  ListResponse,
  UserManagementService
} from '@pb/app/user-management-service';
import { USER_MAN_SERVICE } from '@modules/admin/service-tokens';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { from, Observable } from 'rxjs';
import { CreateUserDialogComponent } from '@modules/admin/component/create-user-dialog/create-user-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryMapper } from '@app/lib/query-mapper';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent {

  readonly response$: Observable<ListResponse>;

  // this thing translates between parameters in the url and a ListRequest
  readonly query = new QueryMapper<ListRequest>(ListRequest.fromPartial({
    page: 1,
    pageSize: 10,
    disabled: ListRequest_Disabled.NO
  }));

  readonly disabledYes = ListRequest_Disabled.YES;
  readonly disabledNo = ListRequest_Disabled.NO;


  constructor(
    private readonly matDialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(USER_MAN_SERVICE) private readonly service: UserManagementService
  ) {

    // whenever the parameters in the url change, we parse them
    route.params.subscribe(pm => this.query.parse(pm));

    // whenever the parsed parameters lead to a different ListRequest,
    // we execute that request, so the display updates.
    this.response$ = this.query.valueChange$.pipe(
      switchMap(request => from(service.list(request))),
      tap(x => console.log('UsersPageComponent list response:', x)),
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
    const dialogRef = this.matDialog.open(CreateUserDialogComponent);
    const user = await dialogRef.afterClosed().toPromise() as User | undefined;
    if (user) {
      this.snackBar.open(`User "${user.username}" created.`);
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


  onEnabledButtonChange(request: ListRequest) {
    switch (request.disabled) {
      case ListRequest_Disabled.YES:
        this.query.update({disabled: ListRequest_Disabled.NO, page: 1});
        break;
      case ListRequest_Disabled.NO:
        this.query.update({disabled: ListRequest_Disabled.ANY});
        break;
      case ListRequest_Disabled.ANY:
        this.query.update({disabled: ListRequest_Disabled.NO, page: 1});
        break;
    }
  }

  onDisabledButtonChange(request: ListRequest) {
    switch (request.disabled) {
      case ListRequest_Disabled.YES:
        this.query.update({disabled: ListRequest_Disabled.ANY});
        break;
      case ListRequest_Disabled.NO:
        this.query.update({disabled: ListRequest_Disabled.YES, page: 1});
        break;
      case ListRequest_Disabled.ANY:
        this.query.update({disabled: ListRequest_Disabled.YES, page: 1});
        break;
    }
  }

  onClearSearchButton() {
    this.query.update({searchText: ''});
  }

  onSearchChange(text: string) {
    // when search changes, we better go to page 1
    this.query.update({searchText: text, page: 1});
  }
}
