module.exports = {
    apps: [
        {
            name: "server",
            script: "yarn start-prod",
            watch: true,
            ignore_watch: [
                "node_modules",
                "\.git",
                ".\.log",
            ],
        }
    ]
}