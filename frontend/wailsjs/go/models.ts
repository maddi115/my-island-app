export namespace email {
	
	export class Email {
	    id: string;
	    title: string;
	    summary: string;
	    from: string;
	
	    static createFrom(source: any = {}) {
	        return new Email(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.summary = source["summary"];
	        this.from = source["from"];
	    }
	}

}

