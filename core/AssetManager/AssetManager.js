class AssetManager {
  constructor() {
    this._assetGroups = {};

    this.getAssetGroup = id => {
      if (!this._assetGroups[id])
        this._assetGroups[id] = new AssetManagerGroup(id);
    };

    this.registerURL = (id, url, groupId = 'default') => {
      this.getAssetGroup(groupId).registerURL(id, url);
    };

    this.unregisterURL = (id, groupId = 'default') => {
      this.getAssetGroup(groupId).unregisterURL(id);
    };

    this.loadURLs = (groupId = 'default') => {
      this.getAssetGroup(groupId).loadURLs();
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
    this._numURLs = 0;
    this._loadedAssets = {};

    this.registerURL = (id, url) => {
      this._urlLookup[id] = url;
      this._numURLs++;
    };

    this.unregisterURL = id => {
      delete this._urlLookup[id];
      this._numURLs--;
    };

    this.loadURLs = async statusCallback => {
      let numLoaded = 0;
      for (const id in this._urlLookup) {
        await this.load(id);
        numLoaded++;

        statusCallback(numLoaded, this._numURLs);
      }
    };

    this.load = async (id, autoUnload = false) => {
      if (this._loadedAssets[id]) return this._loadedAssets[id];

      const url = this._urlLookup[id];
      const asset = await import(url);

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

const instance = new AssetManager();
export default instance;
