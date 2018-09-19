import { inject, customElement } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-http-client";

@customElement("api-calls")
@inject(EventAggregator)
export class APICalls {
    constructor(EventAggregator) {
        this.ea = EventAggregator;
        this.visible = false;
        this.calls = [];
    }

    attached() {
        this.toggleAPICallsSubscriber = this.ea.subscribe("toggleAPICalls", () => {
            this.visible = !this.visible;
        });

        this.loadCalls();
    }

    loadCalls() {
        let client = new HttpClient();

        client.get("/api/api-calls").then(res => {
            let calls = JSON.parse(res.response);
    
            if (this.calls.length !== calls.length) {
                this.calls = calls;
            }
    
            window.setTimeout(() => {
                this.loadCalls();
            }, 1500);
        });        
    }

    showCallDetails(call) {
        this.selectedCall = call;

        $(".api-calls-container").animate({ scrollTop: 0 }, 500);
    }

    copyTextToClipboard(e) {
        let $btn = $(e.target);
        let $code = $btn.parent().find("code");
        let text = $code.text();

        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
            return;
        }
    
        navigator.clipboard.writeText(text).then(() => { }, () => {
            this.fallbackCopyTextToClipboard(text);
        });
    }
    
    fallbackCopyTextToClipboard(text) {
        let textarea = document.createElement("textarea");
        
        textarea.textContent = text;
        document.body.appendChild(textarea);
      
        let selection = document.getSelection();
        let range = document.createRange();
    
        range.selectNode(textarea);
        selection.removeAllRanges();
        selection.addRange(range);
              
        selection.removeAllRanges();
      
        document.body.removeChild(textarea);
    }

    detached() {
        this.toggleAPICallsSubscriber.dispose();
    }

    close() {
        this.visible = false;
    }
}