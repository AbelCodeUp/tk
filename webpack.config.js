var appVersions = 'v1.0.1';  //系统版本号
var adpVersions = 'v1.0.1';  //adapter版本号
var appVersionsTime = 2017090411;  //系统版本号更新时间
var sdkVersions = 'v1.0.0';  //sdk版本号
var publishDirName = 'h5' ; // 发布的目录名字
var publishDirRelativePath = '../' ; //发布的相对地址
var publishDirPath = publishDirRelativePath+publishDirName ; //发布的目录路径(生成的文件目录相对地址)

var path = require('path');
var webpack = require('webpack');
/*
 * verify config
 * （验证config文件是否正确）
 * */
var validate = require('webpack-validator');

/*
 * clean publishing directory
 * （清空发布目录）
 * */
var CleanWebpackPlugin = require('clean-webpack-plugin');

/*
 * create html
 * （创建html文件）
 * */
var HtmlWebpackPlugin = require('html-webpack-plugin');


/*
 * extract css
 * （提取css文件）
 * */
var ExtractTextPlugin = require("extract-text-webpack-plugin");

/*
 * extract file
 * （拷贝文件）
 * */
var CopyWebpackPlugin = require("copy-webpack-plugin");

/*图片压缩*/
var ImageminPlugin = require('imagemin-webpack-plugin').default;

/*
 *  merge config
 *  （合并config文件）
 * */
var Merge = require('webpack-merge');

/*
 * auto open browser
 * （自动打开浏览器）
 * */
var OpenBrowserPlugin = require('open-browser-webpack-plugin');


/*
 *  Detect how npm is run and branch based on that
 *  （当前 npm 运行）
 * */
var currentTarget = process.env.npm_lifecycle_event;

var debug,          // is debug
    devServer,      // is hrm mode
    minimize , 		// is minimize
	sourceMap ,       // is sourceMap
	sdkname ,       // sdk name
	adpname ;       // sdk name

if (currentTarget == "build" || currentTarget == "build-watch") { // online mode （线上模式）
    process.env.NODE_ENV = 'production';
    debug = false, devServer = false, minimize = true , sourceMap = false , sdkname='tksdk' , adpname = 'adp.min';
} else if (currentTarget == "dev" || currentTarget == "dev-watch" ) { // dev mode （开发模式）
    debug = true, devServer = false, minimize = false , sourceMap = true  , sdkname='tksdkdebug', adpname = 'adp' ;
    process.env.NODE_ENV = 'development';
} else if (currentTarget == "dev-hrm") { // dev HRM mode （热更新模式）
    debug = true, devServer = true, minimize = false , sourceMap = true  , sdkname='tksdkdebug' , adpname = 'adp';
    process.env.NODE_ENV = 'development';
} else{
	debug = false, devServer = false, minimize = true , sourceMap = false  , sdkname='tksdk' , adpname = 'adp.min';
    process.env.NODE_ENV = 'production';
}


var PATHS = {
    /*
     * publish path
     * （发布目录）
     * */
    publicPath: devServer ? '/publish/' : './',

    /*
     * resource path
     * （src 目录）
     * */
    srcPath: path.resolve(process.cwd(), './src'),


    /*
    * node_modules path
    */
    node_modulesPath: path.resolve('./node_modules'),
}


var resolve = {
    /*
     * An array of extensions that should be used to resolve modules
     * （引用时可以忽略后缀）
     * */
    extensions: ['', '.js', '.jsx', '.css', '.scss', '.png', '.jpg' , '.jpeg' , '.gif' ,  '.ico' ],


    /*
     * The directory (absolute path) that contains your modules
     * */
    root: [
        PATHS.node_modulesPath
    ],


    /*
     * Replace modules with other modules or paths.
     * （别名，引用时直接可以通过别名引用）
     * */
    alias: {//模块别名定义，方便后续直接引用别名，无须多写长长的地址
        /* js*/
        'ServiceLiterally': path.join(__dirname, './src/js/services/ServiceLiterally'),//ServiceLiterally 服务
        'ServiceNewPptAynamicPPT': path.join(__dirname, './src/js/services/ServiceNewPptAynamicPPT'),//ServiceNewPptAynamicPPT 服务
        'ServiceTools': path.join(__dirname, './src/js/services/ServiceTools'),//ServiceTools 服务
        'ServiceRoom': path.join(__dirname, './src/js/services/ServiceRoom'),//ServiceRoom 服务
        'ServiceTooltip': path.join(__dirname, './src/js/services/ServiceTooltip'),//ServiceTooltip 服务
        'ServiceSignalling': path.join(__dirname, './src/js/services/ServiceSignalling'),//ServiceSignalling 服务
        'CoreController': path.join(__dirname, './src/js/controller/CoreController'),//ServiceTools 服务
        'TkUtils': path.join(__dirname, './src/js/utils/TkUtils'),//TkUtils 工具
        'eventObjectDefine': path.join(__dirname, './src/js/utils/event/eventObjectDefine'),//eventObjectDefine 事件对象容器
        'TkConstant': path.join(__dirname, './src/js/tk_class/TkConstant'),//TkConstant TK常量类
        'TkGlobal': path.join(__dirname, './src/js/tk_class/TkGlobal'),//TkConstant TK全局变量类
        'RoleHandler': path.join(__dirname, './src/js/tk_class/RoleHandler'),//RoleHandler  角色相关处理类
        'RoomHandler': path.join(__dirname, './src/js/tk_class/RoomHandler'),//RoomHandler  房间相关处理类
        'StreamHandler': path.join(__dirname, './src/js/tk_class/StreamHandler'),//StreamHandler  Stream流的相关处理类
        'TkAppPermissions': path.join(__dirname, './src/js/tk_class/TkAppPermissions'),//TkAppPermissions  系统权限的相关处理类
        'WebAjaxInterface': path.join(__dirname, './src/js/dao/WebAjaxInterface'),//WebAjaxInterface  web接口请求封装类
        'SignallingInterface': path.join(__dirname, './src/js/dao/SignallingInterface'),//SignallingInterface  信令发送接口封装类
        'ButtonDumb': path.join(__dirname, './src/js/components/base/button/Button'),//ButtonDumb  Button Dumb组件
    }
}

/*
 * The entry point for the bundle.
 * （入口）
 * */
var entry = {
    tkMain:[
		 path.join(PATHS.srcPath, 'tkMain.js') ,
        /*path.join(PATHS.srcPath, "js/plugs/md5/md5.js") ,
        path.join(PATHS.srcPath, "js/plugs/literally/js/literally-custom.js") ,
        path.join(PATHS.srcPath, "js/plugs/newPpt/js/newPpt-custom.js") ,*/
	] ,
    common: [
        'jquery',"react","react-dom","react-router" ,"babel-polyfill" , 'react-slider' , 'react-dnd' , 'react-dnd-html5-backend'
    ],
};


/*
 * output options tell Webpack how to write the compiled files to disk
 * （webpack 编译后输出标识）
 * */
var output = {
    /*
     *  determines the location on disk the files are written to
     *  （输出目录）
     * */
    path: path.join(__dirname, publishDirPath),

    /*
     * The publicPath specifies the public URL address of the output files when referenced in a browser
     * （发布后，资源的引用目录）
     * */
    publicPath: PATHS.publicPath,

    /*
     * Specifies the name of each output file on disk
     * （文件名称）
     * */
    filename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',

    /*
     * The filename of non-entry chunks as relative path inside the output.path directory.
     * （按需加载模块时输出的文件名称）
     * */
    chunkFilename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js'
}

var loaders = [

    /*
     * Exports HTML as string, require references to static resources.
     * （html loader）
     * */
    {
        test: /\.html$/,
        loader: "html-loader?minimize="+minimize
        // loader: "html?-minimize"
    },


    /*
     * img loader
     * */
    {
        test: /\.(png|gif|jpeg|jpg|gif|ico)$/,
        loader: 'url-loader',
        query: {
            /*
             *  limit=10000 ： 10kb
             *  图片大小小于10kb 采用内联的形式，否则输出图片
             * */
            limit: 1,
            name: '/img/[name]-[hash:8].[ext]'
        }
    },


    /*
     * font loader
     * */
    {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url-loader',
        query: {
            limit: 1,
            name: '/font/[name]-[hash:8].[ext]'
        }
    },

    /*
     * Extract css files
     * （提取css到单独文件loader）
     */
    {
        test: /\.css|scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader", {
            publicPath: '../'
        })
    },
	{
		test: /\.js|jsx$/,
		loader: "babel-loader",
		include: /src/ , 
		exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
	},

];

var plugins = [

    /*
     * gloabal flag
     * （全局标识）
     * */
    new webpack.DefinePlugin({
        /*
         * dev flag
         * （开发标识）
         * */
         __DEV__: debug,
        __SDKDEV__:debug ,
        __VERSIONS__:"'"+appVersions+"'" ,
        __VERSIONSTIME__:appVersionsTime,
        'process.env': {
            NODE_ENV: debug?'"development"':'"production"',
        },
    }),
	

    /*
     * common js
     * （公共js）
     * */

    new webpack.optimize.CommonsChunkPlugin(
        devServer ?{name: "common", filename: "js/common.js"}:{names: ["common", "webpackAssets"] } //改成这种设置以后，当时热替换模式的时候不对common.js做处理，如果是开发模式或者发布模式，会从common.js中将各个文件的版本号以及其他重要信息抽出来，放到‘webpackAssets.js’文件中（名称可以自定义）
    ),


    /*
     *  Module (value) is loaded when the identifier (key) is used as free variable in a module
     *  （如：使用jquery 可以直接使用符号 "$"）
     * */
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
    }),


    /*
     * Search for equal or similar files and deduplicate them in the output
     * （删除重复依赖的文件）
     */
    new webpack.optimize.DedupePlugin(),


    /*
     * Using this config the vendor chunk should not be changing its hash unless you change its code or dependencies
     * （避免在文件不改变的情况下hash值不变化）
     * */
    new webpack.optimize.OccurenceOrderPlugin(),


    /*
     * clean publishing directory
     * （发布前清空发布目录）
     * */
    new CleanWebpackPlugin([publishDirPath], {
        root: '', // An absolute path for the root  of webpack.config.js
        verbose: true,// Write logs to console.
        dry: false // Do not delete anything, good for testing.
    }),


    /*
     * extract css
     * （提取css文件到单独的文件中）
     */
    new ExtractTextPlugin(devServer ? "css/[name].css" : "css/[name]-[chunkhash:8].css", {allChunks: true}),
	


    /*
     *create html file
     * （创建html文件）
     * */
    new HtmlWebpackPlugin({
        title:'TalkCloud' ,
        filename: 'index.html',
        template: __dirname + '/src/index.ejs',
        favicon:false ,
        /*
         * inject: true | 'head' | 'body' | false Inject all assets into the given template or templateContent -
         * When passing true or 'body' all javascript resources will be placed at the bottom of the body element.
         * 'head' will place the scripts in the head element.
         * */
        inject: true,
        // 需要依赖的模块
        // chunks: [ 'tkPlugsCode' , 'tkPlugsCustom'  , 'common', 'tkMain', 'webpackAssets' ],
        chunks: ['common', 'tkMain', 'webpackAssets' ],

        /**根据依赖自动排序*/
        chunksSortMode: 'dependency' ,
        sdkVersions:sdkVersions,
        appVersions:appVersions ,
        adpVersions:adpVersions ,
        sdkName:sdkname ,
        adpName:adpname ,
        sdkDirPreFix:devServer?'../publish/':'./'  ,
        lcName:debug?'tklc_core':'tklc_core.min' ,
        lcVersions:2017090411,
        __SDKDEV__:debug ,
       /* minify:{    //压缩HTML文件
            removeComments:true,    //移除HTML中的注释
            collapseWhitespace:false    //删除空白符与换行符
        }*/
     })
];

if(!devServer){
		
	/*
     * extract file
     * （提取文件到指定的文件中）
		from    定义要拷贝的源目录           from: __dirname + ‘/src/public’
		to      定义要拷贝到的目标目录     from: __dirname + ‘/dist’
		toType  file 或者 dir         可选，默认是文件
		force   强制覆盖先前的插件           可选 默认false
		context                         可选 默认base context可用specific context
		flatten 只拷贝文件不管文件夹      默认是false
		ignore  忽略拷贝指定的文件           可以用模糊匹配
     */
	 plugins.push(
         // Make sure that the plugin is after any plugins that add images
         new ImageminPlugin({
             disable: debug , // Disable during development
             pngquant: {
                 quality: '95-100'
             }
         }),
		 new CopyWebpackPlugin([
             {
                    from: path.resolve(__dirname, './publish/'),
                    to: path.resolve(__dirname, publishDirPath+'/'),
                    force: true,
                    toType: 'dir',
                    // ignore: ['.*']
                    ignore:debug?['tklc_core.min.js' , 'adp.min.js' , 'tksdk.js']:['tklc_core.js' , 'adp.js' , 'tksdkdebug.js']
             }
		])
	 );  
	
}


if (minimize) {
    plugins.push(
        /*
         * Uglify
         * （压缩）
         * */
            new webpack.optimize.UglifyJsPlugin({ // js、css都会压缩
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'module', 'import']
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        })
    )

}

/**处理中心*/
var postcss = [
    require('autoprefixer')    //调用autoprefixer插件,css3自动补全
]

var config = {
	
    entry: entry,
    /*
     *  Like resolve but for loaders.
     *  （查找loader 的位置）
     * */
    resolveLoader: {root: path.join(__dirname, "node_modules")},
    output: output,
    module: {
        loaders: loaders
    },
    resolve: resolve,
    plugins: plugins,
	postcss:postcss , 

}

/*开启生成source-map模式*/
if(sourceMap){
	config = Merge(config,{
		devtool: "source-map",
	});
};

/*
 *  Hrm setting
 * （开启热更新，并自动打开浏览器）
 * */
if (devServer) {
    var devServerIp = '192.168.0.107';
    var devServerPort = 8444 ;
    var devServerProtocol = 'https' ;
    var devServerRouter = 'login' ;
    var devServerParams = 'host=192.168.1.17&domain=test&param=UaToBLfsrWeCdYeh31Ap-0s9ujQlWvQ7WJWrsxt8-Sg15NDR1_DhoLpO-ZENxEMN_Uf-du-RAPVhKGpP-h0YzGbHk_-HRRiX-ykZFg-TjQah_9U9Ee58grREa2Q2DE8gOugBD8a0IldbfIl7PR0ENg&roomtype=0&timestamp=' + new Date().getTime();
    config = Merge(
        config,
        {
            plugins: [
                // Enable multi-pass compilation for enhanced performance
                // in larger projects. Good default.
                new webpack.HotModuleReplacementPlugin({
                    multiStep: true
                }),
                new OpenBrowserPlugin({url:devServerProtocol+'://'+devServerIp+':'+devServerPort + PATHS.publicPath + 'index.html#/'+devServerRouter+'?'+devServerParams})
            ],
            devServer: {
                // Enable history API fallback so HTML5 History API based
                // routing works. This is a good default that will come
                // in handy in more complicated setups.
                historyApiFallback: true,

                // Unlike the cli flag, this doesn't set
                // HotModuleReplacementPlugin!
                hot: true,
                inline: true,
				https: devServerProtocol=="https" ,
                // Display only errors to reduce the amount of output.
                stats: 'errors-only',
                // Parse host and port from env to allow customization.
                //
                // If you use Vagrant or Cloud9, set
                // host: options.host || '0.0.0.0';
                //
                // 0.0.0.0 is available to all network devices
                // unlike default `localhost`.
                host: devServerIp, // Defaults to `localhost`   process.env.HOST
                port: devServerPort,  // Defaults to 8080   process.env.PORT
            }
        }
    );
}

module.exports = validate(config);






