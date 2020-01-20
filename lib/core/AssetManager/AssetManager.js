class AssetManager {
  constructor() {
    this._assetGroups = {};

    this.getAssetGroup = id => {
      if (!this._assetGroups[id])
        this._assetGroups[id] = new AssetManagerGroup(id);
      return this._assetGroups[id];
    };

    this.registerURL = (id, url, autoload = true, groupId = 'default') => {
      this.getAssetGroup(groupId).registerURL(id, url, autoload);
    };

    this.unregisterURL = (id, groupId = 'default') => {
      this.getAssetGroup(groupId).unregisterURL(id);
    };

    this.loadURLs = async (statusCallback, groupId = 'default') => {
      this.getAssetGroup(groupId).loadURLs(statusCallback);
    };

    this.stream = async (id, groupId = 'default') => {
      const assetGroup = this.getAssetGroup(groupId);
      return await assetGroup.load(id, true);
    };

    this.load = async (id, groupId = 'default') => {
      const assetGroup = this.getAssetGroup(groupId);
      return await assetGroup.load(id);
    };

    this.unload = (id, groupId = 'default') => {
      const assetGroup = this.getAssetGroup(groupId);
      return assetGroup.unload(id);
    };

    this.unloadAll = (groupId = 'default') => {
      const assetGroup = this.getAssetGroup(groupId);
      return assetGroup.unloadAll();
    };
  }
}

class AssetManagerGroup {
  constructor(id) {
    this.id = id;
    this._urlLookup = {};
    this._loadedAssets = {};
    this._urlsToAutoload = [];

    this.registerURL = (id, url, autoload) => {
      this._urlLookup[id] = { url: url, autoload: autoload };
      if (autoload) {
        this._urlsToAutoload.push(id);
      }
    };

    this.unregisterURL = id => {
      const data = this._urlLookup[id];
      if (!data) return;

      if (data.autoload)
        this._urlsToAutoload = this._urlsToAutoload.filter(x => x !== id);

      delete this._urlLookup[id];
      this._numURLs--;
    };

    this.loadURLs = async statusCallback => {
      let numLoaded = 0;
      for (const id of this._urlsToAutoload) {
        const data = this._urlLookup[id];
        if (!data.autoload) continue;

        await this.load(id);
        numLoaded++;

        statusCallback(numLoaded, this._urlsToAutoload.length);
      }
    };

    this.load = async (id, autoUnload = false) => {
      if (this._loadedAssets[id]) return this._loadedAssets[id];

      const url = this._urlLookup[id].url;
      let asset;

      if (url.endsWith('jpg') || url.endsWith('jpeg') || url.endsWith('png')) {
        asset = new Image();
        asset.src = url;
      }

      if (!autoUnload) this._loadedAssets[id] = asset;

      return asset;
    };

    this.unload = id => {
      delete this._loadedAssets[id];
    };

    this.unloadAll = () => {
      this._loadedAssets = {};
    };
  }
}

export default AssetManager;
