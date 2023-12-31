const tempAccounts = [
    {
        name: `Isaac Mendoza`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`6`),
        groupName: `Kinetic`,
        image: `http://picsum.photos/500/900`,
        alias: `Spyder`,
        aliasClass: `Spyder`.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: `33`,
        pronouns: `She/Her`.toLowerCase().trim(),
        occupation: `Unemployed`.toLowerCase().trim(),
        power: `Test A [0]`.toLowerCase().trim(),
        floor: `1001`.length === 4 ? `1001`.slice(0,2) : `1001`.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 26 2023`,
        postCount: `24`,
    },
    {
        name: `Emily Lawry`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`7`),
        groupName: `Psychic`,
        image: `http://picsum.photos/500/900`,
        alias: `Spyder`,
        aliasClass: `Spyder`.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: `36`,
        pronouns: `She/Her`.toLowerCase().trim(),
        occupation: `Unemployed`.toLowerCase().trim(),
        power: `Test B [0]`.toLowerCase().trim(),
        floor: `901`.length === 4 ? `901`.slice(0,2) : `901`.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 26 2023`,
        postCount: `43`,
    },
    {
        name: `Hayden Donovan`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`8`),
        groupName: `Enhanced`,
        image: `http://picsum.photos/500/900`,
        alias: `Lux`,
        aliasClass: `Lux`.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: `28`,
        pronouns: `She/Her`.toLowerCase().trim(),
        occupation: `Unemployed`.toLowerCase().trim(),
        power: `Fire Manipulation [0]`.toLowerCase().trim(),
        floor: `901`.length === 4 ? `901`.slice(0,2) : `901`.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 26 2023`,
        postCount: `12`,
    },
    {
        name: `Aiden Mitchell`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`9`),
        groupName: `Summoning`,
        image: `http://picsum.photos/500/900`,
        alias: `Lux`,
        aliasClass: `Lux`.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: `34`,
        pronouns: `She/Her`.toLowerCase().trim(),
        occupation: `Unemployed`.toLowerCase().trim(),
        power: `None [0]`.toLowerCase().trim(),
        floor: `752`.length === 4 ? `752`.slice(0,2) : `752`.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 26 2023`,
        postCount: `23`,
    },
    {
        name: `Nikolas Kovac`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`10`),
        groupName: `Mutation`,
        image: `http://picsum.photos/500/900`,
        alias: `Lux`,
        aliasClass: `Lux`.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: `32`,
        pronouns: `She/Her`.toLowerCase().trim(),
        occupation: `Unemployed`.toLowerCase().trim(),
        power: `Electricity [0]`.toLowerCase().trim(),
        floor: `1212`.length === 4 ? `1212`.slice(0,2) : `1212`.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 26 2023`,
        postCount: `54`,
    },
    {
        name: `Duncan Taggart`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`11`),
        groupName: `Alchemical`,
        image: `http://picsum.photos/500/900`,
        alias: `Lux`,
        aliasClass: `Lux`.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: `38`,
        pronouns: `She/Her`.toLowerCase().trim(),
        occupation: `Unemployed`.toLowerCase().trim(),
        power: `Intuition [0]`.toLowerCase().trim(),
        floor: `130`.length === 4 ? `130`.slice(0,2) : `130`.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 26 2023`,
        postCount: `32`,
    },
    {
        name: `Lux`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`4`),
        groupName: `Admin`,
        image: `http://picsum.photos/500/900`,
        alias: ``,
        aliasClass: ``.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: ``,
        pronouns: ``.toLowerCase().trim(),
        occupation: ``.toLowerCase().trim(),
        power: ``.toLowerCase().trim(),
        floor: ``.length === 4 ? ``.slice(0,2) : ``.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 26 2023`,
        postCount: `2`,
    },
    {
        name: `Sterling De Mitri`.toLowerCase().trim(),
        id: parseInt(`1`),
        groupID: parseInt(`3`),
        groupName: `Member`,
        image: `http://picsum.photos/500/900`,
        alias: `Lux`,
        aliasClass: `Lux`.toLowerCase().replaceAll(' ', "").replaceAll('\/', "").replaceAll(`'`, ""),
        age: `23`,
        pronouns: `She/Her`.toLowerCase().trim(),
        occupation: `Unemployed`.toLowerCase().trim(),
        power: `TBD [0]`.toLowerCase().trim(),
        floor: `400`.length === 4 ? `400`.slice(0,2) : `400`.slice(0,1),
        lastPost: `Oct 26 2023, 10:31 PM`,
        joined: `Oct 30 2023`,
        postCount: `0`,
    }
]