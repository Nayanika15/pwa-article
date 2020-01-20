module.exports = {
	runtimeCompiler: true,
	devServer: {
		proxy: { "/api": {
				target: "http://article.com/api",
				changeOrigin: true ,
				ws: true,
				pathRewrite: {
				'^/api': ''
				}
			}
		}
	},
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js"
    }
	},
};
