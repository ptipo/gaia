/* eslint-disable */
const metadata = {
    models: {
        user: {
            name: 'User', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, email: {
                    name: "email",
                    type: "String",
                }, password: {
                    name: "password",
                    type: "String",
                }, sessions: {
                    name: "sessions",
                    type: "Session",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'user',
                }, apps: {
                    name: "apps",
                    type: "App",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'owner',
                }, assets: {
                    name: "assets",
                    type: "Asset",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'owner',
                }, permission: {
                    name: "permission",
                    type: "Json",
                    isOptional: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, email: {
                    name: "email",
                    fields: ["email"]
                },
            }
            ,
        }
        ,
        app: {
            name: 'App', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, owner: {
                    name: "owner",
                    type: "User",
                    isDataModel: true,
                    backLink: 'apps',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "ownerId" },
                }, ownerId: {
                    name: "ownerId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'owner',
                    defaultValueProvider: $default$App$ownerId,
                }, name: {
                    name: "name",
                    type: "String",
                }, assets: {
                    name: "assets",
                    type: "Asset",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'app',
                }, bundle: {
                    name: "bundle",
                    type: "String",
                }, htmlTagName: {
                    name: "htmlTagName",
                    type: "String",
                }, ptCodeMode: {
                    name: "ptCodeMode",
                    type: "String",
                    isOptional: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, name: {
                    name: "name",
                    fields: ["name"]
                },
            }
            ,
        }
        ,
        asset: {
            name: 'Asset', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, createdAt: {
                    name: "createdAt",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updatedAt: {
                    name: "updatedAt",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, owner: {
                    name: "owner",
                    type: "User",
                    isDataModel: true,
                    backLink: 'assets',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "ownerId" },
                }, ownerId: {
                    name: "ownerId",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    isForeignKey: true,
                    relationField: 'owner',
                    defaultValueProvider: $default$Asset$ownerId,
                }, name: {
                    name: "name",
                    type: "String",
                }, app: {
                    name: "app",
                    type: "App",
                    isDataModel: true,
                    backLink: 'assets',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "appId" },
                }, appId: {
                    name: "appId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'app',
                }, appVersion: {
                    name: "appVersion",
                    type: "String",
                    isOptional: true,
                }, config: {
                    name: "config",
                    type: "Json",
                    isOptional: true,
                }, publishUrl: {
                    name: "publishUrl",
                    type: "String",
                    isOptional: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        session: {
            name: 'Session', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                }, userId: {
                    name: "userId",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'user',
                }, expiresAt: {
                    name: "expiresAt",
                    type: "DateTime",
                }, user: {
                    name: "user",
                    type: "User",
                    isDataModel: true,
                    backLink: 'sessions',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "userId" },
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
    }
    ,
    deleteCascade: {
        user: ['Session'],
    }
    ,
    authModel: 'User'
};
function $default$App$ownerId(user: any): unknown {
    return user?.id;
}

function $default$Asset$ownerId(user: any): unknown {
    return user?.id;
}
export default metadata;
