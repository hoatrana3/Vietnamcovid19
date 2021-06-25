class FbGroupShareModel {

    constructor() {
        this.domNode = null;
        this.innerHtml =
            `<div class="fb-group" data-href="https://www.facebook.com/groups/538220833757944/"
                             data-width="280" data-show-social-context="true" data-show-metadata="true"></div>`;

        this.init();
    }

    init() {
        const child = document.createElement('div');
        child.innerHTML = this.innerHtml;

        // Because of some reasons, facebook group share doesn't show after changing router
        // So I need to find the way to save it's dom in the first initialization and use it in the nex time...
        // This trick solved the problem!!
        this.domNode = child.firstChild;

        FbGroupShareModel.hideDomNode(this.domNode);

        document.body.appendChild(this.domNode);
    }

    static hideDomNode(domNode) {
        domNode.classList.add('invisible');
    }

    static showDomNode(domNode) {
        domNode.classList.remove('invisible');
    }
}

export default FbGroupShareModel;
