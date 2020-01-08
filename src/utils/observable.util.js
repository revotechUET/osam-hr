import {Observable} from 'rxjs';


export function createFilterFunction(functions) {
    return new Observable(observer => {
        // this function will called each time this
        // Observable is subscribed to.
        const subscription = observable.subscribe({
            next: function (value) {
                if (functions.next) {
                    observer.next(functions.next(value));
                } else {
                    observer.next(value);
                }
            },
            error: function (err) {
                if (functions.error) {
                    observer.error(functions.error(value));
                } else {
                    observer.error(value);
                }
            },
            complete: function () {
                if (functions.complete) {
                    functions.complete(observer);
                } else {
                    observer.complete();
                }
            }
        });
        // the return value is the teardown function,
        // which will be invoked when the new
        // Observable is unsubscribed from.
        return () => {
            subscription.unsubscribe();
        }
    });
}


