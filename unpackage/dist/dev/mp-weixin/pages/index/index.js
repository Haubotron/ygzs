"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const pages_index_config = require("./config.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.useRouter();
    const handleClick = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_assets._imports_1,
        c: common_assets._imports_2,
        d: common_assets._imports_3,
        e: common_vendor.f(common_vendor.unref(pages_index_config.menuCard), (item, k0, i0) => {
          return {
            a: `/static/images/home/${item.image}`,
            b: common_vendor.t(item.title),
            c: item.id,
            d: common_vendor.o(($event) => handleClick(item.path), item.id)
          };
        }),
        f: common_assets._imports_1$1
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
