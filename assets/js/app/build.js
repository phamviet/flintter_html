({
    baseUrl: ".",
    mainConfigFile: "main.js",
    dir: "../../js-min",
    modules: [
        {
            name: "main",
            include: [
                "$",
                "app"
            ]
        },
        {
            name: "module/site",
            exclude: [
                "main"
            ],
            include: [

            ]
        },
        {
            name: "module/landing/initialize",
            exclude: [
                "main"
            ],
            include: [
            ]
        },
        {
            name: "module/home/initialize",
            exclude: [
                "main",
                "module/site"
            ],
            include: [
            ]
        },
        {
            name: "module/profile/initialize",
            exclude: [
                "main",
                "module/site"
            ],
            include: [
            ]
        }
    ]
})