import { Subject, combineLatest, forkJoin } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface Books {
    data: string;
}

interface Resource {
    data: string;
}

interface Study {
    book: Books;
    resource: Resource;
}

class StudyManager {
    public book = new Subject<Books>();
    public resource = new Subject<Resource>();
    public study = new Subject<Study>();

    constructor() {
        this.subscribeVar();
    }

    public subscribeVar() {
        //Solution mentioned to them by me gives incorrect answer
        // forkJoin([this.book, this.resource]).subscribe(([bookData, resourceData]) => {
        //     const studyData: Study = {
        //         book: bookData,
        //         resource: resourceData,
        //     };
        //     this.study.next(studyData);
        // });

        // this.study.subscribe(data => {
        //     console.log('Study Data:', data);
        // });
        
        const combined$ = combineLatest([this.book, this.resource]).pipe(
            map(([bookData, resourceData]) => ({ book: bookData, resource: resourceData }))
        );

        const matchedData$ = combineLatest([combined$, this.study]).pipe(
            filter(([combinedData, studyData]) =>
                combinedData.book.data === studyData.book.data &&
                combinedData.resource.data === studyData.resource.data
            ),
            map(([matchedData]) => matchedData)
        );

        matchedData$.subscribe(data => {
            console.log('Matched Study Data:', data);
        });
    }

    public addBook(data: string) {
        this.book.next({ data });
    }

    public addResource(data: string) {
        this.resource.next({ data });
    }

    public addStudy(bookData: string, resourceData: string) {
        this.study.next({ book: { data: bookData }, resource: { data: resourceData } });
    }
}

const manager = new StudyManager();

manager.addBook('Book 1');
manager.addResource('Resource 1');
manager.addStudy('Book 1', 'Resource 1');

manager.addBook('Book 2');
manager.addResource('Resource 2');
manager.addStudy('Book 2', 'Resource 2');

manager.addBook('Book 3');
manager.addResource('Resource 3');
manager.addStudy('Book 3', 'Resource 4');

