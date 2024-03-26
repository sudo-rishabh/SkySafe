let isConfigUpdate = false;
let reader = new FileReader();

async function uploadToS3Bucket(stream, credential, cd) {
    try {
        if (!window.AWS) {
            return
        }
        if (!isConfigUpdate) {
            window.AWS.config.update(({ region: credential.region }));
            isConfigUpdate = true;
        }

        let s3 = new window.AWS.S3({
            credentials: new window.AWS.Credentials({
                apiVersion: 'latest',
                accessKeyId: credential.accressKeyId,
                secretAccessKey: credential.secretAccessKey,
                signatureVersion: credential.signatureVersion,
                region: credential.region,
                Bucket: credential.Bucket
            })
        });
        let uploadedFilename = document.getElementById("fileToUpload").files[0].name;

        let uploadItem = await s3.upload({
            Bucket: credential.Bucket,
            Key: uploadedFilename, //'hello.png',  name for the bucket file
            ContentType: document.getElementById("fileToUpload").files[0].type,
            Body: stream
        }).on("httpUploadProgress", function (progress) {
            console.log("progress=>", progress)
            cd(getUploadingProgress(progress.loaded, progress.total));
        }).promise();
        console.log("uploadItem=>", uploadItem)
        return uploadItem;
    }
    catch (error) {
        console.log(error)
    }

}

function getUploadingProgress(uploadSize, totalSize) {
    let uploadProgress = (uploadSize / totalSize) * 100;
    return Number(uploadProgress.toFixed(0));
}




async function uploadMedia() {
    let credentialRequest = {
        accressKeyId: '', // access key
        secretAccessKey: '', // secret key
        signatureVersion: 'v4',
        region: 'ap-south-1',
        Bucket: '' // bucket name
    };
    let mediaStreamRequest = getFile(document.getElementById("fileToUpload").files[0])
    const [mediaStream] = await Promise.all([
        mediaStreamRequest
    ])
    await uploadToS3Bucket(mediaStream, credentialRequest, (progress) => {
        console.log(progress)
    })
}

async function getFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file selected'));
            return;
        }

        let reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = (err) => {
            reject(false);
        };
        reader.readAsArrayBuffer(file);
    });
};


let fileInput = document.getElementById('fileToUpload');
let descriptionText = document.querySelector('.upload-area-title');

fileInput.addEventListener('change', function(event) {
const filename = event.target.files[0].name;
if (filename) {
    descriptionText.innerHTML = `Selected file: <strong> ${filename} </strong>`;
    document.getElementById('upload-area-title').innerHTML = '<strong>Your text here</strong>';
} else {
    // Handle cases where no file is selected (optional)
    descriptionText.textContent  = 'Drag file(s) here to upload.'; // Or a default message
}
});












async function fetchPostAsyncAwaitMethod(argument) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const res = await response.json();
        console.log(res, "post fetch")
        if (response.status === 200) {
            const response = await fetch(`https://jsonplasceholder.typicode.com/comments?postId=${res[0].id}`);
            const resCon = await response.json();
            console.log(resCon, "comment fetch")
        }
    } catch (error) {
        console.log(error)
    }

}

function fetchPostDotThenMethod(argument) {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then((res) => res.json())
        .then(res => {
            console.log(res, 'post fetch')
            if (res.length > 0) {
                fetch(`https://jsonplaceholder.typeicode.com/comments?postId=${res[0].id}`)
                    .then((res) => res.json())
                    .then(res => {
                        console.log(res, 'comment fetch')
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }).catch(error => {
            console.log(error)
        })
}

function fetchPostCallBackMethod() {
    function fetchPostComment(id) {
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)
            .then((res) => res.json())
            .then(res => {
                console.log(res, 'fetchPostComment')
            }).catch(error => {
                console.log(error)
            })
    }

    function fetchPost(callback) {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((res) => res.json())
            .then(res => {
                if (res.length > 0) {
                    console.log(res, 'fetchPost')
                    callback(res[0].id)
                }
            }).catch(error => {
                console.log(error)
            })
    }

    fetchPost(fetchPostComment)
}

fetchPostAsyncAwaitMethod()