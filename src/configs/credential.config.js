// Credential Configuration

// APP Settings
module.exports.APP = (serverless) => ({
    local: {
        ACCESS_KEY: "",
        SECRET_KEY: "",
        HASH_SALT: "^lN55S0xCT*_2+&X-0Q%#L1I27wm#O+m",
        JWT_PRIVATE_KEY: "Sh=usyTIq@LnSPCY38_8ow+E?kK%Dw4U"
    },
    dev: {
        ACCESS_KEY: "",
        SECRET_KEY: "",
        HASH_SALT: "^lN55S0xCT*_2+&X-0Q%#L1I27wm#O+m",
        JWT_PRIVATE_KEY: "Sh=usyTIq@LnSPCY38_8ow+E?kK%Dw4U"
    },
    prod: {
        ACCESS_KEY: "",
        SECRET_KEY: "",
        HASH_SALT: "t#see&1rZW-2ccYTxuNfm$p6?LjFfUGd",
        JWT_PRIVATE_KEY: "%Y5wk6^6o-w%#$3HiJh-#xOq4|DJ+$BK"
    }
})

// AWS Settings
module.exports.AWS = (serverless) => ({
    local: {
        CF_ACCESS_KEY: ''
    },
    dev: {
        CF_ACCESS_KEY: ''
    },
    prod: {
        CF_ACCESS_KEY: ''
    }
})

// DB Settings
module.exports.DB = (serverless) => ({
    local: {
        ENDPOINT: "",
        USERNAME: "",
        PASSWORD: "",
        DATABASE: "",
        PORT: 3306
    },
    dev: {
        ENDPOINT: "",
        USERNAME: "",
        PASSWORD: "",
        DATABASE: "",
        PORT: 3306
    },
    prod: {
        ENDPOINT: "",
        USERNAME: "",
        PASSWORD: "",
        DATABASE: "",
        PORT: 3306
    }
})