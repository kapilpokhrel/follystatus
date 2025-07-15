export class Messages {
    constructor(code, prompt) {
        this.messages = $state(new Array());
        this.currentIndex = $state(0);
        this.currentMessage = $derived(this.messages[this.currentIndex] || "");
        
        this.statusCode = code;
        this.prompt = prompt;

        this.#getdata();
    }
    
    #getdata() {
        const url = `http://10.100.53.176:8080/funstatus/${this.statusCode}?` + 
            new URLSearchParams({prompt: this.prompt}).toString();
        fetch(url)
            .then(response => response.json())
            .then(data => this.messages.push(...data.status_messages))
            .catch(error => console.log(error));
    }

    get length() {
        return this.messages.length;
    }

    next() {
        if (!this.length)
            return
        this.currentIndex = Math.min(this.length - 1, this.currentIndex + 1);
        if (this.currentIndex == this.length - 2) {
            this.#getdata();
        }
    }

    prev() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
    }
    
}
