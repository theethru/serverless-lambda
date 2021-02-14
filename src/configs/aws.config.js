// AWS Configuration

// Lambda Settings
module.exports.LAMBDA = (serverless) => ({
    local: {
        RUNTIME: 'nodejs12.x',
        MEMORY_SIZE: 128,
        TIMEOUT: 30
    },
    dev: {
        RUNTIME: 'nodejs12.x',
        MEMORY_SIZE: 128,
        TIMEOUT: 30
    },
    prod: {
        RUNTIME: 'nodejs12.x',
        MEMORY_SIZE: 256,
        TIMEOUT: 30
    },
});

// Domain Settings
module.exports.DOMAIN = (serverless) => ({
    local: {
        API: "",
    },
    dev: {
        API: "",
    },
    prod: {
        API: "",
    },
})

// S3 Settings
module.exports.S3 = (serverless) => ({
    local: {
        IMAGE_BUCKET: "",
    },
    dev: {
        IMAGE_BUCKET: "",
    },
    prod: {
        IMAGE_BUCKET: "",
    }
})

// URL Settings
module.exports.URL = (serverless) => ({
    local: {
        IMAGE_CDN: "",
        IMAGE_S3: ""
    },
    dev: {
        IMAGE_CDN: "",
        IMAGE_S3: ""
    },
    prod: {
        IMAGE_CDN: "",
        IMAGE_S3: ""
    }
})