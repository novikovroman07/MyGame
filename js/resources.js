class Resources {
    resourceCache = {}
    readyCallbacks = []

    load = (Arr) => {
        Arr.forEach((url) => {
            if(!this.resourceCache[url]) {
                let img = new Image();
                this.resourceCache[url] = false;
                img.src = url;
                img.onload = () => {
                    this.resourceCache[url] = img;
                    if(this.isReady()) {
                        this.readyCallbacks.forEach((func) => func());
                        this.readyCallbacks = [];
                    }
                };
            }
        });
    }

    get = (url) => {
        return this.resourceCache[url];
    }

    isReady = () => {
        for(let k in this.resourceCache) {
            if(this.resourceCache.hasOwnProperty(k) &&
                !this.resourceCache[k]) {
                return false;
            }
        }
        return true;
    }

    onReady = (func) => {
        this.readyCallbacks.push(func);
    }

}