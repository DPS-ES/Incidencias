export declare function init(webpack: any, HardSourceWebpackPlugin: any, ScriptExtHtmlWebpackPlugin: any, MiniCssExtractPlugin: any, workboxPlugin: any, HtmlWebpackPlugin2: any): void;
export declare function addPage(source: string, route?: string, publicName?: string): void;
export declare function commonConfig(): {
    [key: string]: any;
};
export declare const devConfig: {
    mode: string;
    devtool: string;
};
export declare function prepareProd(common: any, MiniCssExtractPlugin: any): void;
export declare function prodConfig(TerserPlugin: any, CleanWebpackPlugin: any, CompressionPlugin: any, ImageminPlugin: any, imageminMozjpeg: any, WebappWebpackPlugin: any, config: any, BundleAnalyzerPlugin: any): {
    mode: string;
    output: {
        filename: string;
    };
    optimization: {
        minimizer: any[];
        splitChunks: {
            cacheGroups: {
                lib: {
                    test: RegExp;
                    name: string;
                    chunks: string;
                };
                components: {
                    test: RegExp;
                    name: string;
                    chunks: string;
                    enforce: boolean;
                };
            };
        };
    };
    plugins: any[];
};
