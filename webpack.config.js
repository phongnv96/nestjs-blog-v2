export default (options, webpack) => {
    return {
        ...options,
        externals: [],
        output: {
            ...options.output,
            libraryTarget: 'commonjs2',
        },
        // ... the rest of the configuration
    };
};
