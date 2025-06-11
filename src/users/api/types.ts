export type UsersModuleResolver = {
    moduleUrls: ['/users'],
    db: 'Database',
}

export type UsersModuleMeta = {
    name: "Users Module",
    resolvers: {
        serverResolver: undefined,
        moduleResolver: {
            logger: undefined,
            moduleUrls: [],
            db: undefined
        }
    }
}
